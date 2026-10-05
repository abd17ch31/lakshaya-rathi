import React from 'react';
import { cn } from '../../lib/utils';
import { Container, type ContainerWidth } from './Container';

export type SectionBackground = 'deep' | 'surface' | 'elevated' | 'cream' | 'transparent';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  background?: SectionBackground;
  withContainer?: boolean;
  containerWidth?: ContainerWidth;
  hasVignette?: boolean;
  hasNoise?: boolean;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  background = 'deep',
  withContainer = true,
  containerWidth = 'default',
  hasVignette = false,
  hasNoise = true,
  className,
  containerClassName,
  children,
  ...props
}) => {
  const bgStyles: Record<SectionBackground, string> = {
    deep: 'bg-[#fff5f7]',
    surface: 'bg-[#fff0f3]',
    elevated: 'bg-white',
    cream: 'bg-[#fffdf9] text-[#3b1424]',
    transparent: 'bg-transparent',
  };

  const content = withContainer ? (
    <Container width={containerWidth} className={containerClassName}>
      {children}
    </Container>
  ) : (
    children
  );

  return (
    <section
      id={id}
      className={cn(
        'relative py-20 sm:py-28 overflow-hidden',
        bgStyles[background],
        hasVignette && 'cheerful-vignette',
        hasNoise && 'subtle-noise',
        className
      )}
      {...props}
    >
      {content}
    </section>
  );
};
