import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Target, BarChart2, MapPin, 
  CheckCircle, Users, Activity, 
  TrendingUp, ArrowRight, Zap,
  AlertTriangle, Sparkles,
} from 'lucide-react';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const blocks = [
    { id: 'AI', title: 'Full AI Analysis', icon: <Sparkles className={styles.iconA} />, desc: '7 blok × 35 modul — orkestrator', path: '/orchestrator' },
    { id: 'A', title: 'Market Sizing', icon: <Target className={styles.iconA} />, desc: 'TAM, SAM, SOM tahlili', path: '/market-sizing' },
    { id: 'B', title: 'Demand Forecast', icon: <TrendingUp className={styles.iconB} />, desc: 'Talabni bashorat qilish', path: '/demand-forecast' },
    { id: 'C', title: 'Location Score', icon: <MapPin className={styles.iconC} />, desc: 'Joylashuv indeksi', status: 'Tez kunda' },
    { id: 'D', title: 'Financial Viability', icon: <CheckCircle className={styles.iconD} />, desc: 'Break-even, runway, survival (M-D1)', path: '/viability-check' },
    { id: 'E', title: 'Churn Prediction', icon: <AlertTriangle className={styles.iconE} />, desc: '2 yil ichida yopilish ehtimoli (M-E2)', path: '/churn-prediction' },
    { id: 'E2', title: 'Competitor Intel', icon: <Users className={styles.iconE} />, desc: 'Raqobatchilar tahlili', status: 'Tez kunda' },
    { id: 'F', title: 'Risk Assess', icon: <Activity className={styles.iconF} />, desc: 'Xavf-xatarlarni baholash', status: 'Tez kunda' },
    { id: 'G', title: 'Marketing ROI', icon: <BarChart2 className={styles.iconG} />, desc: 'Marketing samaradorligi', status: 'Tez kunda' },
  ];

  return (
    <div className={`animate-fade-in ${styles.page}`}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Badge variant="info" className={styles.heroBadge}>
            <Zap size={14} style={{ marginRight: '6px' }} /> Tizim holati: Barcha xizmatlar faol
          </Badge>
          <h1 className={styles.title}>KMB AI Analitik Platformasi</h1>
          <p className={styles.subtitle}>
            Sun'iy intellekt yordamida biznesingiz uchun ma'lumotlarga asoslangan qarorlar qabul qiling. Bitta formadan — 7 blok va 35 modul bo'yicha umumiy tahlil oling.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/orchestrator')}
              icon={<Sparkles size={18} />}
              style={{ width: 'fit-content' }}
            >
              To'liq AI Tahlil (35 modul) <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/market-sizing')}
              style={{ width: 'fit-content' }}
            >
              Bozor Hajmini Hisoblash (M-A1)
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.modules}>
        <h2 className={styles.sectionTitle}>Tahlil Modullari</h2>
        <div className={styles.grid}>
          {blocks.map(block => (
            <Card 
              key={block.id} 
              hoverEffect 
              padding="lg" 
              className={styles.moduleCard}
              onClick={() => block.path && navigate(block.path)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  {block.icon}
                </div>
                {block.status && <Badge variant="warning" size="sm">{block.status}</Badge>}
              </div>
              <h3 className={styles.cardTitle}>{block.title}</h3>
              <p className={styles.cardDesc}>{block.desc}</p>
              <div className={styles.blockId}>Blok {block.id}</div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
