import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  gradient?: boolean;
}

export function Card({
  children,
  className = '',
  hoverable = true,
  gradient = false,
}: CardProps) {
  const baseStyles = 'rounded-xl';
  const lightMode = 'bg-white border border-gray-200';
  const darkMode = 'bg-white/5 border border-white/10';
  const hoverStyles = hoverable ? 'hover:shadow-lg transition' : '';

  return (
    <div
      className={`${baseStyles} ${gradient ? darkMode : lightMode} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-t border-gray-200 flex gap-2 ${className}`}>{children}</div>;
}
