import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/Djezzy_Logo_2015.svg';
import Loading from '../common/Loading';
import { FileSpreadsheet, Package, CheckCircle2, AlertTriangle } from 'lucide-react';

// ─── useForm hook ──────────────────────────────────────────────
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validate({ ...values, [name]: value })[name] }));
  }, [values, validate]);

  const setTouchedField = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback((onValid) => (e) => {
    e.preventDefault();
    const allErrors = validate(values);
    const allTouched = Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setErrors(allErrors);
    setTouched(allTouched);
    if (Object.keys(allErrors).length === 0) onValid(values);
  }, [values, validate]);

  return { values, errors, touched, setValue, setTouchedField, handleSubmit };
}

// ─── Validation ────────────────────────────────────────────────
const MAX_OFFERS = 50;

function validate(values) {
  const errors = {};
  if (!values.clientFile) errors.clientFile = 'Veuillez importer le fichier clients';
  if (!values.offresFile) errors.offresFile = 'Veuillez importer le fichier offres';
  const n = parseInt(values.topN);
  if (isNaN(n) || n < 1 || n > MAX_OFFERS)
    errors.topN = `Valeur entre 1 et ${MAX_OFFERS}`;
  return errors;
}

// ─── FileUploadInput ───────────────────────────────────────────
function FileUploadInput({ label, icon, name, value, error, touched, onChange, onBlur }) {
  const { lang } = useAppContext();
  const hasFile = !!value;
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={styles.label}>{label}</label>
      <label
        style={{
          ...styles.uploadBox,
          ...(hasFile ? styles.uploadBoxActive : {}),
          ...(touched && error ? styles.uploadBoxError : {}),
        }}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
          onChange={(e) => { onChange(e.target.files[0] || null); }}
          onBlur={onBlur}
        />
        <div style={styles.uploadIcon(hasFile)}>{hasFile ? <CheckCircle2 /> : icon}</div>
        <div>
          <strong style={{ display: 'block', fontSize: 13, fontWeight: 600, color: hasFile ? 'var(--success)' : 'var(--text-primary)' }}>
            {hasFile ? value.name : (lang === 'fr' ? 'Cliquer pour importer' : 'Click to import')}
          </strong>
          <span style={{ fontSize: 11, color: hasFile ? 'var(--success)' : 'var(--text-muted)', fontFamily: 'monospace' }}>
            {hasFile ? `${(value.size / 1024).toFixed(1)} Ko` : '.xlsx · .xls · .csv'}
          </span>
        </div>
      </label>
      {touched && error && <p style={styles.error}>⚠ {error}</p>}
    </div>
  );
}

// ─── NumericInput ──────────────────────────────────────────────
function NumericInput({ label, value, error, touched, onChange, onBlur, min = 1, max = MAX_OFFERS }) {
  const { lang } = useAppContext();
  const n = parseInt(value) || min;
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={styles.label}>{label}</label>
      <div style={{ ...styles.numericWrapper, ...(touched && error ? { borderColor: 'var(--error)' } : {}) }}>
        <button type="button" style={styles.numericBtn}
          onClick={() => onChange(Math.max(min, n - 1))}>−</button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          style={styles.numericInput}
          onChange={(e) => onChange(parseInt(e.target.value) || min)}
          onBlur={onBlur}
        />
        <button type="button" style={styles.numericBtn}
          onClick={() => onChange(Math.min(max, n + 1))}>+</button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>
        {lang === 'fr' ? (
          <>Max recommandé : <strong style={{ color: 'var(--brand-red)' }}>{max}</strong> offres par client</>
        ) : (
          <>Max recommended: <strong style={{ color: 'var(--brand-red)' }}>{max}</strong> offers per client</>
        )}
      </p>
      {touched && error && <p style={styles.error}>⚠ {error}</p>}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function Recommendation({ onSubmit }) {
  const { t, lang } = useAppContext();
  const navigate = useNavigate();

  // ── Loading state ──────────────────────────────────────────
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, setValue, setTouchedField, handleSubmit } = useForm(
    { clientFile: null, offresFile: null, topN: 5 },
    validate
  );

  const getTransError = (err) => {
    if (!err) return '';
    if (err === 'Veuillez importer le fichier clients') {
      return lang === 'fr' ? 'Veuillez importer le fichier clients' : 'Please import the clients file';
    }
    if (err === 'Veuillez importer le fichier offres') {
      return lang === 'fr' ? 'Veuillez importer le fichier offres' : 'Please import the offers file';
    }
    if (err.startsWith('Valeur entre 1 et')) {
      return lang === 'fr' ? err : err.replace('Valeur entre 1 et', 'Value between 1 and');
    }
    return err;
  };
  const createUsageHistory = async (clientsFile, offersFile, recommendationReference) => {
    try {
      const formData = new FormData();
      formData.append('clientsFile', clientsFile);
      formData.append('offersFile', offersFile);
      formData.append('recommendationReference', recommendationReference);

      const res = await fetch('/api/history', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        console.log('Usage history created:', data.data);
      } else {
        console.warn('Usage history failed:', data.message);
      }
    } catch (err) {
      console.error('Error creating usage history:', err);
    }
  };

  const createOffers = async (offersFile) => {
    try {
      const formData = new FormData();
      formData.append('offresFile', offersFile);

      const res = await fetch('/api/offers/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        console.log('Offers Created succesfuly', data.data);
      } else {
        console.warn('Offers failed:', data.message);
      }
    } catch (err) {
      console.error('Error creating Offers:', err);
    }
  };

  const fetchLastIndex = async () => {
    try {
      const response = await fetch(`/api/recommendations/last-reference`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const result = await response.json();
      if (result) {
        console.log("Last Index:", result);
      }
      return result;
    } catch (err) {
      console.error("Error fetching last index:", err);
    }
  };

  const handleValid = async (vals) => {
    try {
      const LastIndex = await fetchLastIndex();
      const NextIndex = LastIndex + 1;

      const formData = new FormData();
      formData.append('clientsFile', vals.clientFile);
      formData.append('offersFile', vals.offresFile);
      formData.append('topN', vals.topN);

      setLoading(true);

      const res = await fetch('/api/recommendations/upload-data', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        console.log('Recommendation generated:', data);
        toast.success('Recommendation generated successfully');

        // ── Créer l'historique en parallèle, sans bloquer la navigation ──
        createUsageHistory(vals.clientFile, vals.offresFile, NextIndex);
        createOffers(vals.offresFile)

        navigate(`/recommendation-result/${NextIndex}`);
      } else {
        setLoading(false);
        toast.error(data.message || 'Something went wrong');
      }

    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error('Server error while uploading files');
    }
  };

  // ── Afficher Loading si en cours ───────────────────────────
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="glass-panel wizard-card" style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <img src={logo} alt="Djezzy Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: -0.3 }}>
            {t('wizardTitle')}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{t('wizardSubtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleValid)} noValidate>
        {/* Fichier Clients */}
        <FileUploadInput
          label={lang === 'fr' ? 'Fichier Clients' : 'Clients File'}
          icon={<FileSpreadsheet />}
          name="clientFile"
          value={values.clientFile}
          error={getTransError(errors.clientFile)}
          touched={touched.clientFile}
          onChange={(file) => setValue('clientFile', file)}
          onBlur={() => setTouchedField('clientFile')}
        />

        {/* Fichier Offres */}
        <FileUploadInput
          label={lang === 'fr' ? 'Fichier Offres' : 'Offers File'}
          icon={<Package />}
          name="offresFile"
          value={values.offresFile}
          error={getTransError(errors.offresFile)}
          touched={touched.offresFile}
          onChange={(file) => setValue('offresFile', file)}
          onBlur={() => setTouchedField('offresFile')}
        />

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

        {/* Top N */}
        <NumericInput
          label={lang === 'fr' ? "Nombre d'offres retournées (Top N)" : "Number of offers returned (Top N)"}
          value={values.topN}
          error={getTransError(errors.topN)}
          touched={touched.topN}
          onChange={(val) => setValue('topN', val)}
          onBlur={() => setTouchedField('topN')}
          min={1}
          max={MAX_OFFERS}
        />

        <button type="submit" className="btn-primary" style={{ marginTop: 24, width: '100%', padding: '13px' }}>
          {t('btnLaunchPredictive')}
        </button>
      </form>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────
const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  headerIcon: {
    width: 48,
    height: 48,
    background: 'var(--bg-800)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    border: '1.5px solid var(--border)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    flexShrink: 0,
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: 8,
  },
  uploadBox: {
    position: 'relative',
    border: '1.5px dashed var(--border)',
    borderRadius: 10,
    background: 'var(--bg-700)',
    padding: '14px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    transition: 'all 0.2s ease',
  },
  uploadBoxActive: {
    borderColor: 'var(--success)',
    background: 'var(--success-glow)',
  },
  uploadBoxError: {
    borderColor: 'var(--error)',
  },
  uploadIcon: (hasFile) => ({
    width: 34, height: 34,
    background: hasFile ? 'var(--success-glow)' : 'var(--bg-600)',
    color: hasFile ? 'var(--success)' : 'var(--text-secondary)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0,
  }),
  numericWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    background: 'var(--bg-700)',
    overflow: 'hidden',
  },
  numericBtn: {
    width: 40, height: 44,
    background: 'var(--bg-600)',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  numericInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    textAlign: 'center',
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--text-primary)',
    padding: '10px 4px',
    MozAppearance: 'textfield',
  },
  error: {
    fontSize: 11,
    color: 'var(--error)',
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
};