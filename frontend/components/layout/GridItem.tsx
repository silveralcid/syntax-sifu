// components/layout/GridItem.tsx
"use client";

import React from "react";

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
}

export function GridItem({ children, className = "" }: GridItemProps) {
  return (
    <div
      className={`card bg-base-100 border rounded-xl shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
