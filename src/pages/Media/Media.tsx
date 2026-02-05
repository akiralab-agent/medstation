import { Image } from 'lucide-react';
import { Header } from '../../components/ui';
import styles from '../Profile/Profile.module.css';

export function Media() {
  return (
    <div className={styles.container}>
      <Header title="Media" showBackButton />

      <div className={styles.placeholderPage}>
        <div className={styles.placeholderIcon}>
          <Image size={32} />
        </div>
        <h2>Media & Documents</h2>
        <p>Your medical documents and images will appear here.</p>
      </div>
    </div>
  );
}
