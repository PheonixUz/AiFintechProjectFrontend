import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import type { OrchestratorResult, OverallVerdict } from '../../types/orchestrator.types';

interface Props {
  result: OrchestratorResult;
}

const verdictMeta: Record<
  OverallVerdict,
  { label: string; color: string; bg: string; icon: React.ReactNode; variant: 'success' | 'warning' | 'danger' }
> = {
  GO: {
    label: 'GO — Tavsiya etiladi',
    color: 'var(--success)',
    bg: 'var(--success-bg)',
    icon: <CheckCircle size={18} />,
    variant: 'success',
  },
  CAUTION: {
    label: 'CAUTION — Ehtiyotkorlik',
    color: 'var(--warning)',
    bg: 'var(--warning-bg)',
    icon: <AlertTriangle size={18} />,
    variant: 'warning',
  },
  NO_GO: {
    label: 'NO-GO — Tavsiya etilmaydi',
    color: 'var(--danger)',
    bg: 'var(--danger-bg)',
    icon: <XCircle size={18} />,
    variant: 'danger',
  },
};

export const OverallScoreCard: React.FC<Props> = ({ result }) => {
  const meta = verdictMeta[result.verdict];
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0);
    const start = performance.now();
    const duration = 900;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedScore(Math.round(result.overallScore * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [result.overallScore]);

  const size = 180;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, animatedScore)) / 100;

  return (
    <Card padding="lg" className="glass-panel" overflowVisible>
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="var(--border-light)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={meta.color}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - pct)}
              style={{ transition: 'stroke-dashoffset 120ms linear' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: meta.color, lineHeight: 1 }}>
              {animatedScore}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              / 100
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: meta.bg,
                color: meta.color,
                fontWeight: 600,
                fontSize: '0.9rem',
                border: `1px solid ${meta.color}`,
              }}
            >
              {meta.icon}
              {meta.label}
            </div>
            <Badge variant="info" size="sm">
              {result.blocks.length} blok · {result.blocks.reduce((s, b) => s + b.modules.length, 0)} modul
            </Badge>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 }}>
            AI Orkestrator xulosasi
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {result.headline}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginTop: '4px',
            }}
          >
            <Clock size={13} />
            <span>
              Hisob: {new Date(result.generatedAt).toLocaleString('ru-RU')} · runtime{' '}
              {result.runtimeMs} ms
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
