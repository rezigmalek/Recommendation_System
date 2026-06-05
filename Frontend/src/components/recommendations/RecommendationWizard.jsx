import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Recommendation from './Recommendation';
import RecommendationLoading from './RecommendationLoading';
import RecommendationResult from './RecommendationResult';

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
      setRecDataUsage(client.dataUsageGB || client.avg_volume_data_mo || 0);
      setRecVoiceMinutes(client.voiceMinutes || Math.round((client.avg_traf_total || 0) * 60));
      setRecBudgetLimit(client.budgetLimit || client.potential_max_rev || 0);
    }
  }, [preselectedClientId, clients]);

  const handleClientChange = (clientId) => {
    setRecClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setRecDataUsage(client.dataUsageGB || client.avg_volume_data_mo || 0);
      setRecVoiceMinutes(client.voiceMinutes || Math.round((client.avg_traf_total || 0) * 60));
      setRecBudgetLimit(client.budgetLimit || client.potential_max_rev || 0);
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
    const currentCost = clientObj.currentSpend || clientObj.avg_real_rev || 0;
    const recommendedCost = recommendedOffer.price;
    const savings = currentCost - recommendedCost;
    const currentPlanName = clientObj.currentPlan || clientObj.clientPastOfferName || 'Inconnu';

    if (lang === 'fr') {
      if (savings > 0) {
        justification = `Le client dépense actuellement ${currentCost.toLocaleString()} DZD/mois. En passant à l'offre ${recommendedOffer.name} (${recommendedCost.toLocaleString()} DZD/mois), il réalisera une économie directe de ${savings.toLocaleString()} DZD par mois tout en disposant de ressources adaptées : ${recommendedOffer.data} d'internet et appels ${recommendedOffer.voice}.`;
      } else {
        justification = `L'offre actuelle de l'abonné (${currentPlanName}) ne correspond pas à sa consommation réelle de ${recDataUsage} Go de data. L'offre ${recommendedOffer.name} lui apporte une tranquillité d'utilisation avec son enveloppe internet (${recommendedOffer.data}) et ses appels (${recommendedOffer.voice}) pour un budget maîtrisé de ${recommendedOffer.price.toLocaleString()} DZD/mois.`;
      }
    } else {
      // English version
      const engVoice = recommendedOffer.voice.replace('Illimité vers Djezzy', 'Unlimited to Djezzy').replace('Sans appels inclus', 'No calls included');
      if (savings > 0) {
        justification = `The client currently spends ${currentCost.toLocaleString()} DZD/month. By switching to the ${recommendedOffer.name} plan (${recommendedCost.toLocaleString()} DZD/month), they will achieve a direct saving of ${savings.toLocaleString()} DZD per month while securing appropriate resources: ${recommendedOffer.data} data allowance and ${engVoice} calls.`;
      } else {
        justification = `The subscriber's current plan (${currentPlanName}) does not match their real consumption of ${recDataUsage} GB of data. The ${recommendedOffer.name} plan provides peace of mind with its data allowance (${recommendedOffer.data}) and calls (${engVoice}) for a controlled budget of ${recommendedOffer.price.toLocaleString()} DZD/month.`;
      }
    }

    setGeneratedRec({
      clientId: clientObj.id,
      clientName: clientObj.name || clientObj.full_name || 'Client',
      clientPhone: clientObj.phone || clientObj.contact || '',
      currentPlan: currentPlanName,
      currentSpend: currentCost,
      recommendedPlan: recommendedOffer.name,
      recommendedPrice: recommendedOffer.price,
      matchingScore: matchScore,
      justification: justification
    });
    setWizardStep('result');
  };

  const handleApplyRecommendation = async (statusText = 'Appliquée') => {
    if (!generatedRec) return;

    // Add recommendation to history
    const dateStr = new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5);
    const newLog = {
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

    try {
      // Try to save to backend API history if available
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setHistoryList([result.data, ...historyList]);
        } else {
          setHistoryList([{ id: 'h_' + Date.now(), ...newLog }, ...historyList]);
        }
      } else {
        setHistoryList([{ id: 'h_' + Date.now(), ...newLog }, ...historyList]);
      }
    } catch (e) {
      setHistoryList([{ id: 'h_' + Date.now(), ...newLog }, ...historyList]);
    }

    // Update Client's active plan in state
    setClients(prev => prev.map(c => {
      if (c.id === generatedRec.clientId) {
        return {
          ...c,
          currentPlan: generatedRec.recommendedPlan,
          clientPastOfferName: generatedRec.recommendedPlan,
          currentSpend: generatedRec.recommendedPrice,
          avg_real_rev: generatedRec.recommendedPrice,
          churnRisk: 'Faible',
          flag_activity: 'Active'
        };
      }
      return c;
    }));

    // Reset wizard & open history
    setWizardStep('setup');
    navigate('/history');
  };

  return (
    <div className="glass-panel wizard-card">
      {wizardStep === 'setup' && (
        <Recommendation
          recClientId={recClientId}
          recDataUsage={recDataUsage}
          recVoiceMinutes={recVoiceMinutes}
          recBudgetLimit={recBudgetLimit}
          setRecDataUsage={setRecDataUsage}
          setRecVoiceMinutes={setRecVoiceMinutes}
          setRecBudgetLimit={setRecBudgetLimit}
          handleClientChange={handleClientChange}
          onSubmit={handleGenerateRecommendation}
        />
      )}

      {wizardStep === 'loading' && (
        <RecommendationLoading
          loadingProgress={loadingProgress}
          loadingText={loadingText}
        />
      )}

      {wizardStep === 'result' && (
        <RecommendationResult
          generatedRec={generatedRec}
          handleApplyRecommendation={handleApplyRecommendation}
          onModify={() => setWizardStep('setup')}
        />
      )}
    </div>
  );
}
