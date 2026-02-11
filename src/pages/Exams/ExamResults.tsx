import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import { Header, Tabs, Card } from '../../components/ui';
import styles from './Exams.module.css';

interface Exam {
  id: string;
  name: string;
  doctor: string;
  city: string;
  type: string;
  date: string;
}

export function ExamResults() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('results');
  const tabs = [
    { id: 'results', label: t('exams.resultsTab') },
    { id: 'orders', label: t('exams.ordersTab') },
  ];
  const mockExams: Exam[] = [
    {
      id: '1',
      name: t('exams.mock.completeBloodCount'),
      doctor: 'Dr. Sarah Johnson',
      city: 'Miami',
      type: t('exams.laboratory'),
      date: 'Jan 05, 2026',
    },
    {
      id: '2',
      name: t('exams.mock.chestXray'),
      doctor: 'Dr. Michael Chen',
      city: 'Miami Beach',
      type: t('exams.imaging'),
      date: 'Dec 28, 2025',
    },
    {
      id: '3',
      name: t('exams.mock.lipidPanel'),
      doctor: 'Dr. Emily Rodriguez',
      city: 'Coral Gables',
      type: t('exams.laboratory'),
      date: 'Dec 15, 2025',
    },
  ];

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
        {activeTab === 'results' ? (
          mockExams.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('exams.noResultsFound')}</p>
            </div>
          ) : (
            mockExams.map((exam) => (
              <Card
                key={exam.id}
                padding="medium"
                onClick={() => navigate(`/exams/${exam.id}`)}
                className={styles.examCard}
              >
                <h3 className={styles.examName}>{exam.name}</h3>
                <p className={styles.examCity}>{exam.city}</p>
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
          <div className={styles.empty}>
            <p>{t('exams.noPendingOrders')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
