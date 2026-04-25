import React, { useId } from 'react';
import { SelectProps } from '../../types/ui.types';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
}) => {
  const id = useId();
  const hasError = !!error;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.selectContainer}>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            ${styles.select} 
            ${hasError ? styles.hasError : ''} 
            ${!value ? styles.placeholderStyle : ''}
          `}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.iconWrapper}>
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
