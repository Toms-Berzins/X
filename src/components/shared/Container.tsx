import React from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  padding = true,
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[96rem]',
    full: 'max-w-full',
  };

  return (
    <div
      className={clsx(
        'mx-auto w-full',
        sizes[size],
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  );
};
