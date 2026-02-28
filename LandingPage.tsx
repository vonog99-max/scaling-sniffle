import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Code2, Cpu, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'DarkCity (DC) Engine v1.0.0 initialized.' },
    { type: 'system', text: 'Type "help" for a list of commands.' }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, { type: 'user', text: `> ${trimmed}` }]);

    switch (trimmed.toLowerCase()) {
      case 'help':
        setHistory(prev => [...prev, 
          { type: 'system', text: 'Available commands:' },
          { type: 'system', text: '  /dashboard  - Open the DarkCity game control dashboard' },
          { type: 'system', text: '  setup       - Show setup instructions' },
          { type: 'system', text: '  clear       - Clear terminal' }
        ]);
        break;
      case '/dashboard':
        setHistory(prev => [...prev, { type: 'system', text: 'Launching dashboard...' }]);
        setTimeout(() => navigate('/dashboard'), 500);
        break;
      case 'setup':
        setHistory(prev => [...prev, 
          { type: 'system', text: 'To setup DarkCity locally, run the following command in your terminal:' },
          { type: 'system', text: 'curl -O https://darkcityv1.vercel.app/setup.py && python3 setup.py' }
        ]);
        break;
      case 'clear':
        setHistory([]);
        break;
      default:
        setHistory(prev => [...prev, { type: 'error', text: `Command not found: ${trimmed}` }]);
    }
    setInput('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff00] font-mono flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter mb-2 text-white flex items-center justify-center gap-4">
            <Terminal size={48} className="text-[#00ff00]" />
            DarkCity
          </h1>
          <p className="text-zinc-400">The CLI-first Game Engine powered by Mistral AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col items-center text-center">
            <Code2 size={32} className="text-[#00ff00] mb-4" />
            <h3 className="text-white font-semibold mb-2">C++ & GCC</h3>
            <p className="text-sm text-zinc-400">Native performance with standard C++ tooling.</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col items-center text-center">
            <Cpu size={32} className="text-[#00ff00] mb-4" />
            <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-zinc-400">Prompt Mistral to generate game logic and mechanics.</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col items-center text-center">
            <Zap size={32} className="text-[#00ff00] mb-4" />
            <h3 className="text-white font-semibold mb-2">Graphical Engine</h3>
            <p className="text-sm text-zinc-400">Based on Godot source architecture for full 2D/3D rendering.</p>
          </div>
        </div>

        <div className="mb-8 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Terminal size={20} className="text-[#00ff00]" />
            Installation
          </h2>
          <p className="text-zinc-400 mb-4 text-sm">Run the following command in your terminal to install the DarkCity Engine locally. This will fetch the setup script and initialize the graphical engine environment.</p>
          <div className="bg-black p-4 rounded-lg font-mono text-sm text-[#00ff00] overflow-x-auto border border-zinc-800">
            curl -O https://darkcityv1.vercel.app/setup.py && python3 setup.py
          </div>
        </div>

        <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs text-zinc-500">dc-terminal</span>
            </div>
            <div className="text-xs text-[#00ff00] font-semibold uppercase tracking-wider opacity-80">
              Demo Testing Terminal
            </div>
          </div>
          <div className="p-4 h-64 overflow-y-auto font-mono text-sm">
            {history.map((entry, i) => (
              <div key={i} className={`mb-1 ${entry.type === 'error' ? 'text-red-500' : entry.type === 'user' ? 'text-white' : 'text-[#00ff00]'}`}>
                {entry.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="p-4 border-t border-zinc-800 flex items-center bg-zinc-900/50">
            <ChevronRight size={16} className="text-[#00ff00] mr-2" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
              className="flex-1 bg-transparent outline-none text-white placeholder-zinc-600"
              placeholder="Type a command... (try /dashboard)"
              autoFocus
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
