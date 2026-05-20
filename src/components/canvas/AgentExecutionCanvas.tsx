import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Search, Brain, CheckCircle2, SendHorizontal, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

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
  { id: '3', type: 'result', content: 'Architectural overview complete.', timestamp: '10:00:10' },
];

export const AgentExecutionCanvas = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activityList, setActivityList] = useState<ActivityItem[]>(initialActivities);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setIsLoading(true);
    // Simulate processing
    setTimeout(() => setIsLoading(false), 2000);
  };

  const clearActivities = () => {
    if (window.confirm('Are you sure you want to clear all activity logs?')) {
      setActivityList([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 pb-8 gap-4 flex flex-col">
          <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Execution Trace</h2>
              {activityList.length > 0 && (
                  <button 
                    onClick={clearActivities}
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-500 transition-colors"
                  >
                      <Trash2 size={14} /> Clear All
                  </button>
              )}
          </div>
          <AnimatePresence>
            {activityList.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "p-4 rounded-xl border backdrop-blur-md flex items-start gap-4",
                  item.type === 'thought' && "bg-blue-500/5 border-blue-500/10",
                  item.type === 'tool' && "bg-purple-500/5 border-purple-500/10",
                  item.type === 'result' && "bg-emerald-500/5 border-emerald-500/10"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  item.type === 'thought' && "text-blue-600 bg-blue-500/10",
                  item.type === 'tool' && "text-purple-600 bg-purple-500/10",
                  item.type === 'result' && "text-emerald-600 bg-emerald-500/10"
                )}>
                  {item.type === 'thought' && <Brain size={20} />}
                  {item.type === 'tool' && <Search size={20} />}
                  {item.type === 'result' && <CheckCircle2 size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">{item.content}</p>
                  <span className="text-xs text-slate-500">{item.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="mt-4 pt-4 border-t border-black/5">
        <div className="relative flex items-center">
            <input
                type="text"
                value={input}
                disabled={isLoading}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "ZORRO is thinking..." : "Ask ZORRO anything..."}
                className={cn(
                    "w-full bg-white/50 backdrop-blur-md border border-black/10 rounded-2xl py-4 pl-4 pr-32 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}
            />
            {isLoading && (
                <div className="absolute right-16 text-sm text-slate-500 animate-pulse font-medium">ZORRO is thinking...</div>
            )}
            <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className={cn(
                    "absolute right-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}>
                <SendHorizontal size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};
