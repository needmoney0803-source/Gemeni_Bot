import React from 'react';
import { Activity, Layers, Briefcase, Brain, Sliders, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeTradesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  activeTradesCount,
}) => {
  const navItems = [
    { id: 'terminal', label: 'Multi-LLM Scouter', icon: Activity },
    { id: 'option_chain', label: 'Option Chain & Greeks', icon: Layers },
    { id: 'positions', label: 'Positions & Carry-Forward', icon: Briefcase, badge: activeTradesCount },
    { id: 'learning', label: 'Self-Learning Vault', icon: Brain },
    { id: 'agents', label: '4-LLM Intelligence Lab', icon: Sliders },
    { id: 'settings', label: 'Broker & PWA Config', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Header Navigation Bar */}
      <nav className="hidden md:block bg-slate-900/90 border-b border-slate-800 sticky top-[65px] z-30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Floating Navigation Bar (Android/PWA optimized) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 px-2 py-1 shadow-2xl">
        <div className="grid grid-cols-6 gap-1 text-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors relative ${
                  isActive ? 'text-cyan-400 bg-slate-800/80' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="truncate w-full text-[9px]">{item.label.split(' ')[0]}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
