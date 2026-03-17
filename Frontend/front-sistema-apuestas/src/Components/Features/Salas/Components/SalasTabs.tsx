import React from 'react';

interface SalasTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SalasTabs: React.FC<SalasTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-8 mb-6 border-b border-white/5">
      {['NAVEGAR', 'MIS SALAS'].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`pb-3 text-sm font-bold tracking-widest transition-colors relative ${
            activeTab === tab
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full shadow-[0_-2px_8px_rgba(249,115,22,0.8)]"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default SalasTabs;
