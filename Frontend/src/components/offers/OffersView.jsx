import React, { useState } from 'react';
import { SearchIcon } from '../common/Icons';
import { useAppContext } from '../../context/AppContext';

export default function OffersView() {
  const {
    offers,
    lang,
    t
  } = useAppContext();

  // Local search query and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [offerTypeFilter, setOfferTypeFilter] = useState('All');

  // Filtering offers
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = offerTypeFilter === 'All' ||
      offer.type === offerTypeFilter ||
      (offerTypeFilter === 'Postpaid' && offer.type === 'Postpayé') ||
      (offerTypeFilter === 'Hybrid' && offer.type === 'Hybride') ||
      (offerTypeFilter === 'Prepaid' && offer.type === 'Prépayé');

    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="toolbar">
        <div className="search-wrapper">
          <span className="search-icon"><SearchIcon /></span>
          <input
            type="text"
            placeholder={t('searchPlaceholderOffers')}
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={offerTypeFilter}
            onChange={(e) => setOfferTypeFilter(e.target.value)}
          >
            <option value="All">{t('allTypes')}</option>
            <option value="Postpayé">{lang === 'fr' ? 'Postpayé' : 'Postpaid'}</option>
            <option value="Hybride">{lang === 'fr' ? 'Hybride' : 'Hybrid'}</option>
            <option value="Prépayé">{lang === 'fr' ? 'Prépayé' : 'Prepaid'}</option>
          </select>
        </div>
      </div>

      <div className="offers-grid">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className={`offer-card ${offer.popular ? 'popular' : ''}`}
          >
            {offer.popular && <div className="popular-badge">{t('popularBadge')}</div>}
            <div>
              <div className="offer-header">
                <div>
                  <span className="offer-type">
                    {lang === 'fr' ? offer.type : offer.type.replace('Postpayé', 'Postpaid').replace('Hybride', 'Hybrid').replace('Prépayé', 'Prepaid')}
                  </span>
                  <h3 className="offer-name">{offer.name}</h3>
                </div>
              </div>

              <div className="offer-price-box">
                <span className="offer-price">{offer.price}</span>
                <span className="offer-price-unit">DZD / {lang === 'fr' ? offer.validity : offer.validity.replace('Jours', 'Days')}</span>
              </div>

              <div className="offer-allowances">
                <div className="allowance-item">
                  <div className="allowance-icon">🌐</div>
                  <span>{t('allowanceInternet')}{offer.data.replace('Go', 'GB')}</span>
                </div>
                <div className="allowance-item">
                  <div className="allowance-icon">📞</div>
                  <span>
                    {t('allowanceVoice')}
                    {lang === 'fr' ? offer.voice : offer.voice.replace('Illimité vers Djezzy', 'Unlimited to Djezzy').replace('Sans appels inclus', 'No calls included')}
                  </span>
                </div>
                {offer.voiceOther !== "Tarif standard" && (
                  <div className="allowance-item">
                    <div className="allowance-icon">💬</div>
                    <span style={{ fontSize: '13px' }}>
                      {t('allowanceOthers')}
                      {lang === 'fr' ? offer.voiceOther : offer.voiceOther.replace('vers autres réseaux', 'to other networks')}
                    </span>
                  </div>
                )}
                <div className="allowance-item">
                  <div className="allowance-icon">✉️</div>
                  <span>
                    {t('allowanceSms')}
                    {lang === 'fr' ? offer.sms : offer.sms.replace('Illimité vers Djezzy', 'Unlimited to Djezzy').replace('Sans SMS inclus', 'No SMS included')}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="offer-features-title">{t('featuresTitle')}</span>
              <ul className="offer-features-list" style={{ listStyle: 'none' }}>
                {offer.features.map((feat, i) => (
                  <li key={i}>
                    <span className="feature-check">✓</span>
                    {lang === 'fr' ? feat : feat.replace('Accès VIP', 'VIP Access').replace('Roaming inclus', 'Roaming included').replace('Support Prioritaire', 'Priority Support').replace('Report de data', 'Data rollover').replace('Option Double SIM dispo', 'Double SIM option available').replace('Idéal réseaux sociaux', 'Ideal for social networks').replace('Contrôle de consommation', 'Consumption control').replace('Spécial Appels', 'Calls special').replace('Petit budget', 'Low budget').replace('100% Data', '100% Data').replace('Vitesse Max 4G+', 'Max 4G+ Speed').replace('Spécial Streaming / Télétravail', 'Streaming / WFH special').replace('Option Multi-SIM', 'Multi-SIM Option')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
