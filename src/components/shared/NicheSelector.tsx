import React from 'react';
import { Select } from '../ui/Select';
import { useNiches } from '../../hooks/useNiches';

interface NicheSelectorProps {
  value: string;
  onChange: (mcc: string, nicheName: string) => void;
  error?: string;
}

export const NicheSelector: React.FC<NicheSelectorProps> = ({ value, onChange, error }) => {
  const { data: niches, isLoading, isError } = useNiches({ active_only: true });

  const options = React.useMemo(() => {
    if (!niches) return [];
    return niches.map((niche) => ({
      value: niche.mcc_code,
      label: `${niche.niche_name_uz} (${niche.mcc_code})`,
      original: niche
    }));
  }, [niches]);

  const handleChange = (val: string | number) => {
    const selected = options.find(o => o.value === val);
    if (selected) {
      // Pass both MCC code and the niche name as required by the API
      onChange(selected.value, selected.original.category_name_en);
    }
  };

  return (
    <Select
      label="Biznes nishasi (MCC)"
      placeholder={isLoading ? "Yuklanmoqda..." : "Nishani tanlang"}
      options={options}
      value={value}
      onChange={handleChange}
      error={isError ? "Xatolik yuz berdi" : error}
      disabled={isLoading || isError}
    />
  );
};
