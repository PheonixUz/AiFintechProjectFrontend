import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';
import styles from './HistoryPage.module.css';
import { useMarketEstimates } from '../hooks/useMarketEstimates';

// Utility functions
const parseNum = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = value.replace(/[^\d.eE+\-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const formatCurrency = (value: string | number | undefined | null): string => {
  const num = parseNum(value);
  if (num === 0) return '0 UZS';
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)} trln UZS`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)} mlrd UZS`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(0)} mln UZS`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)} ming UZS`;
  return `${num.toFixed(0)} UZS`;
};

const getConfidenceColor = (score: number): 'danger' | 'warning' | 'success' => {
  const percentage = score <= 1 ? score * 100 : score;
  if (percentage < 40) return 'danger';
  if (percentage < 70) return 'warning';
  return 'success';
};

export const HistoryPage: React.FC = () => {
  const { data: estimates, isLoading, error } = useMarketEstimates({});

  return (
    <div className={`animate-fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tarix</h1>
        <p className={styles.subtitle}>Avvalgi saqlangan hisob-kitoblarni qayta ko'rish.</p>
      </div>

      <Card className={styles.content}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={32} color="var(--accent-primary)" />
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <AlertCircle size={48} className={styles.emptyIcon} color="var(--error)" />
            <h3>Xatolik</h3>
            <p>Ma'lumotlarni yuklashda xatolik yuz berdi.</p>
          </div>
        ) : !estimates || estimates.length === 0 ? (
          <div className={styles.emptyState}>
            <Clock size={48} className={styles.emptyIcon} />
            <h3>Tarix bo'sh</h3>
            <p>Hozircha saqlangan market sizing tahlillari yo'q.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Nisha</th>
                  <th style={{ padding: '12px' }}>Shahar</th>
                  <th style={{ padding: '12px' }}>TAM</th>
                  <th style={{ padding: '12px' }}>SAM</th>
                  <th style={{ padding: '12px' }}>SOM</th>
                  <th style={{ padding: '12px' }}>Ishonch / Raqobat</th>
                  <th style={{ padding: '12px' }}>Sana</th>
                </tr>
              </thead>
              <tbody>
                {estimates.map((est) => (
                  <tr key={est.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-opacity-50">
                    <td style={{ padding: '12px', fontWeight: 500 }}>{est.niche}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{est.city}</td>
                    <td style={{ padding: '12px', color: '#60a5fa', fontWeight: 500 }}>{formatCurrency(est.tam_uzs)}</td>
                    <td style={{ padding: '12px', color: '#a78bfa', fontWeight: 500 }}>{formatCurrency(est.sam_uzs)}</td>
                    <td style={{ padding: '12px', color: '#34d399', fontWeight: 500 }}>{formatCurrency(est.som_uzs)}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Badge variant={getConfidenceColor(est.confidence_score)}>
                          {(est.confidence_score <= 1 ? est.confidence_score * 100 : est.confidence_score).toFixed(0)}%
                        </Badge>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <MapPin size={12} /> {est.competitor_count ?? 0} raqobatchi
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {new Date(est.calculation_date).toISOString().split('T')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
