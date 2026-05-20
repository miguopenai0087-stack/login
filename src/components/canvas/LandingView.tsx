import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Plus, Play, LogIn, Sparkles, LogOut } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuthState } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { handleLogout } from '../../lib/firebase';

interface LandingViewProps {
  authState: AuthState;
  onStartChat: (input: string) => void;
  onOpenAuth: () => void;
}

export const LandingView = ({ authState, onStartChat, onOpenAuth }: LandingViewProps) => {
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([15, 15, 15, 15, 15]);
  const animationRef = useRef<number | null>(null);

  // Simulate audio speech waves when microphone is active
  useEffect(() => {
    if (isSpeaking) {
      const animateWave = () => {
        setWaveHeights(Array.from({ length: 8 }, () => Math.floor(Math.random() * 45) + 12));
        animationRef.current = requestAnimationFrame(animateWave);
      };
      animateWave();
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setWaveHeights(Array.from({ length: 8 }, () => 15));
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSpeaking]);

  const handleMicClick = () => {
    setIsSpeaking(!isSpeaking);
  };

  const getProviderIcon = (provider: string | null) => {
    if (!provider) return null;
    switch (provider) {
      case 'Google':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.927h6.6c-.28 1.5-.1 3.004-2.23 3.93v3.26h3.58c2.09-1.925 3.3-4.757 3.3-8.047z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.58-3.26c-.99.66-2.26 1.06-4.38 1.06-4.17 0-7.7-2.82-8.96-6.61H1.21v3.37C3.18 19.64 7.28 24 12 24z"/>
            <path fill="#FBBC05" d="M3.04 12.28a7.2 7.2 0 0 1 0-4.56V4.35H1.21a11.94 11.94 0 0 0 0 11.3V12.28z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.435-3.43C17.96 1.19 15.23 0 12 0 7.28 0 3.18 4.36 1.21 8.35l3.87 3.37C6.3 7.57 9.83 4.75 12 4.75z"/>
          </svg>
        );
      case 'Microsoft':
        return (
          <svg viewBox="0 0 23 23" width="14" height="14">
            <path fill="#F25022" d="M0 0h11v11H0z"/>
            <path fill="#7FBA00" d="M12 0h11v11H12z"/>
            <path fill="#00A4EF" d="M0 12h11v11H0z"/>
            <path fill="#FFB900" d="M12 12h11v11H12z"/>
          </svg>
        );
      case 'GitHub':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-slate-800">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.05c-3.35.73-4.06-1.63-4.06-1.63-.54-1.38-1.32-1.75-1.32-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.1-.77.41-1.3.75-1.59-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 3.02-.4c1.02.01 2.05.14 3.02.4 2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.46 5.92.43.37.82 1.1.82 2.22v3.29c0 .33.22.7.82.58C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        );
      case 'Apple':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-black">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-6 relative">
      {/* Ambient glass glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/40 via-indigo-100/30 to-purple-200/40 rounded-full blur-[160px]" />
      </div>

      {/* Canto superior direito: Conta de Login / Active provider indicator */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-3">
        {authState.user ? (
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-full py-1.5 pl-3.5 pr-2 shadow-sm">
            <span className="text-xs text-slate-500 font-bold ml-1 flex items-center gap-1.5 uppercase tracking-wide">
              {getProviderIcon(authState.provider)}
              <span>{authState.provider}</span>
            </span>
            <div className="h-4 w-px bg-slate-200" />
            
            {authState.user.photoURL ? (
              <img 
                src={authState.user.photoURL} 
                alt={authState.user.displayName || "Usuário"} 
                className="w-7 h-7 rounded-full shadow-inner object-cover border border-slate-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                {(authState.user.displayName || authState.user.email || "S").charAt(0).toUpperCase()}
              </div>
            )}
            
            <button 
              onClick={() => handleLogout()}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors tooltip cursor-pointer"
              title="Sair"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-md border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all py-2 px-4 rounded-full text-xs font-bold text-slate-700 shadow-sm cursor-pointer"
          >
            <LogIn size={15} /> Conectar Conta
          </button>
        )}
      </div>

      <div className="w-full max-w-2xl text-center space-y-12 z-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Liquid Glass Z logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-white/70 via-white/40 to-white/15 backdrop-blur-xl border border-white/60 shadow-[inset_0_4px_8px_rgba(255,255,255,0.8),0_12px_36px_rgba(31,38,135,0.08)] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 components-glow to-purple-400/5 opacity-80" />
            {/* Liquid Shine Reflex */}
            <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/65 to-white/0 rounded-t-3xl pointer-events-none" />
            <span className="text-5xl font-black bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 bg-clip-text text-transparent font-sans tracking-tight drop-shadow-sm select-none">Z</span>
            
            {/* Corner specular element */}
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-60 filter blur-[0.5px]" />
          </motion.div>
          <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/15 py-1 px-3 rounded-full text-2xs font-bold tracking-widest uppercase">
            <Sparkles size={11} className="animate-pulse" />
            Liquid Glass Experience
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight select-none">
          Oi Samara, o que está te incomodando?
        </h1>

        <div className="space-y-4">
          <div className="relative flex items-center bg-white/80 backdrop-blur-lg border border-slate-200 rounded-[24px] py-4 pl-6 pr-4 shadow-[0_10px_35px_-8px_rgba(31,38,135,0.05)] hover:shadow-[0_12px_45px_-8px_rgba(31,38,135,0.08)] transition-all">
            <Plus className="text-slate-400 mr-4 flex-shrink-0 cursor-pointer hover:text-slate-600" size={24} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                  onStartChat(input);
                }
              }}
              placeholder="Perguntar ao ZORRO ou acessar o Google Chat..."
              className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-slate-800 placeholder:text-slate-400 font-medium"
            />
            
            <div className="flex items-center gap-3 flex-shrink-0">
               <span className="text-xs bg-slate-100 border border-slate-250 py-1 px-3 rounded-full font-bold text-slate-500 shadow-2xs">Clarão</span>
               
               {/* Speach Voice Speaking button / mic button */}
               <motion.button 
                 whileTap={{ scale: 0.9 }}
                 onClick={handleMicClick}
                 className={cn(
                   "p-3.5 rounded-full transition-all duration-350 cursor-pointer shadow-sm relative flex items-center justify-center",
                   isSpeaking 
                     ? "bg-red-500 text-white shadow-red-200 animate-pulse hover:bg-red-600" 
                     : "bg-gradient-to-br from-indigo-500 to-blue-600 text-white hover:shadow-indigo-100"
                 )}
               >
                 {isSpeaking ? <MicOff size={20} /> : <Mic size={20} />}
                 {isSpeaking && (
                   <span className="absolute -inset-1.5 rounded-full border border-red-500/30 animate-ping pointer-events-none" />
                 )}
               </motion.button>
            </div>
          </div>

          {/* Interactive Voice Waveform when speaking is true */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center space-y-2 py-2"
              >
                <div className="flex items-center gap-1.5 h-10">
                  {waveHeights.map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: h }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      style={{ width: "4px" }}
                      className="bg-red-500 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-2xs font-bold text-red-500 animate-pulse uppercase tracking-widest font-mono">
                  Ouvindo Samara... Fale agora
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Context Hint */}
        <div className="pt-2 flex justify-center flex-wrap gap-2 text-xs font-semibold text-slate-500 justify-center">
          <span>Explore:</span>
          {authState.token ? (
            <span className="text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/10 flex items-center gap-1">
              Google Chat Conectado!
            </span>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="text-slate-600 bg-white hover:text-slate-800 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              Conectar Google Chat 💬
            </button>
          )}
          <span className="opacity-40">|</span>
          <span className="text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
            ZORRO Engine
          </span>
        </div>
      </div>
    </div>
  );
};
