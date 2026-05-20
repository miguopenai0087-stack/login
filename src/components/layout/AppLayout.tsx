import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, History, Settings, Bot, MessageSquare, LogIn, Loader2, Sparkles } from 'lucide-react';
import { AuthState, ChatSpace } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  authState: AuthState;
  onOpenAuth: () => void;
  activeSpace: ChatSpace | null;
  onSelectSpace: (space: ChatSpace | null) => void;
}

export const AppLayout = ({ 
  children, 
  authState, 
  onOpenAuth, 
  activeSpace, 
  onSelectSpace 
}: LayoutProps) => {
  const [spaces, setSpaces] = useState<ChatSpace[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);

  useEffect(() => {
    if (authState.token) {
      setIsLoadingSpaces(true);
      fetch('https://chat.googleapis.com/v1/spaces', {
        headers: { Authorization: `Bearer ${authState.token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.spaces) {
          setSpaces(data.spaces);
        } else {
          setSpaces([]);
        }
      })
      .catch(err => {
        console.error('Erro ao inicializar Google Chat:', err);
        setSpaces([]);
      })
      .finally(() => {
        setIsLoadingSpaces(false);
      });
    } else {
      setSpaces([]);
    }
  }, [authState.token]);

  const getProviderIcon = (provider: string | null) => {
    if (!provider) return null;
    switch (provider) {
      case 'Google':
        return (
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.927h6.6c-.28 1.5-.1 3.004-2.23 3.93v3.26h3.58c2.09-1.925 3.3-4.757 3.3-8.047z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.58-3.26c-.99.66-2.26 1.06-4.38 1.06-4.17 0-7.7-2.82-8.96-6.61H1.21v3.37C3.18 19.64 7.28 24 12 24z"/>
            <path fill="#FBBC05" d="M3.04 12.28a7.2 7.2 0 0 1 0-4.56V4.35H1.21a11.94 11.94 0 0 0 0 11.3V12.28z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.435-3.43C17.96 1.19 15.23 0 12 0 7.28 0 3.18 4.36 1.21 8.35l3.87 3.37C6.3 7.57 9.83 4.75 12 4.75z"/>
          </svg>
        );
      case 'Microsoft':
        return (
          <svg viewBox="0 0 23 23" width="10" height="10">
            <path fill="#F25022" d="M0 0h11v11H0z"/>
            <path fill="#7FBA00" d="M12 0h11v11H12z"/>
            <path fill="#00A4EF" d="M0 12h11v11H0z"/>
            <path fill="#FFB900" d="M12 12h11v11H12z"/>
          </svg>
        );
      case 'GitHub':
        return (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.05c-3.35.73-4.06-1.63-4.06-1.63-.54-1.38-1.32-1.75-1.32-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.48.99.1-.77.41-1.3.75-1.59-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 3.02-.4c1.02.01 2.05.14 3.02.4 2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.46 5.92.43.37.82 1.1.82 2.22v3.29c0 .33.22.7.82.58C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        );
      case 'Apple':
        return (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans w-full">
      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/50 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-100/50 rounded-full blur-[128px]" />
      </div>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-slate-200/50 bg-white/45 backdrop-blur-xl p-5 flex flex-col gap-6 z-10 flex-shrink-0"
      >
        <div className="flex items-center gap-2.5 text-xl font-black tracking-tight text-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/70 to-white/10 backdrop-blur-md border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_8px_16px_rgba(31,38,135,0.05)] flex items-center justify-center">
            <span className="text-xl font-extrabold bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 bg-clip-text text-transparent font-sans">Z</span>
          </div>
          ZORRO
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <div className="text-2xs font-extrabold text-slate-400 tracking-wider uppercase mb-2 px-3">Geral</div>
          <NavItem 
            icon={<Bot size={18}/>} 
            label="Dashboard / AI Trace" 
            active={activeSpace === null}
            onClick={() => onSelectSpace(null)}
          />
          <NavItem icon={<Search size={18}/>} label="Search Engine" />
          <NavItem icon={<History size={18}/>} label="History Log" />

          {/* Google Chat Spaces Section */}
          <div className="pt-4 space-y-1 border-t border-slate-200/50 mt-4">
            <div className="text-2xs font-extrabold text-slate-400 tracking-wider uppercase mb-2 px-3 flex items-center justify-between">
              <span>Google Chat Spaces</span>
              <span className="text-[9px] bg-blue-500/10 text-blue-600 border border-blue-500/20 py-0.5 px-1.5 rounded-full capitalize scale-95 origin-right">Real</span>
            </div>

            {isLoadingSpaces ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-3 px-3">
                <Loader2 size={13} className="animate-spin text-slate-500" />
                <span>Carregando espaços...</span>
              </div>
            ) : authState.token ? (
              spaces.length === 0 ? (
                <div className="text-3s text-slate-400 bg-slate-100/50 p-3 rounded-xl border border-slate-200/30 text-center text-xs">
                  Nenhum espaço encontrado no Google Chat.
                </div>
              ) : (
                <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
                  {spaces.map((space) => {
                    const spaceId = space.name.split('/').pop() || '';
                    const isSelected = activeSpace?.name === space.name;
                    return (
                      <button 
                        key={space.name}
                        onClick={() => onSelectSpace(space)}
                        className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold select-none cursor-pointer ${
                          isSelected 
                            ? "bg-blue-500 text-white shadow-md shadow-blue-100" 
                            : "hover:bg-slate-100/80 text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <MessageSquare size={14} className={isSelected ? "text-white" : "text-slate-400"} />
                        <span className="truncate flex-1">{space.displayName || `Espaço (${spaceId})`}</span>
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 rounded-2xl border border-slate-200/60 flex flex-col gap-2.5">
                <p className="text-[11px] text-slate-500 leading-normal font-medium">
                  Conecte com sua conta do Google para interagir e enviar mensagens ao Google Chat real.
                </p>
                <button 
                  onClick={onOpenAuth}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-3s font-bold shadow-2xs hover:shadow-sm cursor-pointer transition-all"
                >
                  <LogIn size={11} /> Conectar Google
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Dynamic Sidebar Footer */}
        <div className="border-t border-slate-200/50 pt-4 flex flex-col gap-3">
          {authState.user ? (
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-100/50 hover:bg-slate-100 rounded-2xl border border-slate-250/30 transition-all">
              {authState.user.photoURL ? (
                <img 
                  referrerPolicy="no-referrer"
                  src={authState.user.photoURL} 
                  alt={authState.user.displayName || "Usuário"} 
                  className="w-8 h-8 rounded-full border border-slate-250/50 shadow-inner"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                  {(authState.user.displayName || authState.user.email || "S").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {authState.user.displayName || "Usuário"}
                </div>
                <div className="text-[9px] text-indigo-600 font-extrabold tracking-wide uppercase flex items-center gap-1 mt-0.5">
                  {getProviderIcon(authState.provider)}
                  <span>{authState.provider}</span>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-650 hover:to-blue-750 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all cursor-pointer hover:shadow-lg hover:shadow-indigo-200"
            >
              <LogIn size={14} /> Conectar Perfil
            </button>
          )}

          <NavItem icon={<Settings size={18}/>} label="Configurações" />
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 z-10 flex flex-col h-screen min-w-0">
        <div className="flex-1 rounded-[32px] border border-slate-200/80 bg-white/60 backdrop-blur-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative flex flex-col overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick?: () => void 
}) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold select-none cursor-pointer ${
      active 
        ? "bg-slate-200/70 text-slate-905" 
        : "hover:bg-slate-100/50 text-slate-500 hover:text-slate-800"
    }`}
  >
    <div className={active ? "text-slate-800" : "text-slate-400"}>
      {icon}
    </div>
    <span className="truncate">{label}</span>
  </button>
);
