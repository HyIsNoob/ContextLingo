import React from 'react';
import { LearnData } from '../types';
import Flashcard from './Flashcard';
import Quiz from './Quiz';
import { RefreshIcon, ChatIcon, SparklesIcon } from './Icons';

interface ResultDisplayProps {
  learnData: LearnData;
  theme: string;
  language: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ learnData, theme, language, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-4">
          Learning {language}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          {theme}
        </h1>
      </div>

      {/* Roleplay Info Section */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
          <ChatIcon /> Conversation Roles
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-500 uppercase mb-1">You</p>
                <p className="font-bold text-indigo-900 text-lg">{learnData.roles.user_role}</p>
             </div>
             <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">AI Partner</p>
                <p className="font-bold text-gray-900 text-lg">{learnData.roles.ai_role}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
          <SparklesIcon /> Key Vocabulary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {learnData.vocabulary.map((item, index) => (
            <Flashcard key={index} item={item} language={language} />
          ))}
        </div>
      </div>

      {/* Quiz Section */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
          <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs">?</div>
          Knowledge Check
        </h2>
        <div className="grid gap-6 md:grid-cols-1">
          <Quiz questions={learnData.quizzes} onComplete={() => {}} />
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <RefreshIcon />
          Start New Context
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;