'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircleHeart,
  MapPin,
  Briefcase,
  Sparkles,
  Calendar,
  Compass,
  X,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { MatchItem, Profile } from '@/types';
import Image from 'next/image';

interface MatchesViewProps {
  matches: MatchItem[];
  onGoToDiscover: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onGoToDiscover,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const formatMatchTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>Matches</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {matches.length}
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            People who liked you back
          </p>
        </div>
      </div>

      {/* Empty State */}
      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none my-auto">
          <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-500">
            <MessageCircleHeart className="w-8 h-8 text-neutral-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">No Matches Yet</h3>
          <p className="text-neutral-400 text-xs max-w-xs mb-6 leading-relaxed">
            When you and another person both swipe right on each other, they will appear here. Keep discovering profiles!
          </p>
          <button
            type="button"
            onClick={onGoToDiscover}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-rose-500/25 transition active:scale-98"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Profiles</span>
          </button>
        </div>
      ) : (
        /* Matches Grid */
        <div className="grid grid-cols-2 gap-3 pb-8">
          {matches.map((item) => {
            if (!item.profile) return null;
            const profile = item.profile;

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProfile(profile)}
                className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-md cursor-pointer group flex flex-col"
              >
                {/* Profile Photo */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={profile.photoUrl}
                    alt={profile.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 220px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                  {/* Matched Pill */}
                  <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 flex items-center space-x-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[10px] text-white/90 font-medium">
                      {formatMatchTime(item.matchedAt || item.createdAt)}
                    </span>
                  </div>

                  {/* Name & Age Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-sm truncate">{profile.name}</span>
                      <span className="font-light text-sm">{profile.age}</span>
                      {profile.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-[11px] text-neutral-300 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      <span className="truncate">{profile.cityOrCollege}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-card snippet */}
                <div className="p-2.5 bg-neutral-900/95 flex flex-col justify-between flex-1">
                  <p className="text-[11px] text-neutral-400 line-clamp-1 italic mb-2">
                    &quot;{profile.bio}&quot;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-rose-400 font-semibold pt-1 border-t border-neutral-800">
                    <span>Mutual Match</span>
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Selected Match Detail Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-md max-h-[85vh] bg-neutral-900 rounded-t-3xl sm:rounded-3xl border border-neutral-800 shadow-2xl overflow-y-auto no-scrollbar flex flex-col"
            >
              {/* Header Image */}
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={selectedProfile.photoUrl}
                  alt={selectedProfile.name}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition"
                  aria-label="Close profile details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Details */}
              <div className="p-6 flex flex-col space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-bold text-white">
                      {selectedProfile.name}, {selectedProfile.age}
                    </h3>
                    {selectedProfile.verified && (
                      <CheckCircle2 className="w-5 h-5 text-sky-400" />
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 text-neutral-300 text-sm mt-1">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>{selectedProfile.cityOrCollege}</span>
                  </div>

                  {selectedProfile.occupation && (
                    <div className="flex items-center space-x-1.5 text-neutral-400 text-xs mt-1">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedProfile.occupation}</span>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-800/50 p-4 rounded-2xl border border-neutral-800">
                  <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-1.5">
                    About
                  </h4>
                  <p className="text-neutral-200 text-sm leading-relaxed">
                    {selectedProfile.bio}
                  </p>
                </div>

                {selectedProfile.interests && selectedProfile.interests.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-2">
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-200 border border-neutral-700"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm transition mt-2"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
