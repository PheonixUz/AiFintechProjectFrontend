import React, { useState } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  AlertCircle, ChevronDown, ChevronUp, MapPin,
  Percent, DollarSign, Activity, TrendingUp, Info,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { MarketSizingResponse, MethodologyNotes } from '../../types/api.types';

// ─── API field notes (faqat tooltipda) ─────────────────────────────────────
const rootFieldNote = (result: MarketSizingResponse, fieldKey: string): string | undefined => {
  const v = (result as unknown as Record<string, unknown>)[`${fieldKey}_note`];
  return typeof v === 'string' && v.trim() ? v : undefined;
};

const methodologyFieldNote = (notes: MethodologyNotes | undefined, baseKey: string): string | undefined => {
  const v = notes?.[`${baseKey}_note`];
  return typeof v === 'string' && v.trim() ? v : undefined;
};

const mergeNotes = (...parts: (string | undefined | null | false)[]): string =>
  parts.filter((p): p is string => typeof p === 'string' && Boolean(p.trim())).join('\n\n');

// ─── Metodologiya: har qatorda 2 ta teng ustun ────────────────────────────────
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
  minHeight: '88px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  justifyContent: 'flex-start',
};

const methodologyLabel: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  lineHeight: 1.35,
};

const methodologyValueRow: React.CSSProperties = {
  fontWeight: 600,
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexWrap: 'wrap',
};

// ─── Utility: safe parse number from string or number ───────────────────────
const parseNum = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = value.replace(/[^\d.eE+\-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// ─── Utility: format UZS currency ────────────────────────────────────────────
const formatCurrency = (value: string | number | undefined | null): string => {
  const num = parseNum(value);
  if (num === 0) return '0 UZS';
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)} trln UZS`;
  if (num >= 1e9)  return `${(num / 1e9).toFixed(1)} mlrd UZS`;
  if (num >= 1e6)  return `${(num / 1e6).toFixed(0)} mln UZS`;
  if (num >= 1e3)  return `${(num / 1e3).toFixed(0)} ming UZS`;
  return `${num.toFixed(0)} UZS`;
};

// ─── Utility: safe percentage display ────────────────────────────────────────
const formatPct = (value: number | undefined | null, decimals = 1): string => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return value.toFixed(decimals);
};

// ─── Confidence score helpers (API returns 0–1 float) ────────────────────────
const toConfidencePct = (score: number | undefined | null): number => {
  if (score === undefined || score === null || isNaN(score)) return 0;
  return score <= 1 ? Math.round(score * 100) : Math.round(score);
};

const getConfidenceColor = (score: number | undefined | null): string => {
  const pct = toConfidencePct(score);
  if (pct < 40) return 'var(--error)';
  if (pct < 70) return 'var(--warning)';
  return 'var(--success)';
};

const getConfidenceLabel = (score: number | undefined | null): string => {
  const pct = toConfidencePct(score);
  if (pct < 40) return 'Past';
  if (pct < 70) return "O'rta";
  return 'Yuqori';
};

// ─── Confidence threshold description ────────────────────────────────────────
const getConfidenceNote = (score: number | undefined | null): string => {
  const pct = toConfidencePct(score);
  if (pct >= 95) return '≥10 000 tranzaksiya — juda ishonchli';
  if (pct >= 80) return '≥1 000 tranzaksiya — ishonchli';
  if (pct >= 60) return '≥100 tranzaksiya — qoniqarli';
  if (pct >= 40) return '≥10 tranzaksiya — cheklangan';
  return '<10 tranzaksiya — ehtiyotkorlik bilan';
};

// ─── Small inline note component (Hover Tooltip) ─────────────────────────────
const Note: React.FC<{ text: string }> = ({ text }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        marginLeft: '6px', 
        position: 'relative',
        cursor: 'help',
        verticalAlign: 'middle'
      }}
    >
      <Info 
        size={14} 
        style={{ 
          color: isHovered ? 'var(--accent-primary)' : 'var(--text-muted)', 
          opacity: isHovered ? 1 : 0.7,
          transition: 'all 0.2s ease'
        }} 
      />
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: 1.5,
            whiteSpace: 'pre-line',
            width: 'max-content',
            maxWidth: '280px',
            textAlign: 'center',
            zIndex: 50,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none'
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
export const MarketSizingResults: React.FC = () => {
  const { result, niche } = useAnalysisStore();
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  if (!result) return null;

  const confidencePct = toConfidencePct(result.confidence_score);
  const marketSharePct = Math.min(100, Math.max(0, result.market_share_pct ?? 0));
  // API 0–1 oraliqda qaytaradi → ko'rsatish uchun ×100
  const growthRate  = (result.market_growth_rate_pct ?? 0) * 100;
  const grossMargin = (result.gross_margin_pct ?? 0) * 100;
  const dataWeightPct = Math.round((result.data_weight ?? 0) * 100);
  const bayesianTopDownPct = result.methodology_notes?.bayesian_weight_top_down != null
    ? Math.round((result.methodology_notes.bayesian_weight_top_down as number) * 100)
    : null;

  const calcDate =
    result.methodology_notes?.calculation_date ||
    new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-slide-up">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            Tahlil Natijalari: {niche || result.mcc_code} — {result.city}
          </h2>
          {/* mcc_code — inputdan ko'chirilgan, tahlil qaysi kategoriyaga tegishli */}
          <Badge variant="info">MCC: {result.mcc_code}</Badge>
          {result.from_cache && (
            /* from_cache — bir xil so'rov qayta yuborilganda True bo'ladi */
            <Badge variant="warning">Keshdan</Badge>
          )}
        </div>

        {/* confidence_score — bank tranzaksiya hajmiga qarab 0.20–0.95 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Ishonch darajasi:</span>
            <span style={{ fontWeight: 600, color: getConfidenceColor(result.confidence_score) }}>
              {confidencePct}% [{getConfidenceLabel(result.confidence_score)}]
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${confidencePct}%`,
                backgroundColor: getConfidenceColor(result.confidence_score),
                transition: 'width 1s ease-in-out',
              }}
            />
          </div>
          <Note text={mergeNotes(rootFieldNote(result, 'confidence_score'), getConfidenceNote(result.confidence_score))} />
        </div>
      </div>

      {/* ── TAM / SAM / SOM Funnel ── */}
      <Card padding="lg" className="glass-panel" overflowVisible>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Bozor Hajmi (Funnel)</h3>
            <Note text={mergeNotes(
              rootFieldNote(result, 'tam_uzs'),
              rootFieldNote(result, 'sam_uzs'),
              rootFieldNote(result, 'som_uzs'),
              "Qavs ichidagi raqamlar taxminan ±30% ishonch oralig'ini bildiradi"
            )} />
          </div>

          {/* TAM — butun shahar bo'yicha yillik bozor aylanmasi */}
          <div style={{
            width: '100%',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#60a5fa' }}>TAM — Umumiy bozor</div>
                <Note text={mergeNotes(
                  rootFieldNote(result, 'tam_uzs'),
                  `Butun ${result.city} bo'yicha MCC ${result.mcc_code} bizneslarining yillik aylanmasi`,
                  'Hisob: bank tranzaksiyalari × w + benchmark × (1−w)'
                )} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#60a5fa' }}>
                {formatCurrency(result.tam_uzs)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                [{formatCurrency(result.tam_low_uzs)} – {formatCurrency(result.tam_high_uzs)}]
              </div>
            </div>
          </div>

          {/* SAM — radius ichidagi bozor */}
          <div style={{
            width: '85%',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#a78bfa' }}>SAM — Qamrab olish mumkin</div>
                <Note text={mergeNotes(
                  rootFieldNote(result, 'sam_uzs'),
                  "Faqat tanlangan radius ichidagi raqobatchilarning yillik aylanmasi",
                  '"Atrofimda shu nishada qancha pul aylanmoqda?"'
                )} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a78bfa' }}>
                {formatCurrency(result.sam_uzs)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                [{formatCurrency(result.sam_low_uzs)} – {formatCurrency(result.sam_high_uzs)}]
              </div>
            </div>
          </div>

          {/* SOM — realistik ulush */}
          <div style={{
            width: '70%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#34d399' }}>SOM — Haqiqiy ulush</div>
                <Note text={mergeNotes(
                  rootFieldNote(result, 'som_uzs'),
                  "Hisob: SAM × 1/(raqobatchilar+1) × sifat_koeffitsiyenti",
                  'Eng muhim raqam — kapitalingiz bilan solishtiring'
                )} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399' }}>
                {formatCurrency(result.som_uzs)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                [{formatCurrency(result.som_low_uzs)} – {formatCurrency(result.som_high_uzs)}]
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Kontekst ko'rsatkichlari ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>

        {/* market_share_pct — 1/(raqobatchilar+1) × 100 */}
        <Card padding="md" className="glass-panel" overflowVisible>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <Percent size={16} />
            <span style={{ fontSize: '0.9rem' }}>Bozor ulushi</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {formatPct(marketSharePct)}%
            <Note text={mergeNotes(
              rootFieldNote(result, 'market_share_pct'),
              `Hisob: 1 / (${result.competitor_count_radius} + 1) × 100 — teng bo'linish ssenariysi`
            )} />
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
            <div style={{
              height: '100%',
              width: `${marketSharePct}%`,
              backgroundColor: 'var(--accent-primary)',
              transition: 'width 1s ease-in-out',
            }} />
          </div>
        </Card>

        {/* market_growth_rate_pct — benchmarkdan, 0-1 → ×100 */}
        <Card padding="md" className="glass-panel" overflowVisible>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <Activity size={16} />
            <span style={{ fontSize: '0.9rem' }}>O'sish sur'ati</span>
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: growthRate >= 0 ? 'var(--success)' : 'var(--error)',
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px',
            flexWrap: 'wrap',
          }}>
            <span>
              {growthRate > 0 ? '+' : ''}{formatPct(growthRate)}%
              <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>/yil</span>
            </span>
            <Note text={mergeNotes(
              rootFieldNote(result, 'market_growth_rate_pct'),
              "DB benchmark ma'lumotidan — nisha kengaymoqdami yoki qisqarmoqda?"
            )} />
          </div>
        </Card>

        {/* gross_margin_pct — benchmarkdan, 0-1 → ×100 */}
        <Card padding="md" className="glass-panel" overflowVisible>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <DollarSign size={16} />
            <span style={{ fontSize: '0.9rem' }}>Brutto marja</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {formatPct(grossMargin)}%
            <Note text={mergeNotes(
              rootFieldNote(result, 'gross_margin_pct'),
              "DB benchmark ma'lumotidan — daromadning xarajatlar chegirilib qoladigan foizi",
              'ROI va rentabellik modellarida asosiy kirish'
            )} />
          </div>
        </Card>

        {/* competitor_count_radius — market_share_pct ni belgilaydi */}
        <Card padding="md" className="glass-panel" overflowVisible>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <MapPin size={16} />
            <span style={{ fontSize: '0.9rem' }}>Raqobatchilar</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {result.competitor_count_radius ?? 0} ta
            <Note text={mergeNotes(
              rootFieldNote(result, 'competitor_count_radius'),
              'Tanlangan radius ichida topilgan shu MCC kodli bizneslar soni',
              "Bu raqam bozor ulushini (SOM) to'g'ridan-to'g'ri belgilaydi"
            )} />
          </div>
        </Card>

      </div>

      {/* ── Tahlil (analysis_summary) ── */}
      <Card padding="lg" className="glass-panel" overflowVisible>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <AlertCircle size={20} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Tahlili</h3>
          <Note text={mergeNotes(
            result.analysis_summary_note,
            'Gemini AI tomonidan avtomatik tayyorlangan — SOM va kapital nisbati, nisha perspektivi, asosiy xavflar'
          )} />
        </div>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {result.analysis_summary ? (
            <ReactMarkdown>{result.analysis_summary}</ReactMarkdown>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Tahlil mavjud emas.</span>
          )}
        </div>
      </Card>

      {/* ── Metodologiya (methodology_notes) ── */}
      <Card padding="md" className="glass-panel" overflowVisible>
        <div style={{ cursor: 'pointer' }} onClick={() => setMethodologyOpen(!methodologyOpen)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <TrendingUp size={18} color="var(--text-muted)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>Metodologiya ma'lumotlari</h3>
              <span onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex' }}>
                <Note text={mergeNotes(
                  methodologyFieldNote(result.methodology_notes, 'methodology'),
                  "Bayesian birlashtirish og'irliklari, bottom-up / top-down TAM va SAM bo'yicha qisqa ma'lumot"
                )} />
              </span>
            </div>
            {methodologyOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        {methodologyOpen && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Qator 1: Bayesian og'irliklari (2 teng ustun) */}
              <div style={methodologyRow}>
                <div style={methodologyCell}>
                  <div style={methodologyLabel}>Umumiy Bayesian og'irlik (data_weight)</div>
                  <div style={methodologyValueRow}>
                    {dataWeightPct}%
                    <Note text={mergeNotes(
                      methodologyFieldNote(result.methodology_notes, 'data_weight'),
                      rootFieldNote(result, 'data_weight'),
                      `${dataWeightPct}% bank ma'lumotiga, ${100 - dataWeightPct}% benchmarkga`,
                      dataWeightPct >= 70
                        ? 'Hisob asosan haqiqiy bank tranzaksiyalariga asoslangan'
                        : "DB da kam tranzaksiya — hisob ko'proq benchmarkka tayanmoqda"
                    )} />
                  </div>
                </div>
                <div style={methodologyCell}>
                  <div style={methodologyLabel}>Top-down ulushi (bank tranzaksiyalari)</div>
                  <div style={methodologyValueRow}>
                    {bayesianTopDownPct !== null ? (
                      <>
                        {bayesianTopDownPct}%
                        <Note text={mergeNotes(
                          methodologyFieldNote(result.methodology_notes, 'bayesian_weight_top_down'),
                          `Top-down (bank): ${bayesianTopDownPct}%, Bottom-up (benchmark): ${100 - bayesianTopDownPct}%`,
                          "data_weight ning metodologiyadagi izoh ko'rinishi"
                        )} />
                      </>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>—</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Qator 2: TAM bottom-up | TAM top-down */}
              {(result.methodology_notes?.tam_bottom_up_uzs || result.methodology_notes?.tam_top_down_uzs) && (
                <div style={methodologyRow}>
                  <div style={methodologyCell}>
                    <div style={methodologyLabel}>TAM — Bottom-up (benchmark)</div>
                    <div style={methodologyValueRow}>
                      {result.methodology_notes?.tam_bottom_up_uzs ? (
                        <>
                          {formatCurrency(result.methodology_notes.tam_bottom_up_uzs)}
                          <Note text={mergeNotes(
                            methodologyFieldNote(result.methodology_notes, 'tam_bottom_up_uzs'),
                            "Raqobatchilar soni × o'rtacha benchmark daromadi × 12 oy"
                          )} />
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>—</span>
                      )}
                    </div>
                  </div>
                  <div style={methodologyCell}>
                    <div style={methodologyLabel}>TAM — Top-down (bank tranzaksiyalari)</div>
                    <div style={methodologyValueRow}>
                      {result.methodology_notes?.tam_top_down_uzs ? (
                        <>
                          {formatCurrency(result.methodology_notes.tam_top_down_uzs)}
                          <Note text={mergeNotes(
                            methodologyFieldNote(result.methodology_notes, 'tam_top_down_uzs'),
                            "Haqiqiy bank to'lov ma'lumotlaridan olingan yillik aylanma"
                          )} />
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>—</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Qator 3: SAM bottom-up | SAM top-down */}
              {(result.methodology_notes?.sam_bottom_up_uzs || result.methodology_notes?.sam_top_down_uzs) && (
                <div style={methodologyRow}>
                  <div style={methodologyCell}>
                    <div style={methodologyLabel}>SAM — Bottom-up (benchmark)</div>
                    <div style={methodologyValueRow}>
                      {result.methodology_notes?.sam_bottom_up_uzs ? (
                        <>
                          {formatCurrency(result.methodology_notes.sam_bottom_up_uzs)}
                          <Note text={mergeNotes(
                            methodologyFieldNote(result.methodology_notes, 'sam_bottom_up_uzs'),
                            'Radius ichidagi raqobatchilar × benchmark daromadi × 12 oy'
                          )} />
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>—</span>
                      )}
                    </div>
                  </div>
                  <div style={methodologyCell}>
                    <div style={methodologyLabel}>SAM — Top-down (bank tranzaksiyalari)</div>
                    <div style={methodologyValueRow}>
                      {result.methodology_notes?.sam_top_down_uzs ? (
                        <>
                          {formatCurrency(result.methodology_notes.sam_top_down_uzs)}
                          <Note text={mergeNotes(
                            methodologyFieldNote(result.methodology_notes, 'sam_top_down_uzs'),
                            "Radius ichidagi bank to'lovlaridan olingan yillik aylanma"
                          )} />
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>—</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Note text={mergeNotes(
                methodologyFieldNote(result.methodology_notes, 'calculation_meta'),
                `Hisob sanasi: ${calcDate}`,
                "Barcha qiymatlar taxminan ±30% ishonch oralig'iga ega",
                confidencePct < 40
                  ? "Ishonch darajasi past — natijalar taxminiy, ehtiyotkorlik tavsiya etiladi"
                  : undefined
              )} />
            </div>
          </div>
        )}
      </Card>

    </div>
  );
};
