// Button.js

import React from 'react';

export default function Button({ onClick, className, children }: { onClick: () => void, className: string, children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
