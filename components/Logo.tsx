interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

/**
 * Three sailboats — mast, sail, and hull — in ascending formation on one
 * heading. Encodes the actual product idea: many scattered positions,
 * brought into a single coherent fleet.
 */
export function Logo({ size = 32, showWordmark = true }: LogoProps) {
  const s = size / 32; // scale factor relative to the design's base 32px badge

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="shrink-0 rounded-xl flex items-center justify-center gradient-accent relative overflow-hidden"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.72}
          height={size * 0.72}
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(2, 8)">
            {/* back boat, smallest */}
            <g transform="translate(0, 10) scale(0.55)">
              <path d="M9 0 L9 20 L18 20 Z" fill="#0a0a0a" fillOpacity="0.55" />
              <path d="M1 20 Q9 27 17 20 L14 24 Q9 26.5 4 24 Z" fill="#0a0a0a" fillOpacity="0.55" />
            </g>
            {/* middle boat */}
            <g transform="translate(14, 3) scale(0.78)">
              <path d="M9 -2 L9 20 L19 20 Z" fill="#0a0a0a" fillOpacity="0.78" />
              <path d="M0 20 Q9 28 18 20 L14.5 25 Q9 27.5 3.5 25 Z" fill="#0a0a0a" fillOpacity="0.78" />
            </g>
            {/* front boat, largest */}
            <g transform="translate(29, -6)">
              <path d="M9 -6 L9 20 L21 20 Z" fill="#0a0a0a" />
              <path d="M-1 20 Q9 30 19 20 L15 26 Q9 29 3 26 Z" fill="#0a0a0a" />
            </g>
          </g>
        </svg>
      </div>
      {showWordmark && (
        <span className="text-lg font-extrabold tracking-tight">Flotilla</span>
      )}
    </div>
  );
}
