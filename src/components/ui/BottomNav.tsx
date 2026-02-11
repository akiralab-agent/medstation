import { useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, CalendarClock, Heart, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from './Badge';
import styles from './BottomNav.module.css';

interface NavItem {
  id: string;
  icon: typeof Smartphone;
  label: string;
  path: string;
  badge?: number;
}

interface BottomNavProps {
  notificationCount?: number;
}

export function BottomNav({ notificationCount = 0 }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const navItems: NavItem[] = [
    { id: 'home', icon: Smartphone, label: t('nav.home'), path: '/dashboard' },
    { id: 'schedule', icon: CalendarClock, label: t('nav.schedule'), path: '/schedule' },
    { id: 'health', icon: Heart, label: t('nav.health'), path: '/health' },
    { id: 'profile', icon: User, label: t('profile.title'), path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        const showBadge = item.id === 'home' && notificationCount > 0;

        return (
          <button
            key={item.id}
            className={`${styles.navItem} ${active ? styles.active : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className={styles.iconWrapper}>
              <Icon size={24} />
              {showBadge && <Badge count={notificationCount} />}
            </div>
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
