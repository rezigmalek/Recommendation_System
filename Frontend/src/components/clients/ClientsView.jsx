import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '../common/Icons';
import { useAppContext } from '../../context/AppContext';

export default function ClientsView() {
  const {
    clients,
    selectedClientId,
    setSelectedClientId,
    lang,
    t
  } = useAppContext();

  const navigate = useNavigate();

  // Local filters & search query
  const [searchQuery, setSearchQuery] = useState('');
  const [clientSegmentFilter, setClientSegmentFilter] = useState('All');
  const [clientRiskFilter, setClientRiskFilter] = useState('All');

  // Translation helpers
  const translateSegment = (seg) => {
    if (seg === 'Grand Public') return t('segmentGrandPublic');
    if (seg === 'Jeune') return t('segmentJeune');
    if (seg === 'Professionnel') return t('segmentPro');
    if (seg === 'VIP') return t('segmentVIP');
    return seg;
  };

  const translateRisk = (risk) => {
    if (risk === 'Faible') return t('riskFaible');
    if (risk === 'Moyen') return t('riskMoyen');
    if (risk === 'Élevé') return t('riskEleve');
    return risk;
  };

  // Selected client details object
  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Filtering clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);

    // Support filtering across English/French equivalents
    const matchesSegment = clientSegmentFilter === 'All' ||
      client.segment === clientSegmentFilter ||
      (clientSegmentFilter === 'Mass Market' && client.segment === 'Grand Public') ||
      (clientSegmentFilter === 'Youth' && client.segment === 'Jeune') ||
      (clientSegmentFilter === 'Business' && client.segment === 'Professionnel');

    const matchesRisk = clientRiskFilter === 'All' ||
      client.churnRisk === clientRiskFilter ||
      (clientRiskFilter === 'Low' && client.churnRisk === 'Faible') ||
      (clientRiskFilter === 'Medium' && client.churnRisk === 'Moyen') ||
      (clientRiskFilter === 'High' && client.churnRisk === 'Élevé');

    return matchesSearch && matchesSegment && matchesRisk;
  });

  const totalClients = clients.length;
  const highRiskClients = clients.filter(c => c.churnRisk === 'Élevé').length;

  const startRecommendationForClient = (client) => {
    navigate('/recommendation', { state: { clientId: client.id } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flexGrow: 1 }}>
      {/* KPIs Header */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon-box red">👤</div>
          <div className="kpi-info">
            <span className="kpi-value">{totalClients}</span>
            <span className="kpi-label">{t('kpiTotalClients')}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-box warning">⚠️</div>
          <div className="kpi-info">
            <span className="kpi-value">{highRiskClients}</span>
            <span className="kpi-label">{t('kpiRiskClients')}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-box green">📉</div>
          <div className="kpi-info">
            <span className="kpi-value">12.4%</span>
            <span className="kpi-label">{t('kpiChurnRate')}</span>
          </div>
        </div>
      </div>

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
            value={clientSegmentFilter}
            onChange={(e) => setClientSegmentFilter(e.target.value)}
          >
            <option value="All">{t('allSegments')}</option>
            <option value="Grand Public">{lang === 'fr' ? 'Grand Public' : 'Mass Market'}</option>
            <option value="Jeune">{lang === 'fr' ? 'Jeune' : 'Youth'}</option>
            <option value="Professionnel">{lang === 'fr' ? 'Professionnel' : 'Business'}</option>
            <option value="VIP">VIP</option>
          </select>
          <select
            className="filter-select"
            value={clientRiskFilter}
            onChange={(e) => setClientRiskFilter(e.target.value)}
          >
            <option value="All">{t('allRisks')}</option>
            <option value="Faible">{lang === 'fr' ? 'Faible' : 'Low'}</option>
            <option value="Moyen">{lang === 'fr' ? 'Moyen' : 'Medium'}</option>
            <option value="Élevé">{lang === 'fr' ? 'Élevé' : 'High'}</option>
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
                  <th>{t('thSegment')}</th>
                  <th>{t('thSpend')}</th>
                  <th>{t('thRisk')}</th>
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
                          style={{ backgroundColor: client.avatarColor }}
                        >
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="client-details-mini">
                          <span className="client-name-bold">{client.name}</span>
                          <span className="client-phone-sub">{client.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{translateSegment(client.segment)}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{client.currentSpend} DZD</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{client.currentPlan}</div>
                    </td>
                    <td>
                      <span className={`badge ${client.churnRisk === 'Élevé' ? 'red' :
                        client.churnRisk === 'Moyen' ? 'orange' : 'green'
                        }`}>
                        {translateRisk(client.churnRisk)}
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
                style={{ backgroundColor: selectedClient.avatarColor }}
              >
                {selectedClient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="detail-title-sec">
                <span className="detail-name">{selectedClient.name}</span>
                <span className="detail-phone">📱 {selectedClient.phone}</span>
              </div>
            </div>

            <div>
              <h4 className="offer-features-title">{t('profileParamsTitle')}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('currentPlanLabel')}</span>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>{selectedClient.currentPlan}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('targetBudgetLabel')}</span>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--brand-red)' }}>{selectedClient.budgetLimit} DZD</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="offer-features-title">{t('telemetryTitle')}</h4>
              <div className="usage-stats-grid">
                <div className="usage-stat-box">
                  <span className="usage-stat-label">{t('internetVolume')}</span>
                  <span className="usage-stat-value">
                    {selectedClient.dataUsageGB} <span className="usage-stat-unit">GB</span>
                  </span>
                  <div className="telemetry-progress-wrapper">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill red"
                        style={{ width: `${Math.min(100, (selectedClient.dataUsageGB / 120) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="usage-stat-box">
                  <span className="usage-stat-label">{t('voiceMinutes')}</span>
                  <span className="usage-stat-value">
                    {selectedClient.voiceMinutes} <span className="usage-stat-unit">min</span>
                  </span>
                  <div className="telemetry-progress-wrapper">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill purple"
                        style={{ width: `${Math.min(100, (selectedClient.voiceMinutes / 3500) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
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
