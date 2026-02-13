import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Calendar,
  CalendarPlus,
  Clock,
  ChevronRight,
  User,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAppointmentsByPerson, type AppointmentItem } from '../../services/appointments';
import styles from './Dashboard.module.css';

interface QuickAction {
  id: string;
  icon: typeof FileText;
  label: string;
  description: string;
  path: string;
  badge?: number;
  color: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentItem[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const quickActions: QuickAction[] = [
    {
      id: 'exams',
      icon: FileText,
      label: t('dashboard.quickActionExamResultsLabel'),
      description: t('dashboard.quickActionExamResultsDescription'),
      path: '/exams',
      color: 'primary',
    },
    {
      id: 'profile',
      icon: User,
      label: t('dashboard.quickActionProfileLabel'),
      description: t('dashboard.quickActionProfileDescription'),
      path: '/profile',
      color: 'primary',
    },
    {
      id: 'schedule',
      icon: Calendar,
      label: t('dashboard.quickActionAppointmentsLabel'),
      description: t('dashboard.quickActionAppointmentsDescription'),
      path: '/appointments',
      color: 'primary',
    },
    {
      id: 'newSchedule',
      icon: CalendarPlus,
      label: t('dashboard.quickActionBookLabel'),
      description: t('dashboard.quickActionBookDescription'),
      path: '/schedule/new',
      color: 'primary',
    },
  ];

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
      setLoadingAppointments(false);
      return;
    }

    fetchAppointmentsByPerson(personId)
      .then((items) => {
        const now = new Date();
        const upcoming = items
          .filter((appointment) => appointment.appointmentDateTime && new Date(appointment.appointmentDateTime) >= now)
          .sort((a, b) => (a.appointmentDateTime ?? '').localeCompare(b.appointmentDateTime ?? ''));
        setUpcomingAppointments(upcoming.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoadingAppointments(false));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return t('dashboard.goodMorning');
    }
    if (hour < 18) {
      return t('dashboard.goodAfternoon');
    }
    return t('dashboard.goodEvening');
  };

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.greeting}>
            <h1 className={styles.greetingText}>
              {getGreeting()}, <span>{user?.name?.split(' ')[0] || t('common.user')}</span>
            </h1>
            <p className={styles.greetingSubtext}>{t('dashboard.greetingSubtext')}</p>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('dashboard.quickActions')}</h2>
            <div className={styles.actionsGrid}>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className={`${styles.actionCard} ${styles[action.color]}`}
                    onClick={() => navigate(action.path)}
                  >
                    <div className={styles.actionIcon}>
                      <Icon size={24} />
                      {action.badge && action.badge > 0 && (
                        <span className={styles.actionBadge}>{action.badge}</span>
                      )}
                    </div>
                    <div className={styles.actionInfo}>
                      <span className={styles.actionLabel}>{action.label}</span>
                      <span className={styles.actionDesc}>{action.description}</span>
                    </div>
                    <ChevronRight size={18} className={styles.actionArrow} />
                  </button>
                );
              })}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t('dashboard.upcomingAppointments')}</h2>
              <button className={styles.viewAllBtn} onClick={() => navigate('/appointments')}>
                {t('common.viewAll')}
              </button>
            </div>
            <div className={styles.appointmentsList}>
              {loadingAppointments ? (
                <p style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--font-sm)' }}>{t('common.loading')}</p>
              ) : upcomingAppointments.length === 0 ? (
                <p style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--font-sm)' }}>{t('appointments.noUpcomingAppointments')}</p>
              ) : (
                upcomingAppointments.map((appointment) => {
                  const dateTime = appointment.appointmentDateTime ? new Date(appointment.appointmentDateTime) : null;
                  return (
                    <div
                      key={appointment.id}
                      className={styles.appointmentItem}
                      onClick={() => navigate(`/appointments/${appointment.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.appointmentDate}>
                        <span className={styles.dateDay}>{dateTime?.getDate() ?? '-'}</span>
                        <span className={styles.dateMonth}>
                          {dateTime?.toLocaleString(i18n.language, { month: 'short' }).toUpperCase() ?? ''}
                        </span>
                      </div>
                      <div className={styles.appointmentDetails}>
                        <h3 className={styles.doctorName}>{appointment.resourceName || t('appointments.provider')}</h3>
                        <p className={styles.specialty}>{appointment.eventName || ''}</p>
                        <div className={styles.appointmentMeta}>
                          <span className={styles.metaItem}>
                            <Clock size={14} />
                            {formatTime(appointment.appointmentDateTime)}
                          </span>
                          <span className={styles.metaItem}>
                            <Shield size={14} />
                            {appointment.locationName || ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
