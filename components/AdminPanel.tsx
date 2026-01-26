
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, MessageSquare, Cpu, Activity, 
  ArrowUp, AlertCircle, Clock, Database, Globe, 
  LogOut, Settings, Eye, FileText, Save, Trash2, ShieldAlert, X, Download
} from 'lucide-react';
import { LogEntry, SystemConfig } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'moderation' | 'config' | 'content'>('dashboard');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [config, setConfig] = useState<SystemConfig>({
    instruction: '',
    safetyLevel: 'Standard',
    featuredPrompts: ['How can I help my global community?', 'Design a low-cost water filter', 'Explain AI ethics for youth']
  });

  const LOG_KEY = 'db_ai_global_logs';
  const CONFIG_KEY = 'db_ai_global_config';

  useEffect(() => {
    const loadData = () => {
      const savedLogs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      setLogs(savedLogs.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) })));

      const savedConfig = JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null');
      if (savedConfig) {
        setConfig(savedConfig);
      } else {
        const initialConfig: SystemConfig = {
          instruction: 'You are DON BOSCO AI, build by PIYUSH FROM DON BOSCO PURNIA. You are a global genius mentor for youth worldwide. Be extremely fast, compassionate, and concise.',
          safetyLevel: 'Standard',
          featuredPrompts: ['How can I help my global community?', 'Design a low-cost water filter', 'Explain AI ethics for youth']
        };
        setConfig(initialConfig);
        localStorage.setItem(CONFIG_KEY, JSON.stringify(initialConfig));
      }
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const exportLogs = () => {
    const logText = logs.map(l => 
      `[${l.timestamp.toISOString()}] USER: ${l.user} | QUERY: ${l.query} | FLAG: ${l.flagged ? 'YES' : 'NO'}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DonBoscoAI_GlobalSecurityLogs_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const saveConfig = () => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    alert('Deployment Successful: Global system instructions updated.');
  };

  const clearLogs = () => {
    if (confirm('Permanently wipe all activity logs?')) {
      localStorage.setItem(LOG_KEY, '[]');
      setLogs([]);
    }
  };

  const stats = [
    { label: 'Global Learners', value: '12,492', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+18%', border: 'border-blue-500/20' },
    { label: 'Neural Traffic', value: `${(logs.length * 5.2).toFixed(1)}k`, icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-500/10', trend: '+22%', border: 'border-indigo-500/20' },
    { label: 'Core Health', value: 'STABLE', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: 'LIVE', border: 'border-emerald-500/20' },
    { label: 'Global Alerts', value: logs.filter(l => l.flagged).length.toString(), icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10', trend: 'LOW', border: 'border-rose-500/20' },
  ];

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full px-4 md:px-6 overflow-hidden">
      <header className="py-6 md:py-8 flex flex-row items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-black text-white tracking-tighter uppercase leading-none">Global Admin</h2>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">Global Mentor Network Hub</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-slate-900 border border-white/5 px-3 py-1.5 rounded-xl items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secure Core</span>
          </div>
          <button onClick={onLogout} className="p-2.5 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-xl">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <nav className="flex gap-2 mb-6 shrink-0 overflow-x-auto scrollbar-hide pb-2">
        {[
          { id: 'dashboard', label: 'Overview', icon: Globe },
          { id: 'moderation', label: 'Security', icon: Eye },
          { id: 'config', label: 'Persona', icon: Settings },
          { id: 'content', label: 'Content', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border shrink-0 ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg' 
                : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto pb-40 md:pb-12 scrollbar-hide">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((s, i) => (
                <div key={i} className={`bg-slate-900/50 backdrop-blur-xl p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border ${s.border}`}>
                  <div className={`w-8 h-8 md:w-10 md:h-10 ${s.bg} ${s.color} rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-5`}>
                    <s.icon size={16} />
                  </div>
                  <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1">{s.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-base md:text-xl font-black text-white">{s.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900/40 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 p-6 md:p-8">
                <h3 className="text-sm font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
                  <Activity size={16} className="text-blue-500" /> Global Neural Activity
                </h3>
                <div className="h-32 flex items-end gap-1.5 px-1">
                   {[40, 70, 45, 90, 65, 80, 55, 30, 85, 95, 40, 60].map((h, i) => (
                     <div key={i} className="flex-1 bg-blue-600/10 rounded-t-md relative">
                       <div className="absolute bottom-0 left-0 right-0 bg-blue-500/40 rounded-t-md" style={{ height: `${h}%` }} />
                     </div>
                   ))}
                </div>
              </div>
              <div className="bg-slate-900/40 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 p-6 md:p-8 flex flex-col justify-between">
                 <div>
                   <h3 className="text-sm font-black text-white mb-2 uppercase tracking-widest">Global Node</h3>
                   <p className="text-slate-500 text-[10px] font-bold">Node: CLOUD_GLOBAL_01</p>
                 </div>
                 <div className="space-y-4 py-6">
                    <div className="flex items-center justify-between text-[8px] font-black">
                       <span className="text-slate-400 uppercase">Edge Latency</span>
                       <span className="text-emerald-400">12ms</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full">
                       <div className="h-full bg-emerald-500 w-[15%]" />
                    </div>
                 </div>
                 <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/5">
                    Sync Clusters
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="bg-slate-950/50 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col h-[450px] animate-in slide-in-from-bottom-4 shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
              <h3 className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Database size={14} className="text-rose-500" /> Global Security Logs
              </h3>
              <div className="flex gap-2">
                <button onClick={exportLogs} title="Export Logs" className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg">
                  <Download size={14} />
                </button>
                <button onClick={clearLogs} title="Wipe Logs" className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px] space-y-3">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-700 italic">Listening for global activity...</div>
              ) : logs.map(log => (
                <div key={log.id} className={`p-3 rounded-xl border ${log.flagged ? 'bg-rose-950/20 border-rose-500/30' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-blue-400 font-bold">{log.user}</span>
                    <span className="text-slate-600 text-[8px]">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-300 leading-tight">"{log.query}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && (activeTab === 'config' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
             <div className="bg-slate-900/60 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-xl">
                <h3 className="text-sm font-black text-white mb-4 flex items-center gap-3 uppercase tracking-widest">
                  <Settings size={16} className="text-blue-400" /> Global Neural Config
                </h3>
                <textarea 
                  value={config.instruction}
                  onChange={(e) => setConfig({...config, instruction: e.target.value})}
                  className="w-full h-40 bg-slate-950/80 border border-white/10 rounded-xl p-4 text-xs text-slate-300 font-mono focus:outline-none focus:ring-1 ring-blue-500 mb-4 resize-none"
                />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                   <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Tier:</span>
                      <select 
                        value={config.safetyLevel}
                        onChange={(e) => setConfig({...config, safetyLevel: e.target.value as any})}
                        className="bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10"
                      >
                         <option>Standard</option>
                         <option>Strict</option>
                      </select>
                   </div>
                   <button onClick={saveConfig} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl shadow-blue-500/20">
                      <Save size={14} /> Update Global Persona
                   </button>
                </div>
             </div>
          </div>
        ))}

        {activeTab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95">
             <div className="bg-slate-900/40 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5">
                <h4 className="text-white font-black uppercase text-[9px] tracking-widest mb-4">Discovery Prompts</h4>
                <div className="space-y-2">
                   {config.featuredPrompts.map((p, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[10px] text-slate-300 font-bold truncate max-w-[80%]">{p}</span>
                        <X size={12} className="text-slate-600" />
                     </div>
                   ))}
                </div>
                <button className="w-full mt-4 py-2.5 border border-dashed border-white/10 rounded-xl text-[8px] font-black text-slate-600 uppercase tracking-widest">
                  + Add New Prompt
                </button>
             </div>
             <div className="bg-indigo-600/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-indigo-500/10 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/20">
                   <FileText size={20} />
                </div>
                <h3 className="text-white font-black text-sm mb-1 uppercase tracking-tighter">Broadcaster</h3>
                <p className="text-slate-500 text-[10px] mb-4">Push global news to all learners.</p>
                <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest">
                  Start Global Broadcast
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
