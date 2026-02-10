import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Tabs } from '../../components/ui';
import { fetchAppointmentsByPerson, type AppointmentItem } from '../../services/appointments';
import styles from './Appointments.module.css';

const tabs = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
];

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function formatTime(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function isUpcoming(dateString?: string) {
  if (!dateString) return false;
  return new Date(dateString) >= new Date();
}

export function MyAppointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const personId = import.meta.env.VITE_PERSON_ID?.trim();
    if (!personId) {
      setError('Missing VITE_PERSON_ID');
      setLoading(false);
      return;
    }

    fetchAppointmentsByPerson(personId)
      .then(setAppointments)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter((apt) => {
    const upcoming = isUpcoming(apt.appointmentDateTime);
    return activeTab === 'upcoming' ? upcoming : !upcoming;
  });

  return (
    <div className={styles.container}>
      <Header
        title="My Appointments"
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
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className={styles.empty}>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No appointments found</p>
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
                  <h3 className={styles.doctor}>{appointment.resourceName || 'Provider'}</h3>
                  <span className={`${styles.statusBadge} ${isUpcoming(appointment.appointmentDateTime) ? styles.upcoming : styles.completed}`}>
                    {isUpcoming(appointment.appointmentDateTime) ? 'Upcoming' : 'Completed'}
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
