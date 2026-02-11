import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Input, Button, Modal } from '../../components/ui';
import { CreditCard, Check } from 'lucide-react';
import styles from './MedCard.module.css';

interface CardData {
  cardNumber: string;
  cardholder: string;
  email: string;
  phone: string;
  address: string;
  cardStatus: string;
  personStatus: string;
  subscription: string;
}

export function MedCard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [showError, setShowError] = useState(false);
  const [showExternalModal, setShowExternalModal] = useState(false);

  const handleFetch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (cardNumber.length >= 10) {
        setCardData({
          cardNumber,
          cardholder: 'Carlos Comet',
          email: 'carlos@gmail.com',
          phone: '11111111111',
          address: '1343 Saint Tropez Circle, Broward...',
          cardStatus: t('common.active').toUpperCase(),
          personStatus: t('common.active').toUpperCase(),
          subscription: 'stripe_error',
        });
      } else {
        setShowError(true);
      }
    }, 1500);
  };

  const handleContinue = () => {
    navigate('/schedule/payment', { state: { serviceType: 'medcard' } });
  };

  const handleHireMedCard = () => {
    setShowExternalModal(true);
  };

  return (
    <div className={styles.container}>
      <Header title="MedCard" showBackButton />

      <div className={styles.content}>
        {!cardData ? (
          <>
            <div className={styles.inputSection}>
              <label className={styles.label}>{t('medcard.cardNumber').toUpperCase()}</label>
              <Input
                placeholder={t('medcard.enterCardNumber')}
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
                leftIcon={<CreditCard size={20} />}
              />
            </div>

            <div className={styles.buttons}>
              <Button
                variant="success"
                fullWidth
                onClick={handleFetch}
                disabled={!cardNumber || loading}
              >
                {loading ? t('common.loading') : t('medcard.fetchCard')}
              </Button>

              <Button variant="secondary" fullWidth onClick={handleHireMedCard}>
                {t('medcard.hireMedcard')}
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.cardFound}>
            <div className={styles.successHeader}>
              <Check size={24} />
              <span>{t('medcard.cardFound')}</span>
            </div>

            <div className={styles.cardDetails}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.cardNumber')}</span>
                <span className={styles.fieldValue}>{cardData.cardNumber}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.cardholder')}</span>
                <span className={styles.fieldValue}>{cardData.cardholder}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('common.email')}</span>
                <span className={styles.fieldValue}>{cardData.email}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('common.phone')}</span>
                <span className={styles.fieldValue}>{cardData.phone}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('common.address')}</span>
                <span className={styles.fieldValue}>{cardData.address}</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.cardStatus')}</span>
                <span className={`${styles.fieldValue} ${styles.status}`}>{cardData.cardStatus}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.personStatus')}</span>
                <span className={`${styles.fieldValue} ${styles.status}`}>{cardData.personStatus}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.subscription')}</span>
                <span className={styles.fieldValue}>{cardData.subscription}</span>
              </div>
            </div>

            <Button variant="success" fullWidth onClick={handleContinue}>
              {t('medcard.continueToPayment')}
            </Button>
          </div>
        )}
      </div>

      <Modal
        visible={showError}
        onClose={() => setShowError(false)}
        type="error"
        title={t('medcard.cardNotFound')}
        message={t('medcard.cardNotFoundMessage')}
        primaryAction={{ label: t('medcard.tryAgain'), onClick: () => setShowError(false) }}
      />

      <Modal
        visible={showExternalModal}
        onClose={() => setShowExternalModal(false)}
        type="warning"
        title={t('common.attention')}
        message={t('medcard.externalSiteMessage')}
        primaryAction={{
          label: t('common.continue'),
          onClick: () => {
            setShowExternalModal(false);
          },
        }}
        secondaryAction={{ label: t('common.cancel'), onClick: () => setShowExternalModal(false) }}
      />
    </div>
  );
}
