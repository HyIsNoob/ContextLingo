import React from 'react';
import { SparklesIcon, UploadIcon, ChatIcon, BookIcon } from './Icons';
import Mascot from './Mascot';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col overflow-hidden relative font-nunito">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] animate-float-delayed"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[100px] animate-float"></div>
      </div>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 text-center max-w-6xl mx-auto z-10">
        
        {/* Mascot Hero */}
        <div className="mb-8 relative group">
           <div className="absolute inset-0 bg-white/50 rounded-full blur-xl scale-90 group-hover:scale-110 transition-transform duration-700"></div>
           <Mascot emotion="happy" size="xl" className="animate-float cursor-pointer hover:scale-110 transition-transform duration-300" />
           <div className="absolute -right-12 top-0 bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-lg text-sm font-bold text-slate-700 animate-pop-in" style={{ animationDelay: '0.5s' }}>
              Hi! I'm LingoBot! 👋
           </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight drop-shadow-sm">
          Learn English <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">from Real Life.</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium">
          Don't just memorize lists. Snap a photo of your world, and LingoBot will turn it into a fun, bite-sized lesson!
        </p>

        <button 
          onClick={onGetStarted}
          className="group relative px-10 py-5 bg-indigo-600 text-white text-xl font-black rounded-2xl shadow-[0_8px_0_rgb(67,56,202)] hover:shadow-[0_4px_0_rgb(67,56,202)] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all duration-150 overflow-hidden shine-effect"
        >
          START LEARNING
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-100 hover:border-indigo-300 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
              <UploadIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Magic Vision</h3>
            <p className="text-slate-500 font-medium">
              Upload any photo. LingoBot sees what you see and teaches you the words you need right now.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-100 hover:border-emerald-300 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
              <BookIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Context</h3>
            <p className="text-slate-500 font-medium">
              Get vocabulary, definitions, and quizzes that actually make sense for the situation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-100 hover:border-rose-300 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
              <ChatIcon />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Roleplay Dojo</h3>
            <p className="text-slate-500 font-medium">
              Jump into a conversation with LingoBot acting as a barista, a clerk, or a friend!
            </p>
          </div>

        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm font-bold opacity-60">
        © 2025 ContextLingo • Learning made juicy 🍊
      </footer>
    </div>
  );
};

export default LandingPage;