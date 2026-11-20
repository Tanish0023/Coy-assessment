'use client';

import React from 'react';
import { Flame, MessageCircleHeart } from 'lucide-react';
import { TabType } from '@/types';

interface TopHeaderProps {
  activeTab: TabType;
  matchesCount: number;
  onOpenMatches: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  matchesCount,
  onOpenMatches,
}) => {
  return (
    <header className="h-14 px-5 flex items-center justify-between border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur-md z-30 select-none">
      {/* Brand Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-rose-500/30">
          <Flame className="w-5 h-5 text-white fill-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-white">
          coy
        </span>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMatches}
          className={`relative p-2 rounded-xl transition ${
            activeTab === 'matches'
              ? 'bg-rose-500/20 text-rose-400'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
          }`}
          aria-label="Open matches"
        >
          <MessageCircleHeart className="w-5 h-5" />
          {matchesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm">
              {matchesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
