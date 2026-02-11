import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Input, Button, Modal } from '../../components/ui';
import styles from './PaymentForm.module.css';

export function PaymentForm() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const serviceValue = 150.0;
  const scheduledDateTime = new Date('2025-10-25T14:00:00');
  const scheduledDateLabel = scheduledDateTime.toLocaleDateString(i18n.language, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const scheduledTimeLabel = scheduledDateTime.toLocaleTimeString(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const serviceValueFormatted = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'USD',
  }).format(serviceValue);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (cardNumber.includes('0000')) {
        setShowError(true);
      } else {
        setShowSuccess(true);
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const numericValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = numericValue.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let index = 0, len = match.length; index < len; index += 4) {
      parts.push(match.substring(index, index + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const numericValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (numericValue.length >= 2) {
      return numericValue.slice(0, 2) + '/' + numericValue.slice(2, 4);
    }
    return numericValue;
  };

  return (
    <div className={styles.container}>
      <Header title={t('payment.title')} showBackButton variant="primary" />

      <div className={styles.content}>
        <div className={styles.balanceCard}>
          <div className={styles.scheduledInfo}>
            <span className={styles.scheduledLabel}>{t('payment.scheduled')}</span>
            <span className={styles.scheduledDate}>{scheduledDateLabel}</span>
            <span className={styles.scheduledTime}>{scheduledTimeLabel}</span>
          </div>
          <div className={styles.valueSection}>
            <span className={styles.valueLabel}>{t('payment.serviceValue')}</span>
            <span className={styles.valueAmount}>{serviceValueFormatted}</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>{t('payment.cardInformation')}</h3>

          <Input
            label={t('payment.cardNumber')}
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
            maxLength={19}
          />

          <div className={styles.row}>
            <Input
              label={t('payment.expiryDate')}
              placeholder="MM/YY"
              value={expiry}
              onChange={(event) => setExpiry(formatExpiry(event.target.value))}
              maxLength={5}
            />
            <Input
              label="CVV"
              placeholder="123"
              value={cvv}
              onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              type="password"
            />
          </div>

          <Input
            label={t('payment.cardholderName')}
            placeholder={t('payment.nameOnCard')}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <p className={styles.disclaimer}>
            {t('payment.disclaimer')}
          </p>

          <div className={styles.buttons}>
            <Button
              variant="primary"
              fullWidth
              type="submit"
              disabled={loading || !cardNumber || !expiry || !cvv || !name}
            >
              {loading ? t('payment.processing') : t('payment.goToPayment')}
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate(-1)}>
              {t('common.cancel')}
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
        title={t('payment.successTitle')}
        message={t('payment.successMessage')}
        primaryAction={{
          label: t('appointments.viewMyAppointments'),
          onClick: () => navigate('/appointments'),
        }}
      />

      <Modal
        visible={showError}
        onClose={() => setShowError(false)}
        type="error"
        title={t('payment.cardRefusedTitle')}
        message={t('payment.cardRefusedMessage')}
        primaryAction={{
          label: t('payment.tryAnotherCard'),
          onClick: () => setShowError(false),
        }}
        secondaryAction={{
          label: t('payment.changePaymentMethod'),
          onClick: () => navigate('/schedule/payment'),
        }}
      />
    </div>
  );
}
