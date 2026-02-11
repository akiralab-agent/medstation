import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Card, Button } from '../../components/ui';
import styles from './Notifications.module.css';

interface NotificationAction {
  labelKey: string;
  variant: 'success' | 'text' | 'secondary';
  action: string;
}

interface Notification {
  id: string;
  type: 'booking' | 'appointment' | 'exam' | 'canceled' | 'warning';
  titleKey: string;
  descriptionKey: string;
  date: Date;
  actions?: NotificationAction[];
}

const borderColors: Record<Notification['type'], string> = {
  booking: 'var(--color-primary-700)',
  appointment: 'var(--color-highlight)',
  exam: 'var(--color-highlight)',
  canceled: 'var(--color-warning)',
  warning: 'var(--color-warning)',
};

export function Notifications() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'booking',
      titleKey: 'notifications.items.finishBooking.title',
      descriptionKey: 'notifications.items.finishBooking.description',
      date: new Date('2026-01-06T14:00:00'),
      actions: [
        { labelKey: 'notifications.cancelAppointment', variant: 'text', action: 'cancel' },
        { labelKey: 'notifications.finishNow', variant: 'success', action: 'finish' },
      ],
    },
    {
      id: '2',
      type: 'appointment',
      titleKey: 'notifications.items.newAppointmentScheduled.title',
      descriptionKey: 'notifications.items.newAppointmentScheduled.description',
      date: new Date('2026-01-08T10:00:00'),
      actions: [{ labelKey: 'common.edit', variant: 'success', action: 'edit' }],
    },
    {
      id: '3',
      type: 'exam',
      titleKey: 'notifications.items.newExamResult.title',
      descriptionKey: 'notifications.items.newExamResult.description',
      date: new Date('2026-01-05T09:00:00'),
      actions: [{ labelKey: 'notifications.viewNow', variant: 'success', action: 'view' }],
    },
    {
      id: '4',
      type: 'canceled',
      titleKey: 'notifications.items.appointmentCanceled.title',
      descriptionKey: 'notifications.items.pageAppointmentCanceled.description',
      date: new Date('2026-01-04T15:30:00'),
      actions: [{ labelKey: 'notifications.newAppointment', variant: 'success', action: 'new' }],
    },
    {
      id: '5',
      type: 'warning',
      titleKey: 'notifications.items.appointmentWillBeCanceled.title',
      descriptionKey: 'notifications.items.appointmentWillBeCanceled.description',
      date: new Date('2026-01-03T11:00:00'),
      actions: [
        { labelKey: 'notifications.cancelAppointment', variant: 'text', action: 'cancel' },
        { labelKey: 'notifications.finishNow', variant: 'success', action: 'finish' },
      ],
    },
  ];
  const [notifications] = useState<Notification[]>(mockNotifications);

  const formatDateTime = (date: Date) =>
    date.toLocaleString(i18n.language, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

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
      <Header title={t('notifications.title')} showBackButton />

      <div className={styles.list}>
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            leftBorderColor={borderColors[notification.type]}
            padding="medium"
            className={styles.notificationCard}
          >
            <h3 className={styles.title}>{t(notification.titleKey)}</h3>
            <p className={styles.description}>{t(notification.descriptionKey)}</p>
            <p className={styles.date}>{formatDateTime(notification.date)}</p>
            {notification.actions && (
              <div className={styles.actions}>
                {notification.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    size="small"
                    onClick={() => handleAction(notification.id, action.action)}
                  >
                    {t(action.labelKey)}
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
