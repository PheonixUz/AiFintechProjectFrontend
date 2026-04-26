import React from 'react';
import { Card } from '../../components/ui/Card';
import { Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  recommendations: string[];
  risks: string[];
  opportunities: string[];
}

interface ColumnProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  items: string[];
}

const Column: React.FC<ColumnProps> = ({ title, icon, color, bg, items }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      minWidth: 0,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-sm)',
          background: bg,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</h4>
    </div>

    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            padding: '8px 10px',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              minWidth: 22,
              height: 22,
              borderRadius: 'var(--radius-sm)',
              background: bg,
              color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const RecommendationsPanel: React.FC<Props> = ({ recommendations, risks, opportunities }) => {
  return (
    <Card padding="lg" className="glass-panel" overflowVisible>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>
          AI tavsiyalar va insights
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Barcha 35 modul natijalaridan avtomatik ajratilgan eng muhim signallar
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        <Column
          title="Tavsiyalar"
          icon={<Lightbulb size={16} />}
          color="var(--accent-primary)"
          bg="rgba(59, 130, 246, 0.12)"
          items={recommendations}
        />
        <Column
          title="Asosiy risklar"
          icon={<ShieldAlert size={16} />}
          color="var(--danger)"
          bg="var(--danger-bg)"
          items={risks}
        />
        <Column
          title="Imkoniyatlar"
          icon={<Sparkles size={16} />}
          color="var(--success)"
          bg="var(--success-bg)"
          items={opportunities}
        />
      </div>
    </Card>
  );
};
