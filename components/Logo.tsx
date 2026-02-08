
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Recreating the provided logo with SVG paths */}
      <path 
        d="M30 45 C 15 45, 15 15, 45 15 C 75 15, 75 55, 45 85 C 15 85, 15 55, 30 55" 
        fill="none" 
        stroke="#FF4500" 
        strokeWidth="12" 
        strokeLinecap="round"
      />
      <path 
        d="M70 55 C 85 55, 85 85, 55 85 C 25 85, 25 45, 55 15 C 85 15, 85 45, 70 45" 
        fill="none" 
        stroke="#FF4500" 
        strokeWidth="12" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
