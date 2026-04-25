import React from 'react';
import { ButtonProps } from '../../types/ui.types';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      children, 
      variant = 'primary', 
      size = 'md', 
      isLoading = false, 
      icon, 
      fullWidth = false, 
      className = '', 
      disabled, 
      ...props 
    }, 
    ref
  ) => {
    
    const baseClasses = styles.button;
    const variantClasses = styles[`variant-${variant}`];
    const sizeClasses = styles[`size-${size}`];
    const widthClass = fullWidth ? styles.fullWidth : '';
    const loadingClass = isLoading ? styles.loading : '';
    
    const combinedClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClass,
      loadingClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className={styles.spinner} size={size === 'sm' ? 14 : 18} />}
        {!isLoading && icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.content}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
