import React, { useId } from 'react';
import { InputProps } from '../../types/ui.types';
import styles from './Input.module.css';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, className = '', ...props }, ref) => {
    const id = useId();
    const hasError = !!error;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          {icon && <div className={styles.iconWrapper}>{icon}</div>}
          <input
            ref={ref}
            id={id}
            className={`
              ${styles.input} 
              ${icon ? styles.hasIcon : ''} 
              ${hasError ? styles.hasError : ''}
            `}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <span className={`${styles.hint} ${hasError ? styles.errorText : ''}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
