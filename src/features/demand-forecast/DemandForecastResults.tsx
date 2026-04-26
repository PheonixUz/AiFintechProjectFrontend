import React, { useMemo, useState } from 'react';
import { useDemandForecastStore } from '../../store/demandForecastStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Activity, ChevronDown, ChevronUp, Info, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { DemandForecastPointOut, DemandForecastResponse, MethodologyNotes } from '../../types/api.types';

const parseNum = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return Number.isNaN(value) ? 0 : value;
  const cleaned = value.replace(/[^\d.eE+\-]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
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

const formatMonth = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short' });
};

const toConfidencePct = (score: number | undefined | null): number => {
  if (score === undefined || score === null || Number.isNaN(score)) return 0;
  return score <= 1 ? Math.round(score * 100) : Math.round(score);
};

const toDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const methodologyRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: '16px',
  alignItems: 'stretch',
};

const methodologyCell: React.CSSProperties = {
  padding: '14px 16px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--bg-secondary)',
  minHeight: '72px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
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
            maxWidth: 320,
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

const MetricsStrip: React.FC<{ result: DemandForecastResponse }> = ({ result }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '12px',
    }}
  >
    <div style={methodologyCell}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ishonch (model)</span>
      <strong>{toConfidencePct(result.confidence_score)}%</strong>
    </div>
    <div style={methodologyCell}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>O‘qitish oylari</span>
      <strong>{result.training_sample_size}</strong>
    </div>
    {result.train_mape_pct != null && (
      <div style={methodologyCell}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Train MAPE %</span>
        <strong>{result.train_mape_pct.toFixed(2)}</strong>
      </div>
    )}
    {result.train_rmse_uzs != null && (
      <div style={methodologyCell}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Train RMSE</span>
        <strong style={{ fontSize: '0.9rem' }}>{formatCurrency(result.train_rmse_uzs)}</strong>
      </div>
    )}
    <div style={methodologyCell}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anomaliyalar</span>
      <strong>{result.anomaly_count ?? 0}</strong>
    </div>
    <div style={methodologyCell}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yangi raqobatchi (12 oy)</span>
      <strong>{result.new_competitor_count_recent ?? 0}</strong>
    </div>
  </div>
);

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const MethodologyCell: React.FC<{ label: string; value: unknown }> = ({ label, value }) => {
  if (isPlainObject(value)) {
    const subEntries = Object.entries(value).filter(
      ([, sv]) => sv !== undefined && sv !== null
    );
    return (
      <div style={{ ...methodologyCell, gap: 8 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {subEntries.map(([sk, sv]) => (
            <div
              key={sk}
              style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: '0.82rem' }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>{sk}</span>
              <span style={{ fontWeight: 600, wordBreak: 'break-all' }}>{toDisplayValue(sv)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={methodologyCell}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
        {toDisplayValue(value)}
      </span>
    </div>
  );
};

const MethodologyBlock: React.FC<{ notes: MethodologyNotes }> = ({ notes }) => {
  const entries = Object.entries(notes).filter(
    ([, v]) => v !== undefined && v !== null && toDisplayValue(v).trim().length > 0
  );
  if (entries.length === 0) return null;
  const mid = Math.ceil(entries.length / 2);
  const left = entries.slice(0, mid);
  const right = entries.slice(mid);
  return (
    <div style={{ marginTop: '8px' }}>
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Activity size={18} /> Metodologiya
      </h3>
      <div style={methodologyRow}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {left.map(([k, v]) => (
            <MethodologyCell key={k} label={k} value={v} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {right.map(([k, v]) => (
            <MethodologyCell key={k} label={k} value={v} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PointsTable: React.FC<{ points: DemandForecastPointOut[] }> = ({ points }) => {
  const maxPred = useMemo(
    () => Math.max(...points.map((p) => parseNum(p.predicted_revenue_uzs)), 1),
    [points]
  );
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? points : points.slice(0, 6);

  return (
    <div style={{ marginTop: '16px' }}>
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <TrendingUp size={18} /> Oyma-oy prognoz
      </h3>
      <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px' }}>Oy</th>
              <th style={{ padding: '10px 12px' }}>Prognoz</th>
              <th style={{ padding: '10px 12px' }}>Oraliq</th>
              <th style={{ padding: '10px 12px' }}>Trend / mavsum</th>
              <th style={{ padding: '10px 12px' }}>Tashqi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const w = (parseNum(p.predicted_revenue_uzs) / maxPred) * 100;
              return (
                <tr key={`${p.forecast_month}-${p.horizon_index}`} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    {formatMonth(p.forecast_month)}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>#{p.horizon_index}</div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 600 }}>{formatCurrency(p.predicted_revenue_uzs)}</div>
                    <div
                      style={{
                        height: 4,
                        marginTop: 6,
                        borderRadius: 2,
                        background: 'var(--bg-tertiary)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${w}%`,
                          height: '100%',
                          background: 'var(--accent-primary)',
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                    {formatCurrency(p.lower_revenue_uzs)} — {formatCurrency(p.upper_revenue_uzs)}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '0.8rem' }}>
                    {p.trend_component_uzs != null && (
                      <div>Trend: {formatCurrency(p.trend_component_uzs)}</div>
                    )}
                    {p.seasonal_component_uzs != null && (
                      <div>Mavsum: {formatCurrency(p.seasonal_component_uzs)}</div>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '0.78rem' }}>
                    {p.macro_adjustment_pct != null && <div>Macro: {p.macro_adjustment_pct.toFixed(2)}%</div>}
                    {p.competitor_pressure_pct != null && (
                      <div>Raqobat: {p.competitor_pressure_pct.toFixed(2)}%</div>
                    )}
                    {p.event_flags && p.event_flags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                        {p.event_flags.map((f) => (
                          <Badge key={f} variant="info" size="sm">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {points.length > 6 && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          style={{
            marginTop: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--accent-primary)',
            fontSize: '0.9rem',
          }}
        >
          {expanded ? (
            <>
              <ChevronUp size={18} /> Qisqartirish
            </>
          ) : (
            <>
              <ChevronDown size={18} /> Barcha {points.length} oy
            </>
          )}
        </button>
      )}
    </div>
  );
};

export const DemandForecastResults: React.FC = () => {
  const result = useDemandForecastStore((s) => s.result);
  if (!result) return null;

  return (
    <div style={{ marginTop: 16 }}>
    <Card padding="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 8 }}>
            {result.niche}{' '}
            <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '1rem' }}>
              MCC {result.mcc_code} · {result.city}
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Gorizont: {result.horizon_months} oy · interval:{' '}
            {toConfidencePct(result.confidence_level)}%
            <Note text="Backend qaytargan umumiy ishonch va oy kesimidagi interval darajasi." />
          </p>
        </div>

        <MetricsStrip result={result} />

        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 10 }}>Xulosa</h3>
          <div className="markdown-body" style={{ fontSize: '0.95rem', lineHeight: 1.55 }}>
            <ReactMarkdown>{result.analysis_summary}</ReactMarkdown>
          </div>
        </div>

        <MethodologyBlock notes={result.methodology_notes} />

        <PointsTable points={result.points} />
      </div>
    </Card>
    </div>
  );
};
