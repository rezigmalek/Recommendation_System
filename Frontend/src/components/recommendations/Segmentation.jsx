import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import RecommendationNavbar from './RecommendationNavbar';
import { useParams } from 'react-router-dom';

// ─── Multi-language labels ────────────────────────────────────────────────────
const localLabels = {
  fr: {
    title: "Segmentation des Offres",
    subtitle: "Critères de segmentation extraits des abonnés recommandés par offre",
    segCriteria: "Critères de Segmentation",
    dataMin: "Data Min.",
    voixMin: "Voix Min.",
    revenueMin: "Revenu Min.",
    valeurClient: "VALEUR CLIENT",
    activite: "ACTIVITÉ",
    clientsLabel: "Clients recommandés",   // ← nouveau
    noData: "Aucune segmentation disponible.",
    loyal: "Loyal",
    inactive: "Inactif",
    viewDetails: "Voir détails",
    low: "Low",
    medium: "Medium",
    high: "High Value",
    premium: "Premium",
  },
  en: {
    title: "Offer Segmentation",
    subtitle: "Segmentation criteria extracted from subscribers recommended per offer",
    segCriteria: "Segmentation Criteria",
    dataMin: "Data Min.",
    voixMin: "Voice Min.",
    revenueMin: "Revenue Min.",
    valeurClient: "CLIENT VALUE",
    activite: "ACTIVITY",
    clientsLabel: "Recommended clients",   // ← nouveau
    noData: "No segmentation data available.",
    loyal: "Loyal",
    inactive: "Inactive",
    viewDetails: "View details",
    low: "Low",
    medium: "Medium",
    high: "High Value",
    premium: "Premium",
  }
};

// ─── Default mock data ───────────────────────────────────────────────────────
const defaultSegmentations = [
  {
    id: 1,
    id_recommandation: 29,
    id_offre: "FIB-100M",
    offer_name: "Offre Fibre 100M",
    total_recommended_clients: 8,
    minimum_avg_traf_data: 45,
    minimum_avg_traf_voice: 12,
    minimum_avg_revenue: 35,
    value_client: "High",
    activity: "Loyal",
    activity_pct: 85,
  },
  {
    id: 2,
    id_recommandation: 29,
    id_offre: "MOB-UNL",
    offer_name: "Mobile Unlimited Gold",
    total_recommended_clients: 14,
    minimum_avg_traf_data: 100,
    minimum_avg_traf_voice: 30,
    minimum_avg_revenue: 55,
    value_client: "Premium",
    activity: "Loyal",
    activity_pct: 92,
  },
  {
    id: 3,
    id_recommandation: 29,
    id_offre: "FIB-300M",
    offer_name: "Offre Fibre 300M",
    total_recommended_clients: 5,
    minimum_avg_traf_data: 150,
    minimum_avg_traf_voice: 20,
    minimum_avg_revenue: 45,
    value_client: "Medium",
    activity: "Inactive",
    activity_pct: 25,
  },
  {
    id: 4,
    id_recommandation: 29,
    id_offre: "PRO-5G",
    offer_name: "Forfait Pro 5G Max",
    total_recommended_clients: 21,
    minimum_avg_traf_data: 80,
    minimum_avg_traf_voice: 25,
    minimum_avg_revenue: 70,
    value_client: "Premium",
    activity: "Loyal",
    activity_pct: 97,
  },
  {
    id: 5,
    id_recommandation: 29,
    id_offre: "ECO-FLEX",
    offer_name: "Offre Eco Flexible",
    total_recommended_clients: 3,
    minimum_avg_traf_data: 10,
    minimum_avg_traf_voice: 5,
    minimum_avg_revenue: 12,
    value_client: "Low",
    activity: "Inactive",
    activity_pct: 40,
  },
  {
    id: 6,
    id_recommandation: 29,
    id_offre: "LIB-MINI",
    offer_name: "Offre Liberté Mini",
    total_recommended_clients: 7,
    minimum_avg_traf_data: 20,
    minimum_avg_traf_voice: 8,
    minimum_avg_revenue: 18,
    value_client: "Medium",
    activity: "Loyal",
    activity_pct: 60,
  },
];

// ─── Value badge config ──────────────────────────────────────────────────────
const valueConfig = {
  Low:     { bg: 'rgba(107,114,128,0.18)', color: '#9ca3af',         border: 'rgba(107,114,128,0.25)' },
  Medium:  { bg: 'rgba(107,114,128,0.18)', color: 'var(--text-secondary)', border: 'rgba(107,114,128,0.25)' },
  MV:      { bg: 'rgba(107,114,128,0.18)', color: 'var(--text-secondary)', border: 'rgba(107,114,128,0.25)' },
  High:    { bg: 'rgba(16,185,129,0.15)',  color: 'var(--success)',  border: 'rgba(16,185,129,0.25)' },
  Premium: { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa',         border: 'rgba(59,130,246,0.25)' },
};

const activityConfig = {
  Loyal:    { dot: 'var(--success)',  dotGlow: 'rgba(16,185,129,0.5)' },
  Active:   { dot: 'var(--success)',  dotGlow: 'rgba(16,185,129,0.5)' },  // ← ajout
  Inactive: { dot: '#f59e0b',         dotGlow: 'rgba(245,158,11,0.4)' },
  Inactif:  { dot: '#f59e0b',         dotGlow: 'rgba(245,158,11,0.4)' },
};

// ─── Single Offer Card ───────────────────────────────────────────────────────
function SegCard({ item, t }) {
  const [hovered, setHovered] = useState(false);
  const valCfg = valueConfig[item.value_client] || valueConfig.Medium;
  const actCfg = activityConfig[item.activity] || activityConfig.Loyal;
  const actLabel = (item.activity === 'Loyal' || item.activity === 'Active')
    ? t('loyal') : t('inactive');
  const valLabel = item.value_client === 'High'
    ? t('high') : item.value_client === 'Premium'
    ? t('premium') : item.value_client === 'Low'
    ? t('low') : t('medium');

  return (
    <div
      className={`seg-card${hovered ? ' seg-card-hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Card Header ── */}
      <div className="seg-card-header">
        <div className="seg-card-header-top">
          <span className="seg-offer-tag">#{item.id_offre}</span>
          {/* ← totalRecommendedClients remplace batch */}
          <span className="seg-batch-label">
            {item.total_recommended_clients} {t('clientsLabel')}
          </span>
        </div>
        <h3 className="seg-offer-name">{item.offer_name}</h3>
      </div>

      {/* ── Divider ── */}
      <div className="seg-divider" />

      {/* ── Segmentation Criteria ── */}
      <div className="seg-criteria-section">
        <span className="seg-criteria-title">{t('segCriteria')}</span>
        <div className="seg-metrics-grid">

          <div className="seg-metric-box">
            <span className="seg-metric-label">{t('dataMin')}</span>
            <span className="seg-metric-value blue">{item.minimum_avg_traf_data}</span>
            <span className="seg-metric-unit">GB</span>
          </div>

          <div className="seg-metric-box">
            <span className="seg-metric-label">{t('voixMin')}</span>
            <span className="seg-metric-value purple">{item.minimum_avg_traf_voice}h</span>
            <span className="seg-metric-unit">&nbsp;</span>
          </div>

          <div className="seg-metric-box">
            <span className="seg-metric-label">{t('revenueMin')}</span>
            <span className="seg-metric-value red">{item.minimum_avg_revenue}</span>
            <span className="seg-metric-unit">DZD</span>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="seg-divider" />

      {/* ── Footer ── */}
      <div className="seg-card-footer">
        <div className="seg-footer-left">
          <div className="seg-footer-col">
            <span className="seg-footer-label">{t('valeurClient')}</span>
            <span
              className="seg-value-badge"
              style={{
                background: valCfg.bg,
                color: valCfg.color,
                border: `1px solid ${valCfg.border}`,
              }}
            >
              {valLabel}
            </span>
          </div>
          <div className="seg-footer-col">
            <span className="seg-footer-label">{t('activite')}</span>
            <div className="seg-activity-row">
              <span
                className="seg-activity-dot"
                style={{
                  background: actCfg.dot,
                  boxShadow: `0 0 6px ${actCfg.dotGlow}`,
                }}
              />
              <span className="seg-activity-text">
                {actLabel}
                {item.activity_pct != null ? ` (${Math.round(item.activity_pct)}%)` : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="seg-arrow-btn">›</div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Segmentation({ segmentationData }) {
  const { lang } = useAppContext();
  const t = (key) => localLabels[lang]?.[key] || key;
  const { id } = useParams();

  // ── State ─────────────────────────────────────────────────────────────────
  const [apiData, setApiData] = useState(null);

  const fetchSegmentation = async () => {
    try {
      const response = await fetch(`/api/segmentation/recommendation/${id}`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        // ── Mapper les champs API → champs utilisés dans les cards ──
        const mapped = result.data.map((raw) => ({
          id:                        raw.id,
          id_offre:                  raw.offerReference,
          offer_name:                raw.offerName,
          total_recommended_clients: raw.totalRecommendedClients,
          minimum_avg_traf_data:     raw.minimumAvgTrafData,
          minimum_avg_traf_voice:    raw.minimumAvgTrafVoice,
          minimum_avg_revenue:       raw.minimumAvgRevenue,
          value_client:              raw.valueClient,
          activity:                  raw.activity,
          activity_pct:              raw.activityPercentage,
        }));
        setApiData(mapped);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de la segmentation:", err);
    }
  };

  useEffect(() => {
    fetchSegmentation();
  }, []);

  // ── Résolution finale : API > props > mock ────────────────────────────────
  const list = apiData || (segmentationData?.length ? segmentationData : defaultSegmentations);

  return (
    <div>
      {/* ── Sub-Navigation ── */}
      <RecommendationNavbar />

      {/* ── Page Title ── */}
      <div className="wizard-title-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <span className="wizard-icon"></span>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{t('title')}</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('subtitle')}</p>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      {list.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
          {t('noData')}
        </p>
      ) : (
        <div className="seg-grid">
          {list.map((item) => (
            <SegCard key={item.id} item={item} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}