import React, { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { 
  signInWithGoogle, 
  signInWithGithub, 
  signInWithMicrosoft, 
  signInWithApple 
} from '../../lib/firebase';

interface AuthModalProps {
  onAuthSuccess: (user: any, token: string | null, provider: string) => void;
  onClose: () => void;
}

export const AuthModal = ({ onAuthSuccess, onClose }: AuthModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string, signInMethod: () => Promise<any>) => {
    setError(null);
    setIsLoading(provider);
    try {
      const result = await signInMethod();
      onAuthSuccess(result.user, result.accessToken, result.provider);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(`Erro ao autenticar com ${provider}: ${err.message || 'Tente novamente.'}`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[32px] p-8 shadow-[0_24px_64px_rgba(31,38,135,0.15)] space-y-8 relative overflow-hidden"
      >
        {/* Abstract Liquid Glass Blur Accent */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-4">
          {/* Liquid Glass Z Logo */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-lg border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_8px_24px_rgba(31,38,135,0.1)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/5 opacity-50" />
            {/* Liquid Highlight Effect */}
            <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/50 to-white/0 rounded-t-2xl pointer-events-none" />
            <span className="text-4xl font-extrabold bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 bg-clip-text text-transparent font-sans drop-shadow-sm select-none">Z</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-850 tracking-tight">Entrar no ZORRO</h2>
            <p className="text-sm text-slate-500 mt-1">Selecione uma das opções para conectar sua conta</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-650 text-xs px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <AuthButton 
            provider="Google" 
            isLoading={isLoading === 'Google'}
            onClick={() => handleSignIn('Google', signInWithGoogle)} 
          />
          <AuthButton 
            provider="Microsoft" 
            isLoading={isLoading === 'Microsoft'}
            onClick={() => handleSignIn('Microsoft', signInWithMicrosoft)} 
          />
          <AuthButton 
            provider="GitHub" 
            isLoading={isLoading === 'GitHub'}
            onClick={() => handleSignIn('GitHub', signInWithGithub)} 
          />
          <AuthButton 
            provider="Apple" 
            isLoading={isLoading === 'Apple'}
            onClick={() => handleSignIn('Apple', signInWithApple)} 
          />
          
          <div className="flex items-center justify-center pt-2">
            <button 
              onClick={onClose} 
              disabled={isLoading !== null}
              className="text-xs text-slate-400 hover:text-slate-600 hover:underline transition-all cursor-pointer font-medium"
            >
              Acessar como convidado
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface AuthButtonProps {
  provider: string;
  isLoading: boolean;
  onClick: () => void;
}

const AuthButton = ({ provider, isLoading, onClick }: AuthButtonProps) => {
  const getIcon = (p: string) => {
    switch (p) {
      case 'Google': 
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" className="flex-shrink-0">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.927h6.6c-.28 1.5-.1 3.004-2.23 3.93v3.26h3.58c2.09-1.925 3.3-4.757 3.3-8.047z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.58-3.26c-.99.66-2.26 1.06-4.38 1.06-4.17 0-7.7-2.82-8.96-6.61H1.21v3.37C3.18 19.64 7.28 24 12 24z"/>
            <path fill="#FBBC05" d="M3.04 12.28a7.2 7.2 0 0 1 0-4.56V4.35H1.21a11.94 11.94 0 0 0 0 11.3V12.28z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.435-3.43C17.96 1.19 15.23 0 12 0 7.28 0 3.18 4.36 1.21 8.35l3.87 3.37C6.3 7.57 9.83 4.75 12 4.75z"/>
          </svg>
        );
      case 'Microsoft': 
        return (
          <svg viewBox="0 0 23 23" width="18" height="18" className="flex-shrink-0">
            <path fill="#F25022" d="M0 0h11v11H0z"/>
            <path fill="#7FBA00" d="M12 0h11v11H12z"/>
            <path fill="#00A4EF" d="M0 12h11v11H0z"/>
            <path fill="#FFB900" d="M12 12h11v11H12z"/>
          </svg>
        );
      case 'GitHub': 
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-[#24292e] flex-shrink-0">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.05c-3.35.73-4.06-1.63-4.06-1.63-.54-1.38-1.32-1.75-1.32-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.1-.77.41-1.3.75-1.59-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 3.02-.4c1.02.01 2.05.14 3.02.4 2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.46 5.92.43.37.82 1.1.82 2.22v3.29c0 .33.22.7.82.58C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        );
      case 'Apple': 
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-black flex-shrink-0">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z"/>
          </svg>
        );
      default: 
        return null;
    }
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "w-full flex items-center justify-between gap-3 py-3.5 px-5 rounded-2xl bg-white/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 transition-all text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md cursor-pointer relative",
        isLoading && "opacity-75 cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-4">
        {getIcon(provider)}
        <span>Continuar com {provider}</span>
      </div>
      {isLoading ? (
        <span className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
      ) : (
        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </motion.button>
  );
};
