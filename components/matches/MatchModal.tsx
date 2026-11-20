'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, ArrowRight, X } from 'lucide-react';
import { MatchItem } from '@/types';
import { CURRENT_USER_PHOTO } from '@/lib/constants';
import Image from 'next/image';

interface MatchModalProps {
  match: MatchItem | null;
  currentUserPhoto?: string;
  onClose: () => void;
  onViewMatches: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  match,
  currentUserPhoto = CURRENT_USER_PHOTO,
  onClose,
  onViewMatches,
}) => {
  if (!match || !match.profile) return null;

  const partner = match.profile;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative w-full max-w-sm rounded-3xl bg-neutral-900/95 border border-neutral-700/60 p-6 flex flex-col items-center text-center shadow-2xl overflow-hidden"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close / Dismiss Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition z-20"
            aria-label="Close match screen"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Sparkles Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3 z-10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mutual Match</span>
          </motion.div>

          {/* Title Header */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 mb-1 z-10 drop-shadow"
          >
            It&apos;s a Match!
          </motion.h2>

          <p className="text-neutral-300 text-sm mb-6 z-10">
            You and <span className="text-white font-semibold">{partner.name}</span> liked each other.
          </p>

          {/* Interlocking Profile Photos with Heart Accent & Name Badges */}
          <div className="relative flex flex-col items-center justify-center my-4 z-10 w-full">
            <div className="relative flex items-center justify-center w-full h-32">
              {/* Current User Photo (Left) */}
              <motion.div
                initial={{ x: -60, opacity: 0, rotate: -15 }}
                animate={{ x: -30, opacity: 1, rotate: -8 }}
                transition={{ delay: 0.25, type: 'spring', damping: 15 }}
                className="relative w-28 h-28 rounded-full border-4 border-rose-500 shadow-xl overflow-hidden bg-neutral-800"
              >
                <Image
                  src={currentUserPhoto}
                  alt="You"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </motion.div>

              {/* Pulsing Heart Center Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{
                  delay: 0.45,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  duration: 1,
                }}
                className="absolute z-20 w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg border-2 border-white/80"
              >
                <Heart className="w-6 h-6 fill-white text-white" />
              </motion.div>

              {/* Matched Partner Photo (Right) */}
              <motion.div
                initial={{ x: 60, opacity: 0, rotate: 15 }}
                animate={{ x: 30, opacity: 1, rotate: 8 }}
                transition={{ delay: 0.35, type: 'spring', damping: 15 }}
                className="relative w-28 h-28 rounded-full border-4 border-pink-500 shadow-xl overflow-hidden bg-neutral-800"
              >
                <Image
                  src={partner.photoUrl}
                  alt={partner.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Labels indicating You and Partner */}
            <div className="flex items-center justify-between w-full max-w-[260px] px-2 mt-2">
              <span className="text-xs font-semibold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                You (Alex)
              </span>
              <span className="text-xs font-semibold text-pink-400 bg-pink-500/15 border border-pink-500/30 px-2.5 py-0.5 rounded-full">
                {partner.name.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Match Location & Detail Snippet */}
          <div className="mt-2 mb-6 text-center z-10">
            <p className="text-neutral-400 text-xs">
              {partner.cityOrCollege} {partner.occupation ? `• ${partner.occupation}` : ''}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col space-y-3 z-10">
            <button
              type="button"
              onClick={onViewMatches}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/30 active:scale-98 transition transform"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>Say Hello in Matches</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-6 rounded-2xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white font-medium text-sm border border-neutral-700/50 flex items-center justify-center space-x-2 active:scale-98 transition"
            >
              <span>Keep Swiping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
