import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Lock,
  HeartPulse,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Clock,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

export function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorKey, setErrorKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorKey('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorKey('auth.errors.invalidCredentials');
      }
    } catch {
      setErrorKey('auth.errors.generic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authBrand}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>
            <HeartPulse size={48} />
            <span>medstation</span>
          </div>
          <h1 className={styles.brandTitle}>
            {t('auth.login.brandTitleLine1')}<br />
            <span>{t('auth.login.brandTitleLine2')}</span>
          </h1>
          <p className={styles.brandDescription}>{t('auth.brandDescription')}</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <Shield size={24} />
              <span>{t('auth.featureSecure')}</span>
            </div>
            <div className={styles.feature}>
              <Clock size={24} />
              <span>{t('auth.featureAccess')}</span>
            </div>
            <div className={styles.feature}>
              <FileText size={24} />
              <span>{t('auth.featureRecords')}</span>
            </div>
          </div>
        </div>

        <div className={styles.brandPattern} />
      </div>

      <div className={styles.authFormSection}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>{t('auth.login.welcomeBack')}</h2>
            <p>{t('auth.login.signInToContinue')}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('common.email')}</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} />
                <input
                  type="email"
                  placeholder={t('auth.placeholders.email')}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('common.password')}</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.placeholders.password')}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  className={styles.formInput}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                  tabIndex={-1}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.formActions}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>{t('auth.login.rememberMe')}</span>
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            {errorKey && <p className={styles.error}>{t(errorKey)}</p>}

            <Button
              variant="primary"
              fullWidth
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <span className={styles.loadingSpinner} />
                  {t('auth.login.signingIn')}
                </>
              ) : (
                <>
                  {t('auth.login.signIn')}
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <div className={styles.formDivider}>
            <span>{t('common.or')}</span>
          </div>

          <Button
            variant="outline"
            fullWidth
            type="button"
            onClick={() => navigate('/register')}
            className={styles.registrationButton}
            disabled={loading}
          >
            {t('auth.login.haveRegistrationKey')}
          </Button>

          <p className={styles.signupText}>
            {t('auth.login.noAccount')}{' '}
            <Link to="/signup" className={styles.signupLink}>
              {t('auth.login.createAccount')}
            </Link>
          </p>
        </div>

        <p className={styles.copyright}>{t('auth.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </div>
  );
}
