import React from 'react';
import { motion } from 'motion/react';

interface VectorBirthdayCakeProps {
  candlesLit: boolean[];
  onToggleCandle: (index: number) => void;
}

export const VectorBirthdayCake: React.FC<VectorBirthdayCakeProps> = ({
  candlesLit,
  onToggleCandle,
}) => {
  // 5 Candles matching the illustration coordinates across the cake top
  const candleConfigs = [
    { id: 0, x: 135, y: 70, height: 95, color: '#0284c7', stripeColor: '#38bdf8' },
    { id: 1, x: 185, y: 62, height: 100, color: '#0284c7', stripeColor: '#38bdf8' },
    { id: 2, x: 235, y: 55, height: 105, color: '#0284c7', stripeColor: '#38bdf8' },
    { id: 3, x: 285, y: 62, height: 100, color: '#0284c7', stripeColor: '#38bdf8' },
    { id: 4, x: 335, y: 70, height: 95, color: '#0284c7', stripeColor: '#38bdf8' },
  ];

  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none">
      <svg
        viewBox="0 0 470 400"
        className="w-full h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flame Glow Filters */}
          <filter id="flame-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Candle Stripe Pattern */}
          <pattern id="candle-stripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="12" fill="#0284c7" />
            <rect x="6" width="6" height="12" fill="#38bdf8" />
          </pattern>
        </defs>

        {/* 1. BLUE PLATTER BASE (Bottom Plate) */}
        <ellipse cx="235" cy="310" rx="225" ry="75" fill="#0369a1" />
        <ellipse cx="235" cy="302" rx="205" ry="65" fill="#0284c7" />
        <ellipse cx="235" cy="298" rx="195" ry="58" fill="#075985" opacity="0.25" />

        {/* 2. MAIN CAKE BODY (Cream Cylinder) */}
        {/* Cake side cylinder */}
        <path
          d="M85 150 L85 270 C85 320, 385 320, 385 270 L385 150 Z"
          fill="#f3e8d2"
        />

        {/* Cake side shadow curve */}
        <path
          d="M85 240 C130 290, 340 290, 385 240 L385 270 C385 320, 85 320, 85 270 Z"
          fill="#e2d4bc"
          opacity="0.6"
        />

        {/* PINK DECORATIVE HORIZONTAL STRIPES ON CAKE BODY */}
        <path
          d="M85 180 C135 210, 335 210, 385 180 L385 198 C335 228, 135 228, 85 198 Z"
          fill="#e11d48"
        />
        <path
          d="M85 218 C135 248, 335 248, 385 218 L385 236 C335 266, 135 266, 85 236 Z"
          fill="#e11d48"
        />
        <path
          d="M85 256 C135 284, 335 284, 385 256 L385 272 C335 300, 135 300, 85 272 Z"
          fill="#e11d48"
        />

        {/* BOTTOM RASPBERRY / PINK FROSTING ICING DOLLOPS */}
        {[
          { cx: 88, cy: 280, r: 16 },
          { cx: 115, cy: 295, r: 17 },
          { cx: 148, cy: 308, r: 18 },
          { cx: 185, cy: 316, r: 19 },
          { cx: 222, cy: 320, r: 20 },
          { cx: 258, cy: 320, r: 20 },
          { cx: 295, cy: 316, r: 19 },
          { cx: 332, cy: 308, r: 18 },
          { cx: 365, cy: 295, r: 17 },
          { cx: 388, cy: 280, r: 16 },
        ].map((dollop, idx) => (
          <g key={idx}>
            <circle cx={dollop.cx} cy={dollop.cy} r={dollop.r} fill="#be123c" />
            <circle cx={dollop.cx - 2} cy={dollop.cy - 3} r={dollop.r - 2} fill="#e11d48" />
            <circle cx={dollop.cx - 4} cy={dollop.cy - 5} r={dollop.r * 0.35} fill="#fb7185" opacity="0.75" />
          </g>
        ))}

        {/* 3. CAKE TOP FROSTING SURFACE (Ellipse) */}
        <ellipse cx="235" cy="150" rx="150" ry="55" fill="#f7efe1" stroke="#e8dcbf" strokeWidth="2" />

        {/* TOP RIM RASPBERRY / PINK FROSTING DOLLOPS */}
        {[
          { cx: 98, cy: 152, r: 10 },
          { cx: 118, cy: 122, r: 9 },
          { cx: 162, cy: 108, r: 9 },
          { cx: 212, cy: 100, r: 8.5 },
          { cx: 260, cy: 100, r: 8.5 },
          { cx: 310, cy: 108, r: 9 },
          { cx: 352, cy: 122, r: 9 },
          { cx: 375, cy: 145, r: 10 },
          { cx: 348, cy: 168, r: 9.5 },
          { cx: 308, cy: 185, r: 9 },
          { cx: 265, cy: 192, r: 9 },
          { cx: 210, cy: 192, r: 9 },
          { cx: 168, cy: 185, r: 9 },
          { cx: 128, cy: 170, r: 9.5 },
        ].map((dollop, idx) => (
          <g key={idx}>
            <circle cx={dollop.cx} cy={dollop.cy} r={dollop.r} fill="#be123c" />
            <circle cx={dollop.cx - 1.5} cy={dollop.cy - 1.5} r={dollop.r - 1.5} fill="#e11d48" />
            <circle cx={dollop.cx - 2.5} cy={dollop.cy - 2.5} r={dollop.r * 0.35} fill="#fb7185" opacity="0.8" />
          </g>
        ))}

        {/* 4. FIVE INTERACTIVE CANDLE TAPERS */}
        {candleConfigs.map((candle, idx) => {
          const isLit = candlesLit[idx] ?? true;

          return (
            <g
              key={candle.id}
              className="cursor-pointer group/candle"
              onClick={() => onToggleCandle(idx)}
            >
              {/* Candle Body (Diagonal Striped Cylinder) */}
              <g>
                <rect
                  x={candle.x - 7.5}
                  y={candle.y}
                  width="15"
                  height={candle.height}
                  rx="3"
                  fill="url(#candle-stripes)"
                  stroke="#0369a1"
                  strokeWidth="1.5"
                />

                {/* Candle top ellipse */}
                <ellipse
                  cx={candle.x}
                  cy={candle.y}
                  rx="7.5"
                  ry="2.5"
                  fill="#7dd3fc"
                  stroke="#0369a1"
                  strokeWidth="1"
                />

                {/* Candle Wick */}
                <line
                  x1={candle.x}
                  y1={candle.y}
                  x2={candle.x}
                  y2={candle.y - 10}
                  stroke="#1c1917"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>

              {/* FLAME OR SMOKE */}
              {isLit ? (
                <g filter="url(#flame-glow)">
                  {/* Outer Warm Yellow Flame */}
                  <path
                    d={`M${candle.x} ${candle.y - 36} C${candle.x + 8} ${candle.y - 24}, ${candle.x + 8} ${candle.y - 12}, ${candle.x} ${candle.y - 10} C${candle.x - 8} ${candle.y - 12}, ${candle.x - 8} ${candle.y - 24}, ${candle.x} ${candle.y - 36} Z`}
                    fill="#f59e0b"
                  >
                    <animate
                      attributeName="d"
                      dur={`${1.2 + idx * 0.15}s`}
                      repeatCount="indefinite"
                      values={`
                        M${candle.x} ${candle.y - 36} C${candle.x + 8} ${candle.y - 24}, ${candle.x + 8} ${candle.y - 12}, ${candle.x} ${candle.y - 10} C${candle.x - 8} ${candle.y - 12}, ${candle.x - 8} ${candle.y - 24}, ${candle.x} ${candle.y - 36} Z;
                        M${candle.x - 1} ${candle.y - 38} C${candle.x + 7} ${candle.y - 23}, ${candle.x + 9} ${candle.y - 12}, ${candle.x} ${candle.y - 10} C${candle.x - 7} ${candle.y - 12}, ${candle.x - 9} ${candle.y - 23}, ${candle.x - 1} ${candle.y - 38} Z;
                        M${candle.x + 1} ${candle.y - 35} C${candle.x + 9} ${candle.y - 25}, ${candle.x + 7} ${candle.y - 12}, ${candle.x} ${candle.y - 10} C${candle.x - 9} ${candle.y - 12}, ${candle.x - 7} ${candle.y - 25}, ${candle.x + 1} ${candle.y - 35} Z;
                        M${candle.x} ${candle.y - 36} C${candle.x + 8} ${candle.y - 24}, ${candle.x + 8} ${candle.y - 12}, ${candle.x} ${candle.y - 10} C${candle.x - 8} ${candle.y - 12}, ${candle.x - 8} ${candle.y - 24}, ${candle.x} ${candle.y - 36} Z
                      `}
                    />
                  </path>

                  {/* Inner Bright Orange/Yellow Core Flame */}
                  <path
                    d={`M${candle.x} ${candle.y - 28} C${candle.x + 4.5} ${candle.y - 20}, ${candle.x + 4.5} ${candle.y - 12}, ${candle.x} ${candle.y - 10} C${candle.x - 4.5} ${candle.y - 12}, ${candle.x - 4.5} ${candle.y - 20}, ${candle.x} ${candle.y - 28} Z`}
                    fill="#fef08a"
                  />
                </g>
              ) : (
                /* Extinguished Animated Smoke Wisp */
                <g opacity="0.6">
                  <path
                    d={`M${candle.x} ${candle.y - 10} Q${candle.x + 6} ${candle.y - 22}, ${candle.x} ${candle.y - 34} T${candle.x + 4} ${candle.y - 50}`}
                    stroke="#a8a29e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray="4 4"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-20"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.7;0.2;0.7"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
