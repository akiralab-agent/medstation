import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Lock,
  User,
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

export function SignUp() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorKey, setErrorKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorKey('');

    if (password !== confirmPassword) {
      setErrorKey('auth.errors.passwordsDoNotMatch');
      return;
    }

    setLoading(true);

    try {
      const success = await register({ name, email, password });
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorKey('auth.errors.registrationFailed');
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
            {t('auth.signUp.brandTitleLine1')}<br />
            <span>{t('auth.signUp.brandTitleLine2')}</span>
          </h1>
          <p className={styles.brandDescription}>{t('auth.signUp.brandDescription')}</p>

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
          <Link to="/login" className={styles.backLink}>
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            {t('auth.backToLogin')}
          </Link>

          <div className={styles.formHeader}>
            <h2>{t('auth.signUp.createAccount')}</h2>
            <p>{t('auth.signUp.fillDetails')}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('common.fullName')}</label>
              <div className={styles.inputWrapper}>
                <User size={18} />
                <input
                  type="text"
                  placeholder={t('auth.placeholders.fullName')}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={loading}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

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
                  placeholder={t('auth.placeholders.createPassword')}
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

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('common.confirmPassword')}</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('auth.placeholders.confirmPassword')}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={loading}
                  className={styles.formInput}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.togglePassword}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
                  {t('auth.signUp.creatingAccount')}
                </>
              ) : (
                <>
                  {t('auth.signUp.createAccount')}
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <p className={styles.signupText}>
            {t('auth.signUp.alreadyHaveAccount')}{' '}
            <Link to="/login" className={styles.signupLink}>
              {t('auth.login.signIn')}
            </Link>
          </p>
        </div>

        <p className={styles.copyright}>{t('auth.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </div>
  );
}
