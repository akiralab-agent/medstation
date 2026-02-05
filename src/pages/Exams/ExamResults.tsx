import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUp } from 'lucide-react';
import { Header, Tabs, Input, Card } from '../../components/ui';
import styles from './Exams.module.css';

interface Exam {
  id: string;
  name: string;
  doctor: string;
  city: string;
  type: string;
  date: string;
}

const mockExams: Exam[] = [
  {
    id: '1',
    name: 'Complete Blood Count',
    doctor: 'Dr. Sarah Johnson',
    city: 'Miami',
    type: 'Laboratory',
    date: 'Jan 05, 2026',
  },
  {
    id: '2',
    name: 'Chest X-Ray',
    doctor: 'Dr. Michael Chen',
    city: 'Miami Beach',
    type: 'Imaging',
    date: 'Dec 28, 2025',
  },
  {
    id: '3',
    name: 'Lipid Panel',
    doctor: 'Dr. Emily Rodriguez',
    city: 'Coral Gables',
    type: 'Laboratory',
    date: 'Dec 15, 2025',
  },
];

const tabs = [
  { id: 'results', label: 'Results' },
  { id: 'orders', label: 'Orders' },
];

export function ExamResults() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('results');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExams = mockExams.filter((exam) =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Header
        title="Exam Result"
        showBackButton
        rightActions={['search', 'add', 'filter']}
      />

      <div className={styles.searchWrapper}>
        <Input
          placeholder="Search by exam name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={20} />}
        />
      </div>

      <div className={styles.tabsWrapper}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className={styles.list}>
        {activeTab === 'results' ? (
          filteredExams.length === 0 ? (
            <div className={styles.empty}>
              <p>No exam results found</p>
            </div>
          ) : (
            filteredExams.map((exam) => (
              <Card
                key={exam.id}
                padding="medium"
                onClick={() => navigate(`/exams/${exam.id}`)}
                className={styles.examCard}
              >
                <h3 className={styles.examName}>{exam.name}</h3>
                <p className={styles.examDoctor}>{exam.doctor}</p>
                <p className={styles.examCity}>{exam.city}</p>
                <div className={styles.examMeta}>
                  <span className={styles.examType}>
                    <ArrowUp size={14} />
                    {exam.type}
                  </span>
                  <span className={styles.examDate}>{exam.date}</span>
                </div>
              </Card>
            ))
          )
        ) : (
          <div className={styles.empty}>
            <p>No pending orders</p>
          </div>
        )}
      </div>
    </div>
  );
}
