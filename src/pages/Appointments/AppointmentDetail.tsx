import { useEffect, useMemo, useState } from 'react';
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
import { Header, FAB, Modal } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAppointmentById, type AppointmentItem } from '../../services/appointments';
import { isAppointmentFabEnabled, isAppointmentFabPaymentEnabled } from '../../services/featureFlags';
import styles from './Appointments.module.css';

function pickPersonId(authPersonId?: string) {
  return authPersonId?.trim() || import.meta.env.VITE_PERSON_ID?.trim() || '';
}

function buildDateFromPayload(item: AppointmentItem | null) {
  if (!item) return null;

  if (item.appointmentDateTime) {
    return new Date(item.appointmentDateTime);
  }

  if (!item.appointmentDate) {
    return null;
  }

  const baseDate = new Date(item.appointmentDate);
  if (Number.isNaN(baseDate.getTime())) {
    return null;
  }

  const beginTime = item.beginTime?.trim() || '';
  if (/^\d{4}$/.test(beginTime)) {
    const hours = Number(beginTime.slice(0, 2));
    const minutes = Number(beginTime.slice(2, 4));
    baseDate.setHours(hours, minutes, 0, 0);
  }

  return baseDate;
}

function buildProviderName(item: AppointmentItem | null) {
  if (!item) return '';
  const fullName = [
    item.renderingProviderFirstName,
    item.renderingProviderMiddleName,
    item.renderingProviderLastName,
  ]
    .filter((part) => !!part && part.trim().length > 0)
    .join(' ')
    .trim();

  return fullName || item.resourceDisplayName || item.resourceName || '';
}

export function AppointmentDetail() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [showRescheduleError, setShowRescheduleError] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError(t('appointments.missingAppointmentId'));
      setLoading(false);
      return;
    }

    const personId = pickPersonId(user?.id);

    fetchAppointmentById(id, personId)
      .then((item) => {
        if (!item) {
          setError(t('appointments.appointmentNotFound'));
          return;
        }
        setAppointment(item);
      })
      .catch(() => setError(t('appointments.failedToLoad')))
      .finally(() => setLoading(false));
  }, [id, t, user?.id]);

  const appointmentDate = useMemo(() => buildDateFromPayload(appointment), [appointment]);

  const displayTime = appointmentDate
    ? appointmentDate.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })
    : '--:--';
  const displayDate = appointmentDate
    ? appointmentDate.toLocaleDateString(i18n.language, { month: 'short', day: '2-digit' }).toUpperCase()
    : '--';
  const displayYear = appointmentDate ? String(appointmentDate.getFullYear()) : '----';

  const appointmentType = appointment?.isTelemedicine || !!appointment?.virtualVisitLink
    ? t('schedule.telemedicine')
    : t('schedule.inPerson');
  const appointmentStatus = appointment?.workflowStatus || appointment?.status || t('appointments.notAvailable');
  const providerName = buildProviderName(appointment) || t('appointments.provider');
  const clinicName = appointment?.locationName || t('appointments.notAvailable');
  const eventName = appointment?.eventName || t('appointments.notAvailable');

  const fabActions = [
    { icon: <Phone size={18} />, label: t('appointments.connect'), color: '#14b8a6', onClick: () => {} },
    { icon: <Check size={18} />, label: t('appointments.confirmArrival'), color: '#0d9488', onClick: () => {} },
    { icon: <RefreshCw size={18} />, label: t('appointments.reschedule'), color: '#f97316', onClick: () => setShowRescheduleError(true) },
    { icon: <MapPin size={18} />, label: t('appointments.location'), color: '#f97316', onClick: () => {} },
    { icon: <Calendar size={18} />, label: t('appointments.addToCalendar'), color: '#f97316', onClick: () => {} },
    ...(appointment?.isTelemedicine
      ? [{ icon: <Video size={18} />, label: t('appointments.startTeleconsultation'), color: '#fb923c', onClick: () => {} }]
      : []),
    ...(isAppointmentFabPaymentEnabled()
      ? [{ icon: <CreditCard size={18} />, label: t('payment.title'), color: '#d4a574', onClick: () => navigate('/schedule/payment-form') }]
      : []),
  ];

  return (
    <div className={styles.container}>
      <Header title={t('appointments.detailsTitle')} showBackButton variant="primary" />

      <div className={styles.detailContent}>
        {loading ? (
          <div className={styles.empty}>
            <p>{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className={styles.empty}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className={styles.dateDisplay}>
              <span className={styles.displayTime}>{displayTime}</span>
              <span className={styles.displayDate}>{displayDate}</span>
              <span className={styles.displayYear}>{displayYear}</span>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t('appointments.provider')}</span>
                <span className={styles.infoValue}>{providerName}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t('appointments.clinic')}</span>
                <div className={styles.infoRow}>
                  <span className={styles.infoValue}>{clinicName}</span>
                  <MapPin size={20} className={styles.infoIcon} />
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t('schedule.consultation')}</span>
                <span className={styles.infoValue}>{eventName}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t('appointments.statusLabel')}</span>
                <span className={styles.infoValue}>{appointmentStatus}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{t('appointments.typeLabel')}</span>
                <span className={styles.infoValue}>{appointmentType}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {isAppointmentFabEnabled() && (
        <>
          <FAB actions={fabActions} />

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
        </>
      )}
    </div>
  );
}
