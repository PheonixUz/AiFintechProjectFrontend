import React, { useMemo, useState } from 'react';
import { useChurnPredictionStore } from '../../store/churnPredictionStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ChevronDown, ChevronUp, Info, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type {
  ChurnPredictionResponse,
  ChurnRiskFactorOut,
  MethodologyNotes,
} from '../../types/api.types';

const formatPct = (x: number | undefined | null, digits = 1): string => {
  if (x == null || Number.isNaN(x)) return '—';
  const p = x <= 1 ? x * 100 : x;
  return `${p.toFixed(digits)}%`;
};

const bucketVariant = (
  bucket: string
): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const b = (bucket || '').toLowerCase();
  if (b.includes('low') || b.includes('past')) return 'success';
  if (b.includes('medium') || b.includes('o‘rta') || b.includes('orta')) return 'warning';
  if (b.includes('high') || b.includes('yuqori')) return 'danger';
  if (b.includes('critical') || b.includes('krit')) return 'danger';
  return 'info';
};

const methodologyCell: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--bg-secondary)',
  fontSize: '0.85rem',
  wordBreak: 'break-word',
};

const Note: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', marginLeft: '4px' }}>
      <button
        type="button"
        aria-label="Izoh"
        onClick={() => setOpen((o) => !o)}
        style={{
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
          color: 'var(--text-muted)',
          display: 'inline-flex',
        }}
      >
        <Info size={16} />
      </button>
      {open && (
        <span
          style={{
            position: 'absolute',
            zIndex: 20,
            left: 0,
            top: '100%',
            marginTop: 4,
            minWidth: 220,
            maxWidth: 340,
            padding: '10px 12px',
            fontSize: '0.8rem',
            lineHeight: 1.4,
            color: 'var(--text-primary)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
};

const Kpi: React.FC<{ label: string; value: React.ReactNode; hint?: string }> = ({
  label,
  value,
  hint,
}) => (
  <div style={methodologyCell}>
    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 6 }}>
      {label}
      {hint && <Note text={hint} />}
    </div>
    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
      {value}
    </div>
  </div>
);

const RiskBar: React.FC<{ pct: number }> = ({ pct }) => {
  const value = Math.max(0, Math.min(100, pct));
  const color = value >= 66 ? 'var(--danger)' : value >= 33 ? 'var(--warning)' : 'var(--success)';
  return (
    <div
      style={{
        height: 10,
        borderRadius: 999,
        background: 'var(--bg-tertiary)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
};

const directionIcon = (direction: string) => {
  const d = (direction || '').toLowerCase();
  if (d.includes('up') || d.includes('incr') || d.includes('qayta') || d.includes('+')) {
    return <TrendingUp size={14} style={{ color: 'var(--danger)' }} />;
  }
  if (d.includes('down') || d.includes('decr') || d.includes('past') || d.includes('-')) {
    return <TrendingDown size={14} style={{ color: 'var(--success)' }} />;
  }
  return <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />;
};

const RiskFactorsList: React.FC<{ factors: ChurnRiskFactorOut[] }> = ({ factors }) => {
  const sorted = useMemo(
    () => [...factors].sort((a, b) => (a.rank || 0) - (b.rank || 0)),
    [factors]
  );
  if (!sorted.length) return null;

  return (
    <Card>
      <h3 style={{ margin: '0 0 12px', fontSize: '1.05rem', fontWeight: 600 }}>
        Top risk omillari
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sorted.map((f) => {
          const impactPct = Math.round((f.impact_score || 0) * 100);
          return (
            <div
              key={`${f.rank}-${f.factor_name}`}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      minWidth: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {f.rank}
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{f.factor_name}</strong>
                  <Badge variant="default" size="sm">
                    {f.factor_group}
                  </Badge>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {directionIcon(f.direction)}
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {f.direction}
                    </span>
                  </span>
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{impactPct}%</strong>
              </div>

              <RiskBar pct={impactPct} />

              {(f.factor_value || f.baseline_value) && (
                <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {f.factor_value != null && <span>Hozir: <b>{f.factor_value}</b></span>}
                  {f.baseline_value != null && <span>Baseline: <b>{f.baseline_value}</b></span>}
                </div>
              )}

              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                {f.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const MethodologyBlock: React.FC<{ notes: MethodologyNotes }> = ({ notes }) => {
  const [open, setOpen] = useState(false);
  const entries = useMemo(
    () => Object.entries(notes || {}).filter(([, v]) => v != null && v !== ''),
    [notes]
  );
  if (!entries.length) return null;
  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontWeight: 600,
          fontSize: '1rem',
          padding: 0,
        }}
      >
        Metodologiya
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {open && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          {entries.map(([k, v]) => (
            <div key={k} style={methodologyCell}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 4 }}>
                {k}
              </div>
              <div>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const ResultsInner: React.FC<{ data: ChurnPredictionResponse }> = ({ data }) => {
  const confidencePct =
    data.confidence_score <= 1
      ? Math.round(data.confidence_score * 100)
      : Math.round(data.confidence_score);
  const closurePct = Math.round((data.closure_probability_24m || 0) * 100);
  const survivalPct = Math.round((data.survival_probability_24m || 0) * 100);
  const riskScorePct =
    data.risk_score <= 1 ? Math.round(data.risk_score * 100) : Math.round(data.risk_score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {data.niche}
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          MCC {data.mcc_code} · {data.city}
        </span>
        <Badge variant={bucketVariant(data.risk_bucket)}>Risk: {data.risk_bucket}</Badge>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          run #{data.run_id} · snap #{data.feature_snapshot_id}
          {data.business_id != null ? ` · biz #${data.business_id}` : ''}
        </span>
      </div>

      <Card>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 6 }}>
              Yopilish ehtimoli ({data.prediction_horizon_months} oy)
              <Note text="Model bashoratiga ko‘ra biznes tanlangan gorizontda yopilish ehtimoli." />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>
              {closurePct}%
            </div>
            <RiskBar pct={closurePct} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 6 }}>
              Yashab qolish ehtimoli
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
              {survivalPct}%
            </div>
            <RiskBar pct={survivalPct} />
          </div>
        </div>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px',
        }}
      >
        <Kpi label="Risk score" value={`${riskScorePct}`} hint="Umumiy risk indeksi (0–100)" />
        <Kpi label="Ishonch" value={`${confidencePct}%`} />
        <Kpi
          label="Gorizont"
          value={`${data.prediction_horizon_months} oy`}
          hint="Ehtimol qaysi muddat uchun hisoblandi"
        />
        <Kpi
          label="Closure"
          value={formatPct(data.closure_probability_24m)}
        />
        <Kpi
          label="Survival"
          value={formatPct(data.survival_probability_24m)}
        />
        <Kpi label="As of" value={data.as_of_date} />
      </div>

      <Card>
        <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600 }}>Xulosa</h3>
        <div
          className="markdown-body"
          style={{ fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}
        >
          <ReactMarkdown>{data.prediction_summary}</ReactMarkdown>
        </div>
      </Card>

      <RiskFactorsList factors={data.top_factors} />
      <MethodologyBlock notes={data.methodology_notes} />
    </div>
  );
};

export const ChurnPredictionResults: React.FC = () => {
  const result = useChurnPredictionStore((s) => s.result);

  if (!result) {
    return (
      <Card>
        <p style={{ margin: 0, color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
          Chapdagi formani to‘ldirib «Churn ehtimolini hisoblash» tugmasini bosing. Bu yerda yopilish
          ehtimoli, yashab qolish ehtimoli va top-3 risk omillari chiqadi.
        </p>
      </Card>
    );
  }

  return <ResultsInner data={result} />;
};
