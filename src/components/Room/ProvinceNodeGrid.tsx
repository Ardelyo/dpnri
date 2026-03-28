import React, { useState, useEffect } from 'react';
import { getProvinceShort } from '../../constants/provinces';
import { VoteType } from '../../types';

interface ProvinceNodeGridProps {
  provinceVotes: Record<string, VoteType | 'none'>;
  newlyVotedProv: string | null;
  selectedProv: string | null;
  onNodeClick: (provName: string) => void;
  userProvince?: string | null;
}

const ROW_GROUPS = [
  // 5
  ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Banten"],
  // 7
  ["Bengkulu", "Lampung", "Kep. Bangka Belitung", "Kep. Riau", "Jawa Timur", "Bali", "Nusa Tenggara Barat"],
  // 9
  ["Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Kalimantan Barat", "Kalimantan Timur", "Kalimantan Selatan", "Kalimantan Utara"],
  // 9
  ["Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat", "Sulawesi Utara", "Nusa Tenggara Timur", "Kalimantan Tengah", "Sumatera Selatan"],
  // 8
  ["Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan", "Papua Barat Daya"]
];

function useNodeSize(maxNodesPerRow: number = 9) {
  const [nodeSize, setNodeSize] = useState({
    width: 32,
    height: 26,
    fontSize: 9,
    gap: 6,
  });

  useEffect(() => {
    function calculate() {
      // Limit container to essentially max mobile width 390
      const viewportWidth = window.innerWidth;
      const PADDING_TOTAL = 32; 
      let usableWidth = viewportWidth - PADDING_TOTAL;
      if (viewportWidth > 390) {
        usableWidth = 390 - PADDING_TOTAL;
      }
      
      const totalGap = (maxNodesPerRow - 1) * 6;
      const safetyMargin = 4;
      
      const maxWidth = Math.floor((usableWidth - totalGap - safetyMargin) / maxNodesPerRow);
      const nodeWidth = Math.max(24, Math.min(38, maxWidth));
      const nodeHeight = Math.round(nodeWidth * 0.8);
      const fontSize = Math.max(8, Math.round(nodeWidth * 0.28));
      
      setNodeSize({
        width: nodeWidth,
        height: nodeHeight,
        fontSize,
        gap: 6,
      });
    }
    
    calculate();
    
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(calculate, 50);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxNodesPerRow]);

  return nodeSize;
}

export const ProvinceNodeGrid: React.FC<ProvinceNodeGridProps> = ({
  provinceVotes,
  newlyVotedProv,
  selectedProv,
  onNodeClick,
  userProvince,
}) => {
  const nodeSize = useNodeSize(9);

  return (
    <div style={{ width: '100%', overflow: 'visible', padding: '0 16px' }}>
      {ROW_GROUPS.map((rowProvinces, rowIndex) => (
        <div 
          key={rowIndex}
          style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: `${nodeSize.gap}px`,
            marginBottom: rowIndex < ROW_GROUPS.length - 1 ? `${nodeSize.gap}px` : 0
          }}
        >
          {rowProvinces.map(provName => {
            const status = provinceVotes[provName] || 'none';
            const shortCode = getProvinceShort(provName);
            const isSelected = selectedProv === provName;
            const isNew = newlyVotedProv === provName;
            const isUser = userProvince === provName;
            
            // Base styles
            let bg = 'var(--surface-2)';
            let borderColor = 'var(--surface-3)';
            let color = 'var(--text-tertiary)';
            let opacity = 0.45;

            if (status === 'setuju') {
              bg = 'var(--setuju)';
              borderColor = 'var(--setuju)';
              color = '#ffffff';
              opacity = 1;
            } else if (status === 'tolak') {
              bg = 'var(--tolak)';
              borderColor = 'var(--tolak)';
              color = '#ffffff';
              opacity = 1;
            } else if (status === 'abstain') {
              bg = 'var(--abstain)';
              borderColor = 'var(--abstain)';
              color = '#ffffff';
              opacity = 1;
            }

            let transform = 'scale(1)';
            let boxShadow = isUser ? '0 0 0 2px var(--accent)' : 'none';
            
            if (isSelected) {
              transform = 'scale(1.05)';
              boxShadow = '0 0 0 2px var(--accent)';
            }
            if (isNew) {
              transform = 'scale(1.1)';
              boxShadow = '0 0 0 3px var(--accent)';
            }

            return (
              <div
                key={provName}
                onClick={() => onNodeClick(provName)}
                style={{
                  width: `${nodeSize.width}px`,
                  height: `${nodeSize.height}px`,
                  fontSize: `${nodeSize.fontSize}px`,
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  border: `1px solid ${borderColor}`,
                  background: bg,
                  color: color,
                  opacity: opacity,
                  cursor: 'pointer',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  transform: transform,
                  boxShadow: boxShadow,
                  transition: 'transform 150ms ease-out, background-color 300ms ease-out, border-color 300ms ease-out, opacity 300ms ease-out',
                }}
              >
                {shortCode}
              </div>
            );
          })}
        </div>
      ))}

      {/* Legenda */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        marginTop: '14px'
      }}>
        {[
          { label: 'Setuju',  color: 'var(--setuju)' },
          { label: 'Abstain', color: 'var(--abstain)' },
          { label: 'Tolak',   color: 'var(--tolak)' },
          { label: 'Belum',   color: 'var(--surface-3)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: item.color,
              flexShrink: 0
            }} />
            <span style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              fontFamily: 'system-ui, sans-serif',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
