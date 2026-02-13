import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Input, Button, Modal } from '../../components/ui';
import { fetchProcedurePrice } from '../../services/procedures';
import { medcardApi } from '../../services/medcard';
import { createInstamedPayment, type CreateInstamedPaymentResponse } from '../../services/instamed';
import styles from './PaymentForm.module.css';

const DEFAULT_SERVICE_VALUE = 175.0;
const DEFAULT_PROCEDURE_CODE = '99214';
const DEFAULT_INSTAMED_JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js';
const DEFAULT_INSTAMED_TOKEN_SCRIPT_URL = 'https://cdn.instamed.com/content/js/token.js';
const DEFAULT_INSTAMED_HELPER_SCRIPT_URL = 'https://developers.instamed.com/wp-content/themes/devportal/js/secureTokenHelper.js';
const DEFAULT_INSTAMED_DISPLAY_MODE = 'incontext';
const DEFAULT_INSTAMED_MOBILE_DISPLAY_MODE = 'incontext';
const DEFAULT_INSTAMED_ENVIRONMENT = 'UAT';
const DEFAULT_INSTAMED_ADD_CARD_EMAIL = 'imqa@instamed.net';
const DEFAULT_INSTAMED_ADD_CARD_WIDTH = '400';
const DEFAULT_INSTAMED_ADD_CARD_HEIGHT = '600';

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

interface InstamedConfig {
  jqueryUrl: string;
  tokenScriptUrl: string;
  helperScriptUrl: string;
  environment: string;
  displayMode: string;
  mobileDisplayMode: string;
  corporateId: string;
  addCardEmail: string;
  addCardWidth: string;
  addCardHeight: string;
}

declare global {
  interface Window {
    addCard?: (email: string, width: string, height: string) => void;
    InstaMed2?: {
      onReady?: () => void;
      removeCard?: () => void;
    };
  }
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

const loadScript = (id: string, src: string, attributes: Record<string, string> = {}) =>
  new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(id) as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve();
        return;
      }

      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true }
    );
    script.addEventListener('error', () => reject(new Error(`Failed to load script: ${src}`)), { once: true });

    document.body.appendChild(script);
  });

const runInstaMedOnloadHelper = () =>
  new Promise<void>((resolve) => {
    const startedAt = Date.now();

    const run = () => {
      const hasCardEntry =
        document.querySelector('#CardEntry-CardNumber, #CardEntry, #cardinput') !== null;

      if (hasCardEntry) {
        window.InstaMed2?.onReady?.();
        resolve();
        return;
      }

      if (Date.now() - startedAt >= 3000) {
        resolve();
        return;
      }

      window.setTimeout(run, 5);
    };

    run();
  });

const maskToken = (token: string) => {
  if (token.length <= 10) {
    return token;
  }
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
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
  const [description, setDescription] = useState('');
  const [cvn, setCvn] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentResponse, setPaymentResponse] = useState<CreateInstamedPaymentResponse | null>(null);
  const [serviceValue, setServiceValue] = useState(DEFAULT_SERVICE_VALUE);
  const [procedureCode, setProcedureCode] = useState(
    import.meta.env.VITE_PAYMENT_PROCEDURE_CODE?.trim().toUpperCase() || DEFAULT_PROCEDURE_CODE
  );
  const [isLoadingServiceValue, setIsLoadingServiceValue] = useState(true);
  const [isInstamedLoading, setIsInstamedLoading] = useState(false);
  const [isInstamedReady, setIsInstamedReady] = useState(false);
  const [instamedInitError, setInstamedInitError] = useState('');
  const [instamedToken, setInstamedToken] = useState('');
  const [instamedExpiration, setInstamedExpiration] = useState('');
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
  const instamedConfig = useMemo<InstamedConfig>(
    () => ({
      jqueryUrl: import.meta.env.VITE_INSTAMED_JQUERY_URL?.trim() || DEFAULT_INSTAMED_JQUERY_URL,
      tokenScriptUrl: import.meta.env.VITE_INSTAMED_TOKEN_SCRIPT_URL?.trim() || DEFAULT_INSTAMED_TOKEN_SCRIPT_URL,
      helperScriptUrl: import.meta.env.VITE_INSTAMED_HELPER_SCRIPT_URL?.trim() || DEFAULT_INSTAMED_HELPER_SCRIPT_URL,
      environment: import.meta.env.VITE_INSTAMED_ENVIRONMENT?.trim() || DEFAULT_INSTAMED_ENVIRONMENT,
      displayMode: import.meta.env.VITE_INSTAMED_DISPLAY_MODE?.trim() || DEFAULT_INSTAMED_DISPLAY_MODE,
      mobileDisplayMode: import.meta.env.VITE_INSTAMED_MOBILE_DISPLAY_MODE?.trim() || DEFAULT_INSTAMED_MOBILE_DISPLAY_MODE,
      corporateId: import.meta.env.VITE_INSTAMED_CORPORATE_ID?.trim() || '',
      addCardEmail: import.meta.env.VITE_INSTAMED_ADD_CARD_EMAIL?.trim() || DEFAULT_INSTAMED_ADD_CARD_EMAIL,
      addCardWidth: import.meta.env.VITE_INSTAMED_ADD_CARD_WIDTH?.trim() || DEFAULT_INSTAMED_ADD_CARD_WIDTH,
      addCardHeight: import.meta.env.VITE_INSTAMED_ADD_CARD_HEIGHT?.trim() || DEFAULT_INSTAMED_ADD_CARD_HEIGHT,
    }),
    []
  );
  const isFreeConsultation = !isLoadingServiceValue && serviceValue <= 0;
  const hasValidCvn = /^\d{3,4}$/.test(cvn);
  const canSubmitPaidPayment =
    !isInstamedLoading &&
    isInstamedReady &&
    !instamedInitError &&
    !!instamedToken &&
    /^\d{2}\/\d{2}$/.test(instamedExpiration) &&
    hasValidCvn;
  const submitDisabled =
    loading ||
    isLoadingServiceValue ||
    (!isFreeConsultation && !canSubmitPaidPayment);
  const submitLabel = loading
    ? t('payment.processing')
    : isFreeConsultation
      ? t('schedule.confirmAndContinue')
      : t('payment.goToPayment');
  const successMessage = paymentResponse?.transaction_id
    ? t('payment.successMessageWithTransaction', {
      transactionId: paymentResponse.transaction_id,
      status: paymentResponse.status ?? 'N/A',
    })
    : (isFreeConsultation ? t('payment.freeSuccessMessage') : t('payment.successMessage'));

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

  useEffect(() => {
    const syncTokenFields = () => {
      const tokenField = document.getElementById('txtCardNumber') as HTMLInputElement | null;
      const expirationField = document.getElementById('txtExpDate') as HTMLInputElement | null;
      const token = tokenField?.value.trim() ?? '';
      const expiration = expirationField?.value.trim() ?? '';

      setInstamedToken((previous) => (previous === token ? previous : token));
      setInstamedExpiration((previous) => (previous === expiration ? previous : expiration));
    };

    const interval = window.setInterval(syncTokenFields, 300);
    syncTokenFields();

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const setupInstaMed = async () => {
      if (isLoadingServiceValue || serviceValue <= 0) {
        return;
      }

      setIsInstamedLoading(true);
      setInstamedInitError('');
      setIsInstamedReady(false);

      if (!instamedConfig.corporateId) {
        if (isMounted) {
          setIsInstamedLoading(false);
          setInstamedInitError('Missing VITE_INSTAMED_CORPORATE_ID environment variable.');
        }
        return;
      }

      try {
        await loadScript('instamed-jquery', instamedConfig.jqueryUrl);
        await loadScript('instamed-token', instamedConfig.tokenScriptUrl, {
          'data-displaymode': instamedConfig.displayMode,
          'data-environment': instamedConfig.environment,
          'data-mobiledisplaymode': instamedConfig.mobileDisplayMode,
          'data-corporateid': instamedConfig.corporateId,
        });
        await loadScript('instamed-helper', instamedConfig.helperScriptUrl);
        await runInstaMedOnloadHelper();

        if (!isMounted) {
          return;
        }

        setIsInstamedReady(true);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setInstamedInitError(error instanceof Error ? error.message : 'Falha ao inicializar InstaMed.');
      } finally {
        if (isMounted) {
          setIsInstamedLoading(false);
        }
      }
    };

    void setupInstaMed();

    return () => {
      isMounted = false;
    };
  }, [instamedConfig, isLoadingServiceValue, serviceValue]);

  const handleAddCard = () => {
    if (!window.addCard) {
      setInstamedInitError('InstaMed ainda não está pronto. Aguarde e tente novamente.');
      return;
    }

    setInstamedInitError('');
    window.addCard(
      instamedConfig.addCardEmail,
      instamedConfig.addCardWidth,
      instamedConfig.addCardHeight
    );
  };

  const handleRemoveCard = () => {
    window.InstaMed2?.removeCard?.();
    setInstamedToken('');
    setInstamedExpiration('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowError(false);
    setErrorMessage('');
    setPaymentResponse(null);

    if (isFreeConsultation) {
      setShowSuccess(true);
      return;
    }

    if (!instamedToken) {
      setErrorMessage('Nenhum token de cartão encontrado. Clique em "Adicionar cartão".');
      setShowError(true);
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(instamedExpiration)) {
      setErrorMessage('Validade do cartão inválida (esperado MM/AA).');
      setShowError(true);
      return;
    }

    if (!hasValidCvn) {
      setErrorMessage('Informe um CVN válido (3 ou 4 dígitos).');
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await createInstamedPayment({
        token: instamedToken,
        expiration: instamedExpiration,
        cvn,
        amount: Number(serviceValue.toFixed(2)),
        currency: 'USD',
        description: description.trim(),
        person_id: import.meta.env.VITE_PERSON_ID?.trim() || null,
        external_reference: null,
      });

      setPaymentResponse(response);
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('payment.cardRefusedMessage'));
      setShowError(true);
    } finally {
      setLoading(false);
    }
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
          <h3 className={styles.formTitle}>
            {isFreeConsultation ? 'Consulta sem cobrança' : t('payment.cardInformation')}
          </h3>

          <Input
            label="Descrição"
            placeholder="Ex.: Consulta Dr. Fulano"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          {!isFreeConsultation && (
            <div className={styles.instamedContainer}>
              <div className={styles.instamedHeader}>InstaMed Secure Token</div>
              <p className={styles.instamedDescription}>
                Clique em <strong>Adicionar cartão</strong> para abrir a interface segura da InstaMed.
                O MedStation recebe apenas token do cartão e CVN.
              </p>

              <div className={styles.instamedActions}>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAddCard}
                  disabled={isInstamedLoading || !!instamedInitError}
                >
                  {isInstamedLoading ? t('common.loading') : 'Adicionar cartão'}
                </Button>
                <Button
                  type="button"
                  variant="text"
                  onClick={handleRemoveCard}
                  disabled={!instamedToken}
                >
                  Remover cartão
                </Button>
              </div>

              <input type="hidden" id="txtCardNumber" name="txtCardNumber" />
              <input type="hidden" id="txtExpDate" name="txtExpDate" />
              <input type="text" id="cardinput" className={styles.hiddenField} readOnly />

              {!!instamedToken && (
                <p className={`${styles.instamedStatus} ${styles.statusOk}`}>
                  Token carregado: {maskToken(instamedToken)}
                </p>
              )}
              {!!instamedExpiration && (
                <p className={styles.instamedStatus}>Validade retornada: {instamedExpiration}</p>
              )}
              {!!instamedInitError && (
                <p className={`${styles.instamedStatus} ${styles.statusErr}`}>{instamedInitError}</p>
              )}
            </div>
          )}

          {!isFreeConsultation && (
            <Input
              label="CVV"
              placeholder="123"
              value={cvn}
              onChange={(event) => setCvn(event.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              type="password"
            />
          )}

          <p className={styles.disclaimer}>
            {isFreeConsultation
              ? 'Esta consulta é gratuita conforme regras do plano selecionado.'
              : t('payment.disclaimer')}
          </p>

          <div className={styles.buttons}>
            <Button
              variant="primary"
              fullWidth
              type="submit"
              disabled={submitDisabled}
            >
              {submitLabel}
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
        message={successMessage}
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
        message={errorMessage || t('payment.cardRefusedMessage')}
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
