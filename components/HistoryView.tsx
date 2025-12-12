import React, { useState } from 'react';
import { HistoryItem, VocabularyItem, SavedChatSession } from '../types';
import { GlobeIcon, SparklesIcon, HeartIcon, BookIcon, ChatIcon } from './Icons';
import Flashcard from './Flashcard';
import Mascot from './Mascot';

interface HistoryViewProps {
  items: HistoryItem[];
  savedWords: VocabularyItem[];
  savedChats: SavedChatSession[];
  onSelect: (item: HistoryItem) => void;
  onSelectChat: (chat: SavedChatSession) => void;
  onBack: () => void;
  onToggleSavedWord: (item: VocabularyItem) => void;
  initialTab?: 'sessions' | 'saved' | 'chats';
}

const HistoryView: React.FC<HistoryViewProps> = ({ 
  items, savedWords, savedChats, onSelect, onSelectChat, onBack, onToggleSavedWord,
  initialTab = 'sessions'
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'saved' | 'chats'>(initialTab);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in py-8 px-4 font-nunito">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
           <div className="bg-indigo-100 p-3 rounded-2xl hidden sm:block">
              <BookIcon />
           </div>
           <div>
              <h2 className="text-3xl font-extrabold text-slate-900">My Journal</h2>
              <p className="text-slate-500 font-medium">Your learning journey so far.</p>
           </div>
        </div>
        <button 
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-indigo-300 text-slate-700 font-bold text-sm transition-all shadow-sm hover:-translate-y-0.5"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Modern Pill Tabs */}
      <div className="flex justify-center md:justify-start gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit mb-10 mx-auto md:mx-0">
        <button
            onClick={() => setActiveTab('sessions')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'sessions' 
                ? 'bg-white text-indigo-600 shadow-md scale-105' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
        >
            <BookIcon /> Lessons 
            <span className={`px-2 py-0.5 rounded-md text-xs ${activeTab === 'sessions' ? 'bg-indigo-100' : 'bg-slate-200'}`}>{items.length}</span>
        </button>
        <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'saved' 
                ? 'bg-white text-rose-500 shadow-md scale-105' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
        >
            <HeartIcon filled={true} /> Words
            <span className={`px-2 py-0.5 rounded-md text-xs ${activeTab === 'saved' ? 'bg-rose-100' : 'bg-slate-200'}`}>{savedWords.length}</span>
        </button>
        <button
            onClick={() => setActiveTab('chats')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'chats' 
                ? 'bg-white text-emerald-600 shadow-md scale-105' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
        >
            <ChatIcon /> Chats
            <span className={`px-2 py-0.5 rounded-md text-xs ${activeTab === 'chats' ? 'bg-emerald-100' : 'bg-slate-200'}`}>{savedChats.length}</span>
        </button>
      </div>

      {/* SESSIONS TAB */}
      {activeTab === 'sessions' && (
        items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <Mascot emotion="thinking" size="lg" className="mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-slate-800">No lessons yet</h3>
                <p className="text-slate-400 font-medium">Create a lesson to start your collection!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, idx) => (
                <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 cursor-pointer animate-enter flex flex-col h-full"
                style={{ animationDelay: `${idx * 100}ms` }}
                >
                <div className="relative h-48 rounded-[1.5rem] overflow-hidden bg-slate-100 mb-4 border border-slate-100 group-hover:border-indigo-200 transition-colors">
                    {item.thumbnailBase64 ? (
                    <img 
                        src={`data:image/jpeg;base64,${item.thumbnailBase64}`} 
                        alt="Context" 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-200">
                        <SparklesIcon />
                    </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black text-indigo-600 shadow-sm flex items-center gap-1.5">
                      <GlobeIcon /> {item.language}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm">
                        {formatDate(item.timestamp)}
                    </div>
                </div>

                <div className="px-2 pb-2 flex-grow flex flex-col">
                    <h3 className="text-lg font-extrabold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                       {item.theme}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{item.difficulty}</span>
                         <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             →
                         </span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )
      )}

      {/* SAVED WORDS TAB */}
      {activeTab === 'saved' && (
        savedWords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <div className="text-rose-200 mb-4 scale-150"><HeartIcon /></div>
                <h3 className="text-xl font-bold text-slate-800">No saved words</h3>
                <p className="text-slate-400 font-medium">Heart words during lessons to save them.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {savedWords.map((word, idx) => (
                    <Flashcard 
                        key={`${word.word}-${idx}`}
                        item={word}
                        language="English" 
                        isSaved={true}
                        onToggleSave={onToggleSavedWord}
                        index={idx}
                    />
                ))}
            </div>
        )
      )}

      {/* CONVERSATIONS TAB */}
      {activeTab === 'chats' && (
          savedChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <div className="text-emerald-200 mb-4 scale-150"><ChatIcon /></div>
                <h3 className="text-xl font-bold text-slate-800">No conversations</h3>
                <p className="text-slate-400 font-medium">Save your roleplay sessions to replay them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {savedChats.map((chat, idx) => (
                  <div 
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group animate-enter"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl group-hover:rotate-12 transition-transform">
                              <ChatIcon />
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors leading-tight">{chat.theme}</h3>
                              <p className="text-xs font-bold text-slate-400 mt-0.5">{formatDate(chat.timestamp)}</p>
                           </div>
                        </div>
                        <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-lg text-slate-500 uppercase tracking-wide">{chat.language}</span>
                     </div>
                     
                     <div className="flex items-center justify-center gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
                        <span className="font-bold text-indigo-600 bg-white px-2 py-1 rounded-md shadow-sm">{chat.userRole}</span>
                        <span className="text-slate-300 font-black italic">VS</span>
                        <span className="font-bold text-emerald-600 bg-white px-2 py-1 rounded-md shadow-sm">{chat.aiRole}</span>
                     </div>
                     
                     <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                        <span>{chat.messages.length} Messages</span>
                        <span className="text-emerald-600 flex items-center gap-1 group-hover:underline">Resume <span className="text-lg">→</span></span>
                     </div>
                  </div>
               ))}
            </div>
          )
      )}
    </div>
  );
};

export default HistoryView;