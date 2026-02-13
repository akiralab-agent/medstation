import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import { Header, Tabs, Card } from '../../components/ui';
import { fetchLabOrdersByPerson, fetchLabResultsByPerson, type LabOrderItem, type LabResultItem } from '../../services/exams';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Exams.module.css';

interface ExamResultCard {
  orderId: string;
  name: string;
  subtitle: string;
  type: string;
}

interface ExamOrderCard {
  id: string;
  name: string;
  subtitle: string;
  type: string;
}

function pickPersonId(authPersonId?: string) {
  return authPersonId?.trim() || import.meta.env.VITE_PERSON_ID?.trim() || '';
}

export function ExamResults() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('results');
  const [results, setResults] = useState<LabResultItem[]>([]);
  const [orders, setOrders] = useState<LabOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'results', label: t('exams.resultsTab') },
    { id: 'orders', label: t('exams.ordersTab') },
  ];

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString(i18n.language, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const personId = pickPersonId(user?.id);
    if (!personId) {
      setError(t('exams.errorMissingPersonId'));
      setLoading(false);
      return;
    }

    Promise.all([fetchLabResultsByPerson(personId), fetchLabOrdersByPerson(personId)])
      .then(([labResults, labOrders]) => {
        setResults(labResults);
        setOrders(labOrders);
      })
      .catch(() => setError(t('exams.errorFailedToLoadExams')))
      .finally(() => setLoading(false));
  }, [t, user?.id]);

  const resultCards = useMemo<ExamResultCard[]>(() => {
    const orderMap = new Map<string, LabOrderItem>();
    orders.forEach((order) => {
      orderMap.set(order.id, order);
    });

    const grouped = new Map<string, LabResultItem[]>();
    results.forEach((item) => {
      if (!item.orderId) return;
      const list = grouped.get(item.orderId) ?? [];
      list.push(item);
      grouped.set(item.orderId, list);
    });

    return Array.from(grouped.entries())
      .map(([orderId, items]) => {
        const first = items[0];
        const order = orderMap.get(orderId);
        const lastDate = items
          .map((item) => item.observationDateTime ?? item.orderCreateTimestamp ?? '')
          .sort()
          .at(-1);

        return {
          orderId,
          name: order?.testDescription || first.testDescription || first.ngTestDescription || t('exams.fallbackLabExam'),
          subtitle: formatDate(lastDate),
          type: order?.testStatus || first.orderStatus || t('exams.fallbackResultType'),
          sortKey: lastDate ?? '',
        };
      })
      .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
      .map(({ orderId, name, subtitle, type }) => ({ orderId, name, subtitle, type }));
  }, [i18n.language, orders, results, t]);

  const orderCards = useMemo<ExamOrderCard[]>(
    () =>
      orders
        .map((order) => ({
          id: order.id,
          name: order.testDescription || t('exams.fallbackLabOrder'),
          subtitle: formatDate(order.orderDate),
          type: order.testStatus || order.nextgenStatus || t('exams.fallbackOrderType'),
          sortKey: order.orderDate ?? '',
        }))
        .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
        .map(({ id, name, subtitle, type }) => ({ id, name, subtitle, type })),
    [i18n.language, orders, t]
  );

  return (
    <div className={styles.container}>
      <Header
        title={t('exams.resultTitle')}
        showBackButton
        variant="primary"
      />

      <div className={styles.tabsWrapper}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="dark" />
      </div>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>
            <p>{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className={styles.empty}>
            <p>{error}</p>
          </div>
        ) : activeTab === 'results' ? (
          resultCards.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('exams.noResultsFound')}</p>
            </div>
          ) : (
            resultCards.map((exam) => (
              <Card
                key={exam.orderId}
                padding="medium"
                onClick={() => navigate(`/exams/${exam.orderId}`)}
                className={styles.examCard}
              >
                <h3 className={styles.examName}>{exam.name}</h3>
                <p className={styles.examCity}>{exam.subtitle}</p>
                <div className={styles.examMeta}>
                  <span className={styles.examType}>
                    <ArrowUp size={14} />
                    {exam.type}
                  </span>
                </div>
              </Card>
            ))
          )
        ) : (
          orderCards.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('exams.noPendingOrders')}</p>
            </div>
          ) : (
            orderCards.map((order) => (
              <Card
                key={order.id}
                padding="medium"
                onClick={() => navigate(`/exams/${order.id}`)}
                className={styles.examCard}
              >
                <h3 className={styles.examName}>{order.name}</h3>
                <p className={styles.examCity}>{order.subtitle}</p>
                <div className={styles.examMeta}>
                  <span className={styles.examType}>
                    <ArrowUp size={14} />
                    {order.type}
                  </span>
                </div>
              </Card>
            ))
          )
        )}
      </div>
    </div>
  );
}
