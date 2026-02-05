import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Input, Button, Modal } from '../../components/ui';
import styles from './PaymentForm.module.css';

export function PaymentForm() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const serviceValue = 250.0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Simulate random success/failure
      if (cardNumber.includes('0000')) {
        setShowError(true);
      } else {
        setShowSuccess(true);
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className={styles.container}>
      <Header title="Payment" showBackButton />

      <div className={styles.content}>
        <div className={styles.balanceCard}>
          <div className={styles.scheduledInfo}>
            <span className={styles.scheduledLabel}>Scheduled</span>
            <span className={styles.scheduledDate}>Out - 25 - 2025</span>
            <span className={styles.scheduledTime}>02:00 PM</span>
          </div>
          <div className={styles.valueSection}>
            <span className={styles.valueLabel}>Service value</span>
            <span className={styles.valueAmount}>${serviceValue.toFixed(2)}</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Card Information</h3>

          <Input
            label="Card Number"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
          />

          <div className={styles.row}>
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              maxLength={5}
            />
            <Input
              label="CVV"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              type="password"
            />
          </div>

          <Input
            label="Cardholder Name"
            placeholder="Name on card"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <p className={styles.disclaimer}>
            Your card information is securely processed and tokenized. We do not store your full card details.
          </p>

          <div className={styles.buttons}>
            <Button
              variant="primary"
              fullWidth
              type="submit"
              disabled={loading || !cardNumber || !expiry || !cvv || !name}
            >
              {loading ? 'Processing...' : 'GO TO PAYMENT'}
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate(-1)}>
              CANCEL
            </Button>
          </div>
        </form>
      </div>

      <Modal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate('/appointments');
        }}
        type="success"
        title="PAYMENT SUCCESSFUL"
        message="Your payment has been processed successfully. Your appointment is confirmed!"
        primaryAction={{
          label: 'VIEW MY APPOINTMENTS',
          onClick: () => navigate('/appointments'),
        }}
      />

      <Modal
        visible={showError}
        onClose={() => setShowError(false)}
        type="error"
        title="CARD REFUSED"
        message="Your payment could not be processed. Please try a different payment method."
        primaryAction={{
          label: 'TRY ANOTHER CARD',
          onClick: () => setShowError(false),
        }}
        secondaryAction={{
          label: 'CHANGE PAYMENT METHOD',
          onClick: () => navigate('/schedule/payment'),
        }}
      />
    </div>
  );
}
