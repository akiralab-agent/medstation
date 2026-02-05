import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  HeartPulse, 
  ArrowRight,
  Shield,
  Clock,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Button, Modal } from '../../components/ui';
import styles from './Auth.module.css';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated API call
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 1500);
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
            Reset Your<br />
            <span>Password</span>
          </h1>
          <p className={styles.brandDescription}>
            Don&apos;t worry, we&apos;ve got you covered. Enter your email and we&apos;ll 
            send you instructions to get back into your account.
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
            <h2>Forgot Password?</h2>
            <p>No worries, we&apos;ll send you reset instructions</p>
          </div>

          {!showSuccess ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>

              <p className={styles.signupText}>
                Remember your password?{' '}
                <Link to="/login" className={styles.signupLink}>
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={48} />
              </div>
              <h3 className={styles.successTitle}>Check your email</h3>
              <p className={styles.successText}>
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <p className={styles.successSubtext}>
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button 
                  className={styles.resendLink}
                  onClick={() => setShowSuccess(false)}
                >
                  try again
                </button>
              </p>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/login')}
                className={styles.submitButton}
                style={{ marginTop: '24px' }}
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} MedStation. All rights reserved.
        </p>
      </div>

      {/* Success Modal (kept for backward compatibility) */}
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
