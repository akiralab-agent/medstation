import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle2,
  Info
} from 'lucide-react';
import styles from './NotificationDropdown.module.css';

interface Notification {
  id: string;
  type: 'booking' | 'appointment' | 'exam' | 'canceled' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  actions?: { label: string; variant: 'primary' | 'secondary' | 'text'; action: string }[];
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
    title: 'Finish your booking',
    description: "You're almost there! Complete your appointment booking now.",
    time: '2 min ago',
    unread: true,
    actions: [
      { label: 'Cancel', variant: 'text', action: 'cancel' },
      { label: 'Finish', variant: 'primary', action: 'finish' },
    ],
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Appointment confirmed',
    description: 'Your telemedicine appointment has been confirmed for tomorrow.',
    time: '1 hour ago',
    unread: true,
    actions: [{ label: 'View', variant: 'primary', action: 'view' }],
  },
  {
    id: '3',
    type: 'exam',
    title: 'New exam result available',
    description: 'Your blood test results are now available for review.',
    time: '3 hours ago',
    unread: true,
    actions: [{ label: 'View', variant: 'primary', action: 'view' }],
  },
  {
    id: '4',
    type: 'canceled',
    title: 'Appointment canceled',
    description: 'Your appointment on Jan 4 has been canceled by the doctor.',
    time: '1 day ago',
    unread: false,
    actions: [{ label: 'Reschedule', variant: 'primary', action: 'new' }],
  },
  {
    id: '5',
    type: 'warning',
    title: 'Payment required',
    description: 'Complete payment within 24 hours to keep your appointment.',
    time: '2 days ago',
    unread: false,
    actions: [
      { label: 'Cancel', variant: 'text', action: 'cancel' },
      { label: 'Pay now', variant: 'primary', action: 'finish' },
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside (ignore clicks on trigger)
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

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <div ref={dropdownRef} className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>
          Notifications
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </h2>
        <div className={styles.headerActions}>
          {unreadCount > 0 && (
            <button className={styles.markAllBtn} onClick={() => console.log('Mark all read')}>
              Mark all read
            </button>
          )}
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {mockNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Bell size={24} />
            </div>
            <h3 className={styles.emptyTitle}>No notifications</h3>
            <p className={styles.emptyText}>You&apos;re all caught up!</p>
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
                    <h3 className={styles.notificationTitle}>{notification.title}</h3>
                    <span className={styles.notificationTime}>{notification.time}</span>
                  </div>
                  <p className={styles.notificationText}>{notification.description}</p>
                  {notification.actions && (
                    <div className={styles.notificationActions}>
                      {notification.actions.map((action, index) => (
                        <button
                          key={index}
                          className={`${styles.actionBtn} ${styles[action.variant]}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(notification.id, action.action);
                          }}
                        >
                          {action.label}
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

      {/* Footer */}
      {mockNotifications.length > 0 && (
        <div className={styles.footer}>
          <button className={styles.viewAllLink} onClick={handleViewAll}>
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
