import React from 'react';
import { Select } from '../ui/Select';
import { CITIES } from '../../config/constants';

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ value, onChange }) => {
  return (
    <Select
      label="Shahar"
      placeholder="Shaharni tanlang"
      options={CITIES}
      value={value}
      onChange={(val) => onChange(String(val))}
    />
  );
};
