import { Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/ui';
import styles from '../Profile/Profile.module.css';

export function Media() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Header title={t('media.title')} showBackButton />

      <div className={styles.placeholderPage}>
        <div className={styles.placeholderIcon}>
          <Image size={32} />
        </div>
        <h2>{t('media.documentsTitle')}</h2>
        <p>{t('media.documentsDescription')}</p>
      </div>
    </div>
  );
}
