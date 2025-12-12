import React from 'react';

type Emotion = 'happy' | 'thinking' | 'idle' | 'excited' | 'waiting' | 'teasing';

interface MascotProps {
  emotion?: Emotion;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ emotion = 'idle', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  // Robot Colors
  const primaryColor = "#6366f1"; // Indigo 500
  const faceColor = "#ffffff";
  const cheekColor = "#f472b6"; // Pink 400

  return (
    <div className={`relative ${sizeClasses[size]} ${className} select-none`}>
       <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
         {/* Body/Head Shape */}
         <rect x="40" y="40" width="120" height="110" rx="30" fill={primaryColor} />
         <rect x="40" y="140" width="120" height="20" rx="10" fill="#4338ca" /> {/* Shadow/Neck */}
         
         {/* Ears/Antenna */}
         <circle cx="25" cy="95" r="12" fill="#4338ca" />
         <circle cx="175" cy="95" r="12" fill="#4338ca" />
         <line x1="100" y1="40" x2="100" y2="15" stroke={primaryColor} strokeWidth="6" strokeLinecap="round"/>
         <circle cx="100" cy="15" r="8" fill="#fbbf24" className={emotion === 'thinking' ? 'animate-pulse' : ''}/>

         {/* Screen/Face */}
         <rect x="55" y="55" width="90" height="70" rx="20" fill={faceColor} />

         {/* Cheeks */}
         <circle cx="65" cy="105" r="6" fill={cheekColor} opacity="0.6" />
         <circle cx="135" cy="105" r="6" fill={cheekColor} opacity="0.6" />

         {/* Eyes Logic */}
         {emotion === 'idle' && (
             <g className="animate-blink">
                <circle cx="75" cy="85" r="8" fill="#1e293b" />
                <circle cx="125" cy="85" r="8" fill="#1e293b" />
                <circle cx="77" cy="83" r="3" fill="white" />
                <circle cx="127" cy="83" r="3" fill="white" />
             </g>
         )}

         {emotion === 'happy' && (
             <g>
                <path d="M65 85 Q75 75 85 85" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                <path d="M115 85 Q125 75 135 85" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
             </g>
         )}
         
         {emotion === 'excited' && (
             <g>
                <path d="M65 88 L75 78 L85 88" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M115 88 L125 78 L135 88" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
             </g>
         )}

         {emotion === 'thinking' && (
             <g>
                <circle cx="75" cy="85" r="8" fill="#1e293b" />
                <line x1="115" y1="85" x2="135" y2="85" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
             </g>
         )}

         {emotion === 'waiting' && (
             <g>
                <circle cx="75" cy="85" r="8" fill="#1e293b" />
                <circle cx="125" cy="85" r="8" fill="#1e293b" />
             </g>
         )}

         {emotion === 'teasing' && (
             <g>
                 {/* Squinting Eyes > < */}
                 <path d="M65 80 L75 90 L65 100" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
                 <path d="M135 80 L125 90 L135 100" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
             </g>
         )}

         {/* Mouth Logic */}
         {emotion === 'idle' && <path d="M90 105 Q100 110 110 105" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />}
         {(emotion === 'happy' || emotion === 'excited') && <path d="M85 105 Q100 120 115 105" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="#fda4af" />}
         {emotion === 'thinking' && <circle cx="100" cy="110" r="4" fill="#1e293b" />}
         {emotion === 'waiting' && <line x1="90" y1="110" x2="110" y2="110" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />}
         
         {/* Teasing Mouth: Tongue sticking out */}
         {emotion === 'teasing' && (
             <g>
                 <path d="M85 110 Q100 110 115 110" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                 <path d="M92 110 Q92 125 100 125 Q108 125 108 110" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
             </g>
         )}

       </svg>
    </div>
  );
};

export default Mascot;
