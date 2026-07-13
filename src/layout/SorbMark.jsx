import React from 'react'

// The Jane's Jeans brand mark — a jeans back-pocket with a rivet + topstitch,
// inline SVG so it re-skins with the theme: the pocket reads `--bs-primary`, the
// stitch reads `--bs-body-bg`. viewBox'd (the 300px-default SVG trap — Part-3 §2).
export const SorbMark = ({ size = 28, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    role="img"
    aria-label="Jane's Jeans"
    fill="none"
    {...rest}
  >
    {/* back pocket body */}
    <path
      d="M6 7h20l-2.4 13.5a3 3 0 0 1-2.6 2.5l-4.4.5a4 4 0 0 1-1.2 0l-4.4-.5a3 3 0 0 1-2.6-2.5z"
      fill="var(--bs-primary, #2f5c9e)"
    />
    {/* topstitch — inner outline */}
    <path
      d="M8.7 9.4h14.6l-2 11.2a1.4 1.4 0 0 1-1.2 1.15l-3.9.45a3 3 0 0 1-.6 0l-3.9-.45a1.4 1.4 0 0 1-1.2-1.15z"
      stroke="var(--bs-body-bg, #ffffff)"
      strokeWidth="1"
      strokeDasharray="1.6 1.4"
      opacity="0.85"
    />
    {/* signature stitch arcs */}
    <path
      d="M11 12.4c2.5 2.4 7.5 2.4 10 0"
      stroke="var(--bs-body-bg, #ffffff)"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.85"
    />
    {/* rivet */}
    <circle cx="16" cy="8.3" r="1.15" fill="var(--bs-body-bg, #ffffff)" opacity="0.9" />
  </svg>
)
