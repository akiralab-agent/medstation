import { Heart } from 'lucide-react';
import { Header } from '../../components/ui';
import styles from '../Profile/Profile.module.css';

export function Health() {
  return (
    <div className={styles.container}>
      <Header title="Health Authorization" showBackButton />

      <div className={styles.placeholderPage}>
        <div className={styles.placeholderIcon}>
          <Heart size={32} />
        </div>
        <h2>Health Authorization</h2>
        <p>Manage your health authorizations and permissions here.</p>
      </div>
    </div>
  );
}
