import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Moon,
  Search,
  Sparkles,
  Sun,
  TriangleAlert,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { categories } from '../models/palette';
import { siteThemeVariables } from '../services/siteTheme';
import { Atmosphere } from './Atmosphere';
import { PaletteDraftFeature } from './PaletteDraftFeature';
import { PaletteFeature } from './PaletteFeature';
import { PaletteModal } from './PaletteModal';
import { useExplorer } from './useExplorer';

export function App() {
  const explorer = useExplorer();
  const background = explorer.themeTokens?.background;

  useEffect(() => {
    if (!background) return;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background);
  }, [background]);

  return (
    <div
      className="theme-root"
      style={siteThemeVariables(explorer.themeTokens)}
      data-palette={explorer.theme?.id}
      data-mode={explorer.mode}
    >
      <a className="skip-link" href="#collection">
        跳转到色板
      </a>
      <Atmosphere source={explorer.theme?.artwork.src} />
      <div className="page-shell">
        <header className="site-header">
          <a className="brand" href="/" aria-label="守宫首页">
            <img src="/brand/mark-64.png" alt="" width={38} height={38} />
            <span className="brand-name">守宫</span>
            <span className="brand-chinese">中国传统色彩图谱</span>
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
            <div className="header-actions">
              <a
                className="header-icon"
                href="https://hexly.ai"
                target="_blank"
                rel="noreferrer"
                aria-label="Hexly 家族项目"
                title="Hexly 家族"
              >
                <img src="/brand/hexly-mark.svg" alt="" width={16} height={18} />
              </a>
              <a
                className="header-icon"
                href="https://github.com/nocoo/chamelo"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub 源码仓库"
                title="GitHub 源码"
              >
                <svg viewBox="0 0 16 16" width={16} height={16} role="presentation">
                  <path
                    fill="currentColor"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
                  />
                </svg>
              </a>
              <button
                type="button"
                className="header-icon"
                onClick={explorer.toggleMode}
                aria-label={explorer.mode === 'dark' ? '切换到浅色外观' : '切换到深色外观'}
                aria-pressed={explorer.mode === 'dark'}
                title={explorer.mode === 'dark' ? '浅色外观' : '深色外观'}
              >
                {explorer.mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                type="button"
                className="header-icon"
                onClick={() => explorer.setModal({ kind: 'guide' })}
                aria-label="使用指南"
                title="使用指南"
              >
                <BookOpen size={16} />
              </button>
            </div>
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
            守宫<span className="footer-divider">/</span>有来处的配色
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
