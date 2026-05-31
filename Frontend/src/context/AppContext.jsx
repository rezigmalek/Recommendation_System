import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockClients, mockOffers, mockHistory } from '../mockData';
import { translations } from '../translations';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [clients, setClients] = useState(mockClients);
  const [offers] = useState(mockOffers);
  const [historyList, setHistoryList] = useState(mockHistory);

  // Custom Controls State (Language & Theme)
  const [lang, setLang] = useState('fr'); // 'fr' or 'en'
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

  // Navigation & client selection state
  const [selectedClientId, setSelectedClientId] = useState('c1');

  // History inspect modal state
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Translation helper function
  const t = (key) => {
    return translations[lang][key] || key;
  };

  const translateStatus = (status) => {
    if (status === 'Appliquée') return t('statusApplied');
    if (status === 'Envoyée par SMS') return t('statusSentSms');
    if (status === 'Ignorée') return t('statusIgnored');
    return status;
  };

  // Sync theme selection to document element
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        clients,
        setClients,
        offers,
        historyList,
        setHistoryList,
        lang,
        setLang,
        theme,
        setTheme,
        selectedClientId,
        setSelectedClientId,
        selectedHistoryItem,
        setSelectedHistoryItem,
        t,
        translateStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
