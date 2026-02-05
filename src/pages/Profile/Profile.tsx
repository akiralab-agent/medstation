import { useNavigate } from 'react-router-dom';
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
import styles from './Profile.module.css';

const menuItems = [
  { id: 'myinfo', icon: FileText, label: 'My Info', path: '/profile/info' },
  { id: 'programs', icon: BarChart3, label: 'My Programs', path: '/profile/programs' },
  { id: 'health', icon: Heart, label: 'Health Authorization', path: '/health' },
  { id: 'dashboard', icon: Settings, label: 'Dashboard Settings', path: '/profile/dashboard-settings' },
  { id: 'identity', icon: Camera, label: 'Confirm Identity', path: '/profile/identity' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/profile/notifications' },
];

export function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className={styles.container}>
      <Header title="Profile" variant="primary" />

      <div className={styles.userCard}>
        <div className={styles.avatar}>
          {user?.name ? getInitials(user.name) : 'U'}
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{user?.name || 'User'}</h2>
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
          title="Log Out"
          onClick={() => setShowLogoutModal(true)}
          divider={false}
        />
      </div>

      <Modal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        type="confirm"
        title="LOG OUT"
        message="Are you sure you want to log out?"
        primaryAction={{ label: 'Yes, Log Out', onClick: handleLogout }}
        secondaryAction={{ label: 'Cancel', onClick: () => setShowLogoutModal(false) }}
      />
    </div>
  );
}
