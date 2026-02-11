import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  X,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import styles from './NotificationDropdown.module.css';

interface NotificationAction {
  labelKey: string;
  variant: 'primary' | 'secondary' | 'text';
  action: string;
}

interface Notification {
  id: string;
  type: 'booking' | 'appointment' | 'exam' | 'canceled' | 'warning' | 'info';
  titleKey: string;
  descriptionKey: string;
  timeKey: string;
  unread: boolean;
  actions?: NotificationAction[];
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    titleKey: 'notifications.items.finishBooking.title',
    descriptionKey: 'notifications.items.finishBooking.description',
    timeKey: 'notifications.items.finishBooking.time',
    unread: true,
    actions: [
      { labelKey: 'common.cancel', variant: 'text', action: 'cancel' },
      { labelKey: 'notifications.finishNow', variant: 'primary', action: 'finish' },
    ],
  },
  {
    id: '2',
    type: 'appointment',
    titleKey: 'notifications.items.appointmentConfirmed.title',
    descriptionKey: 'notifications.items.appointmentConfirmed.description',
    timeKey: 'notifications.items.appointmentConfirmed.time',
    unread: true,
    actions: [{ labelKey: 'common.view', variant: 'primary', action: 'view' }],
  },
  {
    id: '3',
    type: 'exam',
    titleKey: 'notifications.items.newExamResult.title',
    descriptionKey: 'notifications.items.newExamResult.description',
    timeKey: 'notifications.items.newExamResult.time',
    unread: true,
    actions: [{ labelKey: 'common.view', variant: 'primary', action: 'view' }],
  },
  {
    id: '4',
    type: 'canceled',
    titleKey: 'notifications.items.appointmentCanceled.title',
    descriptionKey: 'notifications.items.appointmentCanceled.description',
    timeKey: 'notifications.items.appointmentCanceled.time',
    unread: false,
    actions: [{ labelKey: 'appointments.reschedule', variant: 'primary', action: 'new' }],
  },
  {
    id: '5',
    type: 'warning',
    titleKey: 'notifications.items.paymentRequired.title',
    descriptionKey: 'notifications.items.paymentRequired.description',
    timeKey: 'notifications.items.paymentRequired.time',
    unread: false,
    actions: [
      { labelKey: 'common.cancel', variant: 'text', action: 'cancel' },
      { labelKey: 'payment.payNow', variant: 'primary', action: 'finish' },
    ],
  },
];

const iconMap = {
  booking: Calendar,
  appointment: CheckCircle2,
  exam: FileText,
  canceled: X,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  booking: 'blue',
  appointment: 'green',
  exam: 'purple',
  canceled: 'red',
  warning: 'amber',
  info: 'blue',
};

export function NotificationDropdown({ isOpen, onClose, triggerRef }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef?.current && triggerRef.current.contains(target)) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const handleAction = (notificationId: string, action: string) => {
    console.log(`Action ${action} on notification ${notificationId}`);
    if (action === 'view') {
      navigate('/exams/1');
    } else if (action === 'new' || action === 'finish') {
      navigate('/schedule/new');
    }
    onClose();
  };

  const handleViewAll = () => {
    navigate('/notifications');
    onClose();
  };

  const unreadCount = mockNotifications.filter((notification) => notification.unread).length;

  return (
    <div ref={dropdownRef} className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>
          {t('notifications.title')}
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </h2>
        <div className={styles.headerActions}>
          {unreadCount > 0 && (
            <button className={styles.markAllBtn} onClick={() => console.log('Mark all read')}>
              {t('notifications.markAllRead')}
            </button>
          )}
          <button className={styles.closeBtn} onClick={onClose} aria-label={t('common.close')}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {mockNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Bell size={24} />
            </div>
            <h3 className={styles.emptyTitle}>{t('notifications.emptyTitle')}</h3>
            <p className={styles.emptyText}>{t('notifications.emptyText')}</p>
          </div>
        ) : (
          mockNotifications.map((notification) => {
            const Icon = iconMap[notification.type];
            const colorClass = colorMap[notification.type];

            return (
              <div
                key={notification.id}
                className={`${styles.notification} ${notification.unread ? styles.unread : ''}`}
              >
                <div className={`${styles.iconWrapper} ${styles[colorClass]}`}>
                  <Icon size={18} />
                </div>
                <div className={styles.notificationContent}>
                  <div className={styles.notificationHeader}>
                    <h3 className={styles.notificationTitle}>{t(notification.titleKey)}</h3>
                    <span className={styles.notificationTime}>{t(notification.timeKey)}</span>
                  </div>
                  <p className={styles.notificationText}>{t(notification.descriptionKey)}</p>
                  {notification.actions && (
                    <div className={styles.notificationActions}>
                      {notification.actions.map((action, index) => (
                        <button
                          key={index}
                          className={`${styles.actionBtn} ${styles[action.variant]}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAction(notification.id, action.action);
                          }}
                        >
                          {t(action.labelKey)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {mockNotifications.length > 0 && (
        <div className={styles.footer}>
          <button className={styles.viewAllLink} onClick={handleViewAll}>
            {t('notifications.viewAll')}
          </button>
        </div>
      )}
    </div>
  );
}
