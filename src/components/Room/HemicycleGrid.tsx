import React, { useMemo, useState, useEffect } from 'react';
import { PROVINCES, Province } from '../../constants/provinces';
import { ProvinceNode } from './ProvinceNode';
import { VoteType } from '../../types';

interface HemicycleGridProps {
  provinceVotes: Record<string, VoteType | 'none'>;
  newlyVotedProv: string | null;
  selectedProv: string | null;
  onNodeClick: (provName: string) => void;
  userProvince?: string | null;
}

const ARC_CONFIG = [
  { count: 5, radius: 80,  provs: ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur"] },
  { count: 7, radius: 120, provs: ["Banten", "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan"] },
  { count: 8, radius: 160, provs: ["Bengkulu", "Lampung", "Kep. Bangka Belitung", "Kep. Riau", "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur"] },
  { count: 9, radius: 200, provs: ["Kalimantan Utara", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat"] },
  { count: 9, radius: 240, provs: ["Sulawesi Selatan", "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan", "Papua Barat Daya"] },
];

export const HemicycleGrid: React.FC<HemicycleGridProps> = ({
  provinceVotes,
  newlyVotedProv,
  selectedProv,
  onNodeClick,
  userProvince,
}) => {
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 360);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { nodes, scale, areaHeight } = useMemo(() => {
    const padding = 16;
    const availableWidth = Math.min(viewportWidth, 500) - (padding * 2);
    
    // We want the widest arc to fit in availableWidth
    // Max radius in config is 240. So baseWidth ~ 480.
    const baseWidth = 480; 
    let scale = availableWidth / baseWidth;
    if (scale > 1) scale = 1;

    const centerX = viewportWidth / 2;
    // We'll place the "focus point" of the arcs slightly below the top of the component
    // and grow the arcs downwards or upwards. 
    // To make it look like a parliament facing the podium (which is at the top),
    // the arcs should be "frown" shapes (concave down) or "smile" shapes (concave up).
    // Let's go with concave up (smile) for a modern "gathering" feel.
    const centerY = 20; 

    const nodePositions = ARC_CONFIG.flatMap((arc) => {
      const radius = arc.radius * scale;
      // Angle 20 to 160 degrees (a nice arc)
      const angleStart = 30;
      const angleEnd = 150;
      const angleRange = angleEnd - angleStart;

      return arc.provs.map((provName, i) => {
        const province = PROVINCES.find(p => p.name === provName);
        if (!province) return null;

        const angle = angleStart + (i * (angleRange / (arc.count - 1)));
        const angleRad = (angle * Math.PI) / 180;
        
        const x = centerX + radius * Math.cos(angleRad);
        const y = centerY + radius * Math.sin(angleRad);

        return {
          province,
          x,
          y,
          rowFraction: (angle - angleStart) / angleRange
        };
      });
    }).filter(Boolean) as { province: Province; x: number; y: number; rowFraction: number }[];

    // areaHeight should be max(y) + padding
    const maxScrollY = Math.max(...nodePositions.map(n => n.y), 100) + 60;

    return { nodes: nodePositions, scale, areaHeight: maxScrollY };
  }, [viewportWidth]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: `${areaHeight}px`,
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      {/* Subtle Arc Guides */}
      <svg
        style={{
          position: 'absolute',
          top: 40, left: 0, 
          width: '100%', height: '100%',
          pointerEvents: 'none',
          opacity: 0.15,
        }}
      >
        {ARC_CONFIG.map((arc, i) => {
          const r = arc.radius * scale;
          const startX = viewportWidth / 2 + r * Math.cos(30 * Math.PI / 180);
          const startY = 20 + r * Math.sin(30 * Math.PI / 180);
          const endX = viewportWidth / 2 + r * Math.cos(150 * Math.PI / 180);
          const endY = 20 + r * Math.sin(150 * Math.PI / 180);
          
          return (
            <path
              key={i}
              d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.province.name}
          style={{
            position: 'absolute',
            left: `${node.x}px`,
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <ProvinceNode
            province={node.province}
            voteStatus={provinceVotes[node.province.name] || 'none'}
            isSelected={selectedProv === node.province.name}
            isNew={newlyVotedProv === node.province.name}
            isUser={userProvince === node.province.name}
            onClick={() => onNodeClick(node.province.name)}
            rowFraction={node.rowFraction}
          />
        </div>
      ))}

      {/* Legenda */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: 0, right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
      }}>
        {[
          { label: 'Setuju',  color: 'var(--setuju)' },
          { label: 'Abstain', color: 'var(--abstain)' },
          { label: 'Tolak',   color: 'var(--tolak)' },
          { label: 'Belum',   color: 'var(--surface-3)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: item.color,
              display: 'inline-block',
            }} />
            <span style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 500
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
