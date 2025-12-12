import React, { useState, useRef, useEffect } from 'react';
import { ThemeSuggestion, RoleConfig } from '../types';
import { CheckIcon, SparklesIcon } from './Icons';
import Mascot from './Mascot';

interface RoleSelectorProps {
  theme: ThemeSuggestion;
  onConfirm: (roles: RoleConfig) => void;
  onBack: () => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ theme, onConfirm, onBack }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [aiRole, setAiRole] = useState<string | null>(null);
  
  // Drag State
  const [draggingRole, setDraggingRole] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  // Refs for elements to calculate positions
  const roleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const userZoneRef = useRef<HTMLDivElement>(null);
  const aiZoneRef = useRef<HTMLDivElement>(null);

  // Available roles are those not assigned
  const roles = theme.available_roles;

  const handlePointerDown = (e: React.PointerEvent, role: string) => {
    e.preventDefault(); // Prevent text selection
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setStartPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setCursorPos({ x: e.clientX, y: e.clientY });
    setDraggingRole(role);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (draggingRole) {
        setCursorPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (draggingRole) {
        const userRect = userZoneRef.current?.getBoundingClientRect();
        const aiRect = aiZoneRef.current?.getBoundingClientRect();

        // Check collision with User Zone
        if (userRect && 
            e.clientX >= userRect.left && e.clientX <= userRect.right && 
            e.clientY >= userRect.top && e.clientY <= userRect.bottom) {
            
            if (aiRole === draggingRole) setAiRole(null);
            setUserRole(draggingRole);
        }
        // Check collision with AI Zone
        else if (aiRect && 
            e.clientX >= aiRect.left && e.clientX <= aiRect.right && 
            e.clientY >= aiRect.top && e.clientY <= aiRect.bottom) {
            
            if (userRole === draggingRole) setUserRole(null);
            setAiRole(draggingRole);
        } 
        else {
           if (userRole === draggingRole) setUserRole(null);
           if (aiRole === draggingRole) setAiRole(null);
        }

        setDraggingRole(null);
      }
    };

    if (draggingRole) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingRole, userRole, aiRole]);

  const handleStart = () => {
    if (userRole && aiRole) {
      onConfirm({ user_role: userRole, ai_role: aiRole });
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col relative animate-fade-in bg-slate-50 overflow-hidden select-none touch-none font-nunito">
      
      {/* SVG Layer for String Effect */}
      {draggingRole && (
        <svg className="fixed inset-0 pointer-events-none z-50 w-full h-full" style={{ overflow: 'visible' }}>
          <line 
            x1={startPos.x} 
            y1={startPos.y} 
            x2={cursorPos.x} 
            y2={cursorPos.y} 
            stroke="#6366f1" 
            strokeWidth="4" 
            strokeLinecap="round"
            className="opacity-50"
          />
          <circle cx={startPos.x} cy={startPos.y} r="6" fill="#6366f1" />
          <circle cx={cursorPos.x} cy={cursorPos.y} r="6" fill="#6366f1" />
        </svg>
      )}

      {/* Header */}
      <div className="pt-8 px-4 text-center z-10">
         <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-4 uppercase tracking-wide">
             Step 3: Casting
         </div>
         <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Assign Roles</h2>
         <p className="text-slate-500 font-medium">Drag a card to select who plays who.</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col md:flex-row items-stretch justify-center gap-8 p-4 md:p-8 relative z-10 max-w-6xl mx-auto w-full">
        
        {/* User Zone (Drop Target) */}
        <div 
          ref={userZoneRef}
          className={`flex-1 rounded-[2.5rem] border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 relative ${
             userRole 
             ? 'border-indigo-500 bg-indigo-50 shadow-[0_0_0_8px_rgba(99,102,241,0.1)]' 
             : draggingRole && draggingRole !== aiRole 
                ? 'border-indigo-400 bg-indigo-50/50 scale-[1.02] shadow-xl' 
                : 'border-slate-200 bg-white'
          }`}
        >
           <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full shadow-sm text-xs font-black uppercase tracking-widest border z-10 transition-colors ${
               userRole ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-100'
           }`}>
              Your Role
           </div>
           
           {userRole ? (
              <div className="text-center animate-pop-in mt-8 w-full flex flex-col items-center">
                  <div className="w-full max-w-[200px] bg-white rounded-2xl p-6 shadow-md border border-indigo-100 mb-4 transform rotate-2">
                     <h3 className="text-xl md:text-2xl font-black text-indigo-900 leading-tight">{userRole}</h3>
                  </div>
                  <p className="text-indigo-500 font-bold mb-4 text-sm uppercase tracking-wide">Ready to act</p>
                  <button onClick={() => setUserRole(null)} className="text-xs text-slate-400 hover:text-rose-500 font-bold px-3 py-1 hover:bg-rose-50 rounded-lg transition-colors">Click to Remove</button>
              </div>
           ) : (
              <div className="text-center opacity-40 pointer-events-none">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto border-2 border-slate-200 text-slate-300">
                    👤
                  </div>
                  <p className="font-bold text-slate-400 text-lg">Drop "You" Here</p>
              </div>
           )}
        </div>

        {/* Roles Pool (Source) */}
        <div className="flex flex-col justify-center gap-4 w-full md:w-72 order-first md:order-none shrink-0">
           {roles.map((role) => {
              const isAssigned = role === userRole || role === aiRole;
              const isDragging = role === draggingRole;

              return (
                 <div 
                    key={role}
                    ref={(el) => { roleRefs.current[role] = el; }}
                    onPointerDown={(e) => !isAssigned && handlePointerDown(e, role)}
                    className={`bg-white p-5 rounded-2xl border-2 shadow-sm transition-all cursor-grab active:cursor-grabbing text-center font-bold text-slate-700 select-none text-lg ${
                        isAssigned ? 'opacity-20 pointer-events-none scale-90 border-slate-100 grayscale' : 'hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 border-slate-200 hover:text-indigo-600'
                    } ${isDragging ? 'opacity-0' : ''}`}
                 >
                    {role}
                 </div>
              );
           })}
        </div>

        {/* AI Zone (Drop Target) */}
        <div 
          ref={aiZoneRef}
          className={`flex-1 rounded-[2.5rem] border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 relative ${
             aiRole 
             ? 'border-emerald-500 bg-emerald-50 shadow-[0_0_0_8px_rgba(16,185,129,0.1)]' 
             : draggingRole && draggingRole !== userRole 
                ? 'border-emerald-400 bg-emerald-50/50 scale-[1.02] shadow-xl' 
                : 'border-slate-200 bg-white'
          }`}
        >
           <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full shadow-sm text-xs font-black uppercase tracking-widest border z-10 transition-colors ${
               aiRole ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-slate-100'
           }`}>
              AI Partner
           </div>

           {aiRole ? (
              <div className="text-center animate-pop-in mt-8 w-full flex flex-col items-center">
                   {/* Mascot in the background/top */}
                   <div className="mb-2">
                       <Mascot emotion="happy" size="sm" />
                   </div>
                  <div className="w-full max-w-[200px] bg-white rounded-2xl p-6 shadow-md border border-emerald-100 mb-4 transform -rotate-2">
                     <h3 className="text-xl md:text-2xl font-black text-emerald-900 leading-tight">{aiRole}</h3>
                  </div>
                  <p className="text-emerald-600 font-bold mb-4 text-sm uppercase tracking-wide">LingoBot Ready</p>
                  <button onClick={() => setAiRole(null)} className="text-xs text-slate-400 hover:text-rose-500 font-bold px-3 py-1 hover:bg-rose-50 rounded-lg transition-colors">Click to Remove</button>
              </div>
           ) : (
              <div className="text-center opacity-60 pointer-events-none flex flex-col items-center">
                  <div className="mb-4">
                     <Mascot emotion="waiting" size="md" className="opacity-70 grayscale" />
                  </div>
                  <p className="font-bold text-slate-400 text-lg">Drop "AI" Here</p>
              </div>
           )}
        </div>

      </div>

      {/* Floating Drag Proxy */}
      {draggingRole && (
          <div 
             className="fixed px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl pointer-events-none z-[60] transform -translate-x-1/2 -translate-y-1/2 text-xl whitespace-nowrap rotate-3 ring-4 ring-indigo-200"
             style={{ left: cursorPos.x, top: cursorPos.y }}
          >
             {draggingRole}
          </div>
      )}

      {/* Footer Actions */}
      <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] relative">
         <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors">
            Cancel
         </button>
         
         <div className="flex items-center gap-6">
            <p className="text-sm font-bold text-slate-400 hidden sm:block animate-pulse">
                {!userRole ? "Select your role..." : !aiRole ? "Select AI role..." : "Ready to start!"}
            </p>
            <button 
                onClick={handleStart}
                disabled={!userRole || !aiRole}
                className="px-10 py-4 rounded-xl bg-slate-900 text-white font-black hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:-translate-y-1 disabled:hover:translate-y-0 flex items-center gap-2"
            >
                <SparklesIcon /> Start Conversation
            </button>
         </div>
      </div>

    </div>
  );
};

export default RoleSelector;