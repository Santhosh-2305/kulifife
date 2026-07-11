import React, { useState, useEffect } from 'react';

export default function InteractiveKulfi({ color = '#FFF9E6', onClick }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [drips, setDrips] = useState([]);

  const handleKulfiClick = () => {
    setIsAnimating(true);
    spawnDrip();
    if (onClick) onClick();
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Spawn dynamic drip particles under the kulfi
  const spawnDrip = () => {
    const newDrip = {
      id: Math.random(),
      left: Math.random() * 80 + 60, // position around the bottom tip
      delay: Math.random() * 0.2
    };
    setDrips(prev => [...prev, newDrip]);
  };

  // Clean up drips after animation completes
  useEffect(() => {
    if (drips.length > 0) {
      const timer = setTimeout(() => {
        setDrips([]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [drips]);

  // Adjust stroke colors based on kulfi body color for detail lines
  const darkStroke = 'rgba(0,0,0,0.15)';
  const lightStroke = 'rgba(255,255,255,0.25)';

  return (
    <div 
      className={`kulfi-svg-wrapper ${isAnimating ? 'animating' : ''}`}
      onClick={handleKulfiClick}
      style={{
        display: 'inline-block',
        position: 'relative',
        transform: isAnimating ? 'scale(0.95) rotate(-3deg)' : 'none',
        transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      {/* Dynamic Drops Container */}
      <div 
        className="kulfi-dripping-container" 
        style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: 0, 
          width: '100%', 
          height: '150px', 
          overflow: 'hidden', 
          zIndex: 10 
        }}
      >
        {drips.map((drip) => (
          <div
            key={drip.id}
            className="drip-particle"
            style={{
              left: `${drip.left}px`,
              backgroundColor: color,
              animationDelay: `${drip.delay}s`,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          />
        ))}
      </div>

      {/* Main Kulfi Popsicle SVG */}
      <svg 
        width="220" 
        height="320" 
        viewBox="0 0 220 320" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SVG Shadows */}
        <defs>
          <filter id="kulfiShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        <g filter="url(#kulfiShadow)">
          {/* Wooden Stick */}
          <path 
            d="M95 190 C95 190 95 295 95 295 C95 303 102 310 110 310 C118 310 125 303 125 295 C125 295 125 190 125 190 Z" 
            fill="#d2b48c" 
            stroke="#aa7c11" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Wooden grain lines */}
          <line x1="105" y1="210" x2="105" y2="280" stroke="#b08d57" strokeWidth="2" strokeLinecap="round" />
          <line x1="115" y1="225" x2="115" y2="270" stroke="#b08d57" strokeWidth="2" strokeLinecap="round" />

          {/* Ice Cream Mold Body */}
          <path 
            d="M50 40 
               C50 40 40 45 40 60 
               L45 190 
               C45 200 60 205 110 205 
               C160 205 175 200 175 190 
               L180 60 
               C180 45 170 40 170 40 
               L50 40 Z" 
            fill={color} 
            stroke={darkStroke} 
            strokeWidth="2.5" 
          />

          {/* Saffron strands or cardamom dots overlay depending on color */}
          {color === '#FFF9E6' && (
            <>
              {/* Saffron Strands */}
              <path d="M70 70 Q75 75 72 80" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M140 90 Q145 92 142 98" stroke="#ff3b30" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M100 130 Q105 128 103 135" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}

          {/* Pistachio pieces */}
          {color === '#E6F5D0' && (
            <>
              <circle cx="80" cy="80" r="3" fill="#2e8b57" />
              <circle cx="130" cy="110" r="2.5" fill="#556b2f" />
              <circle cx="95" cy="140" r="3" fill="#2e8b57" />
              <circle cx="150" cy="70" r="2" fill="#556b2f" />
            </>
          )}

          {/* Rose flakes */}
          {color === '#FFD6E8' && (
            <>
              <path d="M75 75 C75 75 80 70 82 75 C82 80 75 80 75 75" fill="#e91e63" />
              <path d="M145 130 C145 130 150 125 152 130 C152 135 145 135 145 130" fill="#e91e63" />
              <path d="M105 95 C105 95 110 90 112 95 C112 100 105 100 105 95" fill="#e91e63" />
            </>
          )}

          {/* Chocolate Almond chunks */}
          {color === '#EFEBE9' && (
            <>
              <polygon points="75,80 82,75 85,85" fill="#3e2723" />
              <polygon points="135,120 142,115 145,125" fill="#5d4037" />
              <polygon points="100,60 107,55 110,65" fill="#3e2723" />
            </>
          )}

          {/* Ridge Grooves (Vertical indents of kulfi mold) */}
          {/* Ridge 1 */}
          <path d="M72 50 L80 185" stroke={darkStroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
          <path d="M70 50 L78 185" stroke={lightStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

          {/* Ridge 2 */}
          <path d="M110 50 L110 190" stroke={darkStroke} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
          <path d="M108 50 L108 190" stroke={lightStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

          {/* Ridge 3 */}
          <path d="M148 50 L140 185" stroke={darkStroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
          <path d="M146 50 L138 185" stroke={lightStroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

          {/* Highlights and texture */}
          <path 
            d="M58 45 L50 182" 
            stroke="#fff" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            opacity="0.25" 
          />
        </g>
      </svg>
    </div>
  );
}
