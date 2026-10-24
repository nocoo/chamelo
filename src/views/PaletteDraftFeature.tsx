import { CircleDashed, ImageOff } from 'lucide-react';
import { categories, type DraftEntry } from '../models/palette';

const directionRows = [
  { key: 'primary', label: '主色', share: '60%' },
  { key: 'secondary', label: '辅色', share: '30%' },
  { key: 'accent', label: '点睛', share: '10%' },
] as const;

const pendingOutputs = [
  '六枚色块与 12 个语义色',
  '推荐比例与网站预览',
  'CSS 变量与 Agent Prompt 导出',
];

export function PaletteDraftFeature({ draft }: { draft: DraftEntry }) {
  return (
    <article className="palette-feature palette-feature--draft">
      <div className="feature-heading">
        <div className="feature-title">
          <span className="edition-number">{draft.number}</span>
          <div>
            <h2>{draft.name}</h2>
            <p>{draft.english}</p>
          </div>
          <span className="collection-tag">
            {categories.find((category) => category.id === draft.category)?.label}
          </span>
        </div>
        <div className="feature-heading-note">
          <CircleDashed size={14} aria-hidden="true" />
          意象已收录 · 原图与取色待补
        </div>
      </div>

      <div className="feature-grid">
        <div className="artwork-panel">
          <div className="artwork-frame artwork-frame--pending">
            <span className="draft-ribbon" aria-hidden="true">
              待生成
            </span>
            <div className="artwork-topline">
              <span>THE ORIGIN OF COLOUR</span>
            </div>
            <div className="pending-center">
              <span className="pending-glyph" aria-hidden="true">
                色
              </span>
              <span className="pending-title">
                <ImageOff size={15} aria-hidden="true" />
                AI 原图占位
              </span>
              <span className="pending-hint">尚未生成，不使用任何真实图像</span>
            </div>
            <div className="image-corner-label">PLACEHOLDER · 待补 1536 × 1024</div>
          </div>
          <div className="artwork-footnote">
            <p>{draft.description}</p>
            <span className="draft-footnote-note">取色未定</span>
          </div>
        </div>

        <div className="palette-workbench">
          <div className="section-heading">
            <div>
              <span className="section-index">01</span>
              <h3>拟色</h3>
              <span className="section-english">COLOUR DIRECTION</span>
            </div>
            <span className="draft-flag">传统色名</span>
          </div>
          <dl className="draft-direction">
            {directionRows.map((row) => (
              <div key={row.key}>
                <dt>
                  {row.label}
                  <span className="draft-share">{row.share}</span>
                </dt>
                <dd>{draft.direction[row.key]}</dd>
                <span className="draft-slot" aria-hidden="true" />
              </div>
            ))}
          </dl>

          <div className="draft-tags">
            {draft.tags.map((tag) => (
              <span key={tag} className="draft-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="draft-pending">
            <div className="section-heading preview-section-heading">
              <div>
                <span className="section-index">02</span>
                <h3>待完成</h3>
                <span className="section-english">PENDING OUTPUT</span>
              </div>
            </div>
            <ul className="draft-checklist">
              {pendingOutputs.map((item) => (
                <li key={item}>
                  <CircleDashed size={13} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="feature-bottom feature-bottom--draft">
        <p className="draft-note">
          这一版只收录意象与拟色方向。原图、六个色块、语义色和导出会在策展完成后开放。
        </p>
      </div>
    </article>
  );
}
