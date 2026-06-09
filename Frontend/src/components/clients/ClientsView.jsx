import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '../common/Icons';
import { useAppContext } from '../../context/AppContext';

// Helper to generate avatar color from name
const getAvatarColor = (name) => {
  const colors = ['#D6121D', '#2A2633', '#E23B44', '#8E8896', '#1A181E', '#FF5E62', '#4B4453', '#C9141F', '#A855F7', '#3b82f6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function ClientsView() {

  const texts = {
    fr: {
      loadingClients: "Chargement des clients...",
      retry: "Réessayer",
      allActivities: "Toutes les activités",
      activity: "Activité",
      currentOffer: "Offre actuelle",
      potentialRevenue: "Revenu maximum potentiel",
      revenueTenure: "Revenus & Tenure",
      revenueM1: "Revenue M1",
      revenueM2: "Revenue M2",
      revenueM3: "Revenue M3",
      tenure: "Tenure",
      months: "mois",
    },
    en: {
      loadingClients: "Loading clients...",
      retry: "Retry",
      allActivities: "All activities",
      activity: "Activity",
      currentOffer: "Current offer",
      potentialRevenue: "Maximum potential revenue",
      revenueTenure: "Revenue & Tenure",
      revenueM1: "M1 Revenue",
      revenueM2: "M2 Revenue",
      revenueM3: "M3 Revenue",
      tenure: "Tenure",
      months: "months",
    }
  };

  const {
    selectedClientId,
    setSelectedClientId,
    lang,
    t
  } = useAppContext();

  const txt = texts[lang] || texts.fr;

  const navigate = useNavigate();

  // API data state
  const [apiClients, setApiClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local filters & search query
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [activityFilter, setActivityFilter] = useState('All');

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && result.data) {
        setApiClients(result.data);
        if (result.data.length > 0 && !selectedClientId) {
          setSelectedClientId(result.data[0].id);
        }
      } else {
        throw new Error(result.message || 'Erreur lors du chargement des clients');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Selected client details
  const selectedClient = apiClients.find(c => c.id === selectedClientId) || apiClients[0];

  // Filtering
  const filteredClients = apiClients.filter(client => {
    const matchesSearch =
      client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.contact && client.contact.includes(searchQuery));

    const matchesSegment = segmentFilter === 'All' ||
      client.valueSegment === segmentFilter;

    const matchesActivity = activityFilter === 'All' ||
      client.flag_activity === activityFilter;

    return matchesSearch && matchesSegment && matchesActivity;
  });

  // Dynamic filter options
  const uniqueSegments = [...new Set(apiClients.map(c => c.valueSegment))];
  const uniqueActivities = [...new Set(apiClients.map(c => c.flag_activity))];

  const startRecommendationForClient = (client) => {
    navigate('/recommendation', { state: { clientId: client.id } });
  };

  // Badge color helpers
  const getSegmentBadgeClass = (segment) => {
    switch (segment) {
      case 'VHV': return 'green';
      case 'HV': return 'green';
      case 'MV': return 'orange';
      case 'LV': return 'red';
      case 'VLV': return 'red';
      case 'NEW': return 'blue';
      default: return 'blue';
    }
  };

  const getActivityBadgeClass = (activity) => {
    return activity === 1 ? 'green' : 'red';
  };

  const getActivityLabel = (flag) => {
    return flag === 1 ? (lang === 'fr' ? 'Actif' : 'Active') : (lang === 'fr' ? 'Inactif' : 'Inactive');
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: '16px', padding: '60px' }}>
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>
          {txt.loadingClients}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: '16px', padding: '60px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'var(--error-glow)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '28px'
        }}>⚠️</div>
        <p style={{ color: 'var(--error)', fontSize: '14px', fontWeight: 700 }}>
          {txt.error}: {error}
        </p>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '10px 24px' }}
          onClick={() => window.location.reload()}
        >
          {txt.retry}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flexGrow: 1 }}>
      {/* Filters toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <span className="search-icon"><SearchIcon /></span>
          <input
            type="text"
            placeholder={t('searchPlaceholderClients')}
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
          >
            <option value="All">{t('allSegments')}</option>
            {uniqueSegments.map(seg => (
              <option key={seg} value={seg}>{seg}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
          >
            <option value="All">{txt.allActivities}</option>
            {uniqueActivities.map(act => (
              <option key={act} value={act}>{getActivityLabel(act)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Split Content pane */}
      <div className="client-split-container">
        {/* Left Table Panel */}
        <div className="glass-panel clients-list-card">
          <h3 style={{ marginBottom: '16px', fontWeight: '800' }}>{t('listClientsTitle')} ({filteredClients.length})</h3>
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t('thClientContact')}</th>
                  <th>{txt.activity}</th>
                  <th>{t('thSpend')}</th>
                  <th>{t('thSegment')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className={selectedClientId === client.id ? 'selected' : ''}
                    onClick={() => setSelectedClientId(client.id)}
                  >
                    <td>
                      <div className="client-meta-cell">
                        <div
                          className="client-avatar-circle"
                          style={{ backgroundColor: getAvatarColor(client.full_name) }}
                        >
                          {client.full_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="client-details-mini">
                          <span className="client-name-bold">{client.full_name}</span>
                          <span className="client-phone-sub">{client.contact}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getActivityBadgeClass(client.flag_activity)}`}>
                        {getActivityLabel(client.flag_activity)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{client.avg_real_rev} DZD</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{client.clientPastOfferName}</div>
                    </td>
                    <td>
                      <span className={`badge ${getSegmentBadgeClass(client.valueSegment)}`}>
                        {client.valueSegment}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      {t('noClientFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Profile Details panel */}
        {selectedClient && (
          <div className="glass-panel client-detail-card">
            <div className="detail-header">
              <div
                className="avatar-large"
                style={{ backgroundColor: getAvatarColor(selectedClient.full_name) }}
              >
                {selectedClient.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="detail-title-sec">
                <span className="detail-name">{selectedClient.full_name}</span>
                <span className="detail-phone">📱 {selectedClient.contact}</span>
              </div>
            </div>

            <div>
              <h4 className="offer-features-title">{t('profileParamsTitle')}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{txt.currentOffer}</span>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>{selectedClient.clientPastOfferName}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{txt.potentialRevenue}</span>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--brand-red)' }}>{selectedClient.potential_max_rev} DZD</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="offer-features-title">{t('telemetryTitle')}</h4>
              <div className="usage-stats-grid">
                <div className="usage-stat-box">
                  <span className="usage-stat-label">{t('internetVolume')}</span>
                  <span className="usage-stat-value">
                    {(selectedClient.avg_volume_data_mo / 1024).toFixed(2)} <span className="usage-stat-unit">Go</span>
                  </span>
                  <div className="telemetry-progress-wrapper">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill red"
                        style={{ width: `${Math.min(100, ((selectedClient.avg_volume_data_mo / 1024) / 50) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="usage-stat-box">
                  <span className="usage-stat-label">{t('voiceMinutes')}</span>
                  <span className="usage-stat-value">
                    {(selectedClient.avg_traf_total / 60).toFixed(2)} <span className="usage-stat-unit">h</span>
                  </span>
                  <div className="telemetry-progress-wrapper">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill purple"
                        style={{ width: `${Math.min(100, ((selectedClient.avg_traf_total / 60) / 10) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue & Tenure section */}
            <div>
              <h4 className="offer-features-title">{txt.revenueTenure}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{txt.revenueM1}</span>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>{selectedClient.rev_m1} DZD</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{txt.revenueM2}</span>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>{selectedClient.rev_m2} DZD</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{txt.revenueM3}</span>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>{selectedClient.rev_m3} DZD</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{txt.tenure}</span>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>{selectedClient.tenure} mois</p>
                </div>
              </div>
            </div>

            <div className="action-btn-container">
              <button
                className="btn-primary"
                onClick={() => startRecommendationForClient(selectedClient)}
              >
                {t('recButton')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
