const LeafIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="64" height="64" rx="16" fill="hsl(142, 70%, 45%)" />
    <path
      d="M32 16C32 16 20 24 20 36C20 44 25.3726 48 32 48C38.6274 48 44 44 44 36C44 24 32 16 32 16Z"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M32 48V28"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M32 36C32 36 26 32 24 28"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M32 32C32 32 36 29 38 26"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default LeafIcon;
