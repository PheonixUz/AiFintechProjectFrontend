import React from 'react';
import { useOrchestratorStore } from '../../store/orchestratorStore';
import { OverallScoreCard } from './OverallScoreCard';
import { BlockRadarChart } from './BlockRadarChart';
import { BlockSection } from './BlockSection';
import { RecommendationsPanel } from './RecommendationsPanel';
import { Card } from '../../components/ui/Card';
import { Loader2, Sparkles } from 'lucide-react';

const LOADING_STEPS = [
  'Blok A: Bozor hajmi hisoblanmoqda (6 modul)...',
  'Blok B: Talab prognozi tayyorlanmoqda (6 modul)...',
  'Blok C: Lokatsiya va trafik tahlili (6 modul)...',
  'Blok D: Moliyaviy hayotchanlik (6 modul)...',
  'Blok E: Raqobat va risklar (5 modul)...',
  'Blok F: Kreditlash va bank mahsulotlari (5 modul)...',
  'Blok G: Ijtimoiy profil va TA (5 modul)...',
];

const LoadingPanel: React.FC = () => {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => Math.min(LOADING_STEPS.length - 1, s + 1));
    }, 320);
    return () => clearInterval(id);
  }, []);

  return (
    <Card padding="lg" className="glass-panel" overflowVisible>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '32px 16px',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
          }}
        >
          <Sparkles size={28} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '6px' }}>
            AI Orkestrator ishlamoqda
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Barcha 35 modul parallel ravishda ishga tushirildi — bir necha soniyada natija tayyor bo'ladi.
          </p>
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: 520,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {LOADING_STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                background: i <= step ? 'var(--bg-secondary)' : 'transparent',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)',
                opacity: i <= step ? 1 : 0.5,
                transition: 'all 0.3s ease',
              }}
            >
              {i < step ? (
                <span style={{ color: 'var(--success)' }}>✓</span>
              ) : i === step ? (
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>○</span>
              )}
              {s}
            </div>
          ))}
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </Card>
  );
};

const EmptyState: React.FC = () => (
  <Card padding="lg" className="glass-panel" overflowVisible>
    <div
      style={{
        padding: '40px 16px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
        }}
      >
        <Sparkles size={24} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Tahlilga tayyor</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 480 }}>
        Chapdagi formani to'ldiring — orkestrator 7 blok va 35 modul bo'yicha umumiy natijani
        bitta dashboardda ko'rsatadi.
      </p>
    </div>
  </Card>
);

export const OrchestratorResults: React.FC = () => {
  const { result, isRunning } = useOrchestratorStore();

  if (isRunning) return <LoadingPanel />;
  if (!result) return <EmptyState />;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      className="animate-slide-up"
    >
      <OverallScoreCard result={result} />
      <BlockRadarChart blocks={result.blocks} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {result.blocks.map((b) => (
          <BlockSection key={b.code} block={b} />
        ))}
      </div>
      <RecommendationsPanel
        recommendations={result.recommendations}
        risks={result.topRisks}
        opportunities={result.topOpportunities}
      />
    </div>
  );
};
