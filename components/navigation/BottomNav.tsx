'use client';

import React from 'react';
import { Compass, Home, MessageCircleHeart } from 'lucide-react';
import { TabType } from '@/types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  matchesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  matchesCount = 0,
}) => {
  return (
    <nav className="h-16 bg-neutral-900/90 backdrop-blur-md border-t border-neutral-800/80 flex items-center justify-around px-6 z-30 select-none">
      {/* Home Tab (Placeholder) */}
      <button
        type="button"
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors py-1 px-4 rounded-xl ${
          activeTab === 'home'
            ? 'text-rose-500'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label="Home tab"
      >
        <Home className="w-6 h-6 stroke-[2.2]" />
        <span className="text-[11px] font-medium tracking-tight">Home</span>
      </button>

      {/* Discover Tab (Fully Functional) */}
      <button
        type="button"
        onClick={() => onTabChange('discover')}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors py-1 px-4 rounded-xl relative ${
          activeTab === 'discover'
            ? 'text-rose-500'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label="Discover tab"
      >
        <div className="relative">
          <Compass className="w-6 h-6 stroke-[2.2]" />
          {activeTab === 'discover' && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          )}
        </div>
        <span className="text-[11px] font-medium tracking-tight">Discover</span>
      </button>

      {/* Quick Matches Access */}
      <button
        type="button"
        onClick={() => onTabChange('matches')}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors py-1 px-4 rounded-xl relative ${
          activeTab === 'matches'
            ? 'text-rose-500'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
        aria-label="Matches view"
      >
        <div className="relative">
          <MessageCircleHeart className="w-6 h-6 stroke-[2.2]" />
          {matchesCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-sm">
              {matchesCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium tracking-tight">Matches</span>
      </button>
    </nav>
  );
};
