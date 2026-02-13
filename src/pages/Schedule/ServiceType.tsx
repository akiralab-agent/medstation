import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Building2, CreditCard } from 'lucide-react';
import { Header } from '../../components/ui';
import { isHealthInsuranceEnabled } from '../../services/featureFlags';
import styles from './Schedule.module.css';

type NavigationState = Record<string, unknown>;

const isNavigationState = (value: unknown): value is NavigationState =>
  typeof value === 'object' && value !== null;

export function ServiceType() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const currentState = isNavigationState(location.state) ? location.state : {};
  const serviceTypes = [
    { id: 'particular', icon: User, label: t('schedule.serviceTypeParticular') },
    { id: 'medcard', icon: CreditCard, label: 'MEDCARD' },
  ];
  const showHealthInsurance = isHealthInsuranceEnabled();
  if (showHealthInsurance) {
    serviceTypes.splice(1, 0, {
      id: 'insurance',
      icon: Building2,
      label: t('schedule.serviceTypeInsurance'),
    });
  }

  const handleSelect = (type: string) => {
    if (type === 'medcard') {
      navigate('/schedule/medcard', {
        state: {
          ...currentState,
          serviceType: 'medcard',
        },
      });
    } else {
      navigate('/schedule/payment', {
        state: {
          ...currentState,
          serviceType: type,
        },
      });
    }
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
    </div>
  );
}
