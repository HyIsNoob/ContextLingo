import React, { useState } from 'react';
import { ThemeSuggestion } from '../types';
import { CheckIcon, SparklesIcon, RefreshIcon } from './Icons';
import Mascot from './Mascot';
import ConfirmModal from './ConfirmModal';
import { playSfx } from '../utils/audio';

interface ThemeSelectorProps {
  themes: ThemeSuggestion[];
  completedThemes: string[];
  onSelect: (theme: string) => void;
  isLoading: boolean;
  onBack: () => void;
  onRegenerate: () => void;
  onFinish: () => void; 
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  themes, completedThemes, onSelect, isLoading, onBack, onRegenerate, onFinish
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleBack = () => {
    playSfx('click');
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
      setShowExitConfirm(false);
      onBack();
  };

  const handleSelect = (title: string) => {
      playSfx('click');
      onSelect(title);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <ConfirmModal 
        isOpen={showExitConfirm}
        title="Leave Selection?"
        message="Generating these themes took some magic. If you go back, they will be lost."
        confirmLabel="Go Back"
        onConfirm={confirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />

      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-4 uppercase tracking-wide">
            Step 2: Selection
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Choose Your Context</h2>
        <p className="text-slate-500 text-lg">Select a scenario to generate your personalized lesson.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {themes.map((theme, index) => {
          const isCompleted = completedThemes.includes(theme.title);
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={index}
              onClick={() => handleSelect(theme.title)}
              onMouseEnter={() => { if(!isHovered) playSfx('hover'); setHoveredIndex(index); }}
              onMouseLeave={() => setHoveredIndex(null)}
              disabled={isLoading}
              className={`group relative flex flex-col justify-between h-80 p-6 rounded-[2rem] border text-left transition-all duration-300 animate-enter ${
                isCompleted 
                  ? 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100' 
                  : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-2xl hover:-translate-y-2'
              }`}
              style={{ animationDelay: `${index * 150}ms`, zIndex: isHovered ? 10 : 1 }}
            >
              {/* Floating LingoBot on Hover */}
              {isHovered && !isCompleted && !isLoading && (
                  <div className="absolute -top-12 -right-6 z-20 animate-pop-in pointer-events-none">
                      <Mascot emotion="happy" size="md" />
                  </div>
              )}

              <div className="flex-grow flex flex-col overflow-hidden w-full">
                <div className="flex justify-between items-start mb-4 shrink-0">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-110 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-900 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                      {isCompleted ? <CheckIcon /> : `0${index + 1}`}
                   </div>
                   {isCompleted && (
                       <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full">
                           Done
                       </span>
                   )}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                  {theme.title}
                </h3>
                
                {/* Scrollable Description Area */}
                <div className="overflow-y-auto custom-scrollbar pr-1 relative flex-grow">
                     <p className="text-slate-500 font-medium leading-relaxed">
                        {theme.tagline}
                     </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-2 shrink-0 w-full">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide group-hover:text-indigo-500 transition-colors">
                    <SparklesIcon /> 
                    <span>{theme.available_roles.length} Roles Available</span>
                 </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 animate-fade-in border-t border-slate-100 pt-8" style={{ animationDelay: '0.6s' }}>
          <button 
            onClick={handleBack}
            disabled={isLoading}
            className="px-8 py-3.5 rounded-xl font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            ← Back
          </button>
          <button 
             onClick={onRegenerate}
             disabled={isLoading}
             className="px-8 py-3.5 rounded-xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
          >
             <RefreshIcon /> Regenerate Themes
          </button>
          <button 
             onClick={onFinish}
             disabled={isLoading || completedThemes.length === 0}
             className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${completedThemes.length > 0 ? 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
             <CheckIcon /> Finish Learning
          </button>
      </div>
    </div>
  );
};

export default ThemeSelector;