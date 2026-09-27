import React from 'react';
import logoImage from '../assets/logo/sme360-ai-logo.png';

export default function Logo({ variant = 'header', className = '', height, alt = 'SME360 AI' }) {
  // Determine standard heights based on variant if height is not explicitly passed
  const getHeight = () => {
    if (height) return height;
    switch (variant) {
      case 'compact':
      case 'sidebar':
        return 38;
      case 'header':
      case 'navbar':
        return 44;
      case 'large':
      case 'splash':
        return 72;
      case 'card':
        return 52;
      default:
        return 44;
    }
  };

  const computedHeight = getHeight();

  return (
    <div 
      className={`sme-logo-wrapper sme-logo-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        userSelect: 'none'
      }}
    >
      <img
        src={logoImage}
        alt={alt}
        style={{
          height: `${computedHeight}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25))'
        }}
      />
    </div>
  );
}
