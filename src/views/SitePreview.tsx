import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react';
import { useState } from 'react';
import type { Palette } from '../models/palette';
import { paletteVariables } from '../services/exports';

export function SitePreview({
  palette,
  expanded = false,
}: {
  palette: Palette;
  expanded?: boolean;
}) {
  const [exploring, setExploring] = useState(false);

  return (
    <div
      className={`site-preview${expanded ? ' site-preview--expanded' : ''}`}
      style={paletteVariables(palette)}
    >
      <div className="site-preview-nav">
        <span className="preview-wordmark">
          山居<span>SHANJU</span>
        </span>
        <span className="preview-nav-links">
          空间<span>器物</span>
          <span>日常</span>
        </span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </div>
      <div className="site-preview-body">
        <div className="preview-copy">
          <span className="preview-eyebrow">A SLOWER WAY OF LIVING</span>
          <h3>
            {exploring ? (
              <>
                在自然里，
                <br />
                找到自己。
              </>
            ) : (
              <>
                把日子，
                <br />
                还给山野。
              </>
            )}
          </h3>
          <p>
            一处安放身心的居所，
            <br />
            一种与自然相处的方式。
          </p>
          <button type="button" className="preview-cta" onClick={() => setExploring(!exploring)}>
            {exploring ? '回到初见' : '发现山居'}
            <MoveUpRight size={13} aria-hidden="true" />
          </button>
        </div>
        <div className="preview-visual">
          <div className="preview-arch">
            <img
              src={palette.artwork.src}
              alt="与山居网站配色呼应的敦煌矿物色意象"
              loading="lazy"
            />
          </div>
          <span className="preview-seal" aria-hidden="true">
            山<br />居
          </span>
          <span className="preview-image-label">LANDSCAPE / 01</span>
        </div>
      </div>
      {expanded && (
        <div className="preview-extended">
          <div>
            <span className="preview-eyebrow">OUR PHILOSOPHY</span>
            <h4>日常之中，自有山海。</h4>
          </div>
          <p>
            让材质回到本真，让空间留有余地。我们从土地、石壁和草木中寻找色彩，让每一个平凡的日子，多一点自在。
          </p>
          <ArrowDown size={24} aria-hidden="true" />
        </div>
      )}
      <div className="preview-bottom">
        <span>和自然，慢慢相处。</span>
        <span>EST. 2026</span>
      </div>
    </div>
  );
}
