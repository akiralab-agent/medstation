import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Auth.module.css';

export function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const success = await register({ name, email, password });
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
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
            Start Your<br />
            <span>Health Journey</span>
          </h1>
          <p className={styles.brandDescription}>
            Join thousands of patients who trust MedStation for their 
            healthcare management. Simple, secure, and always accessible.
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
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Full Name</label>
              <div className={styles.inputWrapper}>
                <User size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
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

            {/* Password Input */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
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

            {/* Confirm Password Input */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Confirm Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className={styles.formInput}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.togglePassword}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <p className={styles.signupText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.signupLink}>
              Sign in
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
