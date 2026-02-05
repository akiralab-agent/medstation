import { useNavigate } from 'react-router-dom';
import { User, Building2, CreditCard } from 'lucide-react';
import { Header } from '../../components/ui';
import styles from './Schedule.module.css';

const serviceTypes = [
  { id: 'particular', icon: User, label: 'PARTICULAR' },
  { id: 'insurance', icon: Building2, label: 'HEALTH INSURANCE' },
  { id: 'medcard', icon: CreditCard, label: 'MEDCARD' },
];

export function ServiceType() {
  const navigate = useNavigate();

  const handleSelect = (type: string) => {
    if (type === 'medcard') {
      navigate('/schedule/medcard');
    } else {
      navigate('/schedule/payment', { state: { serviceType: type } });
    }
  };

  return (
    <div className={styles.container}>
      <Header title="Type of Service" showBackButton />

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
                <Icon size={48} />
              </div>
              <span className={styles.serviceLabel}>{service.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
