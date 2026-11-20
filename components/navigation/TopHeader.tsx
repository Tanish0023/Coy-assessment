'use client';

import React, { useState } from 'react';
import { Flame, MessageCircleHeart, HelpCircle, X, ShieldCheck, HeartHandshake, EyeOff } from 'lucide-react';
import { TabType } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';

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
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
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
        <div className="flex items-center space-x-2">
          {/* Info & Assessment Guide Button */}
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            aria-label="How matching works"
            title="How matching works"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Quick Matches Button */}
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

      {/* "How Matching Works" Explanation Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-left"
            >
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white bg-neutral-800"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <span>How Coy Matching Works</span>
              </h3>

              <div className="space-y-4 text-xs text-neutral-300">
                <div className="flex items-start space-x-3 bg-neutral-800/40 p-3 rounded-2xl border border-neutral-800">
                  <HeartHandshake className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">1. Strict Mutual Matching</strong>
                    A match happens <em>only</em> when both you and another profile have liked each other.
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-neutral-800/40 p-3 rounded-2xl border border-neutral-800">
                  <EyeOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">2. Total Privacy Guarantee</strong>
                    You will never see who has liked you beforehand. There is no &quot;Who Liked You&quot; screen or hidden like counter. Unmatched likes stay completely private.
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-neutral-800/40 p-3 rounded-2xl border border-neutral-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">3. Demo Pre-Seeded Suitors</strong>
                    To enable testing mutual matches without multiple concurrent human users, 8 out of 32 profiles have secretly pre-liked your profile (Alex Rivera).
                    Swiping right on those 8 triggers an instant match; swiping right on others secretly records your like without matching!
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-xs transition active:scale-98"
              >
                Got It!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
