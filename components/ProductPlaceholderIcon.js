export default function ProductPlaceholderIcon({size = 64}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
    >
      <rect x="22" y="6" width="20" height="8" rx="2" fill="#d4d4d8" />
      <rect x="18" y="14" width="28" height="42" rx="10" fill="#e4e4e7" />
      <rect x="26" y="22" width="12" height="22" rx="6" fill="#a1a1aa" opacity="0.45" />
    </svg>
  );
}
