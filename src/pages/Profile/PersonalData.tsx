import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Input, Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { isProfilePersonalDataReadOnlyEnabled } from '../../services/featureFlags';
import styles from './Profile.module.css';

export function PersonalData() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isReadOnly = isProfilePersonalDataReadOnlyEnabled();
  const [name, setName] = useState(user?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [phone, setPhone] = useState(user?.cellPhone || user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [addressLine1, setAddressLine1] = useState(user?.addressLine1 || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [zip, setZip] = useState(user?.zip || '');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatPhone = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 3) {
      return numericValue;
    }
    if (numericValue.length <= 6) {
      return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
    }
    return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
  };

  return (
    <div className={styles.container}>
      <Header title={t('profile.personalData')} showBackButton />

      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <Input
            label={t('common.fullName')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            readOnly={isReadOnly}
          />
        </div>

        <div className={styles.formGroup}>
          <Input
            label={t('profile.dateOfBirth')}
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            placeholder={t('profile.dateOfBirthPlaceholder')}
            readOnly={isReadOnly}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>{t('profile.cellPhone')}</label>
          <div className={styles.phoneInput}>
            <span className={styles.countryCode}>🇺🇸</span>
            <Input
              value={phone}
              onChange={(event) => setPhone(formatPhone(event.target.value))}
              placeholder={t('profile.phonePlaceholder')}
              readOnly={isReadOnly}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <Input
            label={t('common.email')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('auth.placeholders.email')}
            readOnly={isReadOnly}
          />
        </div>

        <div className={styles.formGroup}>
          <Input
            label={t('common.address')}
            value={addressLine1}
            onChange={(event) => setAddressLine1(event.target.value)}
            placeholder={t('profile.streetAddress')}
            readOnly={isReadOnly}
          />
        </div>

        <div className={styles.formGroup}>
          <Input
            label={t('common.city')}
            value={city}
            onChange={(event) => setCity(event.target.value)}
            readOnly={isReadOnly}
          />
        </div>

        <div className={styles.formGroup}>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <div style={{ flex: 1 }}>
              <Input
                label={t('common.state')}
                value={state}
                onChange={(event) => setState(event.target.value)}
                readOnly={isReadOnly}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label={t('common.zip')}
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                readOnly={isReadOnly}
              />
            </div>
          </div>
        </div>

        {!isReadOnly && (
          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? t('common.saving') : t('common.saveChanges')}
          </Button>
        )}
      </div>
    </div>
  );
}
