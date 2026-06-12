import React, { useState, useEffect } from 'react';
import { SearchIcon } from '../common/Icons';
import { useAppContext } from '../../context/AppContext';
import { AlertTriangle, RefreshCw, Globe, Phone, Check } from 'lucide-react';

export default function OffersView() {
  const {
    lang,
    t
  } = useAppContext();

  // API states
  const [offersList, setOffersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local search query and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [offerTypeFilter, setOfferTypeFilter] = useState('All');

  // Fetch offers from API
  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/offers');
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && result.data) {
        setOffersList(result.data);
      } else {
        throw new Error(result.message || 'Erreur lors du chargement des offres');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Adapt API offer to format expected by UI
  const adaptOffer = (apiOffer) => {
    const price = apiOffer.price || 0;
    const ref = apiOffer.offerReference || '';

    // Deduce type
    let type = 'Prépayé';

    // Generate offer name if null
    const name = apiOffer.offerName || `Djezzy Smart ${Math.round(price)}`;

    // Validity
    const validity = '30 Jours';

    // Data in GB
    const dataGB = apiOffer.dataGeneral ? Math.round(apiOffer.dataGeneral / 1024) : 0;
    const dataStr = `${dataGB} Go`;

    // Voice to Djezzy
    let voiceStr = '';
    if (apiOffer.onnetVoiceUnlimited === 1.0) {
      voiceStr = 'Illimité vers Djezzy';
    } else if (apiOffer.creditOnnet > 0) {
      voiceStr = `${apiOffer.creditOnnet} DZD vers Djezzy`;
    } else {
      voiceStr = 'Sans appels inclus';
    }

    // Voice to others
    let voiceOtherStr = 'Tarif standard';
    if (apiOffer.offnetVoiceUnlimited === 1.0) {
      voiceOtherStr = 'Illimité vers autres réseaux';
    } else if (apiOffer.creditOffnet > 0) {
      voiceOtherStr = `${apiOffer.creditOffnet} DZD vers autres réseaux`;
    }

    // SMS based on price/tier
    let smsStr = 'Sans SMS inclus';
    if (price >= 1500) {
      smsStr = 'Illimité vers Djezzy';
    } else if (price >= 800) {
      smsStr = '150 SMS';
    }

    // Propose features/benefits dynamically
    const features = [];
    if (apiOffer.creditInternational > 0) {
      features.push(`Crédit International: ${apiOffer.creditInternational} DZD`);
    }
    if (price >= 1500) {
      features.push('Accès VIP Djezzy');
      features.push('Roaming inclus');
      features.push('Support Prioritaire 24/7');
    } else if (price >= 800) {
      features.push('Report de data non consommée');
      features.push('Option Double SIM disponible');
      features.push('Idéal réseaux sociaux');
    } else {
      features.push('Contrôle de consommation par code');
      features.push('Idéal appels locaux');
      features.push('Option budget maîtrisé');
    }

    return {
      id: apiOffer.id,
      name,
      type,
      price,
      validity,
      data: dataStr,
      voice: voiceStr,
      voiceOther: voiceOtherStr,
      sms: smsStr,
      features,
      popular: price >= 1500,
      ref
    };
  };

  const adaptedOffers = offersList.map(adaptOffer);

  // Filtering offers
  const filteredOffers = adaptedOffers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(offer.ref).includes(searchQuery);

    const matchesType = offerTypeFilter === 'All' ||
      offer.type === offerTypeFilter ||
      (offerTypeFilter === 'Postpaid' && offer.type === 'Postpayé') ||
      (offerTypeFilter === 'Hybrid' && offer.type === 'Hybride') ||
      (offerTypeFilter === 'Prepaid' && offer.type === 'Prépayé');

    return matchesSearch && matchesType;
  });

  // Loading UI
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: '16px', padding: '60px' }}>
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>
          Chargement des offres...
        </p>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: '16px', padding: '60px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'var(--error-glow)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '28px'
        }}>⚠️</div>
        <p style={{ color: 'var(--error)', fontSize: '14px', fontWeight: 700 }}>
          Erreur: {error}
        </p>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '10px 24px' }}
          onClick={fetchOffers}
        >
          Réessayer
        </button>
      </div>
    );
  }

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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Réf: {offer.ref}</span>
                </div>
              </div>

              <div className="offer-price-box">
                <span className="offer-price">{offer.price}</span>
                <span className="offer-price-unit">DZD / {lang === 'fr' ? offer.validity : offer.validity.replace('Jours', 'Days')}</span>
              </div>

              <div className="offer-allowances">
                <div className="allowance-item">
                  <div className="allowance-icon">
                    <Globe size={15} strokeWidth={1.8} />
                  </div>
                  <span>{t('allowanceInternet')}{offer.data.replace('Go', 'GB')}</span>
                </div>
                <div className="allowance-item">
                  <div className="allowance-icon">
                    <Phone size={15} strokeWidth={1.8}/>
                  </div>
                  <span>
                    {t('allowanceVoice')}
                    {lang === 'fr' ? offer.voice : offer.voice.replace('Illimité vers Djezzy', 'Unlimited to Djezzy').replace('Sans appels inclus', 'No calls included').replace('vers Djezzy', 'to Djezzy')}
                  </span>
                </div>
                {offer.voiceOther !== "Tarif standard" && (
                  <div className="allowance-item">
                    <div className="allowance-icon">
                      <Phone size={15} strokeWidth={1.8}/>
                    </div>
                    <span style={{ fontSize: '13px' }}>
                      {t('allowanceOthers')}
                      {lang === 'fr' ? offer.voiceOther : offer.voiceOther.replace('vers autres réseaux', 'to other networks')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="offer-features-title">{t('featuresTitle')}</span>
              <ul className="offer-features-list" style={{ listStyle: 'none' }}>
                {offer.features.map((feat, i) => (
                  <li key={i}>
                    <span className="feature-check">✓</span>
                    {lang === 'fr' ? feat : feat.replace('Accès VIP Djezzy', 'VIP Djezzy Access').replace('Roaming inclus', 'Roaming included').replace('Support Prioritaire 24/7', 'Priority Support 24/7').replace('Report de data non consommée', 'Unused data rollover').replace('Option Double SIM disponible', 'Double SIM option available').replace('Idéal réseaux sociaux', 'Ideal for social networks').replace('Contrôle de consommation par code', 'Consumption control via code').replace('Idéal appels locaux', 'Ideal for local calls').replace('Option budget maîtrisé', 'Controlled budget option')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {filteredOffers.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Aucune offre ne correspond aux critères.
          </div>
        )}
      </div>
    </div>
  );
}
