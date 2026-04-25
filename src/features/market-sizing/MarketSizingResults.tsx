import React from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TrendingUp, Target, Users, AlertCircle } from 'lucide-react';

export const MarketSizingResults: React.FC = () => {
  const { result } = useAnalysisStore();

  if (!result) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Tahlil Natijalari: {result.niche} ({result.city})</h2>
        <Badge variant={result.confidence_score > 70 ? 'success' : 'warning'}>
          Ishonchlilik: {result.confidence_score}%
        </Badge>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <Card hoverEffect padding="lg" className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <Users size={18} />
            <span>Total Addressable Market (TAM)</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {result.tam_uzs}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Butun bozordagi potentsial mijozlar xarajatlari.
          </div>
        </Card>
        
        <Card hoverEffect padding="lg" className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <Target size={18} />
            <span>Serviceable Available Market (SAM)</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '8px' }}>
            {result.sam_uzs}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Sizning biznes modelingiz qamrab olishi mumkin bo'lgan bozor.
          </div>
        </Card>

        <Card hoverEffect padding="lg" className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <TrendingUp size={18} />
            <span>Serviceable Obtainable Market (SOM)</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)', marginBottom: '8px' }}>
            {result.som_uzs}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Dastlabki yillarda haqiqatdan erishiladigan bozor ulushi ({result.market_share_pct}%).
          </div>
        </Card>
      </div>

      <Card padding="lg" className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <AlertCircle size={20} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Sun'iy Intellekt Xulosasi</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
          {result.analysis_summary}
        </p>
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Badge variant="info">Radiusdagi Raqobatchilar: {result.competitor_count_radius} ta</Badge>
          <Badge variant="success">Bozor o'sishi: {result.market_growth_rate_pct}% / yil</Badge>
          <Badge variant="warning">O'rtacha Marja (Gross Margin): {result.gross_margin_pct}%</Badge>
        </div>
      </Card>
    </div>
  );
};
