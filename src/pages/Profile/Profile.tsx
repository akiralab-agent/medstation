import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  BarChart3,
  Heart,
  Settings,
  Camera,
  Bell,
  LogOut,
} from 'lucide-react';
import { Header, ListItem, Modal } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import {
  isHealthPageEnabled,
  isProfileConfirmIdentityEnabled,
  isProfileDashboardSettingsEnabled,
  isProfileMyProgramsEnabled,
  isProfileNotificationsEnabled,
} from '../../services/featureFlags';
import styles from './Profile.module.css';

export function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const showHealthPage = isHealthPageEnabled();
  const showMyPrograms = isProfileMyProgramsEnabled();
  const showDashboardSettings = isProfileDashboardSettingsEnabled();
  const showConfirmIdentity = isProfileConfirmIdentityEnabled();
  const showProfileNotifications = isProfileNotificationsEnabled();
  const menuItems = [
    { id: 'myinfo', icon: FileText, label: t('profile.myInfo'), path: '/profile/info' },
  ];
  if (showMyPrograms) {
    menuItems.push({ id: 'programs', icon: BarChart3, label: t('profile.myPrograms'), path: '/profile/programs' });
  }
  if (showHealthPage) {
    menuItems.push({ id: 'health', icon: Heart, label: t('profile.healthAuthorization'), path: '/health' });
  }
  if (showDashboardSettings) {
    menuItems.push({ id: 'dashboard', icon: Settings, label: t('profile.dashboardSettings'), path: '/profile/dashboard-settings' });
  }
  if (showConfirmIdentity) {
    menuItems.push({ id: 'identity', icon: Camera, label: t('profile.confirmIdentity'), path: '/profile/identity' });
  }
  if (showProfileNotifications) {
    menuItems.push({ id: 'notifications', icon: Bell, label: t('notifications.title'), path: '/profile/notifications' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((namePart) => namePart[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className={styles.container}>
      <Header title={t('profile.title')} variant="primary" />

      <div className={styles.userCard}>
        <div className={styles.avatar}>
          {user?.name ? getInitials(user.name) : 'U'}
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{user?.name || t('common.user')}</h2>
          <p className={styles.userEmail}>{user?.email || 'user@email.com'}</p>
        </div>
      </div>

      <div className={styles.menuCard}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem
              key={item.id}
              leftIcon={<Icon size={20} />}
              title={item.label}
              onClick={() => navigate(item.path)}
            />
          );
        })}
        <ListItem
          leftIcon={<LogOut size={20} />}
          title={t('common.logOut')}
          onClick={() => setShowLogoutModal(true)}
          divider={false}
        />
      </div>

      <Modal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        type="confirm"
        title={t('profile.logOutTitle')}
        message={t('profile.logOutMessage')}
        primaryAction={{ label: t('profile.logOutConfirm'), onClick: handleLogout }}
        secondaryAction={{ label: t('common.cancel'), onClick: () => setShowLogoutModal(false) }}
      />
    </div>
  );
}
