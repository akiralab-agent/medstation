import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  CalendarPlus,
  TrendingUp,
  Activity,
  Clock,
  ChevronRight,
  User,
  Shield
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

const quickActions: QuickAction[] = [
  { 
    id: 'exams', 
    icon: FileText, 
    label: 'Exam Results', 
    description: 'View your lab results',
    path: '/exams',
    color: 'primary'
  },
  { 
    id: 'profile', 
    icon: User, 
    label: 'My Profile', 
    description: 'View your information',
    path: '/profile',
    color: 'primary'
  },
  { 
    id: 'schedule', 
    icon: Calendar, 
    label: 'My Appointments', 
    description: 'Manage your visits',
    path: '/appointments',
    color: 'primary'
  },
  { 
    id: 'newSchedule', 
    icon: CalendarPlus, 
    label: 'Book Appointment', 
    description: 'Schedule a new visit',
    path: '/schedule/new',
    color: 'primary'
  },
];

function formatTime(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const recentActivity = [
  { id: '1', text: 'Blood test results uploaded', time: '2 hours ago', icon: FileText },
  { id: '2', text: 'Appointment confirmed with Dr. Johnson', time: '5 hours ago', icon: Calendar },
  { id: '3', text: 'Prescription renewed', time: '1 day ago', icon: Activity },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentItem[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

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
          .filter((apt) => apt.appointmentDateTime && new Date(apt.appointmentDateTime) >= now)
          .sort((a, b) => (a.appointmentDateTime ?? '').localeCompare(b.appointmentDateTime ?? ''));
        setUpcomingAppointments(upcoming.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoadingAppointments(false));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={styles.dashboard}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.greeting}>
            <h1 className={styles.greetingText}>
              {getGreeting()}, <span>{user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className={styles.greetingSubtext}>
              Here&apos;s what&apos;s happening with your health today
            </p>
          </div>

        </div>

        {/* Main Grid */}
        <div className={styles.mainGrid}>
          {/* Quick Actions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
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

          {/* Upcoming Appointments */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Upcoming Appointments</h2>
              <button className={styles.viewAllBtn} onClick={() => navigate('/appointments')}>
                View all
              </button>
            </div>
            <div className={styles.appointmentsList}>
              {loadingAppointments ? (
                <p style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--font-sm)' }}>Loading...</p>
              ) : upcomingAppointments.length === 0 ? (
                <p style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--font-sm)' }}>No upcoming appointments</p>
              ) : (
                upcomingAppointments.map((apt) => {
                  const dt = apt.appointmentDateTime ? new Date(apt.appointmentDateTime) : null;
                  return (
                    <div key={apt.id} className={styles.appointmentItem} onClick={() => navigate(`/appointments/${apt.id}`)} style={{ cursor: 'pointer' }}>
                      <div className={styles.appointmentDate}>
                        <span className={styles.dateDay}>
                          {dt?.getDate() ?? '—'}
                        </span>
                        <span className={styles.dateMonth}>
                          {dt?.toLocaleString('default', { month: 'short' }).toUpperCase() ?? ''}
                        </span>
                      </div>
                      <div className={styles.appointmentDetails}>
                        <h3 className={styles.doctorName}>{apt.resourceName || 'Provider'}</h3>
                        <p className={styles.specialty}>{apt.eventName || ''}</p>
                        <div className={styles.appointmentMeta}>
                          <span className={styles.metaItem}>
                            <Clock size={14} />
                            {formatTime(apt.appointmentDateTime)}
                          </span>
                          <span className={styles.metaItem}>
                            <Shield size={14} />
                            {apt.locationName || ''}
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

        {/* Secondary Grid */}
        <div className={styles.secondaryGrid}>
          {/* Health Overview */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Health Overview</h2>
            <div className={styles.healthCard}>
              <div className={styles.healthScore}>
                <div className={styles.scoreCircle}>
                  <span className={styles.scoreValue}>94</span>
                  <span className={styles.scoreLabel}>Score</span>
                </div>
                <div className={styles.scoreInfo}>
                  <p className={styles.scoreTitle}>Excellent</p>
                  <p className={styles.scoreDesc}>Your health is in great shape!</p>
                  <div className={styles.scoreTrend}>
                    <TrendingUp size={16} />
                    <span>+5% from last month</span>
                  </div>
                </div>
              </div>
              <div className={styles.healthMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>72 kg</span>
                  <span className={styles.metricLabel}>Weight</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>120/80</span>
                  <span className={styles.metricLabel}>Blood Pressure</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>72 bpm</span>
                  <span className={styles.metricLabel}>Heart Rate</span>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <div className={styles.activityList}>
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <Icon size={18} />
                    </div>
                    <div className={styles.activityInfo}>
                      <p className={styles.activityText}>{activity.text}</p>
                      <span className={styles.activityTime}>{activity.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
