import React from 'react';
import { cn } from '../../lib/utils';

export type ContainerWidth = 'narrow' | 'default' | 'wide' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  width?: ContainerWidth;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  width = 'default',
  className,
  ...props
}) => {
  const widthClasses: Record<ContainerWidth, string> = {
    narrow: 'max-w-3xl',
    default: 'max-w-5xl',
    wide: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8', widthClasses[width], className)}
      {...props}
    >
      {children}
    </div>
  );
};
