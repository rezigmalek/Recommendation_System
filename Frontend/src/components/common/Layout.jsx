import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppContext } from '../../context/AppContext';

export default function Layout() {
  const {
    historyList,
    setSelectedHistoryItem,
    translateStatus,
    t,
    lang,
    selectedHistoryItem,
    setClients,
    setHistoryList
  } = useAppContext();

  return (
    <div className="dashboard-container">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      <main className="main-content">
        <Header />

        <div className="content-body">
          <Outlet />
        </div>
      </main>

      {/* 3. POPUP MODAL: INSPECT PAST RECOMMENDATION DETAILS */}
      {selectedHistoryItem && (
        <div className="modal-overlay">
          <div className="modal-content-card">
            <button
              className="modal-close-btn"
              onClick={() => setSelectedHistoryItem(null)}
            >
              ✕
            </button>
            <div>
              <span className="modal-section-title">{t('modalRecentTitle')}</span>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>
                {lang === 'fr' ? `Recommandation pour ${selectedHistoryItem.clientName}` : `Recommendation for ${selectedHistoryItem.clientName}`}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {t('modalDateLabel')} {selectedHistoryItem.date}
              </span>
            </div>

            <div className="info-pair-row">
              <div className="info-pair">
                <span className="info-pair-label">{t('modalContactLabel')}</span>
                <span className="info-pair-val">{selectedHistoryItem.clientPhone}</span>
              </div>
              <div className="info-pair">
                <span className="info-pair-label">{t('modalLogStatus')}</span>
                <span className="info-pair-val">
                  <span className={`badge ${selectedHistoryItem.status === 'Appliquée' ? 'green' : 'blue'
                    }`} style={{ textTransform: 'none' }}>
                    {translateStatus(selectedHistoryItem.status)}
                  </span>
                </span>
              </div>
            </div>

            <div className="info-pair-row">
              <div className="info-pair">
                <span className="info-pair-label">{t('modalPrevPlan')}</span>
                <span className="info-pair-val">{selectedHistoryItem.currentPlan} ({selectedHistoryItem.currentSpend} DZD)</span>
              </div>
              <div className="info-pair" style={{ borderLeft: '3px solid var(--brand-red)' }}>
                <span className="info-pair-label" style={{ color: 'var(--brand-red)' }}>{t('modalRecPlan')}</span>
                <span className="info-pair-val">{selectedHistoryItem.recommendedPlan} ({selectedHistoryItem.recommendedPrice} DZD)</span>
              </div>
            </div>

            <div className="justification-section">
              <span className="justification-title">{t('modalAiReasoning')}</span>
              <p className="justification-text">{selectedHistoryItem.justification}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                className="btn-secondary"
                onClick={() => setSelectedHistoryItem(null)}
              >
                {t('btnClose')}
              </button>
              {selectedHistoryItem.status !== 'Appliquée' && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    // Update this specific entry in state history list
                    setHistoryList(prev => prev.map(h => {
                      if (h.id === selectedHistoryItem.id) {
                        return { ...h, status: 'Appliquée' };
                      }
                      return h;
                    }));

                    // Also update clients list in state to change active plan
                    setClients(prev => prev.map(c => {
                      if (c.phone === selectedHistoryItem.clientPhone) {
                        return {
                          ...c,
                          currentPlan: selectedHistoryItem.recommendedPlan,
                          currentSpend: selectedHistoryItem.recommendedPrice,
                          churnRisk: 'Faible'
                        };
                      }
                      return c;
                    }));

                    setSelectedHistoryItem(null);
                  }}
                >
                  {t('btnApplyNow')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
