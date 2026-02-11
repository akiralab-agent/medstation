import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DollarSign, CreditCard, Landmark } from 'lucide-react';
import { Header, Modal } from '../../components/ui';
import { useState } from 'react';
import styles from './Schedule.module.css';

interface PaymentOption {
  id: string;
  icon: typeof DollarSign;
  label: string;
}

export function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isTelemedicine = location.state?.type === 'telemedicine';
  const inPersonPayments: PaymentOption[] = [
    { id: 'zelle', icon: Landmark, label: 'Zelle' },
    { id: 'cash', icon: DollarSign, label: t('payment.cash') },
    { id: 'card', icon: CreditCard, label: t('payment.card') },
    { id: 'carecredit', icon: CreditCard, label: t('payment.careCredit') },
  ];
  const telemedicinePayments: PaymentOption[] = [
    { id: 'card', icon: CreditCard, label: t('payment.card') },
    { id: 'carecredit', icon: CreditCard, label: t('payment.careCredit') },
  ];
  const payments = isTelemedicine ? telemedicinePayments : inPersonPayments;

  const handleSelect = (paymentId: string) => {
    if (paymentId === 'cash' || paymentId === 'zelle') {
      setShowSuccessModal(true);
    } else {
      navigate('/schedule/payment-form', { state: { paymentMethod: paymentId } });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/appointments');
  };

  return (
    <div className={styles.container}>
      <Header title={t('payment.methodTitle')} showBackButton variant="primary" />

      <div className={styles.paymentGrid}>
        {payments.map((payment) => {
          const Icon = payment.icon;
          return (
            <button
              key={payment.id}
              className={styles.paymentCard}
              onClick={() => handleSelect(payment.id)}
            >
              <Icon size={22} />
              <span className={styles.paymentLabel}>{payment.label}</span>
            </button>
          );
        })}
      </div>

      <Modal
        visible={showSuccessModal}
        onClose={handleSuccessClose}
        type="success"
        title={t('payment.appointmentConfirmedTitle')}
        message={t('payment.appointmentConfirmedMessage')}
        primaryAction={{ label: t('appointments.viewMyAppointments'), onClick: handleSuccessClose }}
      />
    </div>
  );
}
