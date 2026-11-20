'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, RefreshCw, MessageCircleHeart } from 'lucide-react';

interface EmptyStateProps {
  onViewMatches: () => void;
  onResetFeed?: () => void;
  isResetting?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onViewMatches,
  onResetFeed,
  isResetting = false,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Animated Radar Pulse */}
      <div className="relative flex items-center justify-center mb-8">
        <motion.div
          animate={{
            scale: [1, 1.8, 2.4],
            opacity: [0.6, 0.2, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute w-24 h-24 rounded-full bg-rose-500/20"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1.8],
            opacity: [0.8, 0.3, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 0.6,
            ease: 'easeOut',
          }}
          className="absolute w-24 h-24 rounded-full bg-pink-500/30"
        />

        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 z-10">
          <Sparkles className="w-9 h-9 text-white stroke-[2.2]" />
        </div>
      </div>

      {/* Headline & Description */}
      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
        You&apos;ve Caught Up!
      </h3>
      <p className="text-neutral-400 text-sm max-w-xs mb-8 leading-relaxed">
        There are no more new profiles to discover right now. Explore your mutual matches or reset the demo stack to try again.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col w-full max-w-xs space-y-3">
        <button
          type="button"
          onClick={onViewMatches}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/25 active:scale-98 transition transform"
        >
          <MessageCircleHeart className="w-5 h-5" />
          <span>View Mutual Matches</span>
        </button>

        {onResetFeed && (
          <button
            type="button"
            onClick={onResetFeed}
            disabled={isResetting}
            className="w-full py-3 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-medium border border-neutral-800 flex items-center justify-center space-x-2 active:scale-98 transition transform disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting Demo...' : 'Reset Demo Profiles'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
