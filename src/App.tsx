import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { AgentExecutionCanvas } from './components/canvas/AgentExecutionCanvas';
import { LandingView } from './components/canvas/LandingView';
import { AuthModal } from './components/auth/AuthModal';
import { initAuth } from './lib/firebase';
import { AuthState, ChatSpace } from './types';

export default function App() {
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [activeSpace, setActiveSpace] = useState<ChatSpace | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    provider: null,
    isLoading: true
  });

  // Track Firebase Auth session on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token, provider) => {
        setAuthState({
          user: {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
          token,
          provider,
          isLoading: false
        });
      },
      () => {
        setAuthState({
          user: null,
          token: null,
          provider: null,
          isLoading: false
        });
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (user: any, token: string | null, provider: string) => {
    setAuthState({
      user: {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      },
      token,
      provider,
      isLoading: false
    });
    setHasStartedChat(true);
  };

  const handleStartChat = (initialInput: string) => {
    setHasStartedChat(true);
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        {/* Mirror ambient animations */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400/30 to-blue-200/20 backdrop-blur-md border border-white/40 shadow-2xl flex items-center justify-center animate-pulse">
          <span className="text-blue-600 text-3xl font-bold font-sans">Z</span>
        </div>
        <p className="text-xs text-slate-400 mt-4 animate-pulse font-mono">Conectando ao ZORRO...</p>
      </div>
    );
  }

  if (!hasStartedChat) {
    return (
      <>
        {showAuth && (
          <AuthModal 
            onAuthSuccess={handleAuthSuccess} 
            onClose={() => setShowAuth(false)} 
          />
        )}
        <LandingView 
          authState={authState}
          onStartChat={handleStartChat} 
          onOpenAuth={() => setShowAuth(true)}
        />
      </>
    );
  }

  return (
    <AppLayout 
      authState={authState} 
      onOpenAuth={() => setShowAuth(true)}
      activeSpace={activeSpace}
      onSelectSpace={setActiveSpace}
    >
      <AgentExecutionCanvas 
        authState={authState} 
        activeSpace={activeSpace}
        onSelectSpace={setActiveSpace}
      />
    </AppLayout>
  );
}
