import React from 'react';
import { Card } from '../../components/ui/Card';
import type { BlockMockResult } from '../../types/orchestrator.types';

interface Props {
  blocks: BlockMockResult[];
}

const SIZE = 340;
const CENTER = SIZE / 2;
const MAX_RADIUS = 130;
const LEVELS = 4;

function polar(angleRad: number, r: number) {
  return {
    x: CENTER + r * Math.cos(angleRad),
    y: CENTER + r * Math.sin(angleRad),
  };
}

export const BlockRadarChart: React.FC<Props> = ({ blocks }) => {
  const n = blocks.length;

  const axes = blocks.map((b, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const end = polar(angle, MAX_RADIUS);
    const labelPos = polar(angle, MAX_RADIUS + 22);
    return { block: b, angle, end, labelPos };
  });

  const dataPoints = axes.map((a) => polar(a.angle, (a.block.score / 100) * MAX_RADIUS));
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';

  const gridLevels = Array.from({ length: LEVELS }, (_, i) => (i + 1) / LEVELS);

  return (
    <Card padding="lg" className="glass-panel" overflowVisible>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 auto' }}>
          <svg width={SIZE} height={SIZE} style={{ display: 'block' }}>
            {gridLevels.map((lvl, i) => {
              const points = axes
                .map((a) => {
                  const p = polar(a.angle, MAX_RADIUS * lvl);
                  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={i}
                  points={points}
                  fill="none"
                  stroke="var(--border-light)"
                  strokeWidth={1}
                  opacity={0.6}
                />
              );
            })}

            {axes.map((a, i) => (
              <line
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={a.end.x}
                y2={a.end.y}
                stroke="var(--border-light)"
                strokeWidth={1}
                opacity={0.5}
              />
            ))}

            <path
              d={dataPath}
              fill="var(--accent-primary)"
              fillOpacity={0.18}
              stroke="var(--accent-primary)"
              strokeWidth={2}
              strokeLinejoin="round"
            />

            {dataPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4}
                fill="var(--accent-primary)"
                stroke="var(--bg-primary)"
                strokeWidth={2}
              />
            ))}

            {axes.map((a, i) => (
              <g key={i}>
                <text
                  x={a.labelPos.x}
                  y={a.labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--text-primary)"
                  fontSize={13}
                  fontWeight={600}
                >
                  {a.block.code}
                </text>
                <text
                  x={a.labelPos.x}
                  y={a.labelPos.y + 14}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--text-muted)"
                  fontSize={11}
                >
                  {a.block.score}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '260px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
            Bloklar bo'yicha skorlar
          </h3>
          {blocks.map((b) => {
            const color =
              b.verdict === 'positive'
                ? 'var(--success)'
                : b.verdict === 'neutral'
                ? 'var(--warning)'
                : 'var(--danger)';
            return (
              <div
                key={b.code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.88rem',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color,
                    flexShrink: 0,
                  }}
                >
                  {b.code}
                </div>
                <div style={{ flex: 1, color: 'var(--text-secondary)', minWidth: 0 }}>
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {b.title}
                  </div>
                </div>
                <div style={{ width: 90, height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${b.score}%`,
                      height: '100%',
                      background: color,
                      transition: 'width 1s ease',
                    }}
                  />
                </div>
                <div style={{ width: 38, textAlign: 'right', fontWeight: 600, color }}>
                  {b.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
