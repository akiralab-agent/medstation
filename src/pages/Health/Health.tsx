import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/ui';
import styles from '../Profile/Profile.module.css';

export function Health() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Header title={t('health.authorizationTitle')} showBackButton variant="primary" />

      <div className={styles.placeholderPage}>
        <div className={styles.placeholderIcon}>
          <Heart size={32} />
        </div>
        <h2>{t('health.authorizationTitle')}</h2>
        <p>{t('health.authorizationDescription')}</p>
      </div>
    </div>
  );
}
