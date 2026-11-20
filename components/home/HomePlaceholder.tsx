'use client';

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface HomePlaceholderProps {
  onGoToDiscover: () => void;
}

export const HomePlaceholder: React.FC<HomePlaceholderProps> = ({
  onGoToDiscover,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
      <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5 text-neutral-500">
        <Sparkles className="w-7 h-7" />
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Home</h2>
      <button
        type="button"
        onClick={onGoToDiscover}
        className="px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-rose-400 font-semibold border border-neutral-800 flex items-center space-x-2 transition"
      >
        <Compass className="w-4 h-4" />
        <span>Open Discover</span>
      </button>
    </div>
  );
};
