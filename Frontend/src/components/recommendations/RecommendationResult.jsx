import React, { useEffect, useState } from 'react';
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
    consumption: "CONSOMMATION (30J)",
    dataUsage: "Data Usage",
    voiceUsage: "Voice Usage",
    revenue: "Revenue (ARPU)",
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
    activity: "Activité"
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
    consumption: "CONSUMPTION (30D)",
    dataUsage: "Data Usage",
    voiceUsage: "Voice Usage",
    revenue: "Revenue (ARPU)",
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
    activity: "Activity"
  }
};

const defaultRecommendations = [
  {
    client: {
      clientReference: "982231-A",
      clientName: "Ahmed Benaliiiiii",
      valueSegment: "PREMIUM",
      clientPastOfferName: "Forfait Liberté 40G",
      clientPastOfferPrice: 24.99,
      contact: "0750 40 20 60",
      flagActivity: "Active",
      tenure: 36,
      avgRealRev: 24.99,
      avgVolumeDataMo: 38.2,
      avgTrafVoice: 150,
      dataLimit: 40.0,
      revM1: 24.99, revM2: 24.99, revM3: 24.99, revM4: 24.99, revM5: 24.99, revM6: 24.99,
      volumeDataMoM1: 35.4, volumeDataMoM2: 38.2, volumeDataMoM3: 31.7, volumeDataMoM4: 39.4, volumeDataMoM5: 36.8, volumeDataMoM6: 35.4,
      sumTrafOutM1: 5.07, sumTrafOutM2: 4.14, sumTrafOutM3: 4.44, sumTrafOutM4: 4.74, sumTrafOutM5: 4.22, sumTrafOutM6: 4.35
    },
    recommendedOffers: [
      { offerName: "Offre Premium 100G", price: 34.99, engagement: "Engagement 12 mois", score: 0.95, type: "star", offerReference: 1, dataGeneral: 100, creditOnnet: 200, creditOffnet: 50, creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false },
      { offerName: "Offre Eco Flexible", price: 19.99, engagement: "Sans engagement", score: 0.85, type: "leaf", offerReference: 2, dataGeneral: 10, creditOnnet: 80, creditOffnet: 30, creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false },
      { offerName: "Offre Liberté Mini", price: 12.99, engagement: "Sans engagement", score: 0.75, type: "leaf", offerReference: 3, dataGeneral: 5, creditOnnet: 40, creditOffnet: 20, creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false },
      { offerName: "Offre Data Boost 60G", price: 29.99, engagement: "Engagement 6 mois", score: 0.70, type: "star", offerReference: 4, dataGeneral: 60, creditOnnet: 150, creditOffnet: 40, creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false },
      { offerName: "Offre Connect Max", price: 39.99, engagement: "Sans engagement", score: 0.65, type: "star", offerReference: 5, dataGeneral: 80, creditOnnet: 300, creditOffnet: 100, creditInternational: 20, onnetVoiceUnlimited: true, offnetVoiceUnlimited: false }
    ]
  },
  {
    client: {
      clientReference: "1002-B",
      clientName: "Malik Rezig",
      valueSegment: "VIP",
      clientPastOfferName: "Forfait Pro Max 80G",
      clientPastOfferPrice: 49.99,
      contact: "0771 99 88 77",
      flagActivity: "Active",
      tenure: 24,
      avgRealRev: 65.0,
      avgVolumeDataMo: 75.5,
      avgTrafVoice: 150,
      dataLimit: 80.0,
      revM1: 61.2, revM2: 65.4, revM3: 63.8, revM4: 67.9, revM5: 64.0, revM6: 66.5,
      volumeDataMoM1: 72.4, volumeDataMoM2: 75.5, volumeDataMoM3: 74.0, volumeDataMoM4: 78.1, volumeDataMoM5: 75.6, volumeDataMoM6: 73.2,
      sumTrafOutM1: 8.2, sumTrafOutM2: 7.9, sumTrafOutM3: 8.5, sumTrafOutM4: 9.1, sumTrafOutM5: 8.0, sumTrafOutM6: 8.7
    },
    recommendedOffers: [
      { offerName: "Offre Unlimited VIP", price: 59.99, engagement: "Engagement 24 mois", score: 0.99, type: "star", offerReference: 6, dataGeneral: 200, creditOnnet: 500, creditOffnet: 200, creditInternational: 50, onnetVoiceUnlimited: true, offnetVoiceUnlimited: true },
      { offerName: "Offre Pro Speed 100G", price: 44.99, engagement: "Engagement 12 mois", score: 0.91, type: "star", offerReference: 7, dataGeneral: 100, creditOnnet: 300, creditOffnet: 100, creditInternational: 0, onnetVoiceUnlimited: true, offnetVoiceUnlimited: false },
      { offerName: "Offre Eco Flexible", price: 19.99, engagement: "Sans engagement", score: 0.65, type: "leaf", offerReference: 8, dataGeneral: 10, creditOnnet: 80, creditOffnet: 30, creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false }
    ]
  }
];

/**
 * Transforms a single API item (from clientsRecommendations array)
 * into the shape expected by the render logic.
 */
function mapApiItemToDisplay(item) {
  const c = item.client;

  const avgTrafVoice = parseFloat(
    ((c.avgTrafOutVoiceOnnet || 0) +
      (c.avgTrafOutVoiceOffnet || 0) +
      (c.avgTrafOutVoiceInter || 0) +
      (c.avgTrafVoiceRoaming || 0)).toFixed(2)
  );

  const dataLimit = c.potentialMaxRev || c.avgRealRev * 1.5 || 1;

  const mappedClient = {
    clientReference: c.clientReference,
    clientName: c.clientName,
    valueSegment: c.valueSegment || "N/A",
    clientPastOfferName: c.clientPastOfferName,
    clientPastOfferPrice: c.clientPastOfferPrice,
    contact: c.contact,
    flagActivity: c.flagActivity,
    tenure: c.tenure || 0,
    avgRealRev: c.avgRealRev,
    avgVolumeDataMo: c.avgVolumeDataMo,
    avgTrafVoice: avgTrafVoice,
    dataLimit: dataLimit,
    revM1: c.revM1, revM2: c.revM2, revM3: c.revM3,
    revM4: c.revM4, revM5: c.revM5, revM6: c.revM6,
    volumeDataMoM1: c.volumeDataMoM1, volumeDataMoM2: c.volumeDataMoM2, volumeDataMoM3: c.volumeDataMoM3,
    volumeDataMoM4: c.volumeDataMoM4, volumeDataMoM5: c.volumeDataMoM5, volumeDataMoM6: c.volumeDataMoM6,
    sumTrafOutM1: c.sumTrafOutM1, sumTrafOutM2: c.sumTrafOutM2, sumTrafOutM3: c.sumTrafOutM3,
    sumTrafOutM4: c.sumTrafOutM4, sumTrafOutM5: c.sumTrafOutM5, sumTrafOutM6: c.sumTrafOutM6,
  };

  const mappedOffers = (item.recommendedOffers || []).map((offer) => ({
    offerName: offer.offerName,
    price: offer.price,
    score: offer.score,
    type: offer.score >= 0.5 ? "star" : "leaf",
    offerReference: offer.offerReference,
    dataGeneral: offer.dataGeneral || 0,
    creditOnnet: offer.creditOnnet || 0,
    creditOffnet: offer.creditOffnet || 0,
    creditInternational: offer.creditInternational || 0,
    onnetVoiceUnlimited: !!offer.onnetVoiceUnlimited,
    offnetVoiceUnlimited: !!offer.offnetVoiceUnlimited,
  }));

  return { client: mappedClient, recommendedOffers: mappedOffers };
}

export default function RecommendationResult({ generatedRec, handleApplyRecommendation, onModify }) {
  const { lang } = useAppContext();
  const tLocal = (key) => localLabels[lang]?.[key] || key;

  const [expandedTraffic, setExpandedTraffic] = useState({});
  const [contactedClient, setContactedClient] = useState(null);
  const [appliedOffers, setAppliedOffers] = useState({});
  const [selectedOffer, setSelectedOffer] = useState(null); // { offer, client }
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Build the list to render ──────────────────────────────────────────────
  let listToRender;

  if (recommendationData && Array.isArray(recommendationData.clientsRecommendations) && recommendationData.clientsRecommendations.length > 0) {
    listToRender = recommendationData.clientsRecommendations.map(mapApiItemToDisplay);
  } else if (generatedRec) {
    listToRender = [
      {
        client: {
          clientReference: generatedRec.clientReference || "WIZ-001",
          clientName: generatedRec.clientName,
          valueSegment: "PREMIUM",
          clientPastOfferName: generatedRec.currentPlan,
          clientPastOfferPrice: generatedRec.currentSpend,
          contact: generatedRec.clientPhone,
          flagActivity: "Active",
          tenure: 0,
          avgRealRev: generatedRec.currentSpend,
          avgVolumeDataMo: 38.2,
          avgTrafVoice: 150,
          dataLimit: 40.0,
          revM1: generatedRec.currentSpend, revM2: generatedRec.currentSpend, revM3: generatedRec.currentSpend,
          revM4: generatedRec.currentSpend, revM5: generatedRec.currentSpend, revM6: generatedRec.currentSpend,
          volumeDataMoM1: 35.4, volumeDataMoM2: 38.2, volumeDataMoM3: 31.7,
          volumeDataMoM4: 39.4, volumeDataMoM5: 36.8, volumeDataMoM6: 35.4,
          sumTrafOutM1: 5.0, sumTrafOutM2: 4.0, sumTrafOutM3: 4.5,
          sumTrafOutM4: 4.7, sumTrafOutM5: 4.2, sumTrafOutM6: 4.3
        },
        recommendedOffers: [
          { offerName: generatedRec.recommendedPlan, price: generatedRec.recommendedPrice, score: generatedRec.matchingScore / 100, type: "star", offerReference: 99, dataGeneral: 0, creditOnnet: 0, creditOffnet: 0, creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false },
          { offerName: "Offre Eco Flexible", price: 19.99, score: 0.85, type: "leaf", offerReference: 2, dataGeneral: 10, creditOnnet: 80, creditOffnet: 30, creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false },
          { offerName: "Offre Liberté Mini", price: 12.99, score: 0.75, type: "leaf", offerReference: 3, dataGeneral: 5, creditOnnet: 40, creditOffnet: 20, creditInternational: 0, onnetVoiceUnlimited: false, offnetVoiceUnlimited: false }
        ]
      },
      ...defaultRecommendations
    ];
  } else {
    listToRender = defaultRecommendations;
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggleTraffic = (clientId) => {
    setExpandedTraffic(prev => ({ ...prev, [clientId]: !prev[clientId] }));
  };

  const handleApplyOffer = (clientId, offer) => {
    const key = `${clientId}_${offer.offerReference}`;
    setAppliedOffers(prev => ({ ...prev, [key]: true }));
    if (handleApplyRecommendation) handleApplyRecommendation('Appliquée');
  };

  // ── API fetch ─────────────────────────────────────────────────────────────
  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recommendations/${id}`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const result = await response.json();
      if (result) {
        setRecommendationData(result);
        console.log("Données enregistrées", result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, [id]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Sub-Navigation ── */}
      <RecommendationNavbar />

      {/* Main Results Title Header */}
      <div className="wizard-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="wizard-icon"></span>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{tLocal('title')}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{tLocal('subtitle')}</p>
          </div>
        </div>
        {onModify && (
          <button className="btn-secondary" style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }} onClick={onModify}>
            ← {tLocal('backBtn')}
          </button>
        )}
      </div>

      {/* Loading / Error states */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Chargement des recommandations…
        </div>
      )}
      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '16px', color: '#e55', fontSize: '13px' }}>
          Erreur : {error}
        </div>
      )}

      {!loading && (
        <div className="rec-container-wrapper">
          {listToRender.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>{tLocal('noRec')}</p>
          )}

          {listToRender.map((item) => {
            const c = item.client;
            const initials = c.clientName.split(' ').map(n => n[0]).join('').substring(0, 2);
            const isExpanded = !!expandedTraffic[c.clientReference];
            const hasManyOffers = item.recommendedOffers.length > 2;

            // FIX: progress bar uses avgRealRev vs potentialMaxRev (dataLimit)
            const consumptionPercent = Math.min(
              100,
              Math.round((c.avgRealRev / c.dataLimit) * 100)
            );

            // FIX: top offer score — score is already 0–1, multiply by 100 for the bar width
            const topOfferScore = item.recommendedOffers[0]?.score ?? 0;

            // Activity tag
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
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', gap: '12px' }}>
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
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          backgroundColor: isActive ? '#16a34a' : '#dc2626',
                          display: 'inline-block'
                        }} />
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    {/* Tenure */}
                    {c.tenure > 0 && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', paddingTop: '6px' }}>
                        {tLocal('tenure')} : <strong style={{ color: 'var(--text-primary)' }}>{c.tenure} {tLocal('months')}</strong>
                      </div>
                    )}

                    <div className="current-plan-section">
                      <span className="current-plan-label">{tLocal('currentPlan')}</span>
                      <div className="current-plan-row">
                        <span className="current-plan-name">{c.clientPastOfferName}</span>
                        <span className="current-plan-price">{c.clientPastOfferPrice.toFixed(2)} DZD</span>
                      </div>
                    </div>
                  </div>

                  {/* ── Column 2 : Recommended Offers ── */}
                  <div className="rec-col rec-col-border">
                    <span className="rec-column-label">
                      {tLocal('recOffers')} {hasManyOffers ? `(Top ${item.recommendedOffers.length})` : ''}
                    </span>
                    <div className="offers-scroll-list">
                      {item.recommendedOffers.map((offer, index) => {
                        const offerKey = `${c.clientReference}_${offer.offerReference}`;
                        const isApplied = !!appliedOffers[offerKey];
                        return (
                          <div
                            key={offer.offerReference}
                            className="offer-subcard"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedOffer({ offer, client: c })}
                          >
                            <div className="offer-details-left">
                              <div className="offer-icon-box">{index + 1}</div>
                              <div>
                                {/* FIX: only show offer name, no description */}
                                <div className="offer-name-bold">{offer.offerName}</div>
                              </div>
                            </div>
                            <div className="offer-price-right">
                              <span className="offer-price-bold">{offer.price.toFixed(2)} DZD</span>
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
                        <span className="consumption-value-green">{c.avgVolumeDataMo} GB</span>
                      </div>
                      <div className="consumption-row-pair">
                        <span className="consumption-label">{tLocal('voiceUsage')}</span>
                        <span className="consumption-value-green">{c.avgTrafVoice} min</span>
                      </div>
                      <div className="consumption-row-pair">
                        <span className="consumption-label">{tLocal('revenue')}</span>
                        <span className="consumption-value">{c.avgRealRev.toFixed(2)} DZD</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Footer ── */}
                <div className="card-footer">
                  <div className="footer-action-links">
                    <button className="footer-action-link-btn" onClick={() => toggleTraffic(c.clientReference)}>
                      {tLocal('trafficDetails')} {isExpanded ? '▲' : '▼'}
                    </button>
                    <button className="footer-action-link-btn" onClick={() => setContactedClient(c)}>
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
                        { name: 'M6', rev: c.revM6, data: c.volumeDataMoM6, traf: c.sumTrafOutM6 }
                      ].map((m) => (
                        <div key={m.name} className="month-stat-box">
                          <span className="month-stat-name">{m.name}</span>
                          <div><div className="month-stat-val">{m.rev.toFixed(1)}</div><div className="month-stat-label-sub">DZD</div></div>
                          <div><div className="month-stat-val">{m.data.toFixed(1)}</div><div className="month-stat-label-sub">GB</div></div>
                          <div><div className="month-stat-val">{m.traf.toFixed(1)}</div><div className="month-stat-label-sub">min</div></div>
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
          <div className="contact-dialog-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', width: '90%' }}>
            <h3 className="contact-dialog-title">{tLocal('offerDetails')}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {selectedOffer.client.clientName}
            </p>

            {/* Offer name */}
            <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>
              {selectedOffer.offer.offerName}
            </div>

            {/* Details grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {/* Price */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid var(--border-color, #e5e7eb)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{tLocal('offerPrice')}</span>
                <span style={{ fontWeight: '700' }}>{selectedOffer.offer.price.toFixed(2)} DZD</span>
              </div>
              {/* Score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid var(--border-color, #e5e7eb)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{tLocal('offerScore')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '80px', height: '6px', borderRadius: '99px', backgroundColor: 'var(--border-color, #e5e7eb)', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedOffer.offer.score * 100}%`, height: '100%', borderRadius: '99px', backgroundColor: '#16a34a' }} />
                  </div>
                  <span style={{ fontWeight: '700' }}>{Math.round(selectedOffer.offer.score * 100)}%</span>
                </div>
              </div>
              {/* Data */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid var(--border-color, #e5e7eb)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{tLocal('offerData')}</span>
                <span style={{ fontWeight: '700' }}>{selectedOffer.offer.dataGeneral} GB</span>
              </div>
              {/* Credit Onnet */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid var(--border-color, #e5e7eb)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{tLocal('offerOnnet')}</span>
                <span style={{ fontWeight: '700' }}>{selectedOffer.offer.creditOnnet} DZD</span>
              </div>
              {/* Credit Offnet */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid var(--border-color, #e5e7eb)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{tLocal('offerOffnet')}</span>
                <span style={{ fontWeight: '700' }}>{selectedOffer.offer.creditOffnet} DZD</span>
              </div>
              {/* Credit International */}
              {selectedOffer.offer.creditInternational > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid var(--border-color, #e5e7eb)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{tLocal('offerInter')}</span>
                  <span style={{ fontWeight: '700' }}>{selectedOffer.offer.creditInternational} DZD</span>
                </div>
              )}
              {/* Unlimited Onnet */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid var(--border-color, #e5e7eb)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{tLocal('offerUnlimitedOnnet')}</span>
                <span style={{ fontWeight: '700', color: selectedOffer.offer.onnetVoiceUnlimited ? '#16a34a' : 'var(--text-secondary)' }}>
                  {selectedOffer.offer.onnetVoiceUnlimited ? `✓ ${tLocal('yes')}` : `✗ ${tLocal('no')}`}
                </span>
              </div>
              {/* Unlimited Offnet */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{tLocal('offerUnlimitedOffnet')}</span>
                <span style={{ fontWeight: '700', color: selectedOffer.offer.offnetVoiceUnlimited ? '#16a34a' : 'var(--text-secondary)' }}>
                  {selectedOffer.offer.offnetVoiceUnlimited ? `✓ ${tLocal('yes')}` : `✗ ${tLocal('no')}`}
                </span>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', padding: '10px' }} onClick={() => setSelectedOffer(null)}>
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
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{contactedClient.clientName}</p>
            <div className="contact-phone-number">{contactedClient.contact}</div>
            <button className="btn-secondary" style={{ width: '100%', marginTop: '12px', padding: '8px' }} onClick={() => setContactedClient(null)}>
              {tLocal('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}