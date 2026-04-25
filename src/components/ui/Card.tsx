import React from 'react';
import { CardProps } from '../../types/ui.types';
import styles from './Card.module.css';

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md',
  onClick,
}) => {
  const baseClasses = styles.card;
  const paddingClass = styles[`padding-${padding}`];
  const hoverClass = hoverEffect ? styles.hoverEffect : '';
  
  const combinedClasses = [
    'glass-panel', // Global glass class
    baseClasses,
    paddingClass,
    hoverClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};
