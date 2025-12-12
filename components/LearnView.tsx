import React, { useState } from 'react';
import { LearnData, VocabularyItem } from '../types';
import Flashcard from './Flashcard';
import Quiz from './Quiz';
import { SparklesIcon, ChatIcon, RefreshIcon, BookIcon, CheckIcon } from './Icons';
import Mascot from './Mascot';
import ConfirmModal from './ConfirmModal';
import { playSfx } from '../utils/audio';

interface LearnViewProps {
  content: LearnData;
  theme: string;
  language: string;
  progress: number;
  onLoadMore: () => void;
  onGoToRoleplay: () => void;
  isBackgroundLoading: boolean;
  onAddXp: (amount: number) => void;
  onQuestionAnswered: () => void;
  onQuizBatchComplete: () => void;
  onBack: () => void;
  onCompleteTheme: () => void;
  onSave: () => void;
  
  savedWords: VocabularyItem[];
  onToggleSavedWord: (item: VocabularyItem) => void;
}

const LearnView: React.FC<LearnViewProps> = ({ 
  content, theme, language, progress, onLoadMore, onGoToRoleplay, isBackgroundLoading, onAddXp, onQuestionAnswered, onQuizBatchComplete, onBack, onCompleteTheme, onSave,
  savedWords, onToggleSavedWord
}) => {
  const [saved, setSaved] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleSaveClick = () => {
    playSfx('success');
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleBackClick = () => {
      playSfx('click');
      if (progress < 100) {
          setShowExitConfirm(true);
      } else {
          onBack();
      }
  };

  const confirmExit = () => {
      setShowExitConfirm(false);
      onBack();
  };
  
  const isThemeCompleted = progress >= 100;
  
  return (
    <div className="animate-fade-in pb-20 relative font-nunito">
      
      <ConfirmModal 
        isOpen={showExitConfirm}
        title="Leave Lesson?"
        message="You are making progress! Leaving now will not save your exact spot."
        confirmLabel="Leave"
        onConfirm={confirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />

      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 px-4 py-4">
        <button 
            onClick={handleBackClick}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 shadow-sm active:translate-y-0.5"
        >
            ← Back
        </button>
        <div className="flex gap-3">
            <button
                onClick={handleSaveClick}
                disabled={saved}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm border-2 ${saved ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
            >
                {saved ? <><CheckIcon /> Saved</> : <><BookIcon /> Save Session</>}
            </button>
            <div className="px-5 py-2 bg-indigo-600 rounded-xl text-xs font-bold text-white uppercase tracking-wider flex items-center shadow-[0_4px_0_#3730a3]">
                <span className="mr-1 opacity-90">Learning {language}</span>
            </div>
        </div>
      </div>

      <div className="text-center mb-10 px-4 relative max-w-4xl mx-auto">
        {/* Mascot reacting to progress */}
        <div className="absolute -top-6 -right-4 hidden md:block animate-float">
            <Mascot emotion={isThemeCompleted ? "excited" : progress > 50 ? "happy" : "idle"} size="sm" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-3 tracking-tight">{theme}</h1>
        <p className="text-slate-500 mb-8 text-lg font-medium">Master vocabulary and test your knowledge</p>
        
        {/* Juicy Progress Bar */}
        <div className="max-w-md mx-auto bg-slate-200 p-2 rounded-full shadow-inner">
             <div className="w-full h-6 bg-slate-300 rounded-full overflow-hidden relative shadow-inner">
                <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)"
                    style={{ width: `${Math.min(100, progress)}%` }}
                >
                     <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase tracking-widest mix-blend-color-dodge z-10">
                    {progress}% Complete
                </div>
             </div>
        </div>
      </div>

      {/* Vertical Stack Layout */}
      <div className="flex flex-col gap-12 max-w-6xl mx-auto px-4">
        
        {/* SECTION 1: VOCABULARY */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                    <BookIcon />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800">Vocabulary</h2>
             </div>
             <button
                onClick={onLoadMore}
                disabled={isBackgroundLoading}
                className="text-sm bg-white border-2 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-sm active:translate-y-0.5"
            >
                {isBackgroundLoading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
                ) : (
                    <RefreshIcon />
                )}
                More Words
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.vocabulary.map((item, idx) => {
              const isSaved = savedWords.some(w => w.word === item.word);
              return (
                <Flashcard 
                  key={`${item.word}-${idx}`} 
                  item={item} 
                  language={language}
                  onAddXp={onAddXp}
                  isSaved={isSaved}
                  onToggleSave={onToggleSavedWord}
                  index={idx} // Pass index
                />
              );
            })}
          </div>
        </div>

        {/* SECTION 2: QUIZ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white border-2 border-slate-200 shadow-[0_8px_0_#e2e8f0] rounded-[2rem] p-8 h-full relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                            <SparklesIcon />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">Mixed Quiz</h2>
                            <p className="text-sm text-slate-500 font-bold opacity-70">Test retention & grammar</p>
                        </div>
                    </div>

                    {isBackgroundLoading ? (
                    <div className="h-64 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6">
                        <Mascot emotion="thinking" size="md" className="mb-4 animate-bounce" />
                        <p className="text-slate-400 font-bold">LingoBot is writing questions...</p>
                    </div>
                    ) : (
                    <Quiz questions={content.quizzes} onAnswer={onQuestionAnswered} onComplete={onQuizBatchComplete} />
                    )}
                </div>
            </div>

            {/* SECTION 3: SIDE ACTIONS */}
            <div className="flex flex-col gap-6">
                {/* Roleplay Call to Action */}
                <div className="bg-slate-900 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-20 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="relative z-10 mb-4">
                        <Mascot emotion="happy" size="md" />
                    </div>

                    <h3 className="text-2xl font-bold mb-2">Roleplay Dojo</h3>
                    <p className="text-slate-400 mb-8 text-sm leading-relaxed px-4 font-medium">
                        Chat with LingoBot in this scenario!
                    </p>
                    <button
                        onClick={onGoToRoleplay}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-wide transition-all shadow-[0_6px_0_#312e81] hover:shadow-[0_4px_0_#312e81] hover:translate-y-0.5 active:translate-y-1"
                    >
                        Enter Dojo
                    </button>
                </div>
                
                {/* Completion Card */}
                <div className={`rounded-[2rem] p-8 flex flex-col items-center justify-center text-center border-2 transition-all duration-500 ${isThemeCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                    <div className={`inline-flex p-3 rounded-2xl mb-4 ${isThemeCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <CheckIcon />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isThemeCompleted ? 'text-emerald-900' : 'text-slate-900'}`}>
                        {isThemeCompleted ? "Session Mastered!" : "Finish Theme"}
                    </h3>
                    <p className={`mb-6 text-sm font-medium ${isThemeCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {isThemeCompleted 
                            ? "Great job! Claim your XP." 
                            : "Reach 100% to unlock."}
                    </p>
                    <button
                        onClick={() => { playSfx('success'); onCompleteTheme(); }}
                        disabled={!isThemeCompleted}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-2 ${
                            isThemeCompleted 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_5px_0_#065f46] hover:shadow-[0_3px_0_#065f46] hover:translate-y-0.5 active:translate-y-1' 
                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                    >
                        {isThemeCompleted ? 'Complete Session' : 'Locked'}
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LearnView;