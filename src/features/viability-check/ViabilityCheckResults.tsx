import React, { useMemo, useState } from 'react';
import { useViabilityCheckStore } from '../../store/viabilityCheckStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { MethodologyNotes, ViabilityCashflowMonthOut, ViabilityCheckResponse } from '../../types/api.types';

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

const formatPct = (x: number | undefined | null, digits = 1): string => {
  if (x == null || Number.isNaN(x)) return '—';
  const p = x <= 1 ? x * 100 : x;
  return `${p.toFixed(digits)}%`;
};

const recVariant = (rec: string): 'success' | 'warning' | 'danger' | 'default' => {
  const r = rec.toLowerCase();
  if (r.includes('approve')) return 'success';
  if (r.includes('reject')) return 'danger';
  if (r.includes('review')) return 'warning';
  return 'default';
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

const Kpi: React.FC<{ label: string; value: React.ReactNode; hint?: string }> = ({ label, value, hint }) => (
  <div style={methodologyCell}>
    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 6 }}>
      {label}
      {hint && <Note text={hint} />}
    </div>
    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{value}</div>
  </div>
);

const MethodologyBlock: React.FC<{ notes: MethodologyNotes }> = ({ notes }) => {
  const [open, setOpen] = useState(false);
  const entries = useMemo(() => Object.entries(notes || {}).filter(([, v]) => v != null && v !== ''), [notes]);
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
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 4 }}>{k}</div>
              <div>{String(v)}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const CashflowTable: React.FC<{ rows: ViabilityCashflowMonthOut[] }> = ({ rows }) => {
  const [expanded, setExpanded] = useState(false);
  const show = expanded ? rows : rows.slice(0, 6);
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Oyma-oy cashflow</h3>
        {rows.length > 6 && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {expanded ? 'Qisqartirish' : `Barchasi (${rows.length})`}
          </button>
        )}
      </div>
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '8px 6px' }}>Oy</th>
              <th style={{ padding: '8px 6px' }}>Revenue</th>
              <th style={{ padding: '8px 6px' }}>Net CF</th>
              <th style={{ padding: '8px 6px' }}>Kum. p50</th>
              <th style={{ padding: '8px 6px' }}>P(manfiy)</th>
              <th style={{ padding: '8px 6px' }}>BE</th>
            </tr>
          </thead>
          <tbody>
            {show.map((r) => (
              <tr
                key={r.month_index}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: r.is_break_even_month ? 'rgba(34, 197, 94, 0.08)' : undefined,
                }}
              >
                <td style={{ padding: '8px 6px', fontWeight: 600 }}>{r.month_index}</td>
                <td style={{ padding: '8px 6px' }}>{formatCurrency(r.expected_revenue_uzs)}</td>
                <td style={{ padding: '8px 6px' }}>{formatCurrency(r.net_cashflow_uzs)}</td>
                <td style={{ padding: '8px 6px' }}>{formatCurrency(r.cumulative_cash_p50_uzs)}</td>
                <td style={{ padding: '8px 6px' }}>{formatPct(r.probability_negative_cash, 0)}</td>
                <td style={{ padding: '8px 6px' }}>{r.is_break_even_month ? '✓' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const ResultsInner: React.FC<{ data: ViabilityCheckResponse }> = ({ data }) => {
  const conf = data.confidence_score <= 1 ? Math.round(data.confidence_score * 100) : Math.round(data.confidence_score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Natija: {data.niche}
        </h2>
        <Badge variant={recVariant(data.recommendation)}>{data.recommendation}</Badge>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          run #{data.run_id}
          {data.assumption_id != null ? ` · assumption #${data.assumption_id}` : ''}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px',
        }}
      >
        <Kpi label="Viability score" value={data.viability_score.toFixed(0)} hint="0–100 umumiy baho" />
        <Kpi label="Ishonch" value={`${conf}%`} />
        <Kpi
          label="Break-even oyi"
          value={data.break_even_month != null ? `${data.break_even_month}-oy` : '24 oy ichida yo‘q'}
        />
        <Kpi label="Runway" value={`${data.runway_months.toFixed(1)} oy`} hint="Kapital tugamaguncha taxminiy muddat" />
        <Kpi
          label="24 oy survival"
          value={formatPct(data.survival_probability_24m)}
          hint="Biznes yashab qolish ehtimoli"
        />
        <Kpi
          label="Cash-out xavfi"
          value={formatPct(data.cash_out_probability_24m)}
          hint="Pul tugab qolish ehtimoli"
        />
        <Kpi label="24 oy BE ehtimoli" value={formatPct(data.probability_break_even_24m)} />
        <Kpi label="Yakuniy cash (median)" value={formatCurrency(data.median_final_cash_uzs)} />
        <Kpi label="Final cash (p10 / p90)" value={`${formatCurrency(data.p10_final_cash_uzs)} / ${formatCurrency(data.p90_final_cash_uzs)}`} />
        <Kpi label="Eng yomon oy (cash)" value={formatCurrency(data.worst_month_cash_uzs)} />
        <Kpi label="Min. qo‘shimcha kapital" value={formatCurrency(data.min_required_capital_uzs)} />
      </div>

      <Card>
        <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600 }}>Xulosa</h3>
        <div className="markdown-body" style={{ fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
          <ReactMarkdown>{data.analysis_summary}</ReactMarkdown>
        </div>
      </Card>

      <CashflowTable rows={data.cashflow_months} />
      <MethodologyBlock notes={data.methodology_notes} />
    </div>
  );
};

export const ViabilityCheckResults: React.FC = () => {
  const result = useViabilityCheckStore((s) => s.result);

  if (!result) {
    return (
      <Card>
        <p style={{ margin: 0, color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
          Chapdagi formani to‘ldirib, hisoblashni boshlang. Bu yerda break-even, runway, survival va oyma-oy
          cashflow chiqadi.
        </p>
      </Card>
    );
  }

  return <ResultsInner data={result} />;
};
