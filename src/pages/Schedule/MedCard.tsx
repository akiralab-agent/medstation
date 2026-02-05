import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [showError, setShowError] = useState(false);
  const [showExternalModal, setShowExternalModal] = useState(false);

  const handleFetch = () => {
    setLoading(true);
    // Simulated API call
    setTimeout(() => {
      setLoading(false);
      if (cardNumber.length >= 10) {
        setCardData({
          cardNumber: cardNumber,
          cardholder: 'Carlos Comet',
          email: 'carlos@gmail.com',
          phone: '11111111111',
          address: '1343 Saint Tropez Circle, Broward...',
          cardStatus: 'ACTIVE',
          personStatus: 'ACTIVE',
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

  const handleContratarMedCard = () => {
    setShowExternalModal(true);
  };

  return (
    <div className={styles.container}>
      <Header title="MedCard" showBackButton />

      <div className={styles.content}>
        {!cardData ? (
          <>
            <div className={styles.inputSection}>
              <label className={styles.label}>CARD NUMBER</label>
              <Input
                placeholder="Enter your card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
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
                {loading ? 'Loading...' : 'Fetch Card'}
              </Button>

              <Button variant="secondary" fullWidth onClick={handleContratarMedCard}>
                Contratar MedCard
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.cardFound}>
            <div className={styles.successHeader}>
              <Check size={24} />
              <span>Card Found</span>
            </div>

            <div className={styles.cardDetails}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Card Number</span>
                <span className={styles.fieldValue}>{cardData.cardNumber}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Cardholder</span>
                <span className={styles.fieldValue}>{cardData.cardholder}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <span className={styles.fieldValue}>{cardData.email}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Phone</span>
                <span className={styles.fieldValue}>{cardData.phone}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Address</span>
                <span className={styles.fieldValue}>{cardData.address}</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Card Status</span>
                <span className={`${styles.fieldValue} ${styles.status}`}>{cardData.cardStatus}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Person Status</span>
                <span className={`${styles.fieldValue} ${styles.status}`}>{cardData.personStatus}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Subscription</span>
                <span className={styles.fieldValue}>{cardData.subscription}</span>
              </div>
            </div>

            <Button variant="success" fullWidth onClick={handleContinue}>
              Continue to Payment
            </Button>
          </div>
        )}
      </div>

      <Modal
        visible={showError}
        onClose={() => setShowError(false)}
        type="error"
        title="Card Not Found"
        message="The card number you entered was not found. Please check and try again."
        primaryAction={{ label: 'Try Again', onClick: () => setShowError(false) }}
      />

      <Modal
        visible={showExternalModal}
        onClose={() => setShowExternalModal(false)}
        type="warning"
        title="ATTENTION"
        message="You will be taken to a partner site to register for MedCard."
        primaryAction={{
          label: 'Continue',
          onClick: () => {
            setShowExternalModal(false);
            // In real app, would open external link
          },
        }}
        secondaryAction={{ label: 'Cancel', onClick: () => setShowExternalModal(false) }}
      />
    </div>
  );
}
