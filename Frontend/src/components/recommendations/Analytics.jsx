import { useAppContext } from '../../context/AppContext';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecommendationNavbar from './RecommendationNavbar';

// ─── Multi-language labels ────────────────────────────────────────────────────
const localLabels = {
  fr: {
    title: "Analytics & Performance",
    subtitle: "Vue d'ensemble des recommandations et de la performance des abonnés",
    totalClients: "TOTAL CLIENTS",
    topOffer: "OFFRE TOP RECOMMANDÉE",
    conversionMoyenne: "CONVERSION MOYENNE",
    analyseTitle: "Analyse des Mouvements",
    batchLabel: "Évolution",
    clientProgression: "Progression des clients par type de mouvement",
    upsell: "UPSELL",
    stable: "STABLE",
    downsell: "DOWNSELL",
    upsellDesc: "Augmentation de la valeur contractuelle",
    stableDesc: "Maintien de l'offre actuelle sans changement",
    downsellDesc: "Migration vers une offre de gamme inférieure",
    usageTitle: "Usage Performance",
    avgData: "Avg. Data Consumption",
    mobileData: "MOBILE DATA",
    avgVoice: "Avg. Voice Consumption",
    voiceSms: "VOICE & SMS",
    arpu: "Average ARPU Shift",
    revenueImpact: "REVENUE IMPACT",
    targetMet: "TARGET MET",
    vsLastBatch: "vs last batch",
  },
  en: {
    title: "Analytics & Performance",
    subtitle: "Overview of recommendations and subscriber performance",
    totalClients: "TOTAL CLIENTS",
    topOffer: "TOP RECOMMENDED OFFER",
    conversionMoyenne: "AVERAGE CONVERSION",
    analyseTitle: "Movement Analysis",
    batchLabel: "Evolution",
    clientProgression: "Client progression by movement type",
    upsell: "UPSELL",
    stable: "STABLE",
    downsell: "DOWNSELL",
    upsellDesc: "Increase in contractual value",
    stableDesc: "Maintaining current offer without change",
    downsellDesc: "Migration to a lower tier offer",
    usageTitle: "Usage Performance",
    avgData: "Avg. Data Consumption",
    mobileData: "MOBILE DATA",
    avgVoice: "Avg. Voice Consumption",
    voiceSms: "VOICE & SMS",
    arpu: "Average ARPU Shift",
    revenueImpact: "REVENUE IMPACT",
    targetMet: "TARGET MET",
    vsLastBatch: "vs last batch",
  }
};

// ─── Default mock data ───────────────────────────────────────────────────────
const defaultAnalytics = {
  id: 15,
  id_recommandation: 29,
  total_clients: 12450,
  top_offer_recommended_id: 15,
  top_offer_recommended_name: "Forfait Illimité 5G Max",
  upsell_pourcentage: 65,
  downsell_pourcentage: 10,
  stable_pourcentage: 25,
  conversion_moyenne: 73.8,
  conversion_delta: 2.4,
  data_avg_gb: 85,
  data_delta: 12,
  voice_avg_min: 450,
  voice_stable: true,
  arpu_shift: 8.40,
  arpu_target_met: true,
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Analytics({ analyticsData, batchRef }) {
  const { lang } = useAppContext();
  const t = (key) => localLabels[lang]?.[key] || key;
  const { id } = useParams();

  // ── State ──────────────────────────────────────────────────────────────────
  const [apiData, setApiData] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/recommendation/${id}`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        const raw = result.data[0];
        // ── Mapper les champs API → champs utilisés dans le template ──
        setApiData({
          id:                        raw.id,
          id_recommandation:         raw.recommendationReference,
          total_clients:             raw.totalClients,
          top_offer_recommended_id:  raw.topOfferRecommendedReference,
          top_offer_recommended_name:raw.topOfferRecommendedName,
          upsell_pourcentage:        raw.upsellPercentage,
          downsell_pourcentage:      raw.downsellPercentage,
          stable_pourcentage:        raw.stablePercentage,
          conversion_moyenne:        raw.EstimatedConversionRate,
          conversion_delta:          parseFloat(raw.AverageRecommendationScore.toFixed(2)),
          data_avg_gb:               parseFloat(raw.averageData.toFixed(2)),
          data_delta:                0,
          voice_avg_min:             parseFloat(raw.averageVoice.toFixed(2)),
          voice_stable:              true,
          arpu_shift:                raw.averageArpu,
          arpu_target_met:           true,
        });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des données de recommandation:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ── Résolution finale : API > props > mock ─────────────────────────────────
  const data = apiData || analyticsData || defaultAnalytics;
  const batchNumber = batchRef || data.id_recommandation;

  return (
    <div>
      {/* ── Sub-Navigation ── */}
      <RecommendationNavbar />

      {/* ── Page Title ── */}
      <div className="wizard-title-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span className="wizard-icon"></span>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{t('title')}</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('subtitle')}</p>
        </div>
      </div>

      <div className="an-wrapper">

        {/* ── Row 1: KPIs ── */}
        <div className="an-kpi-row">

          {/* Total Clients */}
          <div className="an-kpi-card">
            <div className="an-kpi-top">
              <div className="an-kpi-icon blue">👥</div>
            </div>
            <div className="an-kpi-value">
              {data.total_clients.toLocaleString('fr-FR')}
            </div>
            <div className="an-kpi-label">{t('totalClients')}</div>
          </div>

          {/* Top Offer */}
          <div className="an-kpi-card">
            <div className="an-kpi-top">
              <div className="an-kpi-icon red">⭐</div>
            </div>
            <div className="an-kpi-value offer-name">
              {data.top_offer_recommended_name}
            </div>
            <div className="an-kpi-label">{t('topOffer')}</div>
          </div>

          {/* Conversion */}
          <div className="an-kpi-card">
            <div className="an-kpi-top">
              <div className="an-kpi-icon green">📈</div>
              <span className="an-badge green">+{data.conversion_delta}%</span>
            </div>
            <div className="an-kpi-value">
              {data.conversion_moyenne.toFixed(1)}%
            </div>
            <div className="an-kpi-label">{t('conversionMoyenne')}</div>
          </div>

        </div>

        {/* ── Row 2: Movement + Usage ── */}
        <div className="an-bottom-row">

          {/* Movement Analysis */}
          <div className="an-movement-card">
            <div>
              <div className="an-movement-head">
                <span className="an-movement-title">{t('analyseTitle')}</span>
                <span className="an-batch-badge">Batch #{batchNumber} {t('batchLabel')}</span>
              </div>
              <p className="an-movement-sub">{t('clientProgression')}</p>
            </div>

            {/* Segmented bar */}
            <div className="an-seg-bar">
              <div className="an-seg-up" style={{ width: `${data.upsell_pourcentage}%` }}>
                {t('upsell')}
              </div>
              <div className="an-seg-st" style={{ width: `${data.stable_pourcentage}%` }}>
                {t('stable')}
              </div>
              <div className="an-seg-dn" style={{ width: `${data.downsell_pourcentage}%` }}>
                {t('downsell')}
              </div>
            </div>

            {/* Pills */}
            <div className="an-pills-grid">
              <div className="an-pill up">
                <div className="an-pill-dot-row">
                  <span className="an-pill-dot green" />
                  <span className="an-pill-pct">{data.upsell_pourcentage.toFixed(2)}%</span>
                </div>
                <div className="an-pill-lbl">{t('upsell')}</div>
                <div className="an-pill-desc">{t('upsellDesc')}</div>
              </div>

              <div className="an-pill st">
                <div className="an-pill-dot-row">
                  <span className="an-pill-dot gray" />
                  <span className="an-pill-pct">{data.stable_pourcentage.toFixed(2)}%</span>
                </div>
                <div className="an-pill-lbl">{t('stable')}</div>
                <div className="an-pill-desc">{t('stableDesc')}</div>
              </div>

              <div className="an-pill dn">
                <div className="an-pill-dot-row">
                  <span className="an-pill-dot red" />
                  <span className="an-pill-pct">{data.downsell_pourcentage.toFixed(2)}%</span>
                </div>
                <div className="an-pill-lbl">{t('downsell')}</div>
                <div className="an-pill-desc">{t('downsellDesc')}</div>
              </div>
            </div>
          </div>

          {/* Usage Performance */}
          <div className="an-usage-card">
            <div className="an-usage-head">{t('usageTitle')}</div>

            <div className="an-usage-row">
              <div className="an-usage-icon data">🗄️</div>
              <div className="an-usage-info">
                <span className="an-usage-name">{t('avgData')}</span>
                <span className="an-usage-sub">{t('mobileData')}</span>
              </div>
              <div className="an-usage-right">
                <span className="an-usage-val data">{data.data_avg_gb} GB</span>
                <span className="an-delta pos">+{data.data_delta}% {t('vsLastBatch')}</span>
              </div>
            </div>

            <div className="an-usage-row">
              <div className="an-usage-icon voice">📞</div>
              <div className="an-usage-info">
                <span className="an-usage-name">{t('avgVoice')}</span>
                <span className="an-usage-sub">{t('voiceSms')}</span>
              </div>
              <div className="an-usage-right">
                <span className="an-usage-val voice">{data.voice_avg_min} min</span>
                <span className="an-delta neutral">Stable</span>
              </div>
            </div>

            <div className="an-usage-row">
              <div className="an-usage-icon arpu">💰</div>
              <div className="an-usage-info">
                <span className="an-usage-name">{t('arpu')}</span>
                <span className="an-usage-sub">{t('revenueImpact')}</span>
              </div>
              <div className="an-usage-right">
                <span className="an-usage-val arpu">+{data.arpu_shift.toFixed(2)} DZD</span>
                {data.arpu_target_met && (
                  <span className="an-delta target">{t('targetMet')}</span>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}