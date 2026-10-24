import { useEffect, useRef, useState } from 'react';
import { collection } from '../data/collection';
import type { Category, ColorFormat, PaletteMode, PublicationEntry } from '../models/palette';
import { oppositeMode, resolveTheme } from '../services/appearance';
import { activeEntry, adjacentEntry, selectEntries, themeEntry } from '../viewmodels/explorer';

export type ModalState =
  | { kind: 'artwork' | 'prompt' | 'tokens' | 'preview'; palette: PublicationEntry }
  | { kind: 'guide' }
  | null;

const pagingKeys: Record<string, -1 | 1> = { ArrowLeft: -1, ArrowRight: 1 };

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('input, textarea, select, [contenteditable="true"]') !== null
  );
}

export function useExplorer() {
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState<{ text: string; error: boolean } | null>(null);
  const [appearance, setAppearance] = useState<{ id: string; mode: PaletteMode } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visible = selectEntries(collection, category, query);
  const active = activeEntry(visible, selectedId);
  const theme = themeEntry(collection, active);
  const mode: PaletteMode = theme
    ? appearance?.id === theme.id
      ? appearance.mode
      : theme.mode
    : 'light';

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const step = pagingKeys[event.key];
      if (!step || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (modal || isTypingTarget(event.target) || visible.length < 2) return;
      event.preventDefault();
      setSelectedId(adjacentEntry(visible, active?.id ?? null, step));
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modal, visible, active]);

  async function copy(text: string, label: string) {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setToast({ text: `${label}已复制`, error: false });
    } catch {
      setToast({ text: '未能访问剪贴板，请在详情中选中文字复制。', error: true });
    }
    timer.current = setTimeout(() => setToast(null), 3200);
  }

  function toggleMode() {
    if (!theme) return;
    setAppearance({ id: theme.id, mode: oppositeMode(mode) });
  }

  return {
    category,
    setCategory,
    query,
    setQuery,
    format,
    setFormat,
    modal,
    setModal,
    toast,
    copy,
    visible,
    active,
    total: collection.length,
    theme,
    mode,
    themeTokens: theme ? resolveTheme(theme, mode) : undefined,
    toggleMode,
    activeIndex: visible.findIndex((entry) => entry.id === active?.id),
    stepPalette: (step: -1 | 1) => setSelectedId(adjacentEntry(visible, active?.id ?? null, step)),
  };
}
