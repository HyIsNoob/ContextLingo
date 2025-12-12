import React from 'react';
import { ThemeSuggestion } from '../types';

interface ThemeViewProps {
  themes: ThemeSuggestion[];
  onSelect: (theme: string) => void;
}

const ThemeView: React.FC<ThemeViewProps> = ({ themes, onSelect }) => {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in py-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Choose a Focus</h2>
      <p className="text-gray-500 text-center mb-10">What do you want to talk about?</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themes.map((theme, index) => (
          <button
            key={index}
            onClick={() => onSelect(theme.title)}
            className="group relative bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:border-gray-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-64 justify-between"
          >
            <div>
              <div className="text-gray-300 font-mono text-xl mb-6 group-hover:text-gray-900 transition-colors">
                0{index + 1}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-black transition-colors">
                {theme.title}
              </h3>
            </div>
            <p className="text-gray-500 font-medium text-lg leading-snug">
              {theme.tagline}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeView;