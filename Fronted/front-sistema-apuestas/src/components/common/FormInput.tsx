// components/FormInput.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface FormInputProps {
  icon: LucideIcon;
  type: string;
  label: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string; 
}

const FormInput: React.FC<FormInputProps> = ({
  icon: Icon,
  type,
  label,
  placeholder,
  name,
  value,
  onChange: handleFormUsuario,
  autoComplete,
}) => {
  return (
    <div className="flex flex-col gap-2 mb-5">
      <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
          <Icon size={18} />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleFormUsuario}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 pl-12 text-sm text-white focus:outline-none focus:border-orange-500 focus:bg-black/60 transition-all placeholder-gray-600 backdrop-blur-sm"
          
          autoComplete={autoComplete || (type === 'password' ? 'new-password' : 'off')}
          
          readOnly
          
          onFocus={(e) => e.target.removeAttribute('readonly')}
        />
      </div>
    </div>
  );
};

export default FormInput;