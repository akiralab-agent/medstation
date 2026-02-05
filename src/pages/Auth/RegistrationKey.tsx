import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Key, 
  HeartPulse, 
  ArrowRight,
  Shield,
  Clock,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui';
import styles from './Auth.module.css';

export function RegistrationKey() {
  const navigate = useNavigate();
  const [registrationKey, setRegistrationKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated key validation
    setTimeout(() => {
      setLoading(false);
      if (registrationKey.length >= 6) {
        navigate('/signup', { state: { registrationKey } });
      } else {
        setError('Invalid registration key');
      }
    }, 1000);
  };

  return (
    <div className={styles.authPage}>
      {/* Left Side - Branding */}
      <div className={styles.authBrand}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>
            <HeartPulse size={48} />
            <span>medstation</span>
          </div>
          <h1 className={styles.brandTitle}>
            Register With<br />
            <span>Your Key</span>
          </h1>
          <p className={styles.brandDescription}>
            Enter the registration key provided by your healthcare provider 
            to create your secure account and access your medical records.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <Shield size={24} />
              <span>Secure & Private</span>
            </div>
            <div className={styles.feature}>
              <Clock size={24} />
              <span>24/7 Access</span>
            </div>
            <div className={styles.feature}>
              <FileText size={24} />
              <span>Digital Records</span>
            </div>
          </div>
        </div>
        
        <div className={styles.brandPattern} />
      </div>

      {/* Right Side - Form */}
      <div className={styles.authFormSection}>
        <div className={styles.formContainer}>
          {/* Back Link */}
          <Link to="/login" className={styles.backLink}>
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            Back to login
          </Link>

          <div className={styles.formHeader}>
            <h2>Registration Key</h2>
            <p>Enter the key provided by your healthcare provider</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Registration Key Input */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Registration Key</label>
              <div className={styles.inputWrapper}>
                <Key size={18} />
                <input
                  type="text"
                  placeholder="XXXX-XXXX-XXXX"
                  value={registrationKey}
                  onChange={(e) => setRegistrationKey(e.target.value)}
                  disabled={loading}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

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
                  Validating...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={18} />
                </>
              )}
            </Button>

            <p className={styles.signupText}>
              Don&apos;t have a key?{' '}
              <Link to="/signup" className={styles.signupLink}>
                Sign up without key
              </Link>
            </p>
          </form>
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} MedStation. All rights reserved.
        </p>
      </div>
    </div>
  );
}
