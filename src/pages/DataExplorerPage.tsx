import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Search } from 'lucide-react';
import styles from './DataExplorerPage.module.css';

export const DataExplorerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('niches');

  const tabs = [
    { id: 'niches', label: 'Biznes Nishalari' },
    { id: 'benchmarks', label: 'Benchmarklar' },
    { id: 'competitors', label: 'Raqobatchilar' },
    { id: 'transactions', label: 'Tranzaksiyalar' },
  ];

  return (
    <div className={`animate-fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Data Explorer</h1>
        <p className={styles.subtitle}>Barcha xom ma'lumotlar bazasini ko'rib chiqish</p>
      </div>

      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className={styles.content}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Qidirish..." className={styles.searchInput} />
          </div>
          <Badge variant="info">Jami: 0 ta yozuv</Badge>
        </div>
        
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <h3>Ma'lumotlar bu yerda ko'rinadi</h3>
          <p>Tez orada jadval va filtrlar qo'shiladi.</p>
        </div>
      </Card>
    </div>
  );
};
