import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import logo from '../../assets/Djezzy_Logo_2015.svg';

export default function Sidebar() {
  const {
    historyList,
    setSelectedHistoryItem,
    translateStatus,
    selectedClientId,
    t
  } = useAppContext();

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
        <div className="recent-list">
          {historyList.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="recent-item"
              onClick={() => {
                setSelectedHistoryItem(item);
              }}
            >
              <div className="recent-client">
                <span>{item.clientName}</span>
                <span className="recent-plan-badge">{item.recommendedPlan.split(' ').slice(-1)[0]}</span>
              </div>
              <div className="recent-meta">
                <span>{item.date.split(' ')[0]}</span>
                <span style={{ color: item.status === 'Appliquée' ? 'var(--success)' : 'var(--warning)' }}>
                  {translateStatus(item.status)}
                </span>
              </div>
            </div>
          ))}
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
