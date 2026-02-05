import { useState } from 'react';
import { Header, Input, Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Profile.module.css';

export function PersonalData() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Simulated save
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatPhone = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 3) return v;
    if (v.length <= 6) return `(${v.slice(0, 3)}) ${v.slice(3)}`;
    return `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6, 10)}`;
  };

  return (
    <div className={styles.container}>
      <Header title="Personal Data" showBackButton />

      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <Input
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <Input
            label="Date of birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            placeholder="MM/DD/YYYY"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Cell phone</label>
          <div className={styles.phoneInput}>
            <span className={styles.countryCode}>🇺🇸</span>
            <Input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(555) 555-5555"
            />
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
