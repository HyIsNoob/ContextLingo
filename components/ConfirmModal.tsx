import React from 'react';
import Mascot from './Mascot';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'neutral';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  confirmLabel = "Yes, I'm sure", 
  cancelLabel = "Cancel", 
  onConfirm, 
  onCancel,
  variant = 'neutral'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] max-w-sm w-full p-6 shadow-2xl animate-pop-in relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mt-10 z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4">
                <Mascot emotion={variant === 'danger' ? 'thinking' : 'waiting'} size="md" />
            </div>
            
            <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                {message}
            </p>

            <div className="flex flex-col gap-3 w-full">
                <button 
                    onClick={onConfirm}
                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
                        variant === 'danger' 
                        ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                    }`}
                >
                    {confirmLabel}
                </button>
                <button 
                    onClick={onCancel}
                    className="w-full py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                    {cancelLabel}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;