export default function BookPlaceholderIcon({size = 64}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
    >
      <defs>
        <linearGradient id="bookCover" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="bookPages" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5f5" />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="26" height="44" rx="4" fill="url(#bookCover)" />
      <rect x="32" y="10" width="26" height="44" rx="4" fill="url(#bookPages)" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M18 18h12M18 24h12M18 30h12" stroke="#fdf2f8" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 18h16M36 24h16M36 30h16M36 36h16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <rect x="12" y="46" width="40" height="6" rx="3" fill="#fbbf24" opacity="0.8" />
    </svg>
  );
}

