import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon, TextIcon, GlobeIcon, SignalIcon, SparklesIcon } from './Icons';
import { TargetLanguage, DifficultyLevel } from '../types';
import Mascot from './Mascot';

interface InputSectionProps {
  onNext: (text: string, file: File | null, language: TargetLanguage, difficulty: DifficultyLevel) => void;
  isLoading: boolean;
}

const LANGUAGES: TargetLanguage[] = ['English', 'Spanish', 'French', 'Japanese', 'Korean'];
const DIFFICULTIES: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

// Custom Dropdown Component
const CustomSelect = ({ 
    label, 
    value, 
    options, 
    onChange, 
    icon 
}: { 
    label: string, 
    value: string, 
    options: string[], 
    onChange: (val: string) => void,
    icon: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative z-30">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-slate-50 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col group ${isOpen ? 'border-indigo-400 ring-4 ring-indigo-50 bg-white' : 'border-slate-200 hover:border-indigo-300 hover:bg-white'}`}
            >
                <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2 group-hover:text-indigo-500">
                    {icon} {label}
                </span>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-800">{value}</span>
                    <span className={`text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-pop-in">
                    {options.map((opt) => (
                        <div 
                            key={opt}
                            onClick={() => { onChange(opt); setIsOpen(false); }}
                            className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors ${value === opt ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-500'}`}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const InputSection: React.FC<InputSectionProps> = ({ onNext, isLoading }) => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<TargetLanguage>('English');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHoveringDrop, setIsHoveringDrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('contextlingo_pref_lang');
    const savedDiff = localStorage.getItem('contextlingo_pref_diff');
    if (savedLang) setLanguage(savedLang as TargetLanguage);
    if (savedDiff) setDifficulty(savedDiff as DifficultyLevel);
  }, []);

  const handleLanguageChange = (val: string) => {
    setLanguage(val as TargetLanguage);
    localStorage.setItem('contextlingo_pref_lang', val);
  };

  const handleDifficultyChange = (val: string) => {
    setDifficulty(val as DifficultyLevel);
    localStorage.setItem('contextlingo_pref_diff', val);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    onNext(text, file, language, difficulty);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 relative">
      
      {/* Decorative Mascot Peeking - UPDATED Z-INDEX TO BE ON TOP */}
      <div className="absolute -top-12 right-6 md:-right-4 z-20 animate-float-delayed hidden sm:block pointer-events-none">
         <Mascot emotion="waiting" size="xl" />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border-2 border-slate-100 p-8 md:p-12 relative z-10 animate-enter">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-4 uppercase tracking-wide">
             Step 1: Setup
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Create New Lesson</h2>
          <p className="text-slate-500 text-lg font-medium">Capture a moment or describe a scene.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Settings Row with Custom Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
            <CustomSelect 
                label="Target Language"
                value={language}
                options={LANGUAGES}
                onChange={handleLanguageChange}
                icon={<GlobeIcon />}
            />
            <CustomSelect 
                label="Proficiency"
                value={difficulty}
                options={DIFFICULTIES}
                onChange={handleDifficultyChange}
                icon={<SignalIcon />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {/* Visual Context */}
            <div className="md:col-span-2">
                 <div 
                    className={`relative border-3 border-dashed rounded-3xl transition-all cursor-pointer overflow-hidden h-64 flex flex-col items-center justify-center text-center p-4 ${
                      file 
                      ? 'border-indigo-400 bg-indigo-50' 
                      : isHoveringDrop 
                         ? 'border-indigo-400 bg-indigo-50 scale-[1.02]' 
                         : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white'
                    }`}
                    onMouseEnter={() => setIsHoveringDrop(true)}
                    onMouseLeave={() => setIsHoveringDrop(false)}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    
                    {file && previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-bold shadow-lg">Change Image</div>
                        </div>
                      </>
                    ) : (
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-500 mb-3 mx-auto">
                           <UploadIcon />
                        </div>
                        <p className="font-bold text-slate-700">Upload Image</p>
                        <p className="text-xs text-slate-400 mt-1 font-semibold">Support JPG, PNG</p>
                      </div>
                    )}
                  </div>
            </div>

            <div className="md:col-span-1 flex items-center justify-center">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">OR</div>
            </div>

            {/* Text Context */}
            <div className="md:col-span-2 flex flex-col">
                <div className="flex-grow bg-slate-50 rounded-3xl border border-slate-200 p-4 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all hover:bg-white">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                        <TextIcon /> Describe Scenario
                    </label>
                    <textarea
                        className="w-full h-full bg-transparent outline-none resize-none text-slate-700 font-medium placeholder-slate-300"
                        placeholder="E.g., Negotiating prices at a night market..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || (!text && !file)}
            className={`w-full py-5 rounded-2xl font-black text-xl text-white shadow-[0_8px_0_rgba(0,0,0,0.1)] transition-all relative overflow-hidden group ${
              isLoading || (!text && !file)
                ? 'bg-slate-300 shadow-none cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:translate-y-1 active:translate-y-2 active:shadow-none'
            }`}
          >
             <div className="relative z-10 flex items-center justify-center gap-3">
                 {isLoading ? (
                     <>
                        <span className="animate-spin w-6 h-6 border-4 border-white/30 border-t-white rounded-full"></span>
                        Analyzing...
                     </>
                 ) : (
                     <>
                        <SparklesIcon /> Generate Magic Lesson
                     </>
                 )}
             </div>
             {/* Shine Effect */}
             {!isLoading && (text || file) && <div className="absolute inset-0 shine-effect opacity-20 pointer-events-none"></div>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputSection;