export default function NinjaMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4.5 28.2 25.8 5.6" stroke="#8A8A8A" strokeWidth="2.6" strokeLinecap="round" />
      <path d="m23.5 4 4.2 4.1" stroke="#171717" strokeWidth="3.1" strokeLinecap="round" />
      <path d="m4 25.8 3.6 3.4" stroke="#D92D35" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 2.75C23.25 2.75 28.75 8.1 29 15.25V20c-.5 6.1-5.7 9.25-13 9.25S3.5 26.1 3 20v-4.75C3.25 8.1 8.75 2.75 16 2.75Z" fill="#111111" />
      <path d="M3.2 12.5C10.7 14.35 21.3 14.35 28.8 12.5V18c-7.5-1.45-18.1-1.45-25.6 0v-5.5Z" fill="#D92D35" />
      <path d="m8.25 20.1 5.45-.9-2.8 3.2-2.65-2.3Zm15.5 0-5.45-.9 2.8 3.2 2.65-2.3Z" fill="#F7F7F7" />
    </svg>
  );
}
