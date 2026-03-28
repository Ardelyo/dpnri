import React from 'react';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle, action }) => {
  return (
    <div style={{
      padding: '40px 24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: '15px',
        color: 'var(--text-secondary)',
        margin: '0 0 8px',
        fontWeight: 400,
        lineHeight: 1.4,
      }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          margin: 0,
          fontFamily: 'var(--font-ui)',
        }}>
          {subtitle}
        </p>
      )}
      {action && (
        <div style={{ marginTop: '20px' }}>
          {action}
        </div>
      )}
    </div>
  );
};
