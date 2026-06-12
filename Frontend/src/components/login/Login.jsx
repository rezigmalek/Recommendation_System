import { useForm } from 'react-hook-form';
import logo from '../../assets/Djezzy_Logo_2015.svg';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' });

  const users = [
    {
      username: "admin",
      password: "admin123",
    },
    {
      username: "malek",
      password: "123456",
    },
    {
      username: "mustapha",
      password: "admin123",
    },
  ];

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const user = users.find(
      (u) => u.username === data.username && u.password === data.password
    );
    if (user) {
      localStorage.setItem("isAuthenticated", "true");
      navigate('/welcome');
    } else {
      setError("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 70% 20%, rgba(227,6,19,0.28) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(180,0,10,0.2) 0%, transparent 50%), #0f0005',
        padding: '2rem 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Carte */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '2.2rem 3rem 2rem',
          boxShadow: '0 32px 80px rgba(179,0,13,0.25), 0 8px 24px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(20px)',
          boxSizing: 'border-box',
        }}
      >
        {/* En-tête */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.8rem' }}>
          <img
            src={logo}
            alt="Djezzy"
            style={{ height: '64px', width: 'auto', objectFit: 'contain', marginBottom: '1.25rem', filter: 'drop-shadow(0 4px 16px rgba(227,6,19,0.5))' }}
          />
          <h1 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Système de Recommandation
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontWeight: 300, margin: 0 }}>
            Connectez-vous à votre espace
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* ── Username ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              htmlFor="username"
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              placeholder="ex : ahmed.benali"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${errors.username ? '#ff6b6b' : 'rgba(255,255,255,0.12)'}`,
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = errors.username ? '#ff6b6b' : '#e30613';
                e.target.style.background = 'rgba(227,6,19,0.08)';
                e.target.style.boxShadow = errors.username
                  ? '0 0 0 3px rgba(255,107,107,0.2)'
                  : '0 0 0 3px rgba(227,6,19,0.25)';
              }}
              onBlur={e => {
                e.target.style.background = 'rgba(255,255,255,0.07)';
                e.target.style.boxShadow = 'none';
                if (!errors.username) e.target.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              {...register('username', {
                required: "Le nom d'utilisateur est obligatoire",
                minLength: { value: 3, message: 'Minimum 3 caractères' },
                pattern: {
                  value: /^[a-zA-Z0-9._-]+$/,
                  message: 'Uniquement lettres, chiffres, . _ -',
                },
              })}
            />
            {errors.username && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff8080', fontSize: '0.73rem', fontWeight: 500 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.username.message}
              </span>
            )}
          </div>

          {/* ── Password ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              htmlFor="password"
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${errors.password ? '#ff6b6b' : 'rgba(255,255,255,0.12)'}`,
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = errors.password ? '#ff6b6b' : '#e30613';
                e.target.style.background = 'rgba(227,6,19,0.08)';
                e.target.style.boxShadow = errors.password
                  ? '0 0 0 3px rgba(255,107,107,0.2)'
                  : '0 0 0 3px rgba(227,6,19,0.25)';
              }}
              onBlur={e => {
                e.target.style.background = 'rgba(255,255,255,0.07)';
                e.target.style.boxShadow = 'none';
                if (!errors.password) e.target.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              {...register('password', {
                required: 'Le mot de passe est obligatoire',
                minLength: { value: 3, message: 'Minimum 3 caractères' },
              })}
            />
            {errors.password && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff8080', fontSize: '0.73rem', fontWeight: 500 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px',
              marginTop: '0.25rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #e30613 0%, #b0000d 100%)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              boxShadow: '0 4px 20px rgba(227,6,19,0.42)',
              transition: 'box-shadow 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.boxShadow = '0 6px 28px rgba(227,6,19,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(227,6,19,0.42)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {isSubmitting ? (
              <span style={{
                width: '20px', height: '20px', borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                display: 'inline-block',
                animation: 'spin 0.7s linear infinite',
              }} />
            ) : (
              <>
                Se connecter
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: 300 }}>
          © {new Date().getFullYear()} Djezzy — Usage interne uniquement
        </p>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.2); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}