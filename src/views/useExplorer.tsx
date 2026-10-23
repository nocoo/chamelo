import { useEffect, useRef, useState } from 'react';
import { palettes } from '../data/palettes';
import type { Category, ColorFormat, Palette } from '../models/palette';
import { activePalette, adjacentPalette, selectPalettes } from '../viewmodels/explorer';

export type ModalState =
  | { kind: 'artwork' | 'prompt' | 'tokens' | 'preview'; palette: Palette }
  | { kind: 'guide' }
  | null;

export function useExplorer() {
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState<{ text: string; error: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visible = selectPalettes(palettes, category, query);
  const active = activePalette(visible, selectedId);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

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
    total: palettes.length,
    theme: active ?? activePalette(palettes, selectedId),
    activeIndex: visible.findIndex((palette) => palette.id === active?.id),
    stepPalette: (step: -1 | 1) =>
      setSelectedId(adjacentPalette(visible, active?.id ?? null, step)),
  };
}
