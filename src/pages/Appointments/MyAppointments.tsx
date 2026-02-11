import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Card, Tabs } from '../../components/ui';
import { fetchAppointmentsByPerson, type AppointmentItem } from '../../services/appointments';
import styles from './Appointments.module.css';

function isUpcoming(dateString?: string) {
  if (!dateString) {
    return false;
  }
  return new Date(dateString) >= new Date();
}

export function MyAppointments() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabs = [
    { id: 'upcoming', label: t('appointments.upcoming') },
    { id: 'past', label: t('appointments.past') },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const personId = import.meta.env.VITE_PERSON_ID?.trim();
    if (!personId) {
      setError(t('appointments.missingPersonId'));
      setLoading(false);
      return;
    }

    fetchAppointmentsByPerson(personId)
      .then(setAppointments)
      .catch(() => setError(t('appointments.failedToLoad')))
      .finally(() => setLoading(false));
  }, [t]);

  const filtered = appointments.filter((appointment) => {
    const upcoming = isUpcoming(appointment.appointmentDateTime);
    return activeTab === 'upcoming' ? upcoming : !upcoming;
  });

  return (
    <div className={styles.container}>
      <Header
        title={t('appointments.myAppointments')}
        showBackButton
        variant="primary"
        rightActions={['book']}
        onActionClick={() => navigate('/schedule/new')}
      />

      <div className={styles.tabsWrapper}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="dark" />
      </div>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>
            <p>{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className={styles.empty}>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>{t('appointments.noAppointmentsFound')}</p>
          </div>
        ) : (
          filtered.map((appointment) => (
            <Card
              key={appointment.id}
              padding="medium"
              onClick={() => navigate(`/appointments/${appointment.id}`)}
              className={styles.appointmentCard}
            >
              <div className={styles.dateTime}>
                <span className={styles.date}>{formatDate(appointment.appointmentDateTime)}</span>
                <span className={styles.time}>{formatTime(appointment.appointmentDateTime)}</span>
              </div>
              <div className={styles.info}>
                <div className={styles.infoHeader}>
                  <h3 className={styles.doctor}>{appointment.resourceName || t('appointments.provider')}</h3>
                  <span className={`${styles.statusBadge} ${isUpcoming(appointment.appointmentDateTime) ? styles.upcoming : styles.completed}`}>
                    {isUpcoming(appointment.appointmentDateTime) ? t('appointments.upcoming') : t('appointments.completed')}
                  </span>
                </div>
                <p className={styles.specialty}>{appointment.eventName || ''}</p>
                <p className={styles.clinic}>{appointment.locationName || ''}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
