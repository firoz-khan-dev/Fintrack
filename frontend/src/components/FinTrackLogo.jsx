function FinTrackLogo({ className, onClick }) {
  return (
    <svg
      viewBox="0 0 230 72"
      className={className}
      onClick={onClick}
      role="img"
      aria-label="FinTrack"
    >
      <defs>
        <linearGradient id="fintrackGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#10B981" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="8"
        width="56"
        height="56"
        rx="14"
        fill="url(#fintrackGrad)"
      />
      <rect
        x="11"
        y="39"
        width="7"
        height="14"
        rx="2"
        fill="#fff"
        opacity="0.55"
      />
      <rect
        x="22"
        y="32"
        width="7"
        height="21"
        rx="2"
        fill="#fff"
        opacity="0.75"
      />
      <rect x="33" y="25" width="7" height="28" rx="2" fill="#fff" />
      <polyline
        points="11,33 22,25 31,29 45,16"
        fill="none"
        stroke="#FDE68A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="37,16 45,16 45,24"
        fill="none"
        stroke="#FDE68A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="70"
        y="45"
        fontFamily="Poppins, sans-serif"
        fontWeight="700"
        fontSize="30"
      >
        <tspan fill="currentColor">Fin</tspan>
        <tspan fill="#10B981">Track</tspan>
      </text>
    </svg>
  );
}

export default FinTrackLogo;
