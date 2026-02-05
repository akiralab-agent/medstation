import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Button } from '../../components/ui';
import styles from './Notifications.module.css';

interface Notification {
  id: string;
  type: 'booking' | 'appointment' | 'exam' | 'canceled' | 'warning';
  title: string;
  description: string;
  date: string;
  actions?: { label: string; variant: 'success' | 'text' | 'secondary'; action: string }[];
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Finish your booking',
    description: "You're almost there! Complete your appointment booking now.",
    date: 'Jan - 6 - 2026 - 02:00 PM',
    actions: [
      { label: 'Cancel appointment', variant: 'text', action: 'cancel' },
      { label: 'Finish now', variant: 'success', action: 'finish' },
    ],
  },
  {
    id: '2',
    type: 'appointment',
    title: 'New appointment scheduled',
    description: 'Your telemedicine appointment has been confirmed.',
    date: 'Jan - 8 - 2026 - 10:00 AM',
    actions: [{ label: 'Edit', variant: 'success', action: 'edit' }],
  },
  {
    id: '3',
    type: 'exam',
    title: 'New exam result available',
    description: 'Your blood test results are now available.',
    date: 'Jan - 5 - 2026 - 09:00 AM',
    actions: [{ label: 'View now', variant: 'success', action: 'view' }],
  },
  {
    id: '4',
    type: 'canceled',
    title: 'Appointment canceled',
    description: 'Your appointment on Jan 4 has been canceled.',
    date: 'Jan - 4 - 2026 - 03:30 PM',
    actions: [{ label: 'New appointment', variant: 'success', action: 'new' }],
  },
  {
    id: '5',
    type: 'warning',
    title: 'Appointment will be canceled',
    description: 'Complete payment within 24 hours to keep your appointment.',
    date: 'Jan - 3 - 2026 - 11:00 AM',
    actions: [
      { label: 'Cancel appointment', variant: 'text', action: 'cancel' },
      { label: 'Finish now', variant: 'success', action: 'finish' },
    ],
  },
];

const borderColors: Record<Notification['type'], string> = {
  booking: 'var(--color-primary-700)',
  appointment: 'var(--color-highlight)',
  exam: 'var(--color-highlight)',
  canceled: 'var(--color-warning)',
  warning: 'var(--color-warning)',
};

export function Notifications() {
  const navigate = useNavigate();
  const [notifications] = useState<Notification[]>(mockNotifications);

  const handleAction = (notificationId: string, action: string) => {
    console.log(`Action ${action} on notification ${notificationId}`);
    if (action === 'view') {
      navigate('/exams/1');
    } else if (action === 'new' || action === 'finish') {
      navigate('/schedule/new');
    }
  };

  return (
    <div className={styles.container}>
      <Header title="Notifications" showBackButton />

      <div className={styles.list}>
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            leftBorderColor={borderColors[notification.type]}
            padding="medium"
            className={styles.notificationCard}
          >
            <h3 className={styles.title}>{notification.title}</h3>
            <p className={styles.description}>{notification.description}</p>
            <p className={styles.date}>{notification.date}</p>
            {notification.actions && (
              <div className={styles.actions}>
                {notification.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    size="small"
                    onClick={() => handleAction(notification.id, action.action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
