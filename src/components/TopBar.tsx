import React from 'react';

export type AppRoute = 'home' | 'tutorial' | 'lab' | 'achievements' | 'game';

interface TopBarProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  hasActiveMatch: boolean;
  onPrimaryAction: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeRoute,
  onNavigate,
  hasActiveMatch,
  onPrimaryAction,
}) => {
  const navItems: { id: AppRoute; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'tutorial', label: 'Tutorial' },
    { id: 'lab', label: 'Laboratorio' },
    { id: 'achievements', label: 'Traguardi' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284C7] rounded"
        >
          Missione Pitagora
        </button>

        <nav
          aria-label="Navigazione principale"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0284C7] ${
                  isActive
                    ? 'border-[#0284C7] text-slate-900 font-semibold'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
          >
            {hasActiveMatch && activeRoute !== 'game' ? 'Torna alla Partita' : 'Nuova Partita'}
          </button>
        </div>
      </div>

      {/* Mobile secondary single-row nav inside height cap */}
      <nav
        aria-label="Navigazione mobile"
        className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-between gap-4 text-xs font-medium text-slate-600 overflow-x-auto"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`whitespace-nowrap shrink-0 py-1 ${
              activeRoute === item.id ? 'text-[#0284C7] font-semibold' : 'text-slate-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
