import { ArrowDownToLine, Check, Copy, Sparkles, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { type ThemeToken, tokenLabels } from '../models/palette';
import { themeContrastChecks } from '../services/colors';
import { createAgentPrompt } from '../services/exports';
import { SitePreview } from './SitePreview';
import type { ModalState } from './useExplorer';

export function PaletteModal({
  state,
  onDismiss,
  onCopy,
}: {
  state: NonNullable<ModalState>;
  onDismiss: () => void;
  onCopy: (value: string, label: string) => Promise<void>;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.documentElement.style.overflow;
    dialog?.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  const titles = {
    guide: '从灵感，到你的下一个界面',
    artwork: '看见色彩的来处',
    prompt: '把意象交给你的 Agent',
    tokens: '好看，也要好用',
    preview: '让色彩进入真实界面',
  };

  return (
    <dialog
      ref={ref}
      className={`palette-modal palette-modal--${state.kind}`}
      onCancel={onDismiss}
      onClose={onDismiss}
      aria-labelledby="modal-title"
    >
      <div className="modal-header">
        <div>
          <span className="eyebrow">CHAMELO / {state.kind.toUpperCase()}</span>
          <h2 id="modal-title">{titles[state.kind]}</h2>
        </div>
        <button type="button" className="icon-button" onClick={onDismiss} aria-label="关闭弹窗">
          <X size={21} />
        </button>
      </div>
      <div className="modal-body">
        {state.kind === 'guide' && (
          <div className="guide-content">
            <p className="modal-intro">
              这里的每套配色，都从一个中国文化意象开始。你带走的是一套能用在网站上的色彩语言。
            </p>
            <div className="guide-step">
              <span>01</span>
              <div>
                <h3>先看意象，再选颜色</h3>
                <p>
                  生成的原图保留故事和气氛，提取的候选色经过明度、主次与语义用途的校准。图片是灵感，不是色号的唯一约束。
                </p>
              </div>
            </div>
            <div className="guide-step">
              <span>02</span>
              <div>
                <h3>看它如何成为一个界面</h3>
                <p>
                  网站预览真正使用同一套语义变量。查看背景、正文、按钮、悬停和焦点色的搭配，而不是孤立判断一块颜色。
                </p>
              </div>
            </div>
            <div className="guide-step">
              <span>03</span>
              <div>
                <h3>直接带到你的工作流</h3>
                <p>
                  点击色块复制 HEX、RGB、HSL 或 OKLCH，复制整套 CSS
                  变量，或把包含意象、色号、比例和设计约束的 Prompt 交给自己的 Agent。
                </p>
              </div>
            </div>
            <p className="guide-disclosure">
              首辑：敦煌华彩与朱漆鎏金。另有 76
              个意象已收录待策展，先定传统色名方向，再生成原图与语义配色。所有影像均为 AI
              创作的当代诠释，不作历史文物记录。
            </p>
          </div>
        )}
        {state.kind === 'artwork' && (
          <>
            <img
              className="modal-artwork"
              src={state.palette.artwork.original}
              alt={state.palette.artwork.alt}
              width={state.palette.artwork.width}
              height={state.palette.artwork.height}
            />
            <div className="artwork-modal-caption">
              <div>
                <h3>{state.palette.name}</h3>
                <p>{state.palette.story}</p>
                <small>
                  {state.palette.provenance.model} · {state.palette.artwork.width} ×{' '}
                  {state.palette.artwork.height} · AI 意象创作
                </small>
              </div>
              <a
                className="button button-secondary"
                href={state.palette.artwork.original}
                download={`chamelo-${state.palette.id}.png`}
              >
                <ArrowDownToLine size={16} />
                下载原图
              </a>
            </div>
          </>
        )}
        {state.kind === 'prompt' && (
          <>
            <p className="modal-intro">
              意象、六个主色、十二个语义色与搭配规则已整理在一起。不依赖原图链接，直接交给你常用的
              Agent 即可。
            </p>
            <textarea
              className="prompt-text"
              readOnly
              value={createAgentPrompt(state.palette)}
              aria-label="完整 Agent Prompt"
              spellCheck={false}
            />
            <div className="modal-action-row">
              <span>含 HEX / RGB / HSL / OKLCH · 语义用途 · 搭配比例</span>
              <button
                type="button"
                className="button button-primary"
                onClick={() => onCopy(createAgentPrompt(state.palette), 'Agent Prompt ')}
              >
                <Sparkles size={16} />
                复制完整 Prompt
              </button>
            </div>
          </>
        )}
        {state.kind === 'tokens' && (
          <>
            <p className="modal-intro">
              展示色板保留意象；语义色进一步明确每种颜色的工作。流金用于装饰，不用于浅色背景上的小字。
            </p>
            <div className="token-grid">
              {(Object.entries(state.palette.theme) as [ThemeToken, string][]).map(
                ([token, hex]) => (
                  <button
                    type="button"
                    key={token}
                    className="token-row"
                    onClick={() => onCopy(hex, `${tokenLabels[token]} `)}
                    aria-label={`复制${tokenLabels[token]} ${hex}`}
                  >
                    <i style={{ background: hex }} />
                    <span>
                      <strong>{tokenLabels[token]}</strong>
                      <small>--color-{token}</small>
                    </span>
                    <code>{hex}</code>
                    <Copy size={13} />
                  </button>
                ),
              )}
            </div>
            <div className="contrast-heading">
              <h3>对比度记录</h3>
              <p>
                正文组合 ≥ 4.5:1，焦点与背景 ≥
                3:1。这里只评价列出的色彩组合，不代表整个网站的可访问性认证。
              </p>
            </div>
            <div className="contrast-grid">
              {themeContrastChecks(state.palette.theme).map((check) => (
                <div key={check.label} className="contrast-row">
                  <span>{check.label}</span>
                  <strong>{check.ratio.toFixed(2)}:1</strong>
                  <span className={check.passes ? 'contrast-pass' : 'contrast-fail'}>
                    {check.passes ? <Check size={13} /> : <X size={13} />}
                    {check.passes ? '通过' : '待调整'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        {state.kind === 'preview' && (
          <>
            <p className="modal-intro">
              示例品牌「山居」使用「{state.palette.name}
              」的完整语义色。试试主按钮，感受配色如何组织内容和交互。
            </p>
            <SitePreview palette={state.palette} expanded />
          </>
        )}
      </div>
    </dialog>
  );
}
