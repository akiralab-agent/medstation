import { useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, CreditCard, Landmark } from 'lucide-react';
import { Header, Modal } from '../../components/ui';
import { useState } from 'react';
import styles from './Schedule.module.css';

interface PaymentOption {
  id: string;
  icon: typeof DollarSign;
  label: string;
  lines?: string[];
}

const inPersonPayments: PaymentOption[] = [
  { id: 'zelle', icon: Landmark, label: 'Zelle®' },
  { id: 'cash', icon: DollarSign, label: 'CASH' },
  { id: 'card', icon: CreditCard, label: 'CREDIT OR DEBIT CARD', lines: ['CREDIT', 'OR DEBIT', 'CARD'] },
  { id: 'carecredit', icon: CreditCard, label: 'CARE CREDIT', lines: ['CARE', 'CREDIT'] },
];

const telemedicinePayments: PaymentOption[] = [
  { id: 'card', icon: CreditCard, label: 'CREDIT OR DEBIT CARD', lines: ['CREDIT', 'OR DEBIT', 'CARD'] },
  { id: 'carecredit', icon: CreditCard, label: 'CARE CREDIT', lines: ['CARE', 'CREDIT'] },
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
      <Header title="Payment Method" showBackButton />

      <div className={styles.paymentGrid}>
        {payments.map((payment) => {
          const Icon = payment.icon;
          return (
            <button
              key={payment.id}
              className={styles.paymentCard}
              onClick={() => handleSelect(payment.id)}
            >
              <Icon size={32} />
              {payment.lines ? (
                payment.lines.map((line, i) => (
                  <span key={i} className={styles.paymentLabel}>{line}</span>
                ))
              ) : (
                <span className={styles.paymentLabel}>{payment.label}</span>
              )}
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
