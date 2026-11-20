'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Profile } from '@/types';
import { ProfileCard } from './ProfileCard';
import { EmptyState } from './EmptyState';

interface CardStackProps {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  onSwipe: (profile: Profile, action: 'like' | 'pass') => Promise<void>;
  onViewMatches: () => void;
  onResetFeed: () => Promise<void>;
  isResetting: boolean;
}

export const CardStack: React.FC<CardStackProps> = ({
  profiles,
  loading,
  error,
  onSwipe,
  onViewMatches,
  onResetFeed,
  isResetting,
}) => {
  const [swipingProfileId, setSwipingProfileId] = useState<string | null>(null);

  const currentProfile = profiles.length > 0 ? profiles[0] : null;
  const nextProfile = profiles.length > 1 ? profiles[1] : null;

  const handleAction = async (action: 'like' | 'pass') => {
    if (!currentProfile || swipingProfileId) return;

    setSwipingProfileId(currentProfile.id);
    try {
      await onSwipe(currentProfile, action);
    } finally {
      setSwipingProfileId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
        <p className="text-sm font-medium text-neutral-400 animate-pulse">
          Finding nearby profiles...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <X className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-white">Oops, something went wrong</h3>
        <p className="text-sm text-neutral-400 max-w-xs">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <EmptyState
        onViewMatches={onViewMatches}
        onResetFeed={onResetFeed}
        isResetting={isResetting}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-4 pb-2 relative overflow-hidden">
      {/* Card Stack Viewport */}
      <div className="relative flex-1 w-full max-h-[calc(100vh-175px)] min-h-[480px]">
        {/* Next Card Peek (Underneath) */}
        {nextProfile && (
          <ProfileCard
            key={nextProfile.id}
            profile={nextProfile}
            isFront={false}
            onSwipe={() => {}}
            disabled={true}
          />
        )}

        {/* Front Active Swipable Card */}
        {currentProfile && (
          <ProfileCard
            key={currentProfile.id}
            profile={currentProfile}
            isFront={true}
            onSwipe={handleAction}
            disabled={swipingProfileId === currentProfile.id}
          />
        )}
      </div>

      {/* Desktop / Touch Action Buttons Bar */}
      <div className="flex items-center justify-center space-x-6 py-3 z-30">
        {/* PASS BUTTON (Left) */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => handleAction('pass')}
          disabled={!currentProfile || swipingProfileId !== null}
          className="w-16 h-16 rounded-full bg-neutral-900 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-950/40 hover:bg-rose-500 hover:text-white transition-colors duration-200 disabled:opacity-40"
          aria-label="Pass / Nope"
        >
          <X className="w-8 h-8 stroke-[2.5]" />
        </motion.button>

        {/* LIKE BUTTON (Right) */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => handleAction('like')}
          disabled={!currentProfile || swipingProfileId !== null}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/40 hover:from-rose-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-40"
          aria-label="Like"
        >
          <Heart className="w-8 h-8 fill-white stroke-none" />
        </motion.button>
      </div>
    </div>
  );
};
