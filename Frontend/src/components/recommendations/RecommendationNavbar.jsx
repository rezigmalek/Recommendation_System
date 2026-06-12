import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ClipboardList, BarChart2, PieChart } from 'lucide-react';

// ─── Labels ──────────────────────────────────────────────────────────────────
const navLabels = {
  fr: {
    results:       "Résultats",
    resultsDesc:   "Recommandations IA",
    analytics:     "Analytics",
    analyticsDesc: "Performance & KPIs",
    segmentation:  "Segmentation",
    segmentDesc:   "Critères par offre",
  },
  en: {
    results:       "Results",
    resultsDesc:   "AI Recommendations",
    analytics:     "Analytics",
    analyticsDesc: "Performance & KPIs",
    segmentation:  "Segmentation",
    segmentDesc:   "Criteria per offer",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function RecommendationNavbar() {
  const { lang } = useAppContext();
  const location  = useLocation();
  const navigate  = useNavigate();
  const { id }    = useParams();
  const t = (key) => navLabels[lang]?.[key] || key;

  const TABS = [
    {
      key:      'results',
      path:     `/recommendation-result/${id}`,
      icon:     <ClipboardList size={20} strokeWidth={1.8} />,
      labelKey: 'results',
      descKey:  'resultsDesc',
    },
    {
      key:      'analytics',
      path:     `/recommendation-analytics/${id}`,
      icon:     <BarChart2 size={20} strokeWidth={1.8} />,
      labelKey: 'analytics',
      descKey:  'analyticsDesc',
    },
    {
      key:      'segmentation',
      path:     `/recommendation-segmentation/${id}`,
      icon:     <PieChart size={20} strokeWidth={1.8} />,
      labelKey: 'segmentation',
      descKey:  'segmentDesc',
    },
  ];

  const activeTab = TABS.find((tab) => location.pathname === tab.path)?.key || 'results';

  return (
    <>
      <style>{`
        .rec-nav-bleed {
          margin-left:  calc(-1 * var(--content-padding, 24px));
          margin-right: calc(-1 * var(--content-padding, 24px));
          margin-top:   calc(-1 * var(--content-padding, 24px));
          margin-bottom: 28px;
          padding: 0 var(--content-padding, 24px);
          background: var(--bg-900, #0f1117);
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.08));
          position: relative;
          z-index: 10;
        }

        .rec-nav-strip {
          display: flex;
          align-items: stretch;
          gap: 0;
          height: 72px;
          position: relative;
        }

        .rec-nav-strip::after {
          content: '';
          position: absolute;
          bottom: 0;
          height: 2px;
          background: var(--brand-red, #e30613);
          border-radius: 2px 2px 0 0;
          transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                      width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          left: var(--indicator-left, 0px);
          width: var(--indicator-width, 0px);
        }

        .rec-nav-tab {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 28px;
          cursor: pointer;
          border: none;
          background: transparent;
          position: relative;
          transition: background 0.18s ease, transform 0.15s ease;
          text-align: left;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .rec-nav-tab:hover:not(.rec-nav-tab-active) {
          background: var(--bg-800, rgba(255,255,255,0.04));
          transform: translateY(-1px);
        }

        .rec-nav-tab-active {
          border-bottom-color: var(--brand-red, #e30613);
        }

        .rec-nav-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--bg-700, rgba(255,255,255,0.06));
          color: var(--text-muted, #555d6b);
          transition: background 0.18s ease, transform 0.18s ease, color 0.18s ease;
        }

        .rec-nav-tab:hover .rec-nav-icon,
        .rec-nav-tab-active .rec-nav-icon {
          background: rgba(227, 6, 19, 0.14);
          color: var(--brand-red, #e30613);
          transform: scale(1.08);
        }

        .rec-nav-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .rec-nav-label {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-secondary, #8b92a0);
          white-space: nowrap;
          letter-spacing: 0.01em;
          transition: color 0.18s ease;
        }

        .rec-nav-tab-active .rec-nav-label {
          color: var(--text-primary, #fff);
        }

        .rec-nav-desc {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-muted, #555d6b);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rec-nav-tab-active .rec-nav-desc {
          color: var(--text-secondary, #8b92a0);
        }

        .rec-nav-active-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--brand-red, #e30613);
          margin-left: 6px;
          box-shadow: 0 0 6px rgba(227, 6, 19, 0.55);
          animation: rec-dot-pulse 2s ease-in-out infinite;
        }

        @keyframes rec-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.75); }
        }

        .rec-nav-sep {
          width: 1px;
          background: var(--border, rgba(255,255,255,0.07));
          align-self: center;
          height: 28px;
          flex-shrink: 0;
          margin: 0 4px;
        }

        @media (max-width: 640px) {
          .rec-nav-bleed {
            padding: 0 12px;
            margin-left: -12px;
            margin-right: -12px;
            margin-top: -12px;
          }

          .rec-nav-tab {
            padding: 0 14px;
            gap: 8px;
          }

          .rec-nav-desc {
            display: none;
          }

          .rec-nav-icon {
            width: 30px;
            height: 30px;
          }

          .rec-nav-strip {
            height: 60px;
          }

          .rec-nav-sep {
            display: none;
          }
        }
      `}</style>

      <div className="rec-nav-bleed">
        <div className="rec-nav-strip">
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.key;

            return (
              <React.Fragment key={tab.key}>
                {idx > 0 && <div className="rec-nav-sep" />}
                <button
                  className={`rec-nav-tab${isActive ? ' rec-nav-tab-active' : ''}`}
                  onClick={() => navigate(tab.path)}
                >
                  <div className="rec-nav-icon">{tab.icon}</div>
                  <div className="rec-nav-text">
                    <span className="rec-nav-label">
                      {t(tab.labelKey)}
                      {isActive && <span className="rec-nav-active-dot" />}
                    </span>
                    <span className="rec-nav-desc">{t(tab.descKey)}</span>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
}