import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../animations/useReducedMotion';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'scrapbook';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'right',
      isLoading = false,
      fullWidth = false,
      className,
      disabled,
      ...motionProps
    },
    ref
  ) => {
    const reducedMotion = useReducedMotion();

    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-full cursor-pointer transition-all duration-300 select-none whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-pink-400/50 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-4 py-2 gap-1.5',
      md: 'text-sm px-6 py-2.5 gap-2',
      lg: 'text-base px-8 py-3.5 gap-2.5',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:brightness-105 active:scale-[0.98]',
      secondary:
        'bg-white text-pink-700 border border-pink-200 shadow-sm hover:border-pink-400 hover:bg-pink-50/50 active:scale-[0.98]',
      ghost:
        'bg-transparent text-pink-700 hover:text-pink-900 hover:bg-pink-100/60 active:scale-[0.98]',
      scrapbook:
        'bg-[#ffffff] text-[#3b1424] rounded-sm font-serif border border-pink-200 shadow-md hover:shadow-lg hover:-rotate-1 active:scale-[0.98]',
    };

    const motionVariants = reducedMotion
      ? {}
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        {...motionVariants}
        {...motionProps}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
