import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Heart, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { LanguageSelector } from './LanguageSelector';
import { isHealthPageEnabled, isUserMenuSettingsEnabled } from '../../services/featureFlags';
import styles from './Navbar.module.css';

interface NavItem {
  id: string;
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
}

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationBtnRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const showHealthPage = isHealthPageEnabled();
  const showUserMenuSettings = isUserMenuSettingsEnabled();
  const navItems: NavItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard'), path: '/dashboard' },
    { id: 'appointments', icon: CalendarClock, label: t('nav.appointments'), path: '/appointments' },
    { id: 'exams', icon: Shield, label: t('nav.exams'), path: '/exams' },
  ];
  if (showHealthPage) {
    navItems.splice(2, 0, { id: 'health', icon: Heart, label: t('nav.health'), path: '/health' });
  }

  const notificationCount = 0;

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/dashboard" className={styles.logo}>
          <img 
            src="/Medstation-Logo_1200px.png" 
            alt="MedStation" 
            className={styles.logoImage}
          />
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`${styles.navLink} ${active ? styles.active : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Notification Button with Dropdown */}
          <div className={styles.notificationWrapper}>
            <button 
              ref={notificationBtnRef}
              className={styles.notificationBtn}
              onClick={(e) => {
                e.stopPropagation();
                setNotificationOpen((prev) => !prev);
              }}
              aria-label={t('notifications.title')}
              aria-expanded={notificationOpen}
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className={styles.badge}>{notificationCount}</span>
              )}
            </button>

            {/* Notification Dropdown - positioned relative to bell */}
            <NotificationDropdown 
              isOpen={notificationOpen}
              onClose={() => setNotificationOpen(false)}
              triggerRef={notificationBtnRef}
            />
          </div>

          <LanguageSelector />

          {/* User Menu */}
          <div className={styles.userMenuWrapper} ref={userMenuRef}>
            <button 
              className={styles.userMenu}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className={styles.avatar}>{userInitials}</div>
              <span className={styles.userName}>{user?.name || t('common.user')}</span>
              <ChevronDown size={16} />
            </button>

            <div className={`${styles.dropdown} ${userMenuOpen ? styles.dropdownOpen : ''}`}>
              <Link to="/profile" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                <User size={18} />
                {t('profile.title')}
              </Link>
              {showUserMenuSettings && (
                <Link to="/profile/settings" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                  <Settings size={18} />
                  {t('common.settings')}
                </Link>
              )}
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={handleLogout}>
                <LogOut size={18} />
                {t('common.signOut')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
