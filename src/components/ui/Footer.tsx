import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <Link to="/dashboard" className={styles.logo}>
              <img
                src="/Medstation-Logo_1200px_H.png"
                alt="MedStation"
                className={styles.logoImage}
              />
            </Link>
            <p className={styles.description}>{t('footer.description')}</p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label={t('footer.socialFacebook')}>
                <Facebook size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label={t('footer.socialTwitter')}>
                <Twitter size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label={t('footer.socialInstagram')}>
                <Instagram size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label={t('footer.socialLinkedin')}>
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{t('footer.copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
