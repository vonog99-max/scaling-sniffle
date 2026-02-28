import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Square, Folder, FileCode, Settings, Terminal, Plus, Send, RefreshCw, Cpu, Layers, Box } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('script');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [code, setCode] = useState(`// DarkCity Engine Main Script
#include "engine.h"

int main() {
    DarkCity::Engine engine;
    engine.init("My Game", 800, 600);
    
    while (engine.isRunning()) {
        engine.update();
        engine.render();
    }
    
    return 0;
}`);
  const [logs, setLogs] = useState<string[]>(['[System] DarkCity Engine initialized.', '[System] Ready for generation.']);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setLogs(prev => [...prev, `[User] ${prompt}`, `[System] Calling Mistral AI...`]);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Extract code block if present
      const codeMatch = data.result.match(/```cpp\n([\s\S]*?)```/);
      const generatedCode = codeMatch ? codeMatch[1] : data.result;
      
      setCode(generatedCode);
      setLogs(prev => [...prev, `[System] Code generated successfully.`]);
    } catch (err: any) {
      setLogs(prev => [...prev, `[Error] ${err.message}`]);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-zinc-300 flex flex-col font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-[#2d2d2d] border-b border-[#3d3d3d] h-12 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#00ff00] font-bold tracking-wider">
            <Terminal size={18} />
            <span>DarkCity</span>
          </div>
          <div className="h-4 w-px bg-zinc-600 mx-2"></div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors">
              <Play size={16} className="text-green-500" />
            </button>
            <button className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors">
              <Pause size={16} />
            </button>
            <button className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors">
              <Square size={16} className="text-red-500" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-500">Project: Untitled</span>
          <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded border border-zinc-700 transition-colors">
            <Settings size={14} />
            Settings
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Scene/File Tree */}
        <aside className="w-64 bg-[#252526] border-r border-[#3d3d3d] flex flex-col shrink-0">
          <div className="p-2 border-b border-[#3d3d3d] flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <span>Explorer</span>
            <Plus size={14} className="cursor-pointer hover:text-white" />
          </div>
          <div className="p-2 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 py-1 px-2 hover:bg-[#37373d] cursor-pointer rounded text-sm">
              <Folder size={16} className="text-blue-400" />
              <span>src</span>
            </div>
            <div className="flex items-center gap-2 py-1 px-2 ml-4 bg-[#37373d] border-l-2 border-[#00ff00] cursor-pointer rounded text-sm text-white">
              <FileCode size={16} className="text-[#00ff00]" />
              <span>main.cpp</span>
            </div>
            <div className="flex items-center gap-2 py-1 px-2 ml-4 hover:bg-[#37373d] cursor-pointer rounded text-sm">
              <FileCode size={16} className="text-zinc-400" />
              <span>engine.h</span>
            </div>
            <div className="flex items-center gap-2 py-1 px-2 hover:bg-[#37373d] cursor-pointer rounded text-sm mt-2">
              <Folder size={16} className="text-yellow-400" />
              <span>assets</span>
            </div>
            <div className="flex items-center gap-2 py-1 px-2 hover:bg-[#37373d] cursor-pointer rounded text-sm mt-2">
              <Layers size={16} className="text-purple-400" />
              <span>scenes</span>
            </div>
          </div>
        </aside>

        {/* Center Area - Editor & AI Prompt */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          {/* Editor Tabs */}
          <div className="flex bg-[#2d2d2d] border-b border-[#3d3d3d] shrink-0">
            <button 
              className={`px-4 py-2 text-sm flex items-center gap-2 border-t-2 ${activeTab === 'script' ? 'bg-[#1e1e1e] border-[#00ff00] text-white' : 'border-transparent text-zinc-400 hover:bg-[#252526]'}`}
              onClick={() => setActiveTab('script')}
            >
              <FileCode size={14} className="text-[#00ff00]" />
              main.cpp
            </button>
            <button 
              className={`px-4 py-2 text-sm flex items-center gap-2 border-t-2 ${activeTab === 'scene' ? 'bg-[#1e1e1e] border-[#00ff00] text-white' : 'border-transparent text-zinc-400 hover:bg-[#252526]'}`}
              onClick={() => setActiveTab('scene')}
            >
              <Box size={14} className="text-blue-400" />
              Scene View
            </button>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            {activeTab === 'script' ? (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none outline-none focus:ring-1 focus:ring-[#3d3d3d]"
                spellCheck={false}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#111] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="text-center z-10">
                  <Box size={48} className="mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-500">No scene loaded.</p>
                  <p className="text-xs text-zinc-600 mt-2">Use the AI assistant to generate a scene.</p>
                </div>
              </div>
            )}

            {/* AI Assistant Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#252526] border border-[#3d3d3d] rounded-lg shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-[#2d2d2d] px-3 py-2 text-xs font-semibold flex items-center gap-2 text-zinc-400 border-b border-[#3d3d3d]">
                <Cpu size={14} className="text-[#00ff00]" />
                Mistral AI Assistant
              </div>
              <div className="p-2 flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="E.g., Create a player class with movement logic..."
                  className="flex-1 bg-[#1e1e1e] border border-[#3d3d3d] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff00] transition-colors"
                  disabled={isGenerating}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-[#00ff00] hover:bg-[#00cc00] text-black px-4 py-2 rounded flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  Generate
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Inspector / Output */}
        <aside className="w-80 bg-[#252526] border-l border-[#3d3d3d] flex flex-col shrink-0">
          <div className="p-2 border-b border-[#3d3d3d] text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Inspector
          </div>
          <div className="p-4 border-b border-[#3d3d3d] flex-1">
            <div className="text-sm text-zinc-400 text-center mt-10">
              Select an object to inspect its properties.
            </div>
          </div>
          
          <div className="h-1/3 flex flex-col border-t border-[#3d3d3d] bg-[#1e1e1e]">
            <div className="p-2 border-b border-[#3d3d3d] text-xs font-semibold uppercase tracking-wider text-zinc-500 flex justify-between items-center bg-[#252526]">
              <span>Output Console</span>
            </div>
            <div className="p-2 flex-1 overflow-y-auto font-mono text-xs">
              {logs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.startsWith('[Error]') ? 'text-red-400' : log.startsWith('[User]') ? 'text-blue-400' : 'text-zinc-400'}`}>
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
