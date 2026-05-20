import React, { useState } from 'react';
import { Bot, ArrowRight, Mic, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const LandingView = ({ onStartChat }: { onStartChat: (input: string) => void }) => {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-4">
      {/* Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[160px]" />
      </div>

      <div className="w-full max-w-2xl text-center space-y-12 z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400/30 to-blue-200/20 backdrop-blur-md border border-white/40 shadow-2xl flex items-center justify-center">
            <span className="text-white text-3xl font-bold">Z</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-medium text-slate-800 tracking-tight">
          Oi Samara, o que está te incomodando?
        </h1>

        <div className="relative flex items-center bg-white border border-slate-200 rounded-full py-4 px-6 shadow-sm hover:shadow-md transition-shadow">
          <Plus className="text-slate-400 mr-4" size={24} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onStartChat(input)}
            placeholder="Ask ZORRO..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder:text-slate-400"
          />
          <div className="flex items-center gap-3">
             <span className="text-sm text-slate-500">Clarão</span>
             <Mic className="text-slate-400" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};
