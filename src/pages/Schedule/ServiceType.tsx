import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Building2, CreditCard } from 'lucide-react';
import { Header, Modal } from '../../components/ui';
import styles from './Schedule.module.css';

type NavigationState = Record<string, unknown>;

const isNavigationState = (value: unknown): value is NavigationState =>
  typeof value === 'object' && value !== null;

export function ServiceType() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showInsuranceSuccess, setShowInsuranceSuccess] = useState(false);
  const currentState = isNavigationState(location.state) ? location.state : {};
  const serviceTypes = [
    { id: 'particular', icon: User, label: t('schedule.serviceTypeParticular') },
    { id: 'insurance', icon: Building2, label: t('schedule.serviceTypeInsurance') },
    { id: 'medcard', icon: CreditCard, label: 'MEDCARD' },
  ];

  const handleSelect = (type: string) => {
    if (type === 'medcard') {
      navigate('/schedule/medcard', {
        state: {
          ...currentState,
          serviceType: 'medcard',
        },
      });
    } else if (type === 'insurance') {
      setShowInsuranceSuccess(true);
    } else {
      navigate('/schedule/payment', {
        state: {
          ...currentState,
          serviceType: type,
        },
        replace: true,
      });
    }
  };

  const handleInsuranceSuccessClose = () => {
    setShowInsuranceSuccess(false);
    navigate('/appointments', { replace: true });
  };

  return (
    <div className={styles.container}>
      <Header title={t('schedule.serviceTypeTitle')} showBackButton variant="primary" />

      <div className={styles.serviceCards}>
        {serviceTypes.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              className={styles.serviceCard}
              onClick={() => handleSelect(service.id)}
            >
              <div className={styles.serviceIcon}>
                <Icon size={22} />
              </div>
              <span className={styles.serviceLabel}>{service.label}</span>
            </button>
          );
        })}
      </div>

      <Modal
        visible={showInsuranceSuccess}
        onClose={handleInsuranceSuccessClose}
        type="success"
        title={t('payment.appointmentConfirmedTitle')}
        message={t('schedule.healthInsuranceManualPaymentMessage')}
        primaryAction={{ label: t('appointments.viewMyAppointments'), onClick: handleInsuranceSuccessClose }}
      />
    </div>
  );
}
