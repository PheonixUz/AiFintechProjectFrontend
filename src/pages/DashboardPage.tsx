import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Target, BarChart2, MapPin, 
  CheckCircle, Users, Activity, 
  TrendingUp, ArrowRight, Zap 
} from 'lucide-react';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const blocks = [
    { id: 'A', title: 'Market Sizing', icon: <Target className={styles.iconA} />, desc: 'TAM, SAM, SOM tahlili', path: '/market-sizing' },
    { id: 'B', title: 'Demand Forecast', icon: <TrendingUp className={styles.iconB} />, desc: 'Talabni bashorat qilish', status: 'Tez kunda' },
    { id: 'C', title: 'Location Score', icon: <MapPin className={styles.iconC} />, desc: 'Joylashuv indeksi', status: 'Tez kunda' },
    { id: 'D', title: 'Viability Check', icon: <CheckCircle className={styles.iconD} />, desc: 'Moliyaviy hayotiylik', status: 'Tez kunda' },
    { id: 'E', title: 'Competitor Intel', icon: <Users className={styles.iconE} />, desc: 'Raqobatchilar tahlili', status: 'Tez kunda' },
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
            Sun'iy intellekt yordamida biznesingiz uchun ma'lumotlarga asoslangan qarorlar qabul qiling. Boshlash uchun o'zingizga kerakli modulni tanlang.
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => navigate('/market-sizing')}
            style={{ width: 'fit-content' }}
          >
            Bozor Hajmini Hisoblash (M-A1) <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Button>
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
