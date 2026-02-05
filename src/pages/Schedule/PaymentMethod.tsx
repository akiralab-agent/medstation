import { useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, CreditCard, Landmark } from 'lucide-react';
import { Header, Modal } from '../../components/ui';
import { useState } from 'react';
import styles from './Schedule.module.css';

interface PaymentOption {
  id: string;
  icon: typeof DollarSign;
  label: string;
}

const inPersonPayments: PaymentOption[] = [
  { id: 'zelle', icon: Landmark, label: 'Zelle®' },
  { id: 'cash', icon: DollarSign, label: 'Cash' },
  { id: 'card', icon: CreditCard, label: 'Credit or Debit Card' },
  { id: 'carecredit', icon: CreditCard, label: 'Care Credit' },
];

const telemedicinePayments: PaymentOption[] = [
  { id: 'card', icon: CreditCard, label: 'Credit or Debit Card' },
  { id: 'carecredit', icon: CreditCard, label: 'Care Credit' },
];

export function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isTelemedicine = location.state?.type === 'telemedicine';
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
      <Header title="Payment Method" showBackButton variant="primary" />

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
        title="APPOINTMENT CONFIRMED"
        message="Your appointment has been successfully scheduled. You will receive a confirmation email shortly."
        primaryAction={{ label: 'VIEW MY APPOINTMENTS', onClick: handleSuccessClose }}
      />
    </div>
  );
}
