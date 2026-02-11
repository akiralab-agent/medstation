import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Building2, CreditCard } from 'lucide-react';
import { Header } from '../../components/ui';
import styles from './Schedule.module.css';

export function ServiceType() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const serviceTypes = [
    { id: 'particular', icon: User, label: t('schedule.serviceTypeParticular') },
    { id: 'insurance', icon: Building2, label: t('schedule.serviceTypeInsurance') },
    { id: 'medcard', icon: CreditCard, label: 'MEDCARD' },
  ];

  const handleSelect = (type: string) => {
    if (type === 'medcard') {
      navigate('/schedule/medcard');
    } else {
      navigate('/schedule/payment', { state: { serviceType: type } });
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
