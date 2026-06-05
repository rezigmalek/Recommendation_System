import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function RecommendationLoading({ loadingProgress, loadingText }) {
  const { t } = useAppContext();

  return (
    <div className="ai-loader-container">
      <div className="ai-scan-sphere">
        <div className="scanner-beam"></div>
        <div className="ai-inner-core"></div>
      </div>
      <h3 className="loader-status-text">{t('aiAnalyzing')} {loadingProgress}%</h3>
      <p className="loader-sub-text">{loadingText}</p>

      <div style={{ width: '80%', maxWidth: '300px', height: '4px', background: 'var(--bg-600)', borderRadius: '2px', overflow: 'hidden', marginTop: '20px' }}>
        <div style={{ width: `${loadingProgress}%`, height: '100%', backgroundColor: 'var(--brand-red)' }}></div>
      </div>
    </div>
  );
}
