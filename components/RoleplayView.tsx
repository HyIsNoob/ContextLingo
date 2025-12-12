import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { ChatIcon, SwitchHorizontalIcon, XIcon, WandIcon, RefreshIcon, LightBulbIcon, SaveIcon, CheckIcon } from './Icons';
import ConfirmModal from './ConfirmModal';
import { playSfx } from '../utils/audio';

interface RoleplayViewProps {
  theme: string;
  history: ChatMessage[];
  userRole: string;
  aiRole: string;
  onSendMessage: (text: string) => void;
  isSending: boolean;
  onExit: () => void;
  onChangeRoles: () => void;
  onSaveSession: () => void;
}

const RoleplayView: React.FC<RoleplayViewProps> = ({
  theme, history, userRole, aiRole, onSendMessage, isSending, onExit, onChangeRoles, onSaveSession
}) => {
  const [inputText, setInputText] = useState("");
  // 'correction' for Grammar, 'suggestion' for Better Response
  const [activeFeedback, setActiveFeedback] = useState<Record<string, 'correction' | 'suggestion' | null>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isSending, activeFeedback]);

  // Check for perfect grammar on new messages to play sound
  useEffect(() => {
      const lastMsg = history[history.length - 1];
      if (lastMsg && lastMsg.role === 'user' && !lastMsg.isGrammarPending && lastMsg.grammarAnalysis && !lastMsg.grammarAnalysis.hasError) {
          // Check if we just received this analysis (basic check to avoid replay on render)
          // Ideally track this in state, but simple sfx here is fine
      }
  }, [history]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    playSfx('click');
    onSendMessage(inputText);
    setInputText("");
    setIsSaved(false); 
  };

  const handleSave = () => {
      playSfx('success');
      onSaveSession();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleFeedback = (id: string, type: 'correction' | 'suggestion') => {
    playSfx('click');
    setActiveFeedback(prev => {
        const current = prev[id];
        if (current === type) return { ...prev, [id]: null }; 
        return { ...prev, [id]: type }; 
    });
  };

  const handleExitClick = () => {
      playSfx('click');
      if (history.length > 0 && !isSaved) {
          setShowExitConfirm(true);
      } else {
          onExit();
      }
  };

  const confirmExit = () => {
      setShowExitConfirm(false);
      onExit();
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#f8fafc] overflow-hidden animate-fade-in font-nunito">
      
      <ConfirmModal 
        isOpen={showExitConfirm}
        title="Exit Conversation?"
        message="You haven't saved this session yet. Your chat history will be lost."
        confirmLabel="Exit Anyway"
        onConfirm={confirmExit}
        onCancel={() => setShowExitConfirm(false)}
        variant="danger"
      />

      {/* Glassmorphism Header - Fixed */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex justify-between items-center z-20 shrink-0 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
            <button onClick={handleExitClick} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all shadow-sm border border-slate-100">
                <XIcon />
            </button>
            <div>
                <h3 className="font-black text-slate-800 leading-none text-lg line-clamp-1">{theme}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md truncate max-w-[100px]">YOU: {userRole}</span>
                   <span className="text-[10px] text-slate-300">vs</span>
                   <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md truncate max-w-[100px]">AI: {aiRole}</span>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={handleSave}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${isSaved ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
            >
                {isSaved ? <CheckIcon /> : <SaveIcon />}
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            
            <button 
                onClick={onChangeRoles}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200"
            >
                <SwitchHorizontalIcon />
            </button>
        </div>
      </div>

      {/* Messages Area with Pattern Background */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 custom-scrollbar relative z-0 pb-32">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
        
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60 animate-fade-in relative z-10">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm border border-slate-100">🎬</div>
              <p className="text-slate-500 font-bold mb-1 text-xl">Scene Start!</p>
              <p className="text-slate-400 font-medium">Break the ice as <span className="text-indigo-600">{userRole}</span>.</p>
          </div>
        )}
        
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {history.map((msg) => {
          const isUser = msg.role === 'user';
          const isPending = msg.isGrammarPending;
          const hasError = isUser && msg.grammarAnalysis?.hasError;
          const currentFeedback = activeFeedback[msg.id];
          
          return (
            <div 
              key={msg.id} 
              className={`w-full flex gap-3 animate-slide-up relative z-10 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
                {/* AI Avatar (Left) */}
                {!isUser && (
                    <div className="shrink-0 flex flex-col justify-end">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center text-lg border-2 border-white shadow-sm">
                           🤖
                        </div>
                    </div>
                )}

                {/* Message Bubble + Actions Container */}
                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                    
                    {/* Bubble */}
                    <div 
                    className={`px-5 py-3.5 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm transition-all duration-300 relative border ${
                        isUser 
                        ? currentFeedback === 'correction'
                            ? 'bg-rose-50 text-rose-900 border-rose-200 rounded-br-sm'
                            : currentFeedback === 'suggestion'
                                ? 'bg-amber-50 text-amber-900 border-amber-200 rounded-br-sm'
                                : 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-transparent rounded-br-none shadow-indigo-200' 
                        : 'bg-white text-slate-700 border-slate-200 rounded-bl-none' 
                    }`}
                    >
                    
                    {/* Text Content */}
                    <div className="break-words">
                        {currentFeedback === 'correction' && hasError
                            ? <span className="line-through opacity-60 mr-2 decoration-2">{msg.text}</span>
                            : null
                        }
                        
                        {currentFeedback === 'correction' && hasError
                            ? <span className="font-bold">{msg.grammarAnalysis!.correctedText}</span>
                            : currentFeedback === 'suggestion' && msg.grammarAnalysis
                                ? <span className="font-bold italic">"{msg.grammarAnalysis!.betterResponse}"</span>
                                : msg.text
                        }
                    </div>

                    {/* Pending Spinner inside bubble */}
                    {isUser && isPending && (
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                    </div>

                    {/* Feedback Tools (User Only) - Placed clearly below bubble */}
                    {isUser && !isPending && msg.grammarAnalysis && (
                        <div className="mt-1.5 flex flex-wrap items-center justify-end gap-2 w-full">
                            
                            {/* Status Indicator: Perfect Grammar */}
                            {!hasError && (
                                <div className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-100 opacity-80 cursor-default select-none">
                                    <CheckIcon /> Perfect
                                </div>
                            )}

                            {/* Button: Fix Grammar (Only if error) */}
                            {hasError && (
                                <button
                                    onClick={() => toggleFeedback(msg.id, 'correction')}
                                    className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition-all border ${
                                        currentFeedback === 'correction'
                                        ? 'text-rose-700 bg-rose-50 border-rose-200 ring-2 ring-rose-100' 
                                        : 'text-rose-500 hover:text-rose-600 bg-white border-rose-100 hover:border-rose-200 shadow-sm'
                                    }`}
                                >
                                    <WandIcon /> Fix Grammar
                                </button>
                            )}

                            {/* Button: Pro Tip / Better Way */}
                            <button
                                onClick={() => toggleFeedback(msg.id, 'suggestion')}
                                className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition-all border ${
                                    currentFeedback === 'suggestion'
                                    ? 'text-amber-700 bg-amber-50 border-amber-200 ring-2 ring-amber-100' 
                                    : 'text-amber-600 hover:text-amber-700 bg-white border-amber-100 hover:border-amber-200 shadow-sm'
                                }`}
                            >
                                <LightBulbIcon /> Better Way
                            </button>
                        </div>
                    )}
                    
                    {/* Expanded Explanation Card - Full width below buttons */}
                    {isUser && currentFeedback && msg.grammarAnalysis && (
                        <div className={`mt-2 text-sm text-slate-600 bg-white p-4 rounded-xl border-l-4 shadow-md text-left w-full animate-slide-up relative z-10 ${currentFeedback === 'correction' ? 'border-l-rose-500' : 'border-l-amber-500'}`}>
                            <span className={`font-black block mb-1 text-xs uppercase tracking-wide ${currentFeedback === 'correction' ? 'text-rose-600' : 'text-amber-600'}`}>
                                {currentFeedback === 'correction' ? 'Grammar Fix' : 'Context Tip'}
                            </span> 
                            {currentFeedback === 'correction' 
                                ? msg.grammarAnalysis.explanation 
                                : msg.grammarAnalysis.betterResponseExplanation}
                        </div>
                    )}
                </div>

                {/* User Avatar (Right) */}
                {isUser && (
                    <div className="shrink-0 flex flex-col justify-end pb-1">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold shadow-sm text-xs">
                           YOU
                        </div>
                    </div>
                )}
            </div>
          );
        })}
        
        {isSending && (
           <div className="flex justify-start animate-fade-in pl-14">
             <div className="bg-white px-5 py-4 rounded-[1.5rem] rounded-bl-none shadow-sm border border-slate-200">
               <div className="flex gap-1.5">
                 <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></span>
               </div>
             </div>
           </div>
        )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent z-20">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Reply as ${userRole}...`}
            className="w-full pl-6 pr-16 py-4 rounded-2xl bg-white/90 backdrop-blur border border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all text-slate-800 placeholder-slate-400 font-bold shadow-xl"
            disabled={isSending}
            autoFocus
          />
          <button 
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center hover:scale-105 active:scale-95"
          >
            <div className={isSending ? "animate-spin" : ""}>
               {isSending ? <RefreshIcon /> : <ChatIcon />}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleplayView;