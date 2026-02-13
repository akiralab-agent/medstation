import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Header, TimeSlot, Modal } from '../../components/ui';
import {
  fetchAvailabilityForDate,
  fetchResourcesByLocation,
  type AvailabilitySlot,
  type ResourceItem,
} from '../../services/scheduling';
import styles from './Schedule.module.css';

interface ChooseScheduleNavigationState {
  type?: 'inperson' | 'telemedicine';
  specialty?: string;
  location?: string;
  locationId?: string;
}

interface SelectedSlot {
  resourceId: string;
  resourceName: string;
  startDateTime: string;
  time: string;
}

const groupSlotsByResource = (slots: AvailabilitySlot[]) =>
  slots.reduce<Record<string, AvailabilitySlot[]>>((accumulator, slot) => {
    const normalizedId = slot.resourceId.trim().toLowerCase();
    if (!accumulator[normalizedId]) {
      accumulator[normalizedId] = [];
    }
    accumulator[normalizedId].push(slot);
    return accumulator;
  }, {});

export function ChooseSchedule() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { t, i18n } = useTranslation();
  const state = (routerLocation.state ?? {}) as ChooseScheduleNavigationState;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [slotsByResource, setSlotsByResource] = useState<Record<string, AvailabilitySlot[]>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [dateAnimation, setDateAnimation] = useState<'slide-left' | 'slide-right' | null>(null);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const selectedLocationId = state.locationId?.trim() || '';
  const selectedLocationName = state.location?.trim() || '';
  const selectedSpecialty = state.specialty?.trim() || t('schedule.specialtyGeneralPractice');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(i18n.language, {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateTime: string) => {
    const parsed = new Date(dateTime);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString(i18n.language, {
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    const compactTime = dateTime.match(/T(\d{2})(\d{2})/);
    if (compactTime) {
      return `${compactTime[1]}:${compactTime[2]}`;
    }

    const regularTime = dateTime.match(/T(\d{2}):(\d{2})/);
    if (regularTime) {
      return `${regularTime[1]}:${regularTime[2]}`;
    }

    return dateTime;
  };

  useEffect(() => {
    let isMounted = true;

    const loadResources = async () => {
      if (!selectedLocationId && !selectedLocationName) {
        setResources([]);
        setResourcesError(t('schedule.selectLocationFirst'));
        return;
      }

      setIsLoadingResources(true);
      setResourcesError(null);

      try {
        const nextResources = await fetchResourcesByLocation({
          locationId: selectedLocationId || undefined,
          address: selectedLocationId ? undefined : selectedLocationName,
          top: 1000,
        });

        if (!isMounted) {
          return;
        }

        setResources(nextResources);
      } catch {
        if (!isMounted) {
          return;
        }

        setResources([]);
        setResourcesError(t('schedule.providersLoadError'));
      } finally {
        if (isMounted) {
          setIsLoadingResources(false);
        }
      }
    };

    void loadResources();

    return () => {
      isMounted = false;
    };
  }, [selectedLocationId, selectedLocationName, t]);

  useEffect(() => {
    let isMounted = true;

    const loadAvailability = async () => {
      if (!selectedLocationId || resources.length === 0) {
        setSlotsByResource({});
        setAvailabilityError(
          selectedLocationId ? null : t('schedule.locationIdRequired')
        );
        return;
      }

      setIsLoadingAvailability(true);
      setAvailabilityError(null);

      try {
        const availabilitySlots = await fetchAvailabilityForDate({
          date: currentDate,
          locationIds: [selectedLocationId],
          resourceIds: resources.map((resource) => resource.id),
          mode: state.type === 'telemedicine' ? 'telemedicine' : 'inperson',
        });

        if (!isMounted) {
          return;
        }

        setSlotsByResource(groupSlotsByResource(availabilitySlots));
      } catch {
        if (!isMounted) {
          return;
        }

        setSlotsByResource({});
        setAvailabilityError(t('schedule.slotsLoadError'));
      } finally {
        if (isMounted) {
          setIsLoadingAvailability(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      isMounted = false;
    };
  }, [currentDate, resources, selectedLocationId, t]);

  const changeDate = (days: number) => {
    setSelectedSlot(null);
    setDateAnimation(days > 0 ? 'slide-left' : 'slide-right');
    setTimeout(() => {
      setCurrentDate((previousDate) => {
        const nextDate = new Date(previousDate);
        nextDate.setDate(nextDate.getDate() + days);
        return nextDate;
      });
      setDateAnimation(null);
    }, 200);
  };

  const toggleFavorite = (resourceId: string) => {
    setFavorites((previous) => ({
      ...previous,
      [resourceId]: !previous[resourceId],
    }));
  };

  const handleTimeSelect = (resource: ResourceItem, slot: AvailabilitySlot) => {
    setSelectedSlot({
      resourceId: resource.id,
      resourceName: resource.resourceDisplayName,
      startDateTime: slot.startDateTime,
      time: formatTime(slot.startDateTime),
    });
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    if (!selectedSlot) {
      return;
    }

    navigate('/schedule/service-type', {
      state: {
        ...state,
        slot: selectedSlot,
        locationId: selectedLocationId,
      },
    });
  };

  const selectedResource = resources.find((resource) => resource.id === selectedSlot?.resourceId);
  const resourcesWithSlots = resources.filter((resource) => {
    const resourceId = resource.id.trim().toLowerCase();
    return (slotsByResource[resourceId] ?? []).length > 0;
  });
  const displayedResources = isLoadingAvailability ? resources : resourcesWithSlots;

  return (
    <div className={styles.container}>
      <Header title={t('schedule.chooseSchedule')} showBackButton variant="primary" />

      <div className={styles.dateNav}>
        <button className={styles.dateNavButton} onClick={() => changeDate(-1)} aria-label={t('common.previous')}>
          <ChevronLeft size={24} />
        </button>
        <span className={`${styles.dateText} ${dateAnimation ? styles[dateAnimation] : ''}`}>
          {formatDate(currentDate)}
        </span>
        <button className={styles.dateNavButton} onClick={() => changeDate(1)} aria-label={t('common.next')}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className={`${styles.doctorList} ${dateAnimation ? styles.animateList : ''}`}>
        {isLoadingResources && (
          <p className={styles.statusMessage}>{t('schedule.loadingProviders')}</p>
        )}
        {resourcesError && <p className={styles.statusMessage}>{resourcesError}</p>}
        {!isLoadingResources && !resourcesError && resources.length === 0 && (
          <p className={styles.statusMessage}>{t('schedule.noProvidersFound')}</p>
        )}
        {availabilityError && <p className={styles.statusMessage}>{availabilityError}</p>}
        {!isLoadingResources && !resourcesError && !isLoadingAvailability && !availabilityError &&
          resources.length > 0 && resourcesWithSlots.length === 0 && (
            <p className={styles.statusMessage}>{t('schedule.noSlotsThisDay')}</p>
          )}

        {displayedResources.map((resource) => {
          const resourceId = resource.id.trim().toLowerCase();
          const resourceSlots = slotsByResource[resourceId] ?? [];

          return (
            <div key={resource.id} className={styles.doctorCard}>
              <div className={styles.doctorHeader}>
                <h3 className={styles.doctorName}>{resource.resourceDisplayName}</h3>
                <button
                  className={`${styles.favoriteButton} ${favorites[resource.id] ? styles.favorited : ''}`}
                  onClick={() => toggleFavorite(resource.id)}
                  aria-label={t('common.favorite')}
                >
                  <Heart size={20} fill={favorites[resource.id] ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className={styles.doctorSpecialty}>{selectedSpecialty}</p>
              <p className={styles.doctorServices}>{t('schedule.consultation')}</p>
              <p className={styles.doctorAddress}>{selectedLocationName || t('schedule.selectedLocation')}</p>

              {isLoadingAvailability ? (
                <p className={styles.noSlots}>{t('schedule.loadingAvailableSlots')}</p>
              ) : (
                <div className={styles.timeSlots}>
                  {resourceSlots.map((slot) => {
                    const slotTime = formatTime(slot.startDateTime);
                    return (
                      <TimeSlot
                        key={`${resource.id}-${slot.startDateTime}`}
                        time={slotTime}
                        selected={
                          selectedSlot?.resourceId === resource.id &&
                          selectedSlot?.startDateTime === slot.startDateTime
                        }
                        onClick={() => handleTimeSelect(resource, slot)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        type="confirm"
        title={t('schedule.confirmAppointmentTitle')}
        message={t('schedule.confirmAppointmentMessage')}
        primaryAction={{ label: t('schedule.confirmAndContinue'), onClick: handleConfirm }}
        secondaryAction={{ label: t('common.cancel').toUpperCase(), onClick: () => setShowConfirmModal(false) }}
      >
        <div style={{ textAlign: 'left', marginTop: '16px' }}>
          <p style={{ color: 'var(--color-neutral-600)', fontSize: '14px' }}>
            {selectedLocationName}
          </p>
          <p style={{ color: 'var(--color-neutral-600)', fontSize: '14px' }}>
            {selectedResource?.resourceDisplayName}
          </p>
          <p style={{ color: 'var(--color-neutral-900)', fontSize: '18px', fontWeight: 600 }}>
            {selectedSlot?.time}
          </p>
        </div>
      </Modal>
    </div>
  );
}
