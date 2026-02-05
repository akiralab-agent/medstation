import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  HeartPulse, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  Clock,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Your Health,<br />
            <span>Made Simple</span>
          </h1>
          <p className={styles.brandDescription}>
            Access your medical records, schedule appointments, and manage 
            your healthcare journey all in one secure platform.
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
          <div className={styles.formHeader}>
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
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

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className={styles.formInput}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.formActions}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            {error && <p className={styles.error}>{error}</p>}

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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <div className={styles.formDivider}>
            <span>or</span>
          </div>

          <Button
            variant="outline"
            fullWidth
            type="button"
            onClick={() => navigate('/register')}
            className={styles.registrationButton}
            disabled={loading}
          >
            I Have a Registration Key
          </Button>

          <p className={styles.signupText}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className={styles.signupLink}>
              Create account
            </Link>
          </p>
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} MedStation. All rights reserved.
        </p>
      </div>
    </div>
  );
}
