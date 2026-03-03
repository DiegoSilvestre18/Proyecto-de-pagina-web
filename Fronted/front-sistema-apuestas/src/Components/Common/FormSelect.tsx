import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FormSelectProps {
  icon: LucideIcon;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const FormSelect: React.FC<FormSelectProps> = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
          <Icon size={18} />
        </div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 pl-12 pr-10 text-sm text-white focus:outline-none focus:border-orange-500 focus:bg-black/60 transition-all backdrop-blur-sm appearance-none cursor-pointer"
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-[#1a1b2e] text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default FormSelect;
