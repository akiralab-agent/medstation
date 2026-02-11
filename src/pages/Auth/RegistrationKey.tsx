import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Key,
  HeartPulse,
  ArrowRight,
  Shield,
  Clock,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui';
import styles from './Auth.module.css';

export function RegistrationKey() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [registrationKey, setRegistrationKey] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorKey('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (registrationKey.length >= 6) {
        navigate('/signup', { state: { registrationKey } });
      } else {
        setErrorKey('auth.errors.invalidRegistrationKey');
      }
    }, 1000);
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
            {t('auth.registrationKey.brandTitleLine1')}<br />
            <span>{t('auth.registrationKey.brandTitleLine2')}</span>
          </h1>
          <p className={styles.brandDescription}>{t('auth.registrationKey.brandDescription')}</p>

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
            <h2>{t('auth.registrationKey.title')}</h2>
            <p>{t('auth.registrationKey.subtitle')}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{t('auth.registrationKey.label')}</label>
              <div className={styles.inputWrapper}>
                <Key size={18} />
                <input
                  type="text"
                  placeholder={t('auth.placeholders.registrationKey')}
                  value={registrationKey}
                  onChange={(event) => setRegistrationKey(event.target.value)}
                  disabled={loading}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            {errorKey && <p className={styles.error}>{t(errorKey)}</p>}

            <Button
              variant="primary"
              fullWidth
              type="submit"
              disabled={loading || !registrationKey}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <span className={styles.loadingSpinner} />
                  {t('auth.registrationKey.validating')}
                </>
              ) : (
                <>
                  {t('common.continue')}
                  <ArrowRight size={18} />
                </>
              )}
            </Button>

            <p className={styles.signupText}>
              {t('auth.registrationKey.noKey')}{' '}
              <Link to="/signup" className={styles.signupLink}>
                {t('auth.registrationKey.signUpWithoutKey')}
              </Link>
            </p>
          </form>
        </div>

        <p className={styles.copyright}>{t('auth.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </div>
  );
}
