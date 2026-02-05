import { Link } from 'react-router-dom';
import { HeartPulse, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/dashboard" className={styles.logo}>
              <HeartPulse size={24} className={styles.logoIcon} />
              <span className={styles.logoText}>
                <span className={styles.logoMed}>med</span>
                <span className={styles.logoStation}>station</span>
              </span>
            </Link>
            <p className={styles.description}>
              Your trusted healthcare companion. Managing appointments, 
              health records, and medical services all in one place.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <Link to="/dashboard" className={styles.link}>Dashboard</Link>
            <Link to="/appointments" className={styles.link}>Appointments</Link>
            <Link to="/health" className={styles.link}>Health Records</Link>
            <Link to="/exams" className={styles.link}>Lab Results</Link>
          </div>

          {/* Support */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Support</h4>
            <Link to="/help" className={styles.link}>Help Center</Link>
            <Link to="/contact" className={styles.link}>Contact Us</Link>
            <Link to="/faq" className={styles.link}>FAQ</Link>
            <Link to="/feedback" className={styles.link}>Feedback</Link>
          </div>

          {/* Legal */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Legal</h4>
            <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link to="/terms" className={styles.link}>Terms of Service</Link>
            <Link to="/cookies" className={styles.link}>Cookie Policy</Link>
            <Link to="/security" className={styles.link}>Security</Link>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} MedStation. All rights reserved.
          </p>
          <div className={styles.legal}>
            <Link to="/privacy" className={styles.legalLink}>Privacy</Link>
            <Link to="/terms" className={styles.legalLink}>Terms</Link>
            <Link to="/cookies" className={styles.legalLink}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
