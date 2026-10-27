import { useId } from 'react';

export default function GeminiMark({ size = 18 }) {
  const gradientId = `gemini-mark-${useId().replaceAll(':', '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="3" y1="4" x2="29" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4" />
          <stop offset=".28" stopColor="#9B72CB" />
          <stop offset=".54" stopColor="#D96570" />
          <stop offset=".76" stopColor="#F6BF26" />
          <stop offset="1" stopColor="#34A853" />
        </linearGradient>
      </defs>
      <path d="M16 2.25C18.8 10.5 21.5 13.2 29.75 16C21.5 18.8 18.8 21.5 16 29.75C13.2 21.5 10.5 18.8 2.25 16C10.5 13.2 13.2 10.5 16 2.25Z" fill={`url(#${gradientId})`} />
    </svg>
  );
}
