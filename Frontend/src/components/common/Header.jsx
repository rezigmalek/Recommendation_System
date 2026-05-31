import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function Header() {
  const {
    lang,
    setLang,
    theme,
    setTheme,
    t
  } = useAppContext();

  const location = useLocation();
  const path = location.pathname;

  const getTitle = () => {
    if (path === '/') return lang === 'fr' ? 'Bienvenue' : 'Welcome';
    if (path.startsWith('/clients')) return t('tabTitleClients');
    if (path.startsWith('/offres')) return t('tabTitleOffers');
    if (path.startsWith('/recommendation')) return t('tabTitleRec');
    if (path.startsWith('/history')) return t('tabTitleHistory');
    return t('tabTitleClients'); // fallback
  };

  return (
    <header className="content-header">
      <div className="header-title-sec">
        <h1>{getTitle()}</h1>
        <p>{t('subHeader')}</p>
      </div>

      <div className="controls-group">
        {/* Language Switcher Buttons */}
        <div className="lang-group">
          <button
            className={`lang-btn ${lang === 'fr' ? 'active' : ''}`}
            onClick={() => setLang('fr')}
          >
            FR
          </button>
          <button
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>

        {/* Night / Light theme switcher toggle button */}
        <button
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? "Mode Clair" : "Night Mode"}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="system-status">
          <div className="status-dot"></div>
          <span>{t('systemStatus')}</span>
        </div>
      </div>
    </header>
  );
}
