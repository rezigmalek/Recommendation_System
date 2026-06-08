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
    clientsLabel: "Clients recommandés",
    noData: "Aucune segmentation disponible.",
    loyal: "Loyal",
    inactive: "Inactif",
    viewDetails: "Voir détails",
    low: "Low Value",
    medium: "Medium",
    high: "High Value",
    premium: "Premium",
    new: "New",
    errorTitle: "Erreur de chargement",
    retryBtn: "Réessayer",
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
    clientsLabel: "Recommended clients",
    noData: "No segmentation data available.",
    loyal: "Loyal",
    inactive: "Inactive",
    viewDetails: "View details",
    low: "Low Value",
    medium: "Medium",
    high: "High Value",
    premium: "Premium",
    new: "New",
    errorTitle: "Loading Error",
    retryBtn: "Retry",
  }
};

// ─── Value badge config ──────────────────────────────────────────────────────
const valueConfig = {
  Low:     { bg: 'rgba(107,114,128,0.18)', color: '#9ca3af', border: 'rgba(107,114,128,0.25)' },
  Medium:  { bg: 'rgba(107,114,128,0.18)', color: 'var(--text-secondary)', border: 'rgba(107,114,128,0.25)' },
  MV:      { bg: 'rgba(107,114,128,0.18)', color: 'var(--text-secondary)', border: 'rgba(107,114,128,0.25)' },
  High:    { bg: 'rgba(16,185,129,0.15)', color: 'var(--success)', border: 'rgba(16,185,129,0.25)' },
  Premium: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
};

const activityConfig = {
  Loyal:    { dot: 'var(--success)', dotGlow: 'rgba(16,185,129,0.5)' },
  Active:   { dot: 'var(--success)', dotGlow: 'rgba(16,185,129,0.5)' },
  Inactive: { dot: '#f59e0b', dotGlow: 'rgba(245,158,11,0.4)' },
  Inactif:  { dot: '#f59e0b', dotGlow: 'rgba(245,158,11,0.4)' },
};

// ─── Single Offer Card ───────────────────────────────────────────────────────
function SegCard({ item, t }) {
  const [hovered, setHovered] = useState(false);

  const valCfg = valueConfig[item.value_client] || valueConfig.Medium;
  const actCfg = activityConfig[item.activity] || activityConfig.Loyal;

  const actLabel =
    (item.activity === 'Loyal' || item.activity === 'Active')
      ? t('loyal')
      : t('inactive');

  const valLabel =
    item.value_client === 'HV' || item.value_client === 'VHV'
      ? t('high')
      : item.value_client === 'MV'
      ? t('medium')
      : item.value_client === 'LV' || item.value_client === 'VLV'
      ? t('low')
      : t('new');

  return (
    <div
      className={`seg-card${hovered ? ' seg-card-hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="seg-card-header">
        <div className="seg-card-header-top">
          <span className="seg-offer-tag">#{item.id_offre}</span>
          <span className="seg-batch-label">
            {item.total_recommended_clients} {t('clientsLabel')}
          </span>
        </div>
        <h3 className="seg-offer-name">{item.offer_name}</h3>
      </div>

      <div className="seg-divider" />

      <div className="seg-criteria-section">
        <span className="seg-criteria-title">{t('segCriteria')}</span>

        <div className="seg-metrics-grid">
          <div className="seg-metric-box">
            <span className="seg-metric-label">{t('dataMin')}</span>
            <span className="seg-metric-value blue">
              {(item.minimum_avg_traf_data / 1024).toFixed(2)}
            </span>
            <span className="seg-metric-unit">GB</span>
          </div>

          <div className="seg-metric-box">
            <span className="seg-metric-label">{t('voixMin')}</span>
            <span className="seg-metric-value purple">
              {item.minimum_avg_traf_voice}
            </span>
            <span className="seg-metric-unit">MIN</span>
          </div>

          <div className="seg-metric-box">
            <span className="seg-metric-label">{t('revenueMin')}</span>
            <span className="seg-metric-value red">
              {item.minimum_avg_revenue}
            </span>
            <span className="seg-metric-unit">DZD</span>
          </div>
        </div>
      </div>

      <div className="seg-divider" />

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
                {item.activity_pct != null
                  ? ` (${Math.round(item.activity_pct)}%)`
                  : ''}
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

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSegmentation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/segmentation/recommendation/${id}`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Réponse serveur invalide");
      }

      const mapped = (result.data || []).map((raw) => ({
        id: raw.id,
        id_offre: raw.offerReference,
        offer_name: raw.offerName,
        total_recommended_clients: raw.totalRecommendedClients,
        minimum_avg_traf_data: raw.minimumAvgTrafData,
        minimum_avg_traf_voice: raw.minimumAvgTrafVoice,
        minimum_avg_revenue: raw.minimumAvgRevenue,
        value_client: raw.valueClient,
        activity: raw.activity,
        activity_pct: raw.activityPercentage,
      }));

      setApiData(mapped);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegmentation();
  }, []);

  const list = apiData.length
    ? apiData
    : (segmentationData?.length ? segmentationData : []);

  return (
    <div>
      <RecommendationNavbar />

      <div
        className="wizard-title-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        <span className="wizard-icon"></span>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
            {t('title')}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* ── Error state ── */}
      {!loading && error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#dc2626',
            padding: '20px 24px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚠️</div>

          <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>
            {t('errorTitle')}
          </div>

          <div style={{ fontWeight: '500', marginBottom: '16px', color: '#ef4444' }}>
            {error}
          </div>

          <button
            onClick={fetchSegmentation}
            style={{
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: '700',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: '#dc2626',
              color: '#fff',
            }}
          >
            {t('retryBtn')}
          </button>
        </div>
      )}

      {!loading && !error && list.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
          {t('noData')}
        </p>
      ) : (
        !error && (
          <div className="seg-grid">
            {list.map((item) => (
              <SegCard key={item.id} item={item} t={t} />
            ))}
          </div>
        )
      )}
    </div>
  );
}