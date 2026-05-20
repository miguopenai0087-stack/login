import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export const AuthModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-slate-900">Entrar no ZORRO</h2>
        <div className="space-y-3">
          <AuthButton provider="Google" />
          <AuthButton provider="Microsoft" />
          <AuthButton provider="GitHub" />
          <AuthButton provider="Apple" />
          <button onClick={onClose} className="w-full text-center text-xs text-slate-500 hover:text-slate-800 mt-4">
            Acessar como convidado
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AuthButton = ({ provider }: { provider: string }) => {
  const getIcon = (p: string) => {
    switch (p) {
        case 'Google': return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.3-4.74 3.3-8.09z"/></svg>;
        case 'Microsoft': return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M0 0h11.4v11.4H0V0zm12.6 0H24v11.4H12.6V0zM0 12.6h11.4V24H0V12.6zm12.6 0H24V24H12.6V12.6z"/></svg>;
        case 'GitHub': return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.05c-3.35.73-4.06-1.63-4.06-1.63-.54-1.38-1.32-1.75-1.32-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.1-.77.41-1.3.75-1.59-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 3.02-.4c1.02.01 2.05.14 3.02.4 2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.46 5.92.43.37.82 1.1.82 2.22v3.29c0 .33.22.7.82.58C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>;
        case 'Apple': return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.15 1.5c-2.43 0-4.46 1.62-5.18 3.86-.72 2.24-.03 4.66 1.62 6.31 1.65 1.65 4.07 2.34 6.31 1.62 2.24-.72 3.86-2.75 3.86-5.18 0-3.09-2.49-5.61-5.61-5.61zM4.73 14.36c-2.4 1.83-3.95 4.6-3.95 7.64h2.24c0-3.29 2.1-6.14 5.25-7.38l-.75-1.53c-.78.36-1.95.84-2.79 1.27z"/></svg>;
        default: return null;
    }
  }

  return (
    <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/50 hover:bg-white/80 border border-black/5 transition-all text-sm font-medium text-slate-700 shadow-sm">
      {getIcon(provider)}
      Continue com {provider}
    </button>
  );
};
