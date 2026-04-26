import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { ModuleCard } from './ModuleCard';
import type { BlockMockResult } from '../../types/orchestrator.types';

interface Props {
  block: BlockMockResult;
  defaultOpen?: boolean;
}

const verdictColor = (v: BlockMockResult['verdict']): string => {
  if (v === 'positive') return 'var(--success)';
  if (v === 'neutral') return 'var(--warning)';
  return 'var(--danger)';
};

export const BlockSection: React.FC<Props> = ({ block, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  const color = verdictColor(block.verdict);

  return (
    <Card padding="lg" className="glass-panel" overflowVisible>
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', minWidth: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: `1px solid ${color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 700,
              color,
              flexShrink: 0,
            }}
          >
            {block.code}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '2px' }}>
              Blok {block.code}: {block.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {block.description}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-secondary)',
              border: `1px solid ${color}`,
              color,
              fontWeight: 700,
              fontSize: '0.95rem',
              minWidth: 60,
              textAlign: 'center',
            }}
          >
            {block.score}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {block.modules.length} modul
          </div>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {open && (
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-light)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '12px',
          }}
        >
          {block.modules.map((m) => (
            <ModuleCard key={m.code} module={m} />
          ))}
        </div>
      )}
    </Card>
  );
};
