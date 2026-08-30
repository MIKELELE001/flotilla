interface LogoProps {
  size?: number;
  showWordmark?: boolean;
}

/**
 * Three sail shapes of increasing height, angled forward in formation —
 * a small fleet holding one heading. Encodes the actual product idea:
 * many scattered positions, brought into a single coherent line.
 */
export function Logo({ size = 32, showWordmark = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="shrink-0 rounded-xl flex items-center justify-center gradient-accent"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* three sails, increasing height, common baseline — a fleet on one heading */}
          <path d="M3 19L3 10.5L7.5 15L3 19Z" fill="#0a0a0a" fillOpacity="0.55" />
          <path d="M9.5 19L9.5 6L15.5 13L9.5 19Z" fill="#0a0a0a" fillOpacity="0.8" />
          <path d="M16.5 19L16.5 9.5L21 14.5L16.5 19Z" fill="#0a0a0a" />
          <path d="M2 19.5H22" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      {showWordmark && (
        <span className="text-lg font-extrabold tracking-tight">Flotilla</span>
      )}
    </div>
  );
}
