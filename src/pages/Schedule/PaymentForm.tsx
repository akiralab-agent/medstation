import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Input, Button, Modal } from '../../components/ui';
import { fetchProcedurePrice } from '../../services/procedures';
import { medcardApi } from '../../services/medcard';
import styles from './PaymentForm.module.css';

const DEFAULT_SERVICE_VALUE = 175.0;
const DEFAULT_PROCEDURE_CODE = '99214';

type ConsultationType = 'telemedicine' | 'inperson';

interface PaymentFormNavigationState {
  type?: string;
  serviceType?: string;
  medcardPlanName?: string;
  [key: string]: unknown;
}

interface MedcardSubscriptionAttribute {
  name?: string;
  value?: unknown;
}

interface MedcardSubscriptionProduct {
  name?: string;
  attributes?: MedcardSubscriptionAttribute[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeText = (value: string | undefined) => value?.trim().toLowerCase() ?? '';

const toBoolean = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  return false;
};

const toNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const parseMedcardSubscriptionProducts = (payload: unknown) => {
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    return [] as MedcardSubscriptionProduct[];
  }

  return payload.data
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => ({
      name: typeof item.name === 'string' ? item.name : undefined,
      attributes: Array.isArray(item.attributes)
        ? item.attributes
          .filter((attribute): attribute is Record<string, unknown> => isRecord(attribute))
          .map((attribute) => ({
            name: typeof attribute.name === 'string' ? attribute.name : undefined,
            value: attribute.value,
          }))
        : [],
    }));
};

const findAttributeValue = (product: MedcardSubscriptionProduct, attributeName: string) => {
  const targetName = normalizeText(attributeName);
  const attributes = product.attributes ?? [];

  const attribute = attributes.find(
    (item) => normalizeText(item.name) === targetName
  );

  return attribute?.value;
};

const findSubscriptionByPlanName = (products: MedcardSubscriptionProduct[], planName: string) => {
  const normalizedPlanName = normalizeText(planName);
  if (!normalizedPlanName) {
    return undefined;
  }

  const exactMatch = products.find(
    (product) => normalizeText(product.name) === normalizedPlanName
  );

  if (exactMatch) {
    return exactMatch;
  }

  return products.find((product) => {
    const normalizedName = normalizeText(product.name);
    return normalizedName.includes(normalizedPlanName) || normalizedPlanName.includes(normalizedName);
  });
};

const applyMedcardPricingRules = (
  basePrice: number,
  planName: string,
  consultationType: ConsultationType,
  products: MedcardSubscriptionProduct[]
) => {
  const normalizedPlanName = normalizeText(planName);
  const isBlackOrPremium = normalizedPlanName === 'medcard black' || normalizedPlanName === 'medcard premium';
  const matchedSubscription = findSubscriptionByPlanName(products, planName);

  const unlimitedOnlineConsultations = matchedSubscription
    ? toBoolean(findAttributeValue(matchedSubscription, 'unlimited_online_consultations'))
    : isBlackOrPremium;

  if (consultationType === 'telemedicine' && unlimitedOnlineConsultations) {
    return 0;
  }

  const inPersonDiscount = matchedSubscription
    ? toNumber(findAttributeValue(matchedSubscription, 'in_person_consultations_discount'))
    : (normalizedPlanName === 'medcard premium' ? 75 : 0);

  if (consultationType === 'inperson' && inPersonDiscount && inPersonDiscount > 0) {
    return Math.max(basePrice - inPersonDiscount, 0);
  }

  return basePrice;
};

export function PaymentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentState = isRecord(location.state)
    ? location.state as PaymentFormNavigationState
    : {};
  const consultationType: ConsultationType = currentState.type === 'telemedicine' ? 'telemedicine' : 'inperson';
  const isMedcardFlow = currentState.serviceType === 'medcard';
  const medcardPlanName = typeof currentState.medcardPlanName === 'string'
    ? currentState.medcardPlanName
    : '';
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [serviceValue, setServiceValue] = useState(DEFAULT_SERVICE_VALUE);
  const [procedureCode, setProcedureCode] = useState(
    import.meta.env.VITE_PAYMENT_PROCEDURE_CODE?.trim().toUpperCase() || DEFAULT_PROCEDURE_CODE
  );
  const [isLoadingServiceValue, setIsLoadingServiceValue] = useState(true);
  const scheduledDateTime = new Date('2025-10-25T14:00:00');
  const scheduledDateLabel = scheduledDateTime.toLocaleDateString(i18n.language, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const scheduledTimeLabel = scheduledDateTime.toLocaleTimeString(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const serviceValueFormatted = isLoadingServiceValue
    ? t('common.loading')
    : new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'USD',
    }).format(serviceValue);
  const valueMetaParts = [
    procedureCode ? `CPT ${procedureCode}` : '',
    medcardPlanName ? medcardPlanName : '',
  ].filter(Boolean);
  const serviceValueMeta = valueMetaParts.join(' | ');

  useEffect(() => {
    let isMounted = true;

    const loadProcedurePrice = async () => {
      setIsLoadingServiceValue(true);
      let nextServiceValue = DEFAULT_SERVICE_VALUE;
      let nextProcedureCode = import.meta.env.VITE_PAYMENT_PROCEDURE_CODE?.trim().toUpperCase() || DEFAULT_PROCEDURE_CODE;

      try {
        const procedure = await fetchProcedurePrice();
        nextServiceValue = procedure.amount;
        nextProcedureCode = procedure.code;
      } catch (error) {
        console.error('Failed to load procedure price:', error);
      }

      if (isMedcardFlow && medcardPlanName) {
        try {
          const subscriptionsPayload = await medcardApi.getSubscriptionProducts();
          const subscriptions = parseMedcardSubscriptionProducts(subscriptionsPayload);
          nextServiceValue = applyMedcardPricingRules(
            nextServiceValue,
            medcardPlanName,
            consultationType,
            subscriptions
          );
        } catch (error) {
          console.error('Failed to load MedCard subscription rules:', error);
        }
      }

      if (!isMounted) {
        return;
      }

      setServiceValue(nextServiceValue);
      setProcedureCode(nextProcedureCode);
      setIsLoadingServiceValue(false);
    };

    void loadProcedurePrice();

    return () => {
      isMounted = false;
    };
  }, [consultationType, isMedcardFlow, medcardPlanName]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (cardNumber.includes('0000')) {
        setShowError(true);
      } else {
        setShowSuccess(true);
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const numericValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = numericValue.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let index = 0, len = match.length; index < len; index += 4) {
      parts.push(match.substring(index, index + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const numericValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (numericValue.length >= 2) {
      return numericValue.slice(0, 2) + '/' + numericValue.slice(2, 4);
    }
    return numericValue;
  };

  return (
    <div className={styles.container}>
      <Header title={t('payment.title')} showBackButton variant="primary" />

      <div className={styles.content}>
        <div className={styles.balanceCard}>
          <div className={styles.scheduledInfo}>
            <span className={styles.scheduledLabel}>{t('payment.scheduled')}</span>
            <span className={styles.scheduledDate}>{scheduledDateLabel}</span>
            <span className={styles.scheduledTime}>{scheduledTimeLabel}</span>
          </div>
          <div className={styles.valueSection}>
            <span className={styles.valueLabel}>{t('payment.serviceValue')}</span>
            <span className={styles.valueAmount}>{serviceValueFormatted}</span>
            {serviceValueMeta && <span className={styles.valueMeta}>{serviceValueMeta}</span>}
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>{t('payment.cardInformation')}</h3>

          <Input
            label={t('payment.cardNumber')}
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
            maxLength={19}
          />

          <div className={styles.row}>
            <Input
              label={t('payment.expiryDate')}
              placeholder="MM/YY"
              value={expiry}
              onChange={(event) => setExpiry(formatExpiry(event.target.value))}
              maxLength={5}
            />
            <Input
              label="CVV"
              placeholder="123"
              value={cvv}
              onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              type="password"
            />
          </div>

          <Input
            label={t('payment.cardholderName')}
            placeholder={t('payment.nameOnCard')}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <p className={styles.disclaimer}>
            {t('payment.disclaimer')}
          </p>

          <div className={styles.buttons}>
            <Button
              variant="primary"
              fullWidth
              type="submit"
              disabled={loading || !cardNumber || !expiry || !cvv || !name}
            >
              {loading ? t('payment.processing') : t('payment.goToPayment')}
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate(-1)}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </div>

      <Modal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate('/appointments');
        }}
        type="success"
        title={t('payment.successTitle')}
        message={t('payment.successMessage')}
        primaryAction={{
          label: t('appointments.viewMyAppointments'),
          onClick: () => navigate('/appointments'),
        }}
      />

      <Modal
        visible={showError}
        onClose={() => setShowError(false)}
        type="error"
        title={t('payment.cardRefusedTitle')}
        message={t('payment.cardRefusedMessage')}
        primaryAction={{
          label: t('payment.tryAnotherCard'),
          onClick: () => setShowError(false),
        }}
        secondaryAction={{
          label: t('payment.changePaymentMethod'),
          onClick: () => navigate('/schedule/payment', { state: currentState }),
        }}
      />
    </div>
  );
}
