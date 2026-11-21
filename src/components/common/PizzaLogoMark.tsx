import React from 'react';

export function PizzaLogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 15C16 9 27 8 38 14L20 42L8 15Z"
        fill="#1E1410"
        stroke="#E5A94C"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M8 15C16 9 27 8 38 14"
        stroke="#C41E24"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="3" fill="#C41E24" stroke="#E5A94C" strokeWidth="1.2" />
      <circle cx="26" cy="24" r="2.6" fill="#C41E24" stroke="#E5A94C" strokeWidth="1.2" />
      <circle cx="19" cy="29" r="2.4" fill="#C41E24" stroke="#E5A94C" strokeWidth="1.2" />
      <path
        d="M28 17C29.5 16.5 31 17.5 30.5 19C30 20.5 28 20 28 17Z"
        fill="#65A30D"
      />
    </svg>
  );
}
