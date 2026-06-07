import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const loadingSteps = {
  fr: [
    "Analyse des données client...",
    "Évaluation des offres disponibles...",
    "Application des règles métier...",
    "Calcul des scores de correspondance...",
    "Finalisation de la recommandation...",
  ],
  en: [
    "Analyzing client data...",
    "Evaluating available offers...",
    "Applying business rules...",
    "Computing match scores...",
    "Finalizing recommendation...",
  ]
};

export default function Loading() {
  const { lang } = useAppContext();
  const steps = loadingSteps[lang] || loadingSteps.fr;

  const [progress, setProgress] = useState(0);
  const [text, setText] = useState(steps[0]);

  useEffect(() => {
    setProgress(0);
    setText(steps[0]);
  }, [lang]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next < 20)       setText(steps[0]);
        else if (next < 40)  setText(steps[1]);
        else if (next < 60)  setText(steps[2]);
        else if (next < 80)  setText(steps[3]);
        else                 setText(steps[4]);
        if (next >= 100) { clearInterval(interval); return 100; }
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="ai-loader-container">

      {/* ── Sphere ── */}
      <div className="ai-scan-sphere">
        <div className="ai-orbit-ring" />
        <div className="ai-orbit-ring-2" />
        <div className="ai-dot-satellite" />
        <div className="ai-inner-core">
          <div className="ai-land land-1" />
          <div className="ai-land land-2" />
          <div className="ai-land land-3" />
          <div className="ai-land land-4" />
          <div className="scanner-beam" />
        </div>
      </div>

      {/* ── Text ── */}
      <h3 className="loader-status-text">
        Analyse en cours... {progress}%
      </h3>
      <p className="loader-sub-text">{text}</p>

      {/* ── Progress bar ── */}
      <div style={{
        width: '80%', maxWidth: '300px', height: '4px',
        background: 'var(--bg-600)', borderRadius: '2px',
        overflow: 'hidden', marginTop: '20px'
      }}>
        <div style={{
          width: `${progress}%`, height: '100%',
          backgroundColor: 'var(--brand-red)',
          transition: 'width 0.08s linear'
        }} />
      </div>

    </div>
  );
}