import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  HeartPulse,
  ArrowRight,
  Shield,
  Clock,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { Button, Modal } from '../../components/ui';
import styles from './Auth.module.css';

export function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 1500);
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
            {t('auth.forgotPassword.brandTitleLine1')}<br />
            <span>{t('auth.forgotPassword.brandTitleLine2')}</span>
          </h1>
          <p className={styles.brandDescription}>{t('auth.forgotPassword.brandDescription')}</p>

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
            <h2>{t('auth.forgotPassword.title')}</h2>
            <p>{t('auth.forgotPassword.subtitle')}</p>
          </div>

          {!showSuccess ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('auth.forgotPassword.emailAddress')}</label>
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

              <Button
                variant="primary"
                fullWidth
                type="submit"
                disabled={loading || !email}
                className={styles.submitButton}
              >
                {loading ? (
                  <>
                    <span className={styles.loadingSpinner} />
                    {t('auth.forgotPassword.sending')}
                  </>
                ) : (
                  <>
                    {t('auth.forgotPassword.sendResetLink')}
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>

              <p className={styles.signupText}>
                {t('auth.forgotPassword.rememberPassword')}{' '}
                <Link to="/login" className={styles.signupLink}>
                  {t('auth.login.signIn')}
                </Link>
              </p>
            </form>
          ) : (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={48} />
              </div>
              <h3 className={styles.successTitle}>{t('auth.forgotPassword.checkEmail')}</h3>
              <p className={styles.successText}>
                {t('auth.forgotPassword.sentTo')} <strong>{email}</strong>
              </p>
              <p className={styles.successSubtext}>
                {t('auth.forgotPassword.didNotReceive')}{' '}
                <button
                  className={styles.resendLink}
                  onClick={() => setShowSuccess(false)}
                >
                  {t('auth.forgotPassword.tryAgain')}
                </button>
              </p>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/login')}
                className={styles.submitButton}
                style={{ marginTop: '24px' }}
              >
                {t('auth.forgotPassword.backToLogin')}
              </Button>
            </div>
          )}
        </div>

        <p className={styles.copyright}>{t('auth.copyright', { year: new Date().getFullYear() })}</p>
      </div>

      <Modal
        visible={false}
        onClose={() => {}}
        type="success"
        title=""
        message=""
      />
    </div>
  );
}
