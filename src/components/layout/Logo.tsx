import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="hsl(var(--primary))" stroke="none" />
      <path d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z" fill="hsl(var(--background))" stroke="none" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="hsl(var(--accent))" stroke="none" />
      <path d="M2,12 C2,12 5,9 12,9 C19,9 22,12 22,12" stroke="hsl(var(--primary-foreground))" fill="none" strokeWidth="1" opacity="0.5" />
      <path d="M7 2L7 4" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      <path d="M17 2L17 4" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      <path d="M12 7.5V6" stroke="hsl(var(--accent))" strokeWidth="1" />
    </svg>
  );
}
