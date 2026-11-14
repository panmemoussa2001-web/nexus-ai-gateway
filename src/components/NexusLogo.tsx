import React from 'react';

export const NexusLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <rect
      x="2"
      y="2"
      width="28"
      height="28"
      rx="6"
      className="fill-blue-600/15 stroke-blue-500"
      strokeWidth="1.75"
    />
    <path
      d="M16 7.5L23.5 11.2V17.1C23.5 21.1 20.3 24.4 16 25.5C11.7 24.4 8.5 21.1 8.5 17.1V11.2L16 7.5Z"
      className="fill-blue-600/20 stroke-blue-400"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M13 16.2L15.1 18.3L19.4 13.8"
      className="stroke-white dark:stroke-blue-100"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
