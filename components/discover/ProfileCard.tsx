'use client';

import React, { useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
  AnimatePresence,
} from 'framer-motion';
import {
  MapPin,
  Briefcase,
  CheckCircle2,
  Info,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Profile } from '@/types';
import Image from 'next/image';

interface ProfileCardProps {
  profile: Profile;
  isFront: boolean;
  onSwipe: (action: 'like' | 'pass') => void;
  disabled?: boolean;
}

const SWIPE_THRESHOLD = 120;

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isFront,
  onSwipe,
  disabled = false,
}) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const [imageError, setImageError] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0.6, 1, 1, 1, 0.6]);

  // Stamp opacities for visual feedback
  const likeStampOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeStampOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (disabled || !isFront) return;

    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('like');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 1,
      }}
      drag={isFront && !disabled ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={isFront && !disabled ? { cursor: 'grabbing' } : {}}
      className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl select-none cursor-grab bg-neutral-900 border border-neutral-800 ${
        isFront ? 'z-20' : 'z-10 pointer-events-none'
      }`}
      initial={{ scale: isFront ? 1 : 0.94, y: isFront ? 0 : 12 }}
      animate={{ scale: isFront ? 1 : 0.94, y: isFront ? 0 : 12 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
    >
      {/* Background Image Container */}
      <div className="relative w-full h-full">
        <Image
          src={
            imageError
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
              : profile.photoUrl
          }
          alt={profile.name}
          fill
          priority={isFront}
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover object-center pointer-events-none"
          onError={() => setImageError(true)}
        />

        {/* Multi-layered Vignette Gradients for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Visual Swipe Indicators / Stamps */}
        {isFront && (
          <>
            {/* LIKE STAMP (Right Swipe) */}
            <motion.div
              style={{ opacity: likeStampOpacity }}
              className="absolute top-10 left-8 z-30 pointer-events-none transform -rotate-12 border-4 border-emerald-500 rounded-xl px-4 py-1.5 shadow-lg bg-emerald-950/30 backdrop-blur-sm"
            >
              <span className="text-emerald-400 font-black text-3xl tracking-widest uppercase">
                LIKE
              </span>
            </motion.div>

            {/* NOPE / PASS STAMP (Left Swipe) */}
            <motion.div
              style={{ opacity: nopeStampOpacity }}
              className="absolute top-10 right-8 z-30 pointer-events-none transform rotate-12 border-4 border-rose-500 rounded-xl px-4 py-1.5 shadow-lg bg-rose-950/30 backdrop-blur-sm"
            >
              <span className="text-rose-500 font-black text-3xl tracking-widest uppercase">
                NOPE
              </span>
            </motion.div>
          </>
        )}

        {/* Top Header Information Tag (e.g. Verified status) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-white/90">Coy Discover</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullBio(!showFullBio);
            }}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:bg-black/60 transition"
            aria-label="Toggle profile details"
          >
            {showFullBio ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Bottom Profile Information Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col justify-end">
          {/* Name & Age */}
          <div className="flex items-baseline space-x-2.5 mb-1.5">
            <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
              {profile.name}
            </h2>
            <span className="text-2xl font-light text-white/90 drop-shadow-md">
              {profile.age}
            </span>
            {profile.verified && (
              <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20 stroke-[2.5]" />
            )}
          </div>

          {/* Location / College */}
          <div className="flex items-center space-x-2 text-white/80 text-sm mb-1.5">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium truncate">{profile.cityOrCollege}</span>
          </div>

          {/* Occupation (Optional) */}
          {profile.occupation && (
            <div className="flex items-center space-x-2 text-white/70 text-xs mb-3">
              <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{profile.occupation}</span>
            </div>
          )}

          {/* Bio Preview or Expanded */}
          <div className="text-white/90 text-sm leading-relaxed mb-3 drop-shadow">
            <p className={showFullBio ? '' : 'line-clamp-2'}>
              {profile.bio}
            </p>
          </div>

          {/* Interests Tags */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {profile.interests.map((interest, idx) => (
                <span
                  key={`${profile.id}-interest-${idx}`}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/15 text-white/95 backdrop-blur-md border border-white/10 shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
