import React from 'react';
import { DailyMission, HistoryItem } from '../types';
import { FireIcon, TrophyIcon, BookIcon, CheckIcon, SparklesIcon } from './Icons';
import Mascot from './Mascot';

interface DashboardProps {
  xp: number;
  streak: number;
  missions: DailyMission[];
  recentHistory: HistoryItem[];
  savedWordsCount: number;
  onStartNew: () => void;
  onResume: (item: HistoryItem) => void;
  onViewHistory: () => void;
  onViewSavedWords: () => void;
  onStartMinigame?: () => void; // New prop
  totalThemesCompleted: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  xp, streak, missions, recentHistory, savedWordsCount, onStartNew, onResume, onViewHistory, onViewSavedWords, onStartMinigame, totalThemesCompleted 
}) => {
  
  return (
    <div className="max-w-6xl mx-auto py-6 font-nunito">
      {/* Welcome Banner */}
      <div className="animate-enter bg-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-4 border-slate-800">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
         <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-30"></div>
         
         <div className="relative z-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-md tracking-tight">Ready to learn?</h1>
            <p className="text-slate-300 text-lg font-medium max-w-md leading-relaxed mb-8">
                LingoBot is waiting! Capture a photo or describe a scene to start your daily lesson.
            </p>
            
            <button 
                onClick={onStartNew}
                className="group relative px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-2xl shadow-[0_6px_0_rgb(55,48,163)] hover:shadow-[0_4px_0_rgb(55,48,163)] hover:translate-y-0.5 active:translate-y-2 active:shadow-none transition-all uppercase tracking-wide flex items-center gap-3 mx-auto md:mx-0 text-lg"
            >
                <span className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform"><SparklesIcon /></span>
                <span>Start New Session</span>
            </button>
         </div>

         <div className="relative z-10 shrink-0 transform hover:scale-105 transition-transform duration-500">
             <Mascot emotion="excited" size="xl" className="animate-float" />
         </div>
      </div>

      {/* Stats Cards - Updated Layout for Clarity */}
      <h3 className="text-xl font-extrabold text-slate-800 mb-4 px-2 flex items-center gap-2">
          Your Progress
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-enter" style={{ animationDelay: '0.1s' }}>
        
        {/* Read-Only Stats (Flat style) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-orange-500 mb-2 scale-125"><FireIcon /></div>
            <div className="text-2xl font-black text-slate-700">{streak}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Day Streak</div>
        </div>
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-yellow-500 mb-2 scale-125"><TrophyIcon /></div>
            <div className="text-2xl font-black text-slate-700">{xp}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total XP</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-emerald-500 mb-2 scale-125"><CheckIcon /></div>
            <div className="text-2xl font-black text-slate-700">{totalThemesCompleted}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Mastered</div>
        </div>

        {/* CLICKABLE ACTION CARD (Distinct Style) */}
        <button 
            onClick={onViewSavedWords}
            className="bg-indigo-50 p-5 rounded-3xl border-2 border-indigo-200 shadow-[0_4px_0_#c7d2fe] hover:shadow-[0_6px_0_#c7d2fe] hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer group flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-10 bg-white/40 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-white/60 transition-colors"></div>
            
            <div className="relative z-10 text-indigo-600 mb-2 scale-125 group-hover:scale-110 transition-transform duration-300">
                <BookIcon />
            </div>
            <div className="relative z-10 text-2xl font-black text-indigo-900 group-hover:text-indigo-700">{savedWordsCount}</div>
            <div className="relative z-10 flex items-center gap-1 text-xs font-bold text-indigo-500 uppercase tracking-wide mt-1 group-hover:text-indigo-700">
                <span>View Library</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Missions */}
        <div className="lg:col-span-2">
            {/* New Minigame Section */}
            {onStartMinigame && (
                <div className="mb-8">
                     <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                        Arcade
                    </h3>
                    <button 
                        onClick={onStartMinigame}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] p-6 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden group flex items-center justify-between"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                        <div className="relative z-10 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-bold uppercase tracking-widest border border-white/10">Minigame</span>
                            </div>
                            <h3 className="text-2xl font-black italic tracking-tight">WORD CHAIN ARENA</h3>
                            <p className="text-indigo-100 font-medium text-sm mt-1">Challenge LingoBot! Connect words, keep the streak.</p>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform border border-white/20">
                            🎮
                        </div>
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-rose-100 text-rose-500 rounded-xl">
                    <CheckIcon />
                 </div>
                 <h3 className="text-2xl font-extrabold text-slate-800">Daily Quests</h3>
            </div>

            <div className="space-y-4">
                {missions && Array.isArray(missions) && missions.map((mission, idx) => {
                    if (!mission) return null;
                    return (
                        <div 
                            key={mission.id || idx} 
                            className={`p-5 rounded-3xl border-2 transition-all flex items-center gap-5 ${
                                mission.completed 
                                ? 'bg-emerald-50 border-emerald-200' 
                                : 'bg-white border-slate-100 shadow-sm'
                            } animate-enter`}
                            style={{ animationDelay: `${(idx + 2) * 100}ms` }}
                        >
                            <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl font-bold border-2 transition-all ${
                                mission.completed 
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-none' 
                                : 'bg-slate-50 border-slate-200 text-slate-300'
                            }`}>
                                {mission.completed ? <CheckIcon /> : idx + 1}
                            </div>
                            
                            <div className="flex-grow">
                                <div className="flex justify-between mb-2">
                                    <span className={`font-bold text-lg ${mission.completed ? 'text-emerald-800 line-through decoration-2 opacity-60' : 'text-slate-700'}`}>
                                        {mission.label}
                                    </span>
                                    <span className={`text-sm font-black px-2 py-1 rounded-lg ${mission.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {mission.current}/{mission.target}
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ease-out rounded-full relative overflow-hidden ${mission.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                        style={{ width: `${Math.min(100, (mission.current / (mission.target || 1)) * 100)}%` }}
                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Right Col: Recent History */}
        <div className="bg-white rounded-[2rem] border-2 border-slate-200 p-6 h-fit shadow-sm animate-enter" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                <BookIcon /> Recent Activity
            </h3>
            
            {(!recentHistory || recentHistory.length === 0) ? (
                <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2 text-2xl grayscale opacity-50">💤</div>
                    <p className="font-bold">No history yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {Array.isArray(recentHistory) && recentHistory.slice(0, 3).map((item, idx) => {
                        if (!item) return null;
                        return (
                            <button 
                                key={item.id || idx}
                                onClick={() => onResume(item)}
                                className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all border border-slate-100 hover:border-indigo-200 group animate-enter"
                                style={{ animationDelay: `${(idx + 5) * 100}ms` }}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.theme}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-slate-200 text-slate-400 px-2 py-1 rounded-lg group-hover:border-indigo-100 group-hover:text-indigo-400">{item.language}</span>
                                    <span className="text-xs text-slate-400 font-semibold group-hover:text-slate-500">Resume →</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
            
            <button 
                onClick={onViewHistory}
                className="w-full mt-6 py-4 text-sm font-bold text-slate-600 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-sm active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2"
            >
                View Full Journal
            </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;