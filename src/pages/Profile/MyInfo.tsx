import { useNavigate } from 'react-router-dom';
import { FileText, Key, FileCheck, Trash2, Camera } from 'lucide-react';
import { Header, ListItem } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Profile.module.css';

const menuItems = [
  { id: 'personal', icon: FileText, label: 'Personal Data', path: '/profile/personal' },
  { id: 'password', icon: Key, label: 'Change Password', path: '/profile/change-password' },
  { id: 'terms', icon: FileCheck, label: 'Term of Use', path: '/profile/terms' },
  { id: 'delete', icon: Trash2, label: 'Delete Account', path: '/profile/delete-account' },
];

export function MyInfo() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <Header title="My Info" showBackButton />

      <div className={styles.profileHeader}>
        <div className={styles.avatarLarge}>
          {user?.name ? getInitials(user.name) : 'U'}
          <button className={styles.cameraButton}>
            <Camera size={16} />
          </button>
        </div>
        <h2 className={styles.profileName}>{user?.name || 'User'}</h2>
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
              divider={item.id !== 'delete'}
            />
          );
        })}
      </div>
    </div>
  );
}
