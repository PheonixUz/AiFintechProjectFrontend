import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import type { ModuleMockResult } from '../../types/orchestrator.types';

interface Props {
  module: ModuleMockResult;
}

const verdictColor = (v: ModuleMockResult['verdict']): string => {
  if (v === 'positive') return 'var(--success)';
  if (v === 'neutral') return 'var(--warning)';
  return 'var(--danger)';
};

const verdictBg = (v: ModuleMockResult['verdict']): string => {
  if (v === 'positive') return 'var(--success-bg)';
  if (v === 'neutral') return 'var(--warning-bg)';
  return 'var(--danger-bg)';
};

const TrendIcon: React.FC<{ trend?: 'up' | 'down' | 'flat' }> = ({ trend }) => {
  if (trend === 'up') return <TrendingUp size={14} color="var(--success)" />;
  if (trend === 'down') return <TrendingDown size={14} color="var(--danger)" />;
  if (trend === 'flat') return <Minus size={14} color="var(--text-muted)" />;
  return null;
};

export const ModuleCard: React.FC<Props> = ({ module: m }) => {
  const color = verdictColor(m.verdict);
  const bg = verdictBg(m.verdict);

  return (
    <div
      style={{
        padding: '14px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-light)',
        borderLeft: `3px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Badge variant="default" size="sm">
              {m.code}
            </Badge>
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem', lineHeight: 1.25 }}>{m.name}</div>
        </div>
        <div
          style={{
            minWidth: 46,
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            background: bg,
            color,
            fontWeight: 700,
            fontSize: '0.85rem',
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          {m.score}
        </div>
      </div>

      <div
        style={{
          padding: '8px 10px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          {m.keyMetric.label}
        </span>
        <span
          style={{
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {m.keyMetric.value}
          <TrendIcon trend={m.keyMetric.trend} />
        </span>
      </div>

      {m.details && m.details.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(m.details.length, 3)}, minmax(0, 1fr))`,
            gap: '6px',
          }}
        >
          {m.details.map((d, i) => (
            <div
              key={i}
              style={{
                padding: '6px 8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.7rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                overflow: 'hidden',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>{d.label}</span>
              <span
                style={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {d.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {m.algorithm}
      </div>
    </div>
  );
};
