import React from 'react';
import styles from './Slider.module.css';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (val: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue = (v) => v.toString(),
  className = '',
  ...props
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.header}>
        {label && <label className={styles.label}>{label}</label>}
        <span className={styles.valueDisplay}>{formatValue(value)}</span>
      </div>
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.slider}
          style={{ '--percentage': `${percentage}%` } as React.CSSProperties}
          {...props}
        />
      </div>
    </div>
  );
};
