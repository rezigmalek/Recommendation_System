import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import logo from '../../assets/Djezzy_Logo_2015.svg';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const {
    setSelectedHistoryItem,
    translateStatus,
    selectedClientId,
    t
  } = useAppContext();
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo-container">
          <img src={logo} alt="Djezzy Logo" className="brand-logo" />
        </div>
        <div className="brand-info">
          <span className="brand-title">{t('brandTitle')}</span>
          <span className="brand-subtitle">{t('brandSubtitle')}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <span className="menu-label">{t('menuLabelMain')}</span>

        <NavLink
          to="/clients"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          {t('tabClients')}
        </NavLink>

        <NavLink
          to="/offres"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          {t('tabOffers')}
        </NavLink>

        <NavLink
          to="/recommendation"
          state={{ clientId: selectedClientId }}
          className={({ isActive }) => `nav-item nav-item-cta ${isActive ? 'active' : ''}`}
        >
          {t('tabNewRec')}
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          {t('tabHistory')}
        </NavLink>

        {/* Récents recommendations section */}
        <span className="menu-label">{t('menuLabelRecents')}</span>
        <div className="recent-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {historyList.slice(0, 3).map((item) => {
            const refCode = item.recommendationReference ?? item.recommendation_reference ?? item.id;
            const clientsCount = item.totalClients ?? item.total_clients ?? 0;
            const offersCount = item.totalOffers ?? item.total_offers ?? 0;
            const itemDate = formatDate(item.dateTime) || formatDate(item.date);

            return (
              <div
                key={item.id}
                className="recent-item"
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-700)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  navigate(`/recommendation-result/${refCode}`);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--brand-red)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: 'var(--brand-red)',
                    backgroundColor: 'var(--brand-red-glow)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    letterSpacing: '0.5px'
                  }}>
                    Ref: #{refCode}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    📅 {itemDate}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ filter: 'grayscale(100%)' }}>👥</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      {clientsCount}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Clients</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ filter: 'grayscale(100%)' }}>📶</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      {offersCount}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Offres</span>
                  </div>
                </div>
              </div>
            );
          })}
          {historyList.length === 0 && (
            <span className="recent-meta" style={{ paddingLeft: '12px' }}>{t('noHistory')}</span>
          )}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">MK</div>
        <div className="user-details">
          <span className="user-name">Mustapha K.</span>
          <span className="user-role">{t('userRole')}</span>
        </div>
      </div>
    </aside>
  );
}
