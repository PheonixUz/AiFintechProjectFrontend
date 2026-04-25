import React from 'react';
import { BadgeProps } from '../../types/ui.types';
import styles from './Badge.module.css';

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = styles.badge;
  const variantClass = styles[`variant-${variant}`];
  const sizeClass = styles[`size-${size}`];

  const combinedClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={combinedClasses}>
      {children}
    </span>
  );
};
