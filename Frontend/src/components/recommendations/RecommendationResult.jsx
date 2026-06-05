import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

// Multi-language labels
const localLabels = {
  fr: {
    title: "Résultats des Recommandations IA",
    subtitle: "Ajustements de forfaits et optimisation budgétaire pour vos abonnés",
    trafficDetails: "👁️ DÉTAILS TRAFIC",
    contact: "✉️ CONTACTER",
    apply: "Appliquer",
    applied: "Appliquée ✓",
    currentPlan: "OFFRE ACTUELLE",
    recOffers: "RECOMMANDATIONS D'OFFRES",
    consumption: "CONSOMMATION (30J)",
    dataUsage: "Data Usage",
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
    backBtn: "Retour aux paramètres"
  },
  en: {
    title: "AI Recommendation Results",
    subtitle: "Package adjustments and budget optimization for your subscribers",
    trafficDetails: "👁️ TRAFFIC DETAILS",
    contact: "✉️ CONTACT",
    apply: "Apply",
    applied: "Applied ✓",
    currentPlan: "CURRENT PLAN",
    recOffers: "OFFER RECOMMENDATIONS",
    consumption: "CONSUMPTION (30D)",
    dataUsage: "Data Usage",
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
    backBtn: "Back to setup"
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
      avgRealRev: 24.99,
      avgVolumeDataMo: 38.2, // GB
      dataLimit: 40.0,
      // Past months metrics
      revM1: 24.99, revM2: 24.99, revM3: 24.99, revM4: 24.99, revM5: 24.99, revM6: 24.99,
      volumeDataMoM1: 35.4, volumeDataMoM2: 38.2, volumeDataMoM3: 31.7, volumeDataMoM4: 39.4, volumeDataMoM5: 36.8, volumeDataMoM6: 35.4,
      sumTrafOutM1: 5.07, sumTrafOutM2: 4.14, sumTrafOutM3: 4.44, sumTrafOutM4: 4.74, sumTrafOutM5: 4.22, sumTrafOutM6: 4.35
    },
    recommendedOffers: [
      {
        offerName: "Offre Premium 100G",
        price: 34.99,
        engagement: "Engagement 12 mois",
        score: 0.95,
        type: "star",
        offerReference: 1
      },
      {
        offerName: "Offre Eco Flexible",
        price: 19.99,
        engagement: "Sans engagement",
        score: 0.85,
        type: "leaf",
        offerReference: 2
      },
      {
        offerName: "Offre Liberté Mini",
        price: 12.99,
        engagement: "Sans engagement",
        score: 0.75,
        type: "leaf",
        offerReference: 3
      },
      {
        offerName: "Offre Data Boost 60G",
        price: 29.99,
        engagement: "Engagement 6 mois",
        score: 0.70,
        type: "star",
        offerReference: 4
      },
      {
        offerName: "Offre Connect Max",
        price: 39.99,
        engagement: "Sans engagement",
        score: 0.65,
        type: "star",
        offerReference: 5
      }
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
      avgRealRev: 65.0,
      avgVolumeDataMo: 75.5, // GB
      dataLimit: 80.0,
      revM1: 61.2, revM2: 65.4, revM3: 63.8, revM4: 67.9, revM5: 64.0, revM6: 66.5,
      volumeDataMoM1: 72.4, volumeDataMoM2: 75.5, volumeDataMoM3: 74.0, volumeDataMoM4: 78.1, volumeDataMoM5: 75.6, volumeDataMoM6: 73.2,
      sumTrafOutM1: 8.2, sumTrafOutM2: 7.9, sumTrafOutM3: 8.5, sumTrafOutM4: 9.1, sumTrafOutM5: 8.0, sumTrafOutM6: 8.7
    },
    recommendedOffers: [
      {
        offerName: "Offre Unlimited VIP",
        price: 59.99,
        engagement: "Engagement 24 mois",
        score: 0.99,
        type: "star",
        offerReference: 6
      },
      {
        offerName: "Offre Pro Speed 100G",
        price: 44.99,
        engagement: "Engagement 12 mois",
        score: 0.91,
        type: "star",
        offerReference: 7
      },
      {
        offerName: "Offre Eco Flexible",
        price: 19.99,
        engagement: "Sans engagement",
        score: 0.65,
        type: "leaf",
        offerReference: 8
      }
    ]
  }
];

export default function RecommendationResult({
  generatedRec,
  handleApplyRecommendation,
  onModify
}) {
  const { lang } = useAppContext();
  const tLocal = (key) => localLabels[lang]?.[key] || key;

  // Local state for UI interactions
  const [expandedTraffic, setExpandedTraffic] = useState({});
  const [contactedClient, setContactedClient] = useState(null);
  const [appliedOffers, setAppliedOffers] = useState({});

  // Dynamic listing logic
  const listToRender = generatedRec ? [
    {
      client: {
        clientReference: generatedRec.clientReference || "WIZ-001",
        clientName: generatedRec.clientName,
        valueSegment: "PREMIUM",
        clientPastOfferName: generatedRec.currentPlan,
        clientPastOfferPrice: generatedRec.currentSpend,
        contact: generatedRec.clientPhone,
        flagActivity: "Active",
        avgRealRev: generatedRec.currentSpend,
        avgVolumeDataMo: 38.2,
        dataLimit: 40.0,
        revM1: generatedRec.currentSpend, revM2: generatedRec.currentSpend, revM3: generatedRec.currentSpend, revM4: generatedRec.currentSpend, revM5: generatedRec.currentSpend, revM6: generatedRec.currentSpend,
        volumeDataMoM1: 35.4, volumeDataMoM2: 38.2, volumeDataMoM3: 31.7, volumeDataMoM4: 39.4, volumeDataMoM5: 36.8, volumeDataMoM6: 35.4,
        sumTrafOutM1: 5.0, sumTrafOutM2: 4.0, sumTrafOutM3: 4.5, sumTrafOutM4: 4.7, sumTrafOutM5: 4.2, sumTrafOutM6: 4.3
      },
      recommendedOffers: [
        {
          offerName: generatedRec.recommendedPlan,
          price: generatedRec.recommendedPrice,
          engagement: "Recommandation IA",
          score: generatedRec.matchingScore / 100,
          type: "star",
          offerReference: 99
        },
        {
          offerName: "Offre Eco Flexible",
          price: 19.99,
          engagement: "Sans engagement",
          score: 0.85,
          type: "leaf",
          offerReference: 2
        },
        {
          offerName: "Offre Liberté Mini",
          price: 12.99,
          engagement: "Sans engagement",
          score: 0.75,
          type: "leaf",
          offerReference: 3
        }
      ]
    },
    ...defaultRecommendations
  ] : defaultRecommendations;

  const toggleTraffic = (clientId) => {
    setExpandedTraffic(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  const handleApplyOffer = (clientId, offer) => {
    const key = `${clientId}_${offer.offerReference}`;
    setAppliedOffers(prev => ({ ...prev, [key]: true }));

    // Trigger parent application callback if present
    if (handleApplyRecommendation) {
      handleApplyRecommendation('Appliquée');
    }
  };

  return (
    <div>
      <style>{`
        .rec-container-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-top: 8px;
        }
        .rec-card {
          background: var(--bg-800);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
          transition: var(--transition);
          overflow: hidden;
        }
        .rec-card:hover {
          border-color: var(--border-hover);
        }
        .rec-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1.2fr;
          padding: 24px;
          gap: 24px;
          align-items: stretch;
        }
        @media (max-width: 992px) {
          .rec-grid {
            grid-template-columns: 1fr;
          }
        }
        .rec-col {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 16px;
        }
        .rec-col-border {
          border-right: 1px solid var(--border);
          padding-right: 24px;
        }
        @media (max-width: 992px) {
          .rec-col-border {
            border-right: none;
            border-bottom: 1px solid var(--border);
            padding-right: 0;
            padding-bottom: 24px;
          }
        }
        
        /* Left Column Profile Styles */
        .avatar-initials-wrapper {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .avatar-initials {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--brand-red) 0%, #85030B 100%);
          color: #fff;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(227, 6, 19, 0.15);
        }
        .profile-name-text {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .profile-ref-text {
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .segment-badge-green {
          display: inline-block;
          align-self: flex-start;
          background-color: rgba(16, 185, 129, 0.15);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .current-plan-section {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .current-plan-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .current-plan-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .current-plan-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--brand-red);
        }
        .current-plan-price {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        /* Middle Column Recommendations List Styles */
        .rec-column-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .offers-scroll-list {
          max-height: 180px;
          overflow-y: auto;
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        /* Scrollbar customization */
        .offers-scroll-list::-webkit-scrollbar {
          width: 4px;
        }
        .offers-scroll-list::-webkit-scrollbar-track {
          background: var(--bg-700);
          border-radius: 2px;
        }
        .offers-scroll-list::-webkit-scrollbar-thumb {
          background: var(--brand-red);
          border-radius: 2px;
        }
        .offer-subcard {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-700);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          transition: var(--transition);
        }
        .offer-subcard:hover {
          border-color: var(--brand-red);
          background: var(--bg-600);
        }
        .offer-details-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .offer-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .offer-icon-box.star {
          background: rgba(245, 158, 11, 0.15);
          color: var(--warning);
        }
        .offer-icon-box.leaf {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success);
        }
        .offer-name-bold {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .offer-desc-sub {
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 1px;
        }
        .offer-price-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .offer-price-bold {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .apply-link-btn {
          color: var(--brand-red);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          margin-top: 4px;
          transition: var(--transition);
        }
        .apply-link-btn:hover {
          color: var(--brand-red-hover);
          text-decoration: underline;
        }
        .applied-link-btn {
          color: var(--success);
          font-size: 11px;
          font-weight: 800;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        /* Right Column Consumption Metrics */
        .consumption-row-pair {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          margin-bottom: 2px;
        }
        .consumption-label {
          color: var(--text-secondary);
          font-weight: 600;
        }
        .consumption-value {
          font-weight: 700;
          color: var(--text-primary);
        }
        .consumption-value-green {
          font-weight: 800;
          color: var(--success);
        }
        .progress-bar-container-flex {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
        }
        .progress-bar-bg-custom {
          flex-grow: 1;
          height: 6px;
          background: var(--bg-600);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-fill-custom {
          height: 100%;
          background: var(--success);
          border-radius: 3px;
          transition: width 0.8s ease-out;
        }
        .progress-percentage-label {
          font-size: 12px;
          font-weight: 800;
          color: var(--success);
          min-width: 30px;
          text-align: right;
        }

        /* Footer links styling */
        .footer-action-links {
          display: flex;
          gap: 20px;
        }
        .footer-action-link-btn {
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }
        .footer-action-link-btn:hover {
          color: var(--brand-red);
        }
        .card-footer-dots {
          cursor: pointer;
          color: var(--text-muted);
          font-size: 16px;
          display: flex;
          align-items: center;
        }
        .card-footer-dots:hover {
          color: var(--text-primary);
        }

        /* Dropdown Traffic Panel Styles */
        .traffic-detail-panel {
          background: var(--bg-900);
          border-top: 1px dashed var(--border);
          padding: 20px 24px;
          animation: slideInDown 0.25s ease-out;
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .traffic-panel-title {
          font-size: 12px;
          font-weight: 800;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .traffic-grid-months {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }
        @media (max-width: 768px) {
          .traffic-grid-months {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 480px) {
          .traffic-grid-months {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .month-stat-box {
          background: var(--bg-800);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .month-stat-name {
          font-size: 11px;
          font-weight: 700;
          color: var(--brand-red);
          text-transform: uppercase;
        }
        .month-stat-val {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .month-stat-label-sub {
          font-size: 9px;
          color: var(--text-muted);
        }

        /* Modal popup dialog for contacting */
        .contact-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(9, 8, 12, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .contact-dialog-box {
          background: var(--bg-800);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          width: 90%;
          max-width: 380px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          animation: modalGrow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalGrow {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .contact-dialog-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
        }
        .contact-phone-number {
          font-size: 22px;
          font-weight: 800;
          color: var(--brand-red);
          text-align: center;
          padding: 16px;
          background: var(--bg-700);
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          letter-spacing: 1px;
        }
      `}</style>

      {/* Main Results Title Header */}
      <div className="wizard-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="wizard-icon">✅</span>
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

      <div className="rec-container-wrapper">
        {listToRender.map((item) => {
          const c = item.client;
          const initials = c.clientName.split(' ').map(n => n[0]).join('').substring(0, 2);
          const isExpanded = !!expandedTraffic[c.clientReference];
          const hasManyOffers = item.recommendedOffers.length > 2;

          // Calculate consumption percentage
          const consumptionPercent = Math.round((c.avgVolumeDataMo / c.dataLimit) * 100);

          return (
            <div key={c.clientReference} className="rec-card">
              <div className="rec-grid">

                {/* 1. Profile and Current Plan Column */}
                <div className="rec-col rec-col-border">
                  <div className="avatar-initials-wrapper">
                    <div className="avatar-initials">{initials}</div>
                    <div>
                      <div className="profile-name-text">{c.clientName}</div>
                      <div className="profile-ref-text">Réf: #{c.clientReference}</div>
                    </div>
                  </div>

                  <span className="segment-badge-green">
                    SEGMENT {c.valueSegment}
                  </span>

                  <div className="current-plan-section">
                    <span className="current-plan-label">{tLocal('currentPlan')}</span>
                    <div className="current-plan-row">
                      <span className="current-plan-name">{c.clientPastOfferName}</span>
                      <span className="current-plan-price">
                        {c.clientPastOfferPrice.toFixed(2)} DZD
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Scrollable Recommendations Column */}
                <div className="rec-col rec-col-border">
                  <span className="rec-column-label">
                    {tLocal('recOffers')} {hasManyOffers ? `(Top ${item.recommendedOffers.length})` : ''}
                  </span>

                  <div className="offers-scroll-list">
                    {item.recommendedOffers.map((offer) => {
                      const offerKey = `${c.clientReference}_${offer.offerReference}`;
                      const isApplied = !!appliedOffers[offerKey];

                      return (
                        <div key={offer.offerReference} className="offer-subcard">
                          <div className="offer-details-left">
                            <div className={`offer-icon-box ${offer.type}`}>
                              {offer.type === 'star' ? '⭐' : '🍃'}
                            </div>
                            <div>
                              <div className="offer-name-bold">{offer.offerName}</div>
                              <div className="offer-desc-sub">
                                {offer.engagement} · {lang === 'fr' ? 'Match' : 'Match'} {Math.round(offer.score * 100)}%
                              </div>
                            </div>
                          </div>

                          <div className="offer-price-right">
                            <span className="offer-price-bold">{offer.price.toFixed(2)} DZD</span>
                            {isApplied ? (
                              <span className="applied-text-btn applied-link-btn">
                                {tLocal('applied')}
                              </span>
                            ) : (
                              <button
                                className="apply-link-btn"
                                onClick={() => handleApplyOffer(c.clientReference, offer)}
                              >
                                {tLocal('apply')}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Telemetry & Consumption Column */}
                <div className="rec-col">
                  <span className="rec-column-label">{tLocal('consumption')}</span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                    <div className="consumption-row-pair">
                      <span className="consumption-label">{tLocal('dataUsage')}</span>
                      <span className="consumption-value-green">
                        {c.avgVolumeDataMo} GB / {c.dataLimit} GB
                      </span>
                    </div>

                    <div className="consumption-row-pair">
                      <span className="consumption-label">{tLocal('revenue')}</span>
                      <span className="consumption-value">
                        {c.avgRealRev.toFixed(2)} DZD
                      </span>
                    </div>

                    <div className="progress-bar-container-flex">
                      <div className="progress-bar-bg-custom">
                        <div
                          className="progress-bar-fill-custom"
                          style={{ width: `${Math.min(100, consumptionPercent)}%` }}
                        ></div>
                      </div>
                      <span className="progress-percentage-label">{consumptionPercent}%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 4. Footer Row */}
              <div className="card-footer">
                <div className="footer-action-links">
                  <button className="footer-action-link-btn" onClick={() => toggleTraffic(c.clientReference)}>
                    {tLocal('trafficDetails')} {isExpanded ? '▲' : '▼'}
                  </button>
                  <button className="footer-action-link-btn" onClick={() => setContactedClient(c)}>
                    {tLocal('contact')}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="card-footer-dots">⋮</span>
                </div>
              </div>

              {/* 5. Expanded Traffic Dropdown Panel */}
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
                        <div>
                          <div className="month-stat-val">{m.rev.toFixed(1)}</div>
                          <div className="month-stat-label-sub">DZD</div>
                        </div>
                        <div>
                          <div className="month-stat-val">{m.data.toFixed(1)}</div>
                          <div className="month-stat-label-sub">GB</div>
                        </div>
                        <div>
                          <div className="month-stat-val">{m.traf.toFixed(1)}</div>
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

      {/* Contact Modal Window Overlay */}
      {contactedClient && (
        <div className="contact-dialog-overlay" onClick={() => setContactedClient(null)}>
          <div className="contact-dialog-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="contact-dialog-title">{tLocal('contactInfo')}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {contactedClient.clientName}
            </p>
            <div className="contact-phone-number">
              {contactedClient.contact}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary"
                style={{ flexGrow: 1, padding: '10px' }}
                onClick={() => {
                  alert(`Appel vers ${contactedClient.contact} lancé...`);
                  setContactedClient(null);
                }}
              >
                📞 {tLocal('callingClient')}
              </button>
              <button
                className="btn-secondary"
                style={{ flexGrow: 1, padding: '10px' }}
                onClick={() => {
                  alert(`SMS envoyé à ${contactedClient.contact}...`);
                  setContactedClient(null);
                }}
              >
                ✉️ {tLocal('smsClient')}
              </button>
            </div>
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
