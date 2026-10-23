import { LiquidGlass } from 'liquid-glass-web-react';
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Expand,
  Image,
  Monitor,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { type ColorFormat, colorFormats, type Palette } from '../models/palette';
import { foregroundFor, formatColor, themeContrastChecks } from '../services/colors';
import { createAgentPrompt, createCss } from '../services/exports';
import { SitePreview } from './SitePreview';
import type { ModalState } from './useExplorer';

interface PaletteFeatureProps {
  palette: Palette;
  format: ColorFormat;
  onFormat: (format: ColorFormat) => void;
  onCopy: (value: string, label: string) => Promise<void>;
  onModal: (modal: ModalState) => void;
}

export function PaletteFeature({
  palette,
  format,
  onFormat,
  onCopy,
  onModal,
}: PaletteFeatureProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const textPasses = themeContrastChecks(palette.theme).every((check) => check.passes);

  return (
    <article className="palette-feature">
      <div className="feature-heading">
        <div className="feature-title">
          <span className="edition-number">{palette.number}</span>
          <div>
            <h2>{palette.name}</h2>
            <p>{palette.english}</p>
          </div>
          <span className="collection-tag">壁画与石窟</span>
        </div>
        <div className="feature-heading-note">
          <span className="status-dot" />
          源于意象，为界面而配
          <ArrowUpRight size={16} aria-hidden="true" />
        </div>
      </div>

      <div className="feature-grid">
        <div className="artwork-panel">
          <div className="artwork-frame">
            <LiquidGlass
              className="artwork-glass"
              x={0.5}
              y={0.875}
              width={230}
              height={64}
              radius={19}
              strength={0.035}
              chromaticAberration={0.12}
              blur={1.4}
              edgeHighlight={0.35}
              quality={256}
              shadow={false}
            >
              <img
                className="source-artwork"
                src={palette.artwork.src}
                alt={palette.artwork.alt}
                width={palette.artwork.width}
                height={palette.artwork.height}
                fetchPriority="high"
              />
            </LiquidGlass>
            <div className="artwork-topline">
              <span>THE ORIGIN OF COLOUR</span>
              <button
                type="button"
                className="artwork-expand"
                onClick={() => onModal({ kind: 'artwork', palette })}
                aria-label="查看完整原图"
              >
                <Expand size={17} />
              </button>
            </div>
            <div className="artwork-caption">
              <span className="caption-symbol" aria-hidden="true">
                色
              </span>
              <div>
                <span>一缕石青，半壁流金</span>
                <small>DUNHUANG · AN IMAGINED LANDSCAPE</small>
              </div>
            </div>
            <div className="image-corner-label">AI ORIGINAL · 1536 × 1024</div>
          </div>
          <div className="artwork-footnote">
            <p>{palette.description}</p>
            <a
              href={palette.artwork.original}
              download="chamelo-dunhuang-huacai.png"
              aria-label="下载敦煌华彩原始 PNG"
            >
              <ArrowDownToLine size={16} />
              <span>原图</span>
            </a>
          </div>
        </div>

        <div className="palette-workbench">
          <div className="section-heading">
            <div>
              <span className="section-index">01</span>
              <h3>拾色</h3>
              <span className="section-english">THE PALETTE</span>
            </div>
            <fieldset className="format-switch" aria-label="色号格式">
              {colorFormats.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={format === item}
                  onClick={() => onFormat(item)}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </fieldset>
          </div>
          <div className="swatch-grid">
            {palette.swatches.map((swatch, index) => (
              <button
                key={swatch.id}
                type="button"
                className="color-swatch"
                style={{ backgroundColor: swatch.hex, color: foregroundFor(swatch.hex) }}
                onClick={() =>
                  onCopy(formatColor(swatch.hex, format), `${swatch.name} ${format.toUpperCase()} `)
                }
                aria-label={`复制${swatch.name} ${formatColor(swatch.hex, format)}`}
                title={`${swatch.role} · 点击复制`}
              >
                <span className="swatch-top">
                  <span>{swatch.name}</span>
                  <Copy size={13} aria-hidden="true" />
                </span>
                <span className="swatch-bottom">
                  <code>{formatColor(swatch.hex, format)}</code>
                  <span className="swatch-index">0{index + 1}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="palette-detail-line">
            <span>
              <span className="tiny-dot" />
              点击色块复制色号
            </span>
            <button type="button" onClick={() => onModal({ kind: 'tokens', palette })}>
              12 个语义色 · 配色规范
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="section-heading preview-section-heading">
            <div>
              <span className="section-index">02</span>
              <h3>入境</h3>
              <span className="section-english">IN CONTEXT</span>
            </div>
            <div className="preview-controls">
              <button
                type="button"
                aria-label="桌面预览"
                aria-pressed={viewport === 'desktop'}
                onClick={() => setViewport('desktop')}
              >
                <Monitor size={15} />
              </button>
              <button
                type="button"
                aria-label="移动预览"
                aria-pressed={viewport === 'mobile'}
                onClick={() => setViewport('mobile')}
              >
                <Smartphone size={15} />
              </button>
              <span />
              <button
                type="button"
                aria-label="放大网站预览"
                onClick={() => onModal({ kind: 'preview', palette })}
              >
                <Expand size={14} />
              </button>
            </div>
          </div>
          <div
            className={`browser-window${viewport === 'mobile' ? ' browser-window--mobile' : ''}`}
          >
            <div className="browser-bar">
              <div className="browser-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <span>
                <span className="browser-lock" />
                shanju · 生活方式网站
              </span>
              <span>↗</span>
            </div>
            <SitePreview palette={palette} />
          </div>
          <div className="preview-footnote">
            <span>不是想象，是真正用这套配色搭出的界面。</span>
            {textPasses && (
              <span className="contrast-pass">
                <Check size={12} />
                文本对比达标
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="feature-bottom">
        <div className="usage-overview">
          <div
            className="usage-bar"
            role="img"
            aria-label="建议配色比例：60% 基底，30% 主色，10% 点缀"
          >
            {palette.distribution.map((item) => (
              <span
                key={item.label}
                style={{ background: item.color, width: `${item.percentage}%` }}
              />
            ))}
          </div>
          <div className="usage-labels">
            {palette.distribution.map((item) => (
              <span key={item.label}>
                {item.percentage}% {item.label}
              </span>
            ))}
          </div>
        </div>
        <div className="export-actions">
          <button
            type="button"
            className="text-button prompt-preview-button"
            onClick={() => onModal({ kind: 'prompt', palette })}
          >
            <Image size={15} />
            查看设计提示词
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => onCopy(createCss(palette), 'CSS 变量')}
          >
            <Code2 size={16} />
            复制 CSS
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={() => onCopy(createAgentPrompt(palette), 'Agent Prompt ')}
          >
            <Sparkles size={16} />
            复制 Agent Prompt
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
