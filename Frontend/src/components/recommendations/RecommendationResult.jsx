import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { useAppContext } from '../../context/AppContext';
import RecommendationNavbar from './RecommendationNavbar';
import { useParams } from 'react-router-dom';

// Multi-language labels
const localLabels = {
  fr: {
    title: "Résultats des Recommandations IA",
    subtitle: "Ajustements de forfaits et optimisation budgétaire pour vos abonnés",
    trafficDetails: "DÉTAILS TRAFIC",
    contact: "CONTACTER",
    apply: "Appliquer",
    applied: "Appliquée ✓",
    currentPlan: "OFFRE ACTUELLE",
    recOffers: "RECOMMANDATIONS D'OFFRES",
    consumption: "CONSOMMATION MOYENNE",
    dataUsage: "Utilisation Data",
    voiceUsage: "Utilisation Voix",
    revenue: "Revenu",
    month: "mois",
    close: "Fermer",
    callingClient: "Appeler le client",
    smsClient: "Envoyer un SMS",
    contactInfo: "Coordonnées de l'abonné",
    noRec: "Aucune recommandation disponible.",
    trafficHistory: "Historique du trafic (6 derniers mois)",
    monthLabel: "Mois",
    revenueLabel: "Revenu (ARPU)",
    dataLabel: "Data (GB)",
    voiceLabel: "Voix (Total)",
    backBtn: "Retour aux paramètres",
    offerDetails: "Détails de l'offre",
    offerPrice: "Prix",
    offerScore: "Score de correspondance",
    offerData: "Data",
    offerOnnet: "Crédit Onnet",
    offerOffnet: "Crédit Offnet",
    offerInter: "Crédit International",
    offerUnlimitedOnnet: "Voix Onnet illimitée",
    offerUnlimitedOffnet: "Voix Offnet illimitée",
    yes: "Oui",
    no: "Non",
    tenure: "Ancienneté",
    months: "mois",
    days: "jours",
    activity: "Activité",
    exportExcel: "Exporter Excel",
    exportSuccess: "Export réussi",
    noDataExport: "Aucune donnée à exporter.",
    retryBtn: "Réessayer",
    errorTitle: "Erreur de chargement",
    emptyState: "Aucune recommandation trouvée pour cette session.",
  },
  en: {
    title: "AI Recommendation Results",
    subtitle: "Package adjustments and budget optimization for your subscribers",
    trafficDetails: "TRAFFIC DETAILS",
    contact: "CONTACT",
    apply: "Apply",
    applied: "Applied ✓",
    currentPlan: "CURRENT PLAN",
    recOffers: "OFFER RECOMMENDATIONS",
    consumption: "Average Consumption",
    dataUsage: "Data Usage",
    voiceUsage: "Voice Usage",
    revenue: "Revenue",
    month: "month",
    close: "Close",
    callingClient: "Call client",
    smsClient: "Send SMS",
    contactInfo: "Subscriber Contact Info",
    noRec: "No recommendations available.",
    trafficHistory: "Traffic History (Last 6 Months)",
    monthLabel: "Month",
    revenueLabel: "Revenue (ARPU)",
    dataLabel: "Data (GB)",
    voiceLabel: "Voice (Total)",
    backBtn: "Back to setup",
    offerDetails: "Offer Details",
    offerPrice: "Price",
    offerScore: "Match Score",
    offerData: "Data",
    offerOnnet: "Onnet Credit",
    offerOffnet: "Offnet Credit",
    offerInter: "International Credit",
    offerUnlimitedOnnet: "Unlimited Onnet Voice",
    offerUnlimitedOffnet: "Unlimited Offnet Voice",
    yes: "Yes",
    no: "No",
    tenure: "Tenure",
    months: "months",
    days: "days",
    activity: "Activity",
    exportExcel: "Export Excel",
    exportSuccess: "Export successful",
    noDataExport: "No data to export.",
    retryBtn: "Retry",
    errorTitle: "Loading Error",
    emptyState: "No recommendations found for this session.",
  }
};

/**
 * Transforms a single API item (from clientsRecommendations array)
 * into the shape expected by the render logic.
 */
function mapApiItemToDisplay(item) {
  const c = item.client;

  const avgTrafVoice = parseFloat(
    (
      (c.avgTrafOutVoiceOnnet || 0) +
      (c.avgTrafOutVoiceOffnet || 0) +
      (c.avgTrafOutVoiceInter || 0) +
      (c.avgTrafVoiceRoaming || 0)
    ).toFixed(2)
  );

  const dataLimit = c.potentialMaxRev || (c.avgRealRev ? c.avgRealRev * 1.5 : 1) || 1;

  const mappedClient = {
    clientReference: c.clientReference,
    clientName: c.clientName || '—',
    valueSegment: c.valueSegment || 'N/A',
    clientPastOfferName: c.clientPastOfferName || '—',
    clientPastOfferPrice: c.clientPastOfferPrice ?? 0,
    contact: c.contact || '—',
    flagActivity: c.flagActivity === 1 ? 'Active' : c.flagActivity === 0 ? 'Inactive' : '—',
    passivity: c.passivity ?? c.passivityO ?? 0,
    tenure: c.tenure || 0,
    avgRealRev: c.avgRealRev ?? 0,
    potentialMaxRev: c.potentialMaxRev ?? 0,
    avgVolumeDataMo: c.avgVolumeDataMo ?? 0,
    avgTrafVoice,
    dataLimit,
    revM1: c.revM1 ?? 0, revM2: c.revM2 ?? 0, revM3: c.revM3 ?? 0,
    revM4: c.revM4 ?? 0, revM5: c.revM5 ?? 0, revM6: c.revM6 ?? 0,
    volumeDataMoM1: c.volumeDataMoM1 ?? 0, volumeDataMoM2: c.volumeDataMoM2 ?? 0, volumeDataMoM3: c.volumeDataMoM3 ?? 0,
    volumeDataMoM4: c.volumeDataMoM4 ?? 0, volumeDataMoM5: c.volumeDataMoM5 ?? 0, volumeDataMoM6: c.volumeDataMoM6 ?? 0,
    sumTrafOutM1: c.sumTrafOutM1 ?? 0, sumTrafOutM2: c.sumTrafOutM2 ?? 0, sumTrafOutM3: c.sumTrafOutM3 ?? 0,
    sumTrafOutM4: c.sumTrafOutM4 ?? 0, sumTrafOutM5: c.sumTrafOutM5 ?? 0, sumTrafOutM6: c.sumTrafOutM6 ?? 0,
  };

  const mappedOffers = (item.recommendedOffers || []).map((offer) => ({
    offerName: offer.offerName || '—',
    price: offer.price ?? 0,
    score: offer.score ?? 0,
    type: (offer.score ?? 0) >= 0.5 ? 'star' : 'leaf',
    offerReference: offer.offerReference,
    dataGeneral: offer.dataGeneral ?? 0,
    creditOnnet: offer.creditOnnet ?? 0,
    creditOffnet: offer.creditOffnet ?? 0,
    creditInternational: offer.creditInternational ?? 0,
    onnetVoiceUnlimited: !!offer.onnetVoiceUnlimited,
    offnetVoiceUnlimited: !!offer.offnetVoiceUnlimited,
  }));

  return { client: mappedClient, recommendedOffers: mappedOffers };
}

// ─────────────────────────────────────────────────────────────────────────────
// Excel Export
// ─────────────────────────────────────────────────────────────────────────────
function buildExcelRows(listToRender) {
  if (!listToRender || listToRender.length === 0) return [];

  // Determine max number of recommended offers across all rows
  const maxOffers = Math.max(...listToRender.map((item) => item.recommendedOffers.length));

  // Build header row
  const offerHeaders = [];
  for (let i = 1; i <= maxOffers; i++) {
    offerHeaders.push(`top${i}_offerReference`, `top${i}_offerName`);
  }

  const headers = [
    'clientReference',
    'clientName',
    'contact',
    'flagActivity',
    'valueSegment',
    'passivity',
    'avgRealRev',
    'potentialMaxRev',
    'tenure',
    ...offerHeaders,
  ];

  // Build data rows
  const rows = listToRender.map((item) => {
    const c = item.client;
    const row = {
      clientReference: c.clientReference,
      clientName: c.clientName,
      contact: c.contact,
      flagActivity: c.flagActivity,
      valueSegment: c.valueSegment,
      passivity: c.passivity,
      avgRealRev: c.avgRealRev,
      potentialMaxRev: c.potentialMaxRev,
      tenure: c.tenure,
    };

    for (let i = 0; i < maxOffers; i++) {
      const offer = item.recommendedOffers[i];
      row[`top${i + 1}_offerReference`] = offer ? offer.offerReference : '';
      row[`top${i + 1}_offerName`] = offer ? offer.offerName : '';
    }

    return row;
  });

  return { headers, rows };
}

function exportToExcel(listToRender, filename = 'recommendations') {
  if (!listToRender || listToRender.length === 0) return false;

  const { headers, rows } = buildExcelRows(listToRender);

  // Build worksheet data: header row first, then data rows
  const wsData = [
    headers,
    ...rows.map((r) => headers.map((h) => r[h] ?? '')),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws['!cols'] = headers.map((h) => ({
    wch: Math.max(h.length + 2, 16),
  }));

  // Style header row (bold) — basic xlsx supports cell metadata
  headers.forEach((_, colIdx) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (!ws[cellAddress]) return;
    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'E30613' } }, // Djezzy red
      alignment: { horizontal: 'center' },
    };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Recommandations');

  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function RecommendationResult({ generatedRec, handleApplyRecommendation, onModify }) {
  const { lang } = useAppContext();
  const tLocal = (key) => localLabels[lang]?.[key] || key;

  const [expandedTraffic, setExpandedTraffic] = useState({});
  const [contactedClient, setContactedClient] = useState(null);
  const [appliedOffers, setAppliedOffers] = useState({});
  const [selectedOffer, setSelectedOffer] = useState(null);
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportFlash, setExportFlash] = useState(false);

  // ── Build the list to render ──────────────────────────────────────────────
  let listToRender = [];

  if (
    recommendationData &&
    Array.isArray(recommendationData.clientsRecommendations) &&
    recommendationData.clientsRecommendations.length > 0
  ) {
    listToRender = recommendationData.clientsRecommendations.map(mapApiItemToDisplay);
  } else if (!loading && !error && generatedRec) {
    // Fallback to wizard single-client mode
    listToRender = [
      {
        client: {
          clientReference: generatedRec.clientReference || 'WIZ-001',
          clientName: generatedRec.clientName || '—',
          valueSegment: 'PREMIUM',
          clientPastOfferName: generatedRec.currentPlan || '—',
          clientPastOfferPrice: generatedRec.currentSpend ?? 0,
          contact: generatedRec.clientPhone || '—',
          flagActivity: 'Active',
          passivity: 0,
          tenure: 0,
          avgRealRev: generatedRec.currentSpend ?? 0,
          potentialMaxRev: (generatedRec.currentSpend ?? 0) * 1.5,
          avgVolumeDataMo: 38.2,
          avgTrafVoice: 150,
          dataLimit: 40.0,
          revM1: generatedRec.currentSpend ?? 0, revM2: generatedRec.currentSpend ?? 0, revM3: generatedRec.currentSpend ?? 0,
          revM4: generatedRec.currentSpend ?? 0, revM5: generatedRec.currentSpend ?? 0, revM6: generatedRec.currentSpend ?? 0,
          volumeDataMoM1: 35.4, volumeDataMoM2: 38.2, volumeDataMoM3: 31.7,
          volumeDataMoM4: 39.4, volumeDataMoM5: 36.8, volumeDataMoM6: 35.4,
          sumTrafOutM1: 5.0, sumTrafOutM2: 4.0, sumTrafOutM3: 4.5,
          sumTrafOutM4: 4.7, sumTrafOutM5: 4.2, sumTrafOutM6: 4.3,
        },
        recommendedOffers: [
          {
            offerName: generatedRec.recommendedPlan || '—',
            price: generatedRec.recommendedPrice ?? 0,
            score: (generatedRec.matchingScore ?? 0) / 100,
            type: 'star',
            offerReference: 99,
            dataGeneral: 0, creditOnnet: 0, creditOffnet: 0, creditInternational: 0,
            onnetVoiceUnlimited: false, offnetVoiceUnlimited: false,
          },
          {
            offerName: 'Offre Eco Flexible', price: 19.99, score: 0.85, type: 'leaf',
            offerReference: 2, dataGeneral: 10, creditOnnet: 80, creditOffnet: 30,
            creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false,
          },
          {
            offerName: 'Offre Liberté Mini', price: 12.99, score: 0.75, type: 'leaf',
            offerReference: 3, dataGeneral: 5, creditOnnet: 40, creditOffnet: 20,
            creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false,
          },
        ],
      },
    ];
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggleTraffic = (clientId) => {
    setExpandedTraffic((prev) => ({ ...prev, [clientId]: !prev[clientId] }));
  };

  const handleApplyOffer = (clientId, offer) => {
    const key = `${clientId}_${offer.offerReference}`;
    setAppliedOffers((prev) => ({ ...prev, [key]: true }));
    if (handleApplyRecommendation) handleApplyRecommendation('Appliquée');
  };

  const handleExportExcel = () => {
    if (!listToRender || listToRender.length === 0) {
      alert(tLocal('noDataExport'));
      return;
    }
    const ok = exportToExcel(listToRender, `djezzy_recommendations_${id || 'wizard'}`);
    if (ok) {
      setExportFlash(true);
      setTimeout(() => setExportFlash(false), 2000);
    }
  };

  // ── API fetch ─────────────────────────────────────────────────────────────
  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/recommendations/${id}`);

      if (!response.ok) {
        switch (response.status) {
          case 404:
            throw new Error('Recommandation introuvable (404).');
          case 500:
            throw new Error('Erreur serveur (500) : impossible de récupérer les recommandations.');
          case 503:
            throw new Error('Service indisponible (503). Veuillez réessayer plus tard.');
          default:
            throw new Error(`Erreur HTTP ${response.status}.`);
        }
      }

      const result = await response.json();

      // Guard: API returned success but no data
      if (!result || (!result.clientsRecommendations && !Array.isArray(result.clientsRecommendations))) {
        setRecommendationData(null);
      } else {
        setRecommendationData(result);
      }
    } catch (err) {
      if (err.name === 'TypeError') {
        setError(
          'Impossible de contacter le serveur. Vérifiez votre connexion ou que l\'API est démarrée.'
        );
      } else {
        setError(err.message);
      }
      setRecommendationData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecommendation();
    } else {
      // No id = wizard mode, skip API call
      setLoading(false);
    }
  }, [id]);

  // ── Safe helpers ──────────────────────────────────────────────────────────
  const safeFixed = (val, decimals = 2) =>
    typeof val === 'number' && !isNaN(val) ? val.toFixed(decimals) : '0.' + '0'.repeat(decimals);

  const safeDiv = (a, b) => (b && b !== 0 ? a / b : 0);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Sub-Navigation ── */}
      <RecommendationNavbar />

      {/* Main Results Title Header */}
      <div
        className="wizard-title-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="wizard-icon"></span>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{tLocal('title')}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{tLocal('subtitle')}</p>
          </div>
        </div>

        {/* Right: Export + Modify buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* ── Export Excel Button ── */}
          <button
            onClick={handleExportExcel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '700',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: exportFlash
                ? 'linear-gradient(135deg, #16a34a, #15803d)'
                : 'linear-gradient(135deg, #E30613, #b80010)',
              color: '#fff',
              boxShadow: exportFlash
                ? '0 4px 14px rgba(22,163,74,0.45)'
                : '0 4px 14px rgba(227,6,19,0.40)',
              transition: 'background 0.3s, box-shadow 0.3s, transform 0.15s',
              transform: 'scale(1)',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={(e) => {
              if (!exportFlash) e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            disabled={loading || listToRender.length === 0}
          >
            {/* Excel icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            {exportFlash ? `✓ ${tLocal('exportSuccess')}` : tLocal('exportExcel')}
          </button>

          {/* Back button */}
          {onModify && (
            <button
              className="btn-secondary"
              style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}
              onClick={onModify}
            >
              ← {tLocal('backBtn')}
            </button>
          )}
        </div>
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 40px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid var(--border-color, #e5e7eb)',
              borderTop: '3px solid #E30613',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          Chargement des recommandations…
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

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
            {tLocal('errorTitle')}
          </div>
          <div style={{ fontWeight: '500', marginBottom: '16px', color: '#ef4444' }}>{error}</div>
          <button
            onClick={fetchRecommendation}
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
             {tLocal('retryBtn')}
          </button>
        </div>
      )}

      {/* ── Empty state (API OK but 0 results, no generatedRec) ── */}
      {!loading && !error && listToRender.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 40px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
          <div style={{ fontWeight: '600' }}>{tLocal('emptyState')}</div>
        </div>
      )}

      {/* ── Results list ── */}
      {!loading && listToRender.length > 0 && (
        <div className="rec-container-wrapper">
          {listToRender.map((item) => {
            const c = item.client;
            const initials = (c.clientName || '??')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();
            const isExpanded = !!expandedTraffic[c.clientReference];
            const hasManyOffers = item.recommendedOffers.length > 2;

            const consumptionPercent = Math.min(
              100,
              Math.round(safeDiv(c.avgRealRev, c.dataLimit) * 100)
            );

            const isActive = (c.flagActivity || '').toLowerCase() === 'active';

            return (
              <div key={c.clientReference} className="rec-card">
                <div className="rec-grid">
                  {/* ── Column 1 : Client Identity ── */}
                  <div className="rec-col rec-col-border">
                    <div className="avatar-initials-wrapper">
                      <div className="avatar-initials">{initials}</div>
                      <div>
                        <div className="profile-name-text">{c.clientName}</div>
                        <div className="profile-ref-text">Réf: #{c.clientReference}</div>
                      </div>
                    </div>

                    {/* Segment + Activity tags */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span className="segment-badge-green">SEGMENT {c.valueSegment}</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          backgroundColor: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: isActive ? '#16a34a' : '#dc2626',
                          border: `1px solid ${isActive ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isActive ? '#16a34a' : '#dc2626',
                            display: 'inline-block',
                          }}
                        />
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    {c.tenure > 0 && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                          paddingTop: '6px',
                        }}
                      >
                        {tLocal('tenure')} :{' '}
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {c.tenure < 30
                            ? `${c.tenure} ${tLocal('days')}`
                            : `${Math.floor(c.tenure / 30)} ${tLocal('months')}`}
                        </strong>
                      </div>
                    )}

                    <div className="current-plan-section">
                      <span className="current-plan-label">{tLocal('currentPlan')}</span>
                      <div className="current-plan-row">
                        <span className="current-plan-name">{c.clientPastOfferName}</span>
                        <span className="current-plan-price">
                          {safeFixed(c.clientPastOfferPrice)} DZD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Column 2 : Recommended Offers ── */}
                  <div className="rec-col rec-col-border">
                    <span className="rec-column-label">
                      {tLocal('recOffers')}{' '}
                      {hasManyOffers ? `(Top ${item.recommendedOffers.length})` : ''}
                    </span>
                    <div className="offers-scroll-list">
                      {item.recommendedOffers.map((offer, index) => {
                        const offerKey = `${c.clientReference}_${offer.offerReference}`;
                        const isApplied = !!appliedOffers[offerKey];
                        return (
                          <div
                            key={`${offer.offerReference}_${index}`}
                            className="offer-subcard"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedOffer({ offer, client: c })}
                          >
                            <div className="offer-details-left">
                              <div className="offer-icon-box">{index + 1}</div>
                              <div>
                                <div className="offer-name-bold">{offer.offerName}</div>
                              </div>
                            </div>
                            <div className="offer-price-right">
                              <span className="offer-price-bold">
                                {safeFixed(offer.price)} DZD
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Column 3 : Consumption ── */}
                  <div className="rec-col">
                    <span className="rec-column-label">{tLocal('consumption')}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                      <div className="consumption-row-pair">
                        <span className="consumption-label">{tLocal('dataUsage')}</span>
                        <span className="consumption-value-green">
                          {safeFixed(c.avgVolumeDataMo / 1024)} GB
                        </span>
                      </div>
                      <div className="consumption-row-pair">
                        <span className="consumption-label">{tLocal('voiceUsage')}</span>
                        <span className="consumption-value-green">{c.avgTrafVoice} min</span>
                      </div>
                      <div className="consumption-row-pair">
                        <span className="consumption-label">{tLocal('revenue')}</span>
                        <span className="consumption-value-green">
                          {safeFixed(c.avgRealRev)} DZD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Footer ── */}
                <div className="card-footer">
                  <div className="footer-action-links">
                    <button
                      className="footer-action-link-btn"
                      onClick={() => toggleTraffic(c.clientReference)}
                    >
                      {tLocal('trafficDetails')} {isExpanded ? '▲' : '▼'}
                    </button>
                    <button
                      className="footer-action-link-btn"
                      onClick={() => setContactedClient(c)}
                    >
                      {tLocal('contact')}
                    </button>
                  </div>
                </div>

                {/* ── Traffic History Panel ── */}
                {isExpanded && (
                  <div className="traffic-detail-panel">
                    <h4 className="traffic-panel-title">{tLocal('trafficHistory')}</h4>
                    <div className="traffic-grid-months">
                      {[
                        { name: 'M1', rev: c.revM1, data: c.volumeDataMoM1, traf: c.sumTrafOutM1 },
                        { name: 'M2', rev: c.revM2, data: c.volumeDataMoM2, traf: c.sumTrafOutM2 },
                        { name: 'M3', rev: c.revM3, data: c.volumeDataMoM3, traf: c.sumTrafOutM3 },
                        { name: 'M4', rev: c.revM4, data: c.volumeDataMoM4, traf: c.sumTrafOutM4 },
                        { name: 'M5', rev: c.revM5, data: c.volumeDataMoM5, traf: c.sumTrafOutM5 },
                        { name: 'M6', rev: c.revM6, data: c.volumeDataMoM6, traf: c.sumTrafOutM6 },
                      ].map((m) => (
                        <div key={m.name} className="month-stat-box">
                          <span className="month-stat-name">{m.name}</span>
                          <div>
                            <div className="month-stat-val">{safeFixed(m.rev, 1)}</div>
                            <div className="month-stat-label-sub">DZD</div>
                          </div>
                          <div>
                            <div className="month-stat-val">{safeFixed(m.data, 1)}</div>
                            <div className="month-stat-label-sub">GB</div>
                          </div>
                          <div>
                            <div className="month-stat-val">{safeFixed(m.traf, 1)}</div>
                            <div className="month-stat-label-sub">min</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Offer Detail Dialog ── */}
      {selectedOffer && (
        <div className="contact-dialog-overlay" onClick={() => setSelectedOffer(null)}>
          <div
            className="contact-dialog-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px', width: '90%' }}
          >
            <h3 className="contact-dialog-title">{tLocal('offerDetails')}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {selectedOffer.client.clientName}
            </p>

            <div
              style={{
                fontSize: '16px',
                fontWeight: '800',
                marginBottom: '16px',
                color: 'var(--text-primary)',
              }}
            >
              {selectedOffer.offer.offerName}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                { label: tLocal('offerPrice'), value: `${safeFixed(selectedOffer.offer.price)} DZD` },
                { label: tLocal('offerData'), value: `${selectedOffer.offer.dataGeneral} GB` },
                { label: tLocal('offerOnnet'), value: `${selectedOffer.offer.creditOnnet} DZD` },
                { label: tLocal('offerOffnet'), value: `${selectedOffer.offer.creditOffnet} DZD` },
                ...(selectedOffer.offer.creditInternational > 0
                  ? [{ label: tLocal('offerInter'), value: `${selectedOffer.offer.creditInternational} DZD` }]
                  : []),
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    borderBottom: '1px solid var(--border-color, #e5e7eb)',
                    paddingBottom: '8px',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: '700' }}>{value}</span>
                </div>
              ))}

              {/* Score row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px',
                  borderBottom: '1px solid var(--border-color, #e5e7eb)',
                  paddingBottom: '8px',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{tLocal('offerScore')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '6px',
                      borderRadius: '99px',
                      backgroundColor: 'var(--border-color, #e5e7eb)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${selectedOffer.offer.score * 100}%`,
                        height: '100%',
                        borderRadius: '99px',
                        backgroundColor: '#16a34a',
                      }}
                    />
                  </div>
                  <span style={{ fontWeight: '700' }}>
                    {Math.round(selectedOffer.offer.score * 100)}%
                  </span>
                </div>
              </div>

              {/* Unlimited flags */}
              {[
                { label: tLocal('offerUnlimitedOnnet'), val: selectedOffer.offer.onnetVoiceUnlimited },
                { label: tLocal('offerUnlimitedOffnet'), val: selectedOffer.offer.offnetVoiceUnlimited },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    borderBottom: '1px solid var(--border-color, #e5e7eb)',
                    paddingBottom: '8px',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: '700', color: val ? '#16a34a' : 'var(--text-secondary)' }}>
                    {val ? `✓ ${tLocal('yes')}` : `✗ ${tLocal('no')}`}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="btn-secondary"
              style={{ width: '100%', padding: '10px' }}
              onClick={() => setSelectedOffer(null)}
            >
              {tLocal('close')}
            </button>
          </div>
        </div>
      )}

      {/* ── Contact Dialog ── */}
      {contactedClient && (
        <div className="contact-dialog-overlay" onClick={() => setContactedClient(null)}>
          <div className="contact-dialog-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="contact-dialog-title">{tLocal('contactInfo')}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {contactedClient.clientName}
            </p>
            <div className="contact-phone-number">{contactedClient.contact}</div>
            <button
              className="btn-secondary"
              style={{ width: '100%', marginTop: '12px', padding: '8px' }}
              onClick={() => setContactedClient(null)}
            >
              {tLocal('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}