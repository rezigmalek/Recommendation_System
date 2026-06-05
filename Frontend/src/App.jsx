import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppProvider } from './context/AppContext';

import Layout from './components/common/Layout';
import Welcome from './components/welcome/Welcome';
import ClientsView from './components/clients/ClientsView';
import OffersView from './components/offers/OffersView';
import RecommendationWizard from './components/recommendations/RecommendationWizard';
import HistoryView from './components/history/HistoryView';
import Recommendation from './components/recommendations/Recommendation';
import RecommendationResult from './components/recommendations/RecommendationResult';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/clients" element={<ClientsView />} />
            <Route path="/offres" element={<OffersView />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/recommendation-result" element={<RecommendationResult />} />
            <Route path="/history" element={<HistoryView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
