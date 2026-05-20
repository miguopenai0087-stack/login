import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Search, 
  Brain, 
  CheckCircle2, 
  SendHorizontal, 
  Trash2, 
  MessageSquare, 
  RefreshCw, 
  User, 
  AlertCircle, 
  Sparkles,
  Command,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AuthState, ChatSpace, ChatMessage } from '../../types';

interface AgentExecutionCanvasProps {
  authState: AuthState;
  activeSpace: ChatSpace | null;
  onSelectSpace: (space: ChatSpace | null) => void;
}

type ActivityType = 'thought' | 'tool' | 'result';

interface ActivityItem {
  id: string;
  type: ActivityType;
  content: string;
  timestamp: string;
}

const initialActivities: ActivityItem[] = [
  { id: '1', type: 'thought', content: 'Analyzing the request to find the best architectural approach...', timestamp: '10:00:01' },
  { id: '2', type: 'tool', content: 'Searching the web for cross-platform deployment best practices...', timestamp: '10:00:05' },
  { id: '3', type: 'result', content: 'Architectural overview complete. Loaded in-memory neural pipeline.', timestamp: '10:00:10' },
];

export const AgentExecutionCanvas = ({ authState, activeSpace, onSelectSpace }: AgentExecutionCanvasProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activityList, setActivityList] = useState<ActivityItem[]>(initialActivities);
  
  // Google Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside chat view
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activityList]);

  // Fetch Google Chat messages when activeSpace changes
  useEffect(() => {
    if (activeSpace && authState.token) {
      loadChatMessages();
    }
  }, [activeSpace, authState.token]);

  const loadChatMessages = async () => {
    if (!activeSpace || !authState.token) return;
    setIsLoadingMessages(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${activeSpace.name}/messages`, {
        headers: { Authorization: `Bearer ${authState.token}` }
      });
      const data = await res.json();
      if (data && data.messages) {
        setChatMessages(data.messages);
      } else {
        setChatMessages([]);
      }
    } catch (err: any) {
      console.error('Erro ao ler mensagens do Google Chat:', err);
      setErrorMessage('Erro ao carregar mensagens do Google Chat real. Verifique as permissões de acesso da organização.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Mutating Action - Google Chat message submission
  const handleSendChatMessage = async () => {
    if (!input.trim() || !activeSpace || !authState.token) return;
    const messageText = input;
    setInput('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${activeSpace.name}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: messageText })
      });
      const data = await res.json();
      if (res.ok) {
        // Reload messages to display the new text immediately
        await loadChatMessages();
      } else {
        setErrorMessage(`Não foi possível postar no chat: ${data.error?.message || 'Erro inesperado'}`);
      }
    } catch (err: any) {
      console.error('Erro ao postar mensagem no Google Chat:', err);
      setErrorMessage('Erro de conectividade ao postar a mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // AI Agent message submission (calls actual server-side Gemini 3.5 Flash endpoint!)
  const handleSendAgentRequest = async () => {
    if (!input.trim()) return;
    const userPrompt = input;
    setInput('');
    setIsLoading(true);

    const now = () => new Date().toLocaleTimeString();

    // Create diagnostic traces step by step
    const step1Id = String(Date.now() + 1);
    const step2Id = String(Date.now() + 2);
    const step3Id = String(Date.now() + 3);

    // Initial Thought Trace
    setActivityList(prev => [
      ...prev,
      {
        id: step1Id,
        type: 'thought',
        content: `Ouvindo prompt: "${userPrompt}". Iniciando pipeline do modelo de linguagem gemini-3.5-flash.`,
        timestamp: now()
      }
    ]);

    // Fast interval simulated tool usage log
    setTimeout(() => {
      setActivityList(prev => [
        ...prev,
        {
          id: step2Id,
          type: 'tool',
          content: 'Consultando agente local de memória e inicializando cabeçalhos HTTP na porta 3000.',
          timestamp: now()
        }
      ]);
    }, 600);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });
      const data = await response.json();

      if (response.ok && data.text) {
        setActivityList(prev => [
          ...prev,
          {
            id: step3Id,
            type: 'result',
            content: data.text,
            timestamp: now()
          }
        ]);
      } else {
        throw new Error(data.error || 'Erro na API Gemini');
      }
    } catch (err: any) {
      console.error(err);
      setActivityList(prev => [
        ...prev,
        {
          id: step3Id,
          type: 'result',
          content: `Falha na requisição: ${err.message || 'Desculpe, ocorreu um erro de conexão.'}. Verifique se a variável GEMINI_API_KEY está configurada no painel settings.`,
          timestamp: now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearActivities = () => {
    if (window.confirm('Deseja realmente limpar todos os logs de execução do agente?')) {
      setActivityList([]);
    }
  };

  // Google Chat View Mode
  if (activeSpace) {
    const spaceId = activeSpace.name.split('/').pop() || '';
    return (
      <div className="flex flex-col h-full bg-transparent">
        {/* Header toolbar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectSpace(null)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors cursor-pointer md:hidden"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl border border-blue-500/15">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                {activeSpace.displayName || `Espaço (${spaceId})`}
              </h2>
              <p className="text-[10px] text-slate-400 font-extrabold tracking-wide uppercase mt-0.5">
                Google Chat Integrado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={loadChatMessages}
              disabled={isLoadingMessages}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw size={14} className={cn(isLoadingMessages && "animate-spin")} />
              Recarregar
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-550/10 border border-red-500/20 text-red-700 text-xs px-4 py-3 rounded-2xl mb-4 flex items-start gap-2 flex-shrink-0">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Messaging Area */}
        <div className="flex-1 overflow-y-auto pr-1 pb-6 space-y-4">
          {isLoadingMessages ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
              <p className="text-xs text-slate-400 font-medium font-sans">Lendo mensagens do Google Chat real...</p>
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-700">Nenhuma mensagem encontrada</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto leading-relaxed">
                  Escreva e poste a primeira mensagem no canal! Ela será propagada de forma real no espaço do Google Workspace.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {chatMessages.map((msg, index) => {
                const senderName = msg.sender?.displayName || "Membro";
                const isMe = msg.sender?.name === authState.user?.uid;
                const formattedTime = msg.createTime ? new Date(msg.createTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
                
                return (
                  <motion.div
                    key={msg.name || index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3 max-w-2xl",
                      isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {msg.sender?.avatarUrl ? (
                      <img 
                        referrerPolicy="no-referrer"
                        src={msg.sender.avatarUrl} 
                        alt={senderName} 
                        className="w-8 h-8 rounded-full border border-slate-200 shadow-2xs flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-2xs border border-slate-200 flex-shrink-0">
                        {senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div>
                      <div className={cn(
                        "flex items-center gap-1.5 mb-1 text-[11px] font-bold text-slate-400",
                        isMe && "justify-end"
                      )}>
                        <span>{senderName}</span>
                        <span>•</span>
                        <span>{formattedTime}</span>
                      </div>
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-xs font-medium border shadow-3xs leading-relaxed",
                        isMe 
                          ? "bg-blue-600 border-blue-600 text-white rounded-tr-sm" 
                          : "bg-white border-slate-150 text-slate-800 rounded-tl-sm"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="mt-4 pt-4 border-t border-slate-200/50 flex-shrink-0">
          <div className="relative flex items-center pr-2 bg-white/70 backdrop-blur-md border border-slate-250 rounded-2xl shadow-3xs">
            <input
              type="text"
              value={input}
              disabled={isLoading || isLoadingMessages}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Escreva sua mensagem para o Google Chat..."
              className={cn(
                "w-full bg-transparent py-4 pl-4 pr-16 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 font-semibold",
                (isLoading || isLoadingMessages) && "opacity-50 cursor-not-allowed"
              )}
            />
            <button 
              onClick={handleSendChatMessage}
              disabled={isLoading || isLoadingMessages || !input.trim()}
              className="absolute right-2 p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-md transition-all cursor-pointer disabled:opacity-30"
            >
              <SendHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Agent Mode (ZORRO trace)
  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Trace Header */}
      <div className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-slate-200/50 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl shadow-md">
            <Command size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">AI Agent Diagnostic Trace</h2>
            <p className="text-[10px] text-slate-400 font-extrabold tracking-wide uppercase mt-0.5 flex items-center gap-1">
              <Sparkles size={10} className="text-blue-500" />
              Powered by Gemini 3.5 Flash
            </p>
          </div>
        </div>
        {activityList.length > 0 && (
          <button 
            onClick={clearActivities}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-slate-50 border border-slate-150 transition-all cursor-pointer shadow-3xs"
          >
            <Trash2 size={13} /> Limpar Logs
          </button>
        )}
      </div>

      {/* Activities Viewport */}
      <div className="flex-1 overflow-y-auto pr-1 pb-6 space-y-3.5">
        <AnimatePresence>
          {activityList.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "p-4 rounded-2xl border backdrop-blur-md flex items-start gap-3.5 shadow-3xs",
                item.type === 'thought' && "bg-white/50 border-blue-500/5 hover:border-blue-500/20",
                item.type === 'tool' && "bg-white/40 border-purple-500/5 hover:border-purple-500/20",
                item.type === 'result' && "bg-slate-900/5 border-slate-900/5 text-slate-850 hover:bg-slate-900/10"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl flex-shrink-0 shadow-3xs border",
                item.type === 'thought' && "text-blue-600 bg-blue-500/10 border-blue-500/10",
                item.type === 'tool' && "text-purple-600 bg-purple-500/10 border-purple-500/10",
                item.type === 'result' && "text-slate-800 bg-white border-slate-200"
              )}>
                {item.type === 'thought' && <Brain size={18} />}
                {item.type === 'tool' && <Command size={18} />}
                {item.type === 'result' && <Bot size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    item.type === 'thought' && "text-blue-600",
                    item.type === 'tool' && "text-purple-600",
                    item.type === 'result' && "text-slate-800"
                  )}>
                    {item.type === 'thought' && 'Thought Trace'}
                    {item.type === 'tool' && 'Action Log'}
                    {item.type === 'result' && 'ZORRO response'}
                  </span>
                  <span className="text-3s text-slate-400 font-mono font-bold">{item.timestamp}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 font-semibold select-text whitespace-pre-wrap">{item.content}</p>
              </div>
            </motion.div>
          ))}
          {activityList.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
              <Bot size={28} className="text-slate-300 animate-bounce mb-3" />
              <p className="text-xs font-semibold">Os logs estão vazios. Digite abaixo para iniciar os ciclos do agente!</p>
            </div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input panel */}
      <div className="mt-4 pt-4 border-t border-slate-200/50 flex-shrink-0">
        <div className="relative flex items-center pr-2 bg-white/70 backdrop-blur-md border border-slate-250 rounded-2xl shadow-3xs">
          <input
            type="text"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendAgentRequest()}
            placeholder={isLoading ? "ZORRO is thinking..." : "Interagir com o agente..."}
            className={cn(
              "w-full bg-transparent py-4 pl-4 pr-32 text-xs text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-0 font-semibold",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          />
          {isLoading && (
            <div className="absolute right-16 flex items-center gap-1.5 text-xs text-blue-600 animate-pulse font-bold tracking-tight uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              Zorro is thinking...
            </div>
          )}
          <button 
            onClick={handleSendAgentRequest}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-md transition-all cursor-pointer disabled:opacity-30"
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
