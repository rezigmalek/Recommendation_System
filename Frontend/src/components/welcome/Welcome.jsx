import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function Welcome() {
  const { lang } = useAppContext();

  const title = lang === 'fr' ? 'Bienvenue sur Djezzy AI' : 'Welcome to Djezzy AI';
  const subtitle = lang === 'fr'
    ? 'Le portail intelligent de prédiction et recommandation de forfaits.'
    : 'The intelligent package prediction and recommendation portal.';

  return (
    <div className="welcome-hero">
      <style>{`
        .welcome-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 60vh;
          text-align: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* ── Red Spotlight ── */
        .welcome-spotlight {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(
            circle,
            rgba(227, 6, 19, 0.22) 0%,
            rgba(227, 6, 19, 0.10) 35%,
            rgba(227, 6, 19, 0.03) 60%,
            transparent 80%
          );
          pointer-events: none;
          filter: blur(40px);
          z-index: 0;
          animation: spotlightPulse 5s infinite alternate ease-in-out;
        }

        /* Secondary softer accent ring */
        .welcome-spotlight-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(227, 6, 19, 0.12) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
          animation: spotlightPulse 5s 1s infinite alternate ease-in-out;
        }

        @keyframes spotlightPulse {
          0%   { transform: translate(-50%, -50%) scale(0.85); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }

        /* ── Text wrapper ── */
        .welcome-text-wrapper {
          z-index: 1;
          max-width: 750px;
        }

        /* ── Title ── dark mode default */
        .welcome-hero-title {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #ffffff 40%, var(--brand-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 20px rgba(227, 6, 19, 0.25));
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── Subtitle ── */
        .welcome-hero-subtitle {
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.7;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ═══════════════════════════════════
           Light Theme Overrides
           ═══════════════════════════════════ */

        /* Spotlight: softer on light backgrounds */
        .light-theme .welcome-spotlight {
          background: radial-gradient(
            circle,
            rgba(227, 6, 19, 0.12) 0%,
            rgba(227, 6, 19, 0.05) 40%,
            transparent 75%
          );
          filter: blur(50px);
        }

        .light-theme .welcome-spotlight-ring {
          background: radial-gradient(
            circle,
            rgba(227, 6, 19, 0.07) 0%,
            transparent 70%
          );
        }

        /* Title gradient: dark text fading to brand red */
        .light-theme .welcome-hero-title {
          background: linear-gradient(135deg, var(--text-primary) 40%, var(--brand-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 10px rgba(227, 6, 19, 0.15));
        }

        /* Subtitle: lighter shadow on bright backgrounds */
        .light-theme .welcome-hero-subtitle {
          color: var(--text-secondary);
          filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.08));
        }
      `}</style>

      {/* Spotlight layers behind the hero text */}
      <div className="welcome-spotlight"></div>
      <div className="welcome-spotlight-ring"></div>

      <div className="welcome-text-wrapper">
        <h1 className="welcome-hero-title">{title}</h1>
        <p className="welcome-hero-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
