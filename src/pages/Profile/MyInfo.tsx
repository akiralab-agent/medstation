import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Key, FileCheck, Trash2, Camera, type LucideIcon } from 'lucide-react';
import { Header, ListItem } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import {
  isProfileChangePasswordEnabled,
  isProfileDeleteAccountEnabled,
  isProfileTermsOfUseEnabled,
} from '../../services/featureFlags';
import styles from './Profile.module.css';

export function MyInfo() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const showChangePassword = isProfileChangePasswordEnabled();
  const showTermsOfUse = isProfileTermsOfUseEnabled();
  const showDeleteAccount = isProfileDeleteAccountEnabled();
  const menuItems: Array<{ id: string; icon: LucideIcon; label: string; path: string }> = [
    { id: 'personal', icon: FileText, label: t('profile.personalData'), path: '/profile/personal' },
  ];
  if (showChangePassword) {
    menuItems.push({ id: 'password', icon: Key, label: t('profile.changePassword'), path: '/profile/change-password' });
  }
  if (showTermsOfUse) {
    menuItems.push({ id: 'terms', icon: FileCheck, label: t('profile.termOfUse'), path: '/profile/terms' });
  }
  if (showDeleteAccount) {
    menuItems.push({ id: 'delete', icon: Trash2, label: t('profile.deleteAccount'), path: '/profile/delete-account' });
  }

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
      <Header title={t('profile.myInfo')} showBackButton />

      <div className={styles.profileHeader}>
        <div className={styles.avatarLarge}>
          {user?.name ? getInitials(user.name) : 'U'}
          <button className={styles.cameraButton} aria-label={t('profile.changePhoto')}>
            <Camera size={16} />
          </button>
        </div>
        <h2 className={styles.profileName}>{user?.name || t('common.user')}</h2>
      </div>

      <div className={styles.menuCard}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <ListItem
              key={item.id}
              leftIcon={<Icon size={20} />}
              title={item.label}
              onClick={() => navigate(item.path)}
              divider={index < menuItems.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}
