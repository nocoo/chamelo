import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  TriangleAlert,
  X,
} from 'lucide-react';
import { categories } from '../models/palette';
import { siteThemeVariables } from '../services/siteTheme';
import { Atmosphere } from './Atmosphere';
import { PaletteDraftFeature } from './PaletteDraftFeature';
import { PaletteFeature } from './PaletteFeature';
import { PaletteModal } from './PaletteModal';
import { useExplorer } from './useExplorer';

export function App() {
  const explorer = useExplorer();

  return (
    <div
      className="theme-root"
      style={siteThemeVariables(explorer.theme)}
      data-palette={explorer.theme?.id}
      data-mode={explorer.theme?.mode ?? 'light'}
    >
      <a className="skip-link" href="#collection">
        跳转到色板
      </a>
      <Atmosphere source={explorer.theme?.artwork.src} />
      <div className="page-shell">
        <header className="site-header">
          <a className="brand" href="/" aria-label="Chamelo 变色龙首页">
            <img src="/favicon.svg" alt="" width={29} height={29} />
            <span>
              chamelo<span className="brand-period">.</span>
            </span>
            <span className="brand-chinese">变色龙</span>
          </a>
          <nav className="header-nav" aria-label="主导航">
            <a href="#collection" className="nav-active">
              <span />
              意象色馆
            </a>
            <button type="button" onClick={() => explorer.setModal({ kind: 'guide' })}>
              配色方法
              <ArrowUpRight size={13} />
            </button>
          </nav>
          <div className="header-end">
            <span className="header-motto">ROOTED IN CHINA. MADE FOR NOW.</span>
            <button
              type="button"
              className="guide-button"
              onClick={() => explorer.setModal({ kind: 'guide' })}
            >
              <BookOpen size={15} />
              <span>使用指南</span>
            </button>
          </div>
        </header>

        <main>
          <section className="intro" aria-labelledby="page-title">
            <div className="intro-main">
              <div className="eyebrow intro-eyebrow">
                <span className="eyebrow-line" />
                中国意象 · 当代配色<span className="volume">VOL. 01</span>
              </div>
              <h1 id="page-title">
                东方有色，<em>万物可配。</em>
                <span className="title-spark" aria-hidden="true">
                  ✳
                </span>
              </h1>
              <p>从一幅意象，到一个好界面。为你的下一个作品，找一套有来处的配色。</p>
            </div>
            <div className="intro-aside">
              <div className="mini-spectrum" aria-hidden="true">
                {explorer.theme?.swatches.map((swatch) => (
                  <i key={swatch.id} style={{ background: swatch.hex }} />
                ))}
              </div>
              <p>
                取色于千年之间，
                <br />
                用色在方寸之上。
              </p>
              <span>A COLOUR ATLAS, REIMAGINED.</span>
            </div>
          </section>

          <section id="collection" className="collection" aria-label="意象色板馆">
            <div className="collection-toolbar">
              <fieldset className="category-tabs" aria-label="按文化来源筛选">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={explorer.category === category.id}
                    onClick={() => explorer.setCategory(category.id)}
                  >
                    {category.label}
                    {category.id === 'all' && (
                      <span>{String(explorer.total).padStart(2, '0')}</span>
                    )}
                  </button>
                ))}
              </fieldset>
              <div className="collection-tools">
                {explorer.visible.length > 1 && (
                  <nav
                    className="palette-pagination"
                    aria-label="切换意象色板"
                    aria-keyshortcuts="ArrowLeft ArrowRight"
                  >
                    <button
                      type="button"
                      onClick={() => explorer.stepPalette(-1)}
                      aria-label="上一套色板"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span aria-live="polite">
                      {String(explorer.activeIndex + 1).padStart(2, '0')}
                      <span> / {String(explorer.visible.length).padStart(2, '0')}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => explorer.stepPalette(1)}
                      aria-label="下一套色板"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                )}
                <label className="search-field">
                  <Search size={15} aria-hidden="true" />
                  <input
                    value={explorer.query}
                    onChange={(event) => explorer.setQuery(event.target.value)}
                    placeholder="寻找一种意境…"
                    aria-label="搜索色板"
                  />
                  {explorer.query && (
                    <button
                      type="button"
                      onClick={() => explorer.setQuery('')}
                      aria-label="清空搜索"
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
              </div>
            </div>
            {explorer.active?.status === 'published' && (
              <PaletteFeature
                key={explorer.active.id}
                palette={explorer.active}
                format={explorer.format}
                onFormat={explorer.setFormat}
                onCopy={explorer.copy}
                onModal={explorer.setModal}
              />
            )}
            {explorer.active?.status === 'todo' && (
              <PaletteDraftFeature key={explorer.active.id} draft={explorer.active} />
            )}
            {!explorer.active && (
              <div className="empty-state">
                <Sparkles size={32} strokeWidth={1.2} />
                <span className="eyebrow">ANOTHER STORY IS TAKING SHAPE</span>
                <h2>{explorer.query ? '暂未找到这份意境' : '下一种意象，正在酝酿。'}</h2>
                <p>
                  {explorer.query
                    ? '试试「敦煌」「石青」或「温润」，也可以回到全部意象。'
                    : '好的配色值得慢慢打磨。先从首辑「敦煌华彩」开始。'}
                </p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    explorer.setCategory('all');
                    explorer.setQuery('');
                  }}
                >
                  回到全部意象
                  <ArrowRight size={15} />
                </button>
              </div>
            )}{' '}
          </section>

          <section className="method-note" id="method">
            <div className="method-mark" aria-hidden="true">
              从<br />色
            </div>
            <div>
              <h2>不止于好看的颜色。</h2>
              <p>从原图提取，再为界面调校。让背景、文字、按钮各得其所，也让灵感有章可循。</p>
            </div>
            <button type="button" onClick={() => explorer.setModal({ kind: 'guide' })}>
              了解我们的配色方法
              <ArrowUpRight size={16} />
            </button>
          </section>
        </main>

        <footer className="site-footer">
          <span>
            CHAMELO<span className="footer-divider">/</span>有来处的配色
          </span>
          <span>原创 AI 意象 · 语义配色策展</span>
          <span>
            慢慢收集，认真配色。<span className="footer-year">© 2026</span>
            <span className="footer-version" title={`版本 ${__APP_VERSION__}`}>
              v{__APP_VERSION__}
            </span>
          </span>
        </footer>
      </div>

      {explorer.modal && (
        <PaletteModal
          state={explorer.modal}
          onDismiss={() => explorer.setModal(null)}
          onCopy={explorer.copy}
        />
      )}
      <div
        className={`copy-toast${explorer.toast ? ' copy-toast--visible' : ''}${explorer.toast?.error ? ' copy-toast--error' : ''}`}
        role="status"
        aria-live="polite"
      >
        {explorer.toast?.error ? <TriangleAlert size={17} /> : <Check size={17} />}
        <span>{explorer.toast?.text}</span>
      </div>
    </div>
  );
}
