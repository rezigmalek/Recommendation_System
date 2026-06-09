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
import Analytics from './components/recommendations/Analytics';
import Loading from './components/common/Loading';
import Segmentation from './components/recommendations/Segmentation';
import Login from './components/login/Login'
import ProtectedRoute from './components/login/ProtectedRoute';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/welcome" element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }/>

            <Route path="/clients" element={
              <ProtectedRoute>
                <ClientsView />
              </ProtectedRoute>
            }/>

            <Route path="/offres" element={
              <ProtectedRoute>
                <OffersView />
              </ProtectedRoute>
            } />

            <Route path="/recommendation" element={
              <ProtectedRoute>
                <Recommendation />
              </ProtectedRoute>
            } />

            <Route path="/recommendation-result/:id" element={
              <ProtectedRoute>
                <RecommendationResult />
              </ProtectedRoute>
            } />

            <Route path="/recommendation-analytics/:id" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />

            <Route path="/recommendation-segmentation/:id" element={
              <ProtectedRoute>
                <Segmentation />
              </ProtectedRoute>
            } />

            <Route path="/history" element={
              <ProtectedRoute>
                <HistoryView />
              </ProtectedRoute>
            } />

          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </AppProvider>
  );
}

export default App;
