import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Tabs } from '../../components/ui';
import styles from './Appointments.module.css';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  clinic: string;
  type: 'in-person' | 'telemedicine';
  status: 'upcoming' | 'completed' | 'canceled';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: 'Sep 04, 2026',
    time: '03:30 PM',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    clinic: 'Miami Medical Center',
    type: 'in-person',
    status: 'upcoming',
  },
  {
    id: '2',
    date: 'Sep 10, 2026',
    time: '10:00 AM',
    doctor: 'Dr. Michael Chen',
    specialty: 'General Practice',
    clinic: 'Health Plus Clinic',
    type: 'telemedicine',
    status: 'upcoming',
  },
  {
    id: '3',
    date: 'Sep 15, 2026',
    time: '02:00 PM',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    clinic: 'Skin Care Center',
    type: 'in-person',
    status: 'upcoming',
  },
  {
    id: '4',
    date: 'Sep 20, 2026',
    time: '09:00 AM',
    doctor: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    clinic: 'City Hospital',
    type: 'in-person',
    status: 'upcoming',
  },
  {
    id: '5',
    date: 'Aug 20, 2026',
    time: '02:00 PM',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    clinic: 'Skin Care Center',
    type: 'in-person',
    status: 'completed',
  },
  {
    id: '6',
    date: 'Aug 15, 2026',
    time: '11:00 AM',
    doctor: 'Dr. Maria Santos',
    specialty: 'Pediatrics',
    clinic: 'Children Clinic',
    type: 'telemedicine',
    status: 'completed',
  },
  {
    id: '7',
    date: 'Aug 10, 2026',
    time: '03:00 PM',
    doctor: 'Dr. Robert Brown',
    specialty: 'Neurology',
    clinic: 'Neuro Center',
    type: 'in-person',
    status: 'completed',
  },
  {
    id: '8',
    date: 'Aug 05, 2026',
    time: '10:30 AM',
    doctor: 'Dr. Lisa Anderson',
    specialty: 'Gynecology',
    clinic: 'Women Health Center',
    type: 'in-person',
    status: 'canceled',
  },
];

const tabs = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
];

const statusLabels: Record<Appointment['status'], string> = {
  upcoming: 'Upcoming',
  completed: 'Completed',
  canceled: 'Canceled',
};

export function MyAppointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredAppointments = mockAppointments.filter((apt) =>
    activeTab === 'upcoming' ? apt.status === 'upcoming' : apt.status !== 'upcoming'
  );

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
        {filteredAppointments.length === 0 ? (
          <div className={styles.empty}>
            <p>No appointments found</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              padding="medium"
              onClick={() => navigate(`/appointments/${appointment.id}`)}
              className={styles.appointmentCard}
            >
              <div className={styles.dateTime}>
                <span className={styles.date}>{appointment.date}</span>
                <span className={styles.time}>{appointment.time}</span>
              </div>
              <div className={styles.info}>
                <div className={styles.infoHeader}>
                  <h3 className={styles.doctor}>{appointment.doctor}</h3>
                  <span className={`${styles.statusBadge} ${styles[appointment.status]}`}>
                    {statusLabels[appointment.status]}
                  </span>
                </div>
                <p className={styles.specialty}>{appointment.specialty}</p>
                <p className={styles.clinic}>{appointment.clinic}</p>
                <div className={styles.metaRow}>
                  <span className={`${styles.typeBadge} ${styles[appointment.type]}`}>
                    {appointment.type === 'telemedicine' ? 'Online' : 'In-person'}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
