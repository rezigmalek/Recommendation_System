import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function RecommendationWizard() {
  const {
    clients,
    setClients,
    offers,
    historyList,
    setHistoryList,
    lang,
    t
  } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const preselectedClientId = location.state?.clientId;

  // Wizard Sub-steps State
  const [wizardStep, setWizardStep] = useState('setup'); // 'setup', 'loading', 'result'
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [generatedRec, setGeneratedRec] = useState(null);

  // Wizard Parameters State
  const [recClientId, setRecClientId] = useState(preselectedClientId || clients[0]?.id || 'c1');
  const [recDataUsage, setRecDataUsage] = useState(78);
  const [recVoiceMinutes, setRecVoiceMinutes] = useState(1450);
  const [recBudgetLimit, setRecBudgetLimit] = useState(3000);

  // Initialize values when client changes or page pre-selection updates
  useEffect(() => {
    const activeId = preselectedClientId || recClientId;
    setRecClientId(activeId);
    const client = clients.find(c => c.id === activeId);
    if (client) {
      setRecDataUsage(client.dataUsageGB);
      setRecVoiceMinutes(client.voiceMinutes);
      setRecBudgetLimit(client.budgetLimit);
    }
  }, [preselectedClientId, clients]);

  const handleClientChange = (clientId) => {
    setRecClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setRecDataUsage(client.dataUsageGB);
      setRecVoiceMinutes(client.voiceMinutes);
      setRecBudgetLimit(client.budgetLimit);
    }
  };

  const handleGenerateRecommendation = (e) => {
    e.preventDefault();
    setWizardStep('loading');
    setLoadingProgress(0);
  };

  // Simulation loading progress animation effect
  useEffect(() => {
    if (wizardStep !== 'loading') return;

    const steps = t('aiLoadingSteps');
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + 5;

        // Map progress index to translated loader text
        if (next < 20) {
          setLoadingText(steps[0]);
        } else if (next < 40) {
          setLoadingText(steps[1]);
        } else if (next < 60) {
          setLoadingText(steps[2]);
        } else if (next < 80) {
          setLoadingText(steps[3]);
        } else {
          setLoadingText(steps[4]);
        }

        if (next >= 100) {
          clearInterval(interval);
          generateAIResult();
        }
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [wizardStep, lang]);

  const generateAIResult = () => {
    const clientObj = clients.find(c => c.id === recClientId) || clients[0];

    // Core AI Matching Rule logic
    let recommendedOffer = offers[2]; // Default to Smart 1000
    let matchScore = 85;

    // Check Data and Voice weights to select plan
    if (recDataUsage > 50) {
      if (recVoiceMinutes > 1000) {
        recommendedOffer = offers.find(o => o.id === 'o1') || offers[0]; // Legend 2000
        matchScore = recDataUsage > 90 ? 98 : 94;
      } else {
        recommendedOffer = offers.find(o => o.id === 'o6') || offers[5]; // Speed 2000 (80GB data only)
        matchScore = 91;
      }
    } else if (recDataUsage > 20) {
      if (recVoiceMinutes > 200) {
        recommendedOffer = offers.find(o => o.id === 'o2') || offers[1]; // Smart 1500
        matchScore = 95;
      } else {
        recommendedOffer = offers.find(o => o.id === 'o5') || offers[4]; // Speed 1000
        matchScore = 89;
      }
    } else if (recVoiceMinutes > 400) {
      recommendedOffer = offers.find(o => o.id === 'o3') || offers[2]; // Smart 1000
      matchScore = 92;
    } else {
      recommendedOffer = offers.find(o => o.id === 'o4') || offers[3]; // Hadra 500
      matchScore = 87;
    }

    // Adjust score if price exceeds manager's target budget limit
    if (recommendedOffer.price > recBudgetLimit) {
      matchScore = Math.max(60, matchScore - 20);
    }

    // Dynamic AI justification text
    let justification = '';
    const currentCost = clientObj.currentSpend;
    const recommendedCost = recommendedOffer.price;
    const savings = currentCost - recommendedCost;

    if (lang === 'fr') {
      if (savings > 0) {
        justification = `Le client dépense actuellement ${currentCost.toLocaleString()} DZD/mois. En passant à l'offre ${recommendedOffer.name} (${recommendedCost.toLocaleString()} DZD/mois), il réalisera une économie directe de ${savings.toLocaleString()} DZD par mois tout en disposant de ressources adaptées : ${recommendedOffer.data} d'internet et appels ${recommendedOffer.voice}.`;
      } else {
        justification = `L'offre actuelle de l'abonné (${clientObj.currentPlan}) ne correspond pas à sa consommation réelle de ${recDataUsage} Go de data. L'offre ${recommendedOffer.name} lui apporte une tranquillité d'utilisation avec son enveloppe internet (${recommendedOffer.data}) et ses appels (${recommendedOffer.voice}) pour un budget maîtrisé de ${recommendedOffer.price.toLocaleString()} DZD/mois.`;
      }
    } else {
      // English version
      const engVoice = recommendedOffer.voice.replace('Illimité vers Djezzy', 'Unlimited to Djezzy').replace('Sans appels inclus', 'No calls included');
      if (savings > 0) {
        justification = `The client currently spends ${currentCost.toLocaleString()} DZD/month. By switching to the ${recommendedOffer.name} plan (${recommendedCost.toLocaleString()} DZD/month), they will achieve a direct saving of ${savings.toLocaleString()} DZD per month while securing appropriate resources: ${recommendedOffer.data} data allowance and ${engVoice} calls.`;
      } else {
        justification = `The subscriber's current plan (${clientObj.currentPlan}) does not match their real consumption of ${recDataUsage} GB of data. The ${recommendedOffer.name} plan provides peace of mind with its data allowance (${recommendedOffer.data}) and calls (${engVoice}) for a controlled budget of ${recommendedOffer.price.toLocaleString()} DZD/month.`;
      }
    }

    setGeneratedRec({
      clientId: clientObj.id,
      clientName: clientObj.name,
      clientPhone: clientObj.phone,
      currentPlan: clientObj.currentPlan,
      currentSpend: currentCost,
      recommendedPlan: recommendedOffer.name,
      recommendedPrice: recommendedOffer.price,
      matchingScore: matchScore,
      justification: justification
    });
    setWizardStep('result');
  };

  const handleApplyRecommendation = (statusText = 'Appliquée') => {
    if (!generatedRec) return;

    // Add recommendation to history
    const dateStr = new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5);
    const newLog = {
      id: 'h_' + Date.now(),
      clientName: generatedRec.clientName,
      clientPhone: generatedRec.clientPhone,
      date: dateStr,
      currentPlan: generatedRec.currentPlan,
      recommendedPlan: generatedRec.recommendedPlan,
      currentSpend: generatedRec.currentSpend,
      recommendedPrice: generatedRec.recommendedPrice,
      matchingScore: generatedRec.matchingScore,
      justification: generatedRec.justification,
      status: statusText === 'Appliquée' ? 'Appliquée' : 'Envoyée par SMS'
    };

    setHistoryList([newLog, ...historyList]);

    // Update Client's active plan in state
    setClients(prev => prev.map(c => {
      if (c.id === generatedRec.clientId) {
        return {
          ...c,
          currentPlan: generatedRec.recommendedPlan,
          currentSpend: generatedRec.recommendedPrice,
          churnRisk: 'Faible'
        };
      }
      return c;
    }));

    // Reset wizard
    setWizardStep('setup');
    // Open History path
    navigate('/history');
  };

  return (
    <div className="glass-panel wizard-card">
      {/* STEP 1: CONFIGURE SYSTEM */}
      {wizardStep === 'setup' && (
        <div>
          <div className="wizard-title-row">
            <span className="wizard-icon">🔮</span>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{t('wizardTitle')}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('wizardSubtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleGenerateRecommendation}>
            <div className="form-group">
              <label className="form-label">{t('labelSelectClient')}</label>
              <select
                className="form-select-search"
                value={recClientId}
                onChange={(e) => handleClientChange(e.target.value)}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {t('currentPlanLabel')}: {c.currentPlan}
                  </option>
                ))}
              </select>
            </div>

            <div className="wizard-inputs-grid">
              <div className="form-group">
                <div className="slider-container">
                  <div className="slider-header">
                    <label className="form-label" style={{ margin: 0 }}>{t('labelDataUsage')}</label>
                    <span className="slider-val-highlight">{recDataUsage} {lang === 'fr' ? 'Go' : 'GB'}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    className="custom-range-slider"
                    value={recDataUsage}
                    onChange={(e) => setRecDataUsage(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="slider-container">
                  <div className="slider-header">
                    <label className="form-label" style={{ margin: 0 }}>{t('labelVoiceUsage')}</label>
                    <span className="slider-val-highlight">{recVoiceMinutes} Min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4000"
                    step="50"
                    className="custom-range-slider"
                    value={recVoiceMinutes}
                    onChange={(e) => setRecVoiceMinutes(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="slider-container">
                <div className="slider-header">
                  <label className="form-label" style={{ margin: 0 }}>{t('labelBudgetLimit')}</label>
                  <span className="slider-val-highlight">{recBudgetLimit} DZD</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  className="custom-range-slider"
                  value={recBudgetLimit}
                  onChange={(e) => setRecBudgetLimit(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <button type="submit" className="btn-primary" style={{ fontSize: '15px' }}>
                {t('btnLaunchPredictive')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: AI SCAN RUNNING */}
      {wizardStep === 'loading' && (
        <div className="ai-loader-container">
          <div className="ai-scan-sphere">
            <div className="scanner-beam"></div>
            <div className="ai-inner-core"></div>
          </div>
          <h3 className="loader-status-text">{t('aiAnalyzing')} {loadingProgress}%</h3>
          <p className="loader-sub-text">{loadingText}</p>

          <div style={{ width: '80%', maxWidth: '300px', height: '4px', background: 'var(--bg-600)', borderRadius: '2px', overflow: 'hidden', marginTop: '20px' }}>
            <div style={{ width: `${loadingProgress}%`, height: '100%', backgroundColor: 'var(--brand-red)' }}></div>
          </div>
        </div>
      )}

      {/* STEP 3: RECOMMENDATION RESULT DISPLAY */}
      {wizardStep === 'result' && generatedRec && (
        <div>
          <div className="wizard-title-row">
            <span className="wizard-icon">✅</span>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{t('resultTitle')}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {t('clientLabel')} <strong>{generatedRec.clientName}</strong> ({generatedRec.clientPhone})
              </p>
            </div>
          </div>

          <div className="result-card-container">
            {/* Left Recommendation Stats */}
            <div className="result-main-panel">
              <div className="match-header-row">
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{t('sectionPropositions')}</span>
                <div className="score-radial">
                  <div className="radial-dot-pulse"></div>
                  <span>{t('matchScore')} {generatedRec.matchingScore}%</span>
                </div>
              </div>

              <div className="recommended-plan-showcase">
                <span className="offer-type" style={{ fontSize: '10px' }}>{t('optimalOffer')}</span>
                <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>
                  {generatedRec.recommendedPlan}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  {t('priceMonthly')} <strong>{generatedRec.recommendedPrice} DZD</strong>
                </p>
              </div>

              <div className="justification-section">
                <span className="justification-title">{t('justificationTitle')}</span>
                <p className="justification-text">{generatedRec.justification}</p>
              </div>
            </div>

            {/* Right Price Savings Panel */}
            <div className="comparison-chart-card">
              <div>
                <span className="comparison-chart-title">{t('budgetOptimTitle')}</span>
                <div className="chart-visual">
                  <div className="chart-bar-container">
                    <div className="chart-bar-label">
                      <span>{t('currentCostEst')}</span>
                      <span>{generatedRec.currentSpend} DZD</span>
                    </div>
                    <div className="chart-bar-bg">
                      <div className="chart-bar-fill current" style={{ width: '100%' }}>
                        {generatedRec.currentPlan.split(' ').slice(-1)[0]}
                      </div>
                    </div>
                  </div>

                  <div className="chart-bar-container">
                    <div className="chart-bar-label">
                      <span>{t('newOfferRec')}</span>
                      <span>{generatedRec.recommendedPrice} DZD</span>
                    </div>
                    <div className="chart-bar-bg">
                      <div
                        className="chart-bar-fill recommended"
                        style={{ width: `${(generatedRec.recommendedPrice / generatedRec.currentSpend) * 100}%` }}
                      >
                        {generatedRec.recommendedPlan.split(' ').slice(-1)[0]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {generatedRec.currentSpend - generatedRec.recommendedPrice > 0 ? (
                <div className="savings-highlight-box">
                  <span className="savings-label">{t('savingsEst')}</span>
                  <span className="savings-value">
                    -{generatedRec.currentSpend - generatedRec.recommendedPrice} DZD / {lang === 'fr' ? 'mois' : 'month'}
                  </span>
                </div>
              ) : (
                <div className="savings-highlight-box" style={{ borderColor: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.08)' }}>
                  <span className="savings-label" style={{ color: 'var(--text-primary)' }}>{t('valueAdd')}</span>
                  <span className="savings-value" style={{ color: '#A855F7' }}>
                    {t('valueAddSub')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="result-actions-row">
            <button
              className="btn-primary"
              onClick={() => handleApplyRecommendation('Appliquée')}
            >
              {t('btnApplyOffer')}
            </button>
            <button
              className="btn-secondary"
              onClick={() => handleApplyRecommendation('Envoyée par SMS')}
            >
              {t('btnSmsOffer')}
            </button>
            <button
              className="btn-secondary"
              style={{ flexGrow: 0, width: 'auto', padding: '14px 20px' }}
              onClick={() => setWizardStep('setup')}
            >
              {t('btnModify')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
