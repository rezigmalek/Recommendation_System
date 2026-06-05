import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function HistoryView() {
  const {
    lang,
    t
  } = useAppContext();

  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  const formatDate = (dateTime) => {
    if (!dateTime) return '';

    const date = new Date(dateTime);

    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/history');

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setHistoryList(result.data);

        // select first item safely
        if (result.data.length > 0) {
          setSelectedHistoryItem(result.data[0]);
        }
      } else {
        throw new Error(result.message || 'Erreur lors du chargement de l’historique');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="glass-panel">Loading...</div>;
  }

  if (error) {
    return <div className="glass-panel" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="glass-panel history-logs-card">
      <h3 style={{ marginBottom: '16px', fontWeight: '800' }}>
        {t('historyTableTitle')}
      </h3>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>{t('thDateTime')}</th>
              <th>Total Clients</th>
              <th>Total Offers</th>
              <th>{t('thAction')}</th>
            </tr>
          </thead>

          <tbody>
            {historyList.map((log) => (
              <tr key={log.id}>

                {/* DATE */}
                <td style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {formatDate(log.dateTime) || formatDate(log.date)}
                </td>

                {/* TOTAL CLIENTS */}
                <td>
                  <div style={{ fontWeight: 700 }}>
                    {log.totalClients ?? log.total_clients}
                  </div>
                </td>

                {/* TOTAL OFFERS */}
                <td>
                  <div style={{ fontWeight: 700 }}>
                    {log.totalOffers ?? log.total_offers}
                  </div>
                </td>

                {/* ACTION */}
                <td>
                  <button
                    className="btn-secondary"
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      width: 'auto',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onClick={() => setSelectedHistoryItem(log)}
                  >
                    {t('btnInspect')}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}