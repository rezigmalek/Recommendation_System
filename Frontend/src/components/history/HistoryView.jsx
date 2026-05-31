import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function HistoryView() {
  const {
    historyList,
    setSelectedHistoryItem,
    lang,
    t
  } = useAppContext();

  const translateStatus = (status) => {
    if (status === 'Appliquée') return t('statusApplied');
    if (status === 'Envoyée par SMS') return t('statusSentSms');
    if (status === 'Ignorée') return t('statusIgnored');
    return status;
  };

  return (
    <div className="glass-panel history-logs-card">
      <h3 style={{ marginBottom: '16px', fontWeight: '800' }}>{t('historyTableTitle')}</h3>
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>{t('thDateTime')}</th>
              <th>{t('thClientConcerned')}</th>
              <th>{t('thOfferProposed')}</th>
              <th>{t('thSavingsOptim')}</th>
              <th>{t('thStatus')}</th>
              <th>{t('thAction')}</th>
            </tr>
          </thead>
          <tbody>
            {historyList.map((log) => {
              const savings = log.currentSpend - log.recommendedPrice;
              return (
                <tr key={log.id}>
                  <td style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {log.date}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{log.clientName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.clientPhone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{log.recommendedPlan}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lang === 'fr' ? 'Avant: ' : 'Before: '}{log.currentPlan}</div>
                  </td>
                  <td>
                    {savings > 0 ? (
                      <span style={{ color: 'var(--success)', fontWeight: 700 }}>+{savings} DZD {lang === 'fr' ? 'Éco' : 'Saved'}</span>
                    ) : (
                      <span style={{ color: '#A855F7', fontWeight: 700 }}>{lang === 'fr' ? 'Data Opti' : 'Data Opti'}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${log.status === 'Appliquée' ? 'green' :
                      log.status === 'Envoyée par SMS' ? 'blue' : 'orange'
                      }`}>
                      {translateStatus(log.status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', borderRadius: 'var(--radius-sm)' }}
                      onClick={() => setSelectedHistoryItem(log)}
                    >
                      {t('btnInspect')}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
