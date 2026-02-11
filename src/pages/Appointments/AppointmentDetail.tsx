import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Check,
  RefreshCw,
  MapPin,
  Calendar,
  Video,
  CreditCard,
} from 'lucide-react';
import { Header, FAB, Modal, Button } from '../../components/ui';
import styles from './Appointments.module.css';

export function AppointmentDetail() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleError, setShowRescheduleError] = useState(false);
  const appointmentDateTime = new Date('2026-09-04T15:30:00');

  const appointment = {
    id,
    locator: '1234567890',
    operatorStatus: t('appointments.authorized'),
    date: appointmentDateTime.toLocaleDateString(i18n.language, { month: 'short', day: '2-digit' }).toUpperCase(),
    year: String(appointmentDateTime.getFullYear()),
    time: appointmentDateTime.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' }),
    address: '123 Medical Center Dr, Miami Beach, FL 33139',
    patient: 'John Doe',
    clinic: 'Miami Medical Center',
    insurance: 'BlueCross BlueShield',
    plan: 'Premium Plus',
    instructions: t('appointments.instructionsDefault'),
    isTelemedicine: false,
  };

  const fabActions = [
    { icon: <Phone size={18} />, label: t('appointments.connect'), color: '#14b8a6', onClick: () => {} },
    { icon: <Check size={18} />, label: t('appointments.confirmArrival'), color: '#0d9488', onClick: () => {} },
    { icon: <RefreshCw size={18} />, label: t('appointments.reschedule'), color: '#f97316', onClick: () => setShowRescheduleError(true) },
    { icon: <MapPin size={18} />, label: t('appointments.location'), color: '#f97316', onClick: () => {} },
    { icon: <Calendar size={18} />, label: t('appointments.addToCalendar'), color: '#f97316', onClick: () => {} },
    ...(appointment.isTelemedicine
      ? [{ icon: <Video size={18} />, label: t('appointments.startTeleconsultation'), color: '#fb923c', onClick: () => {} }]
      : []),
    { icon: <CreditCard size={18} />, label: t('payment.title'), color: '#d4a574', onClick: () => navigate('/schedule/payment-form') },
  ];

  const handleCancel = () => {
    setShowCancelModal(false);
    navigate('/appointments');
  };

  return (
    <div className={styles.container}>
      <Header title={t('appointments.detailsTitle')} showBackButton variant="primary" />

      <div className={styles.detailContent}>
        <div className={styles.statusRow}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>{t('appointments.operatorStatus')}</span>
            <span className={`${styles.statusValue} ${styles.authorized}`}>
              {appointment.operatorStatus}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>{t('appointments.locator')}</span>
            <span className={`${styles.statusValue} ${styles.locator}`}>
              {appointment.locator}
            </span>
          </div>
        </div>

        <div className={styles.dateDisplay}>
          <span className={styles.displayTime}>{appointment.time}</span>
          <span className={styles.displayDate}>{appointment.date}</span>
          <span className={styles.displayYear}>{appointment.year}</span>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('common.address')}</span>
            <div className={styles.infoRow}>
              <span className={styles.infoValue}>{appointment.address}</span>
              <MapPin size={20} className={styles.infoIcon} />
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('appointments.patient')}</span>
            <span className={styles.infoValue}>{appointment.patient}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('appointments.clinic')}</span>
            <span className={styles.infoValue}>{appointment.clinic}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('appointments.insurance')}</span>
            <span className={styles.infoValue}>{appointment.insurance}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('appointments.plan')}</span>
            <span className={styles.infoValue}>{appointment.plan}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{t('appointments.instructions')}</span>
            <span className={styles.infoValue}>{appointment.instructions}</span>
          </div>
        </div>

        <Button
          variant="text"
          fullWidth
          onClick={() => setShowCancelModal(true)}
          className={styles.cancelButton}
        >
          {t('appointments.cancelAppointment')}
        </Button>
      </div>

      <FAB actions={fabActions} />

      <Modal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        type="warning"
        title={t('appointments.cancelModalTitle')}
        message={t('appointments.cancelModalMessage')}
        primaryAction={{ label: t('common.yes'), onClick: handleCancel }}
        secondaryAction={{ label: t('common.no'), onClick: () => setShowCancelModal(false) }}
      />

      <Modal
        visible={showRescheduleError}
        onClose={() => setShowRescheduleError(false)}
        type="error"
        title={t('appointments.rescheduleNotAllowedTitle')}
        message={t('appointments.rescheduleNotAllowedMessage')}
        primaryAction={{
          label: t('appointments.whatsappSupport'),
          onClick: () => setShowRescheduleError(false),
        }}
        secondaryAction={{ label: t('common.turnBack'), onClick: () => setShowRescheduleError(false) }}
      />
    </div>
  );
}
