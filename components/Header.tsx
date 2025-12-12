import React from 'react';
import { SparklesIcon, FireIcon, TrophyIcon, BookIcon } from './Icons';

interface HeaderProps {
  xp?: number;
  streak?: number;
  onDashboard?: () => void;
  isDashboard?: boolean;
}

const Header: React.FC<HeaderProps> = ({ xp = 0, streak = 0, onDashboard, isDashboard }) => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-white border-b border-slate-200 sticky top-0 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer group" 
        onClick={onDashboard}
      >
        <div className="text-indigo-600 group-hover:scale-110 transition-transform">
           <SparklesIcon />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Context<span className="text-slate-400">Lingo</span>
        </h1>
      </div>

      {!isDashboard && onDashboard && (
        <div className="flex items-center gap-4">
           {/* Navigation */}
           <button 
            onClick={onDashboard}
            className="hidden md:flex text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
           >
             Dashboard
           </button>

           <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

           {/* Stats */}
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5" title="Day Streak">
                <FireIcon />
                <span className="font-bold text-slate-700 text-sm">{streak}</span>
              </div>
              <div className="flex items-center gap-1.5" title="Total XP">
                <TrophyIcon />
                <span className="font-bold text-slate-700 text-sm">{xp}</span>
              </div>
           </div>
        </div>
      )}
      
      {/* On Dashboard or Login state, simplified header or actions could go here */}
    </header>
  );
};

export default Header;