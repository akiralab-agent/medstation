import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { id } = useParams();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleError, setShowRescheduleError] = useState(false);

  // Mock data - in real app would fetch by ID
  const appointment = {
    id,
    locator: '1234567890',
    operatorStatus: 'Authorized',
    date: 'SEP/ 04',
    year: '2026',
    time: '03:30 PM',
    address: '123 Medical Center Dr, Miami Beach, FL 33139',
    patient: 'John Doe',
    clinic: 'Miami Medical Center',
    insurance: 'BlueCross BlueShield',
    plan: 'Premium Plus',
    instructions: 'Please arrive 15 minutes before your appointment. Bring your ID and insurance card.',
    isTelemedicine: false,
  };

  const fabActions = [
    { icon: <Phone size={18} />, label: 'Connect', color: '#14b8a6', onClick: () => {} },
    { icon: <Check size={18} />, label: 'Confirm arrival', color: '#0d9488', onClick: () => {} },
    { icon: <RefreshCw size={18} />, label: 'Reschedule', color: '#f97316', onClick: () => setShowRescheduleError(true) },
    { icon: <MapPin size={18} />, label: 'Location', color: '#f97316', onClick: () => {} },
    { icon: <Calendar size={18} />, label: 'Add to calendar', color: '#f97316', onClick: () => {} },
    ...(appointment.isTelemedicine
      ? [{ icon: <Video size={18} />, label: 'Start teleconsultation', color: '#fb923c', onClick: () => {} }]
      : []),
    { icon: <CreditCard size={18} />, label: 'Payment', color: '#d4a574', onClick: () => navigate('/schedule/payment-form') },
  ];

  const handleCancel = () => {
    setShowCancelModal(false);
    navigate('/appointments');
  };

  return (
    <div className={styles.container}>
      <Header title="Appointment Details" showBackButton />

      <div className={styles.detailContent}>
        <div className={styles.statusRow}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Operator status</span>
            <span className={`${styles.statusValue} ${styles.authorized}`}>
              {appointment.operatorStatus}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Locator</span>
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
            <span className={styles.infoLabel}>Address</span>
            <div className={styles.infoRow}>
              <span className={styles.infoValue}>{appointment.address}</span>
              <MapPin size={20} className={styles.infoIcon} />
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Patient</span>
            <span className={styles.infoValue}>{appointment.patient}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Clinic</span>
            <span className={styles.infoValue}>{appointment.clinic}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Insurance</span>
            <span className={styles.infoValue}>{appointment.insurance}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Plan</span>
            <span className={styles.infoValue}>{appointment.plan}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Instructions</span>
            <span className={styles.infoValue}>{appointment.instructions}</span>
          </div>
        </div>

        <Button
          variant="text"
          fullWidth
          onClick={() => setShowCancelModal(true)}
          className={styles.cancelButton}
        >
          Cancel Appointment
        </Button>
      </div>

      <FAB actions={fabActions} />

      <Modal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        type="warning"
        title="ATTENTION"
        message="Your appointment will be canceled, do you wish to continue?"
        primaryAction={{ label: 'Yes', onClick: handleCancel }}
        secondaryAction={{ label: 'No', onClick: () => setShowCancelModal(false) }}
      />

      <Modal
        visible={showRescheduleError}
        onClose={() => setShowRescheduleError(false)}
        type="error"
        title="RESCHEDULING NOT ALLOWED"
        message="This appointment cannot be rescheduled at this time. Please contact support for assistance."
        primaryAction={{
          label: 'TALK TO WHATSAPP SUPPORT',
          onClick: () => setShowRescheduleError(false),
        }}
        secondaryAction={{ label: 'TURN BACK', onClick: () => setShowRescheduleError(false) }}
      />
    </div>
  );
}
