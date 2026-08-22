'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { TechProfile } from '@/types';
import { TechCard } from './TechCard';
import { 
  X, 
  Heart, 
  Star, 
  RotateCcw, 
  Zap, 
  RefreshCw,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface SwipeDeckProps {
  profiles: TechProfile[];
  onSwipe: (profile: TechProfile, direction: 'left' | 'right' | 'super') => void;
  onRewind?: () => void;
  canRewind?: boolean;
  onOpenFilters: () => void;
  onBoost?: () => void;
}

export function SwipeDeck({
  profiles,
  onSwipe,
  onRewind,
  canRewind = false,
  onOpenFilters,
  onBoost
}: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardExpanded, setCardExpanded] = useState(false);

  const activeProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  // Drag physics motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-20, 20]);
  const opacity = useTransform(x, [-300, 0, 300], [0.5, 1, 0.5]);

  // Dynamic stamp opacities
  const likeOpacity = useTransform(x, [30, 130], [0, 1]);
  const nopeOpacity = useTransform(x, [-30, -130], [0, 1]);
  const superLikeOpacity = useTransform(y, [-30, -110], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 90;
    const velocityThreshold = 350;

    if (info.offset.y < -110 || info.velocity.y < -velocityThreshold) {
      triggerSwipe('super');
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      triggerSwipe('right');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      triggerSwipe('left');
    }
  };

  const triggerSwipe = (direction: 'left' | 'right' | 'super') => {
    if (!activeProfile) return;
    onSwipe(activeProfile, direction);
    setCurrentIndex(prev => prev + 1);
    setCardExpanded(false);
    x.set(0);
    y.set(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerSwipe('right');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerSwipe('left');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        triggerSwipe('super');
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setCardExpanded(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeProfile]);

  const resetDeck = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-sm sm:max-w-md mx-auto h-[620px] sm:h-[660px] relative px-3">
      {/* Cards Stack Container */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        <AnimatePresence>
          {activeProfile ? (
            <>
              {/* Next Card preview underneath (Depth stack) */}
              {nextProfile && (
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none transform scale-[0.96] translate-y-3 opacity-70 blur-[0.3px] transition-all duration-300"
                  style={{ zIndex: 1 }}
                >
                  <TechCard profile={nextProfile} showSynergy={true} />
                </div>
              )}

              {/* Active Draggable Card */}
              <motion.div
                key={activeProfile.id}
                className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                style={{
                  x,
                  y,
                  rotate,
                  opacity,
                  zIndex: 10
                }}
                drag={cardExpanded ? false : true}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.9}
                onDragEnd={handleDragEnd}
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{
                  x: x.get() < 0 ? -450 : x.get() > 0 ? 450 : 0,
                  y: y.get() < -40 ? -450 : 0,
                  opacity: 0,
                  transition: { duration: 0.22 }
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              >
                {/* Stamp: LIKE (Tinder Green) */}
                <motion.div 
                  style={{ opacity: likeOpacity }}
                  className="absolute top-8 left-6 z-30 transform -rotate-15 pointer-events-none px-4 py-1.5 rounded-xl border-4 border-[#20D5A0] bg-[#20D5A0]/15 text-[#20D5A0] font-black text-3xl tracking-widest uppercase shadow-2xl backdrop-blur-sm"
                >
                  LIKE
                </motion.div>

                {/* Stamp: NOPE (Tinder Red) */}
                <motion.div 
                  style={{ opacity: nopeOpacity }}
                  className="absolute top-8 right-6 z-30 transform rotate-15 pointer-events-none px-4 py-1.5 rounded-xl border-4 border-[#FE3C72] bg-[#FE3C72]/15 text-[#FE3C72] font-black text-3xl tracking-widest uppercase shadow-2xl backdrop-blur-sm"
                >
                  NOPE
                </motion.div>

                {/* Stamp: SUPER LIKE (Tinder Blue) */}
                <motion.div 
                  style={{ opacity: superLikeOpacity }}
                  className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-5 py-2 rounded-xl border-4 border-[#2DB1FF] bg-[#2DB1FF]/20 text-[#2DB1FF] font-black text-2xl tracking-widest uppercase shadow-2xl backdrop-blur-sm whitespace-nowrap"
                >
                  SUPER LIKE ⭐
                </motion.div>

                <div className="w-full h-full">
                  <TechCard 
                    profile={activeProfile} 
                    isExpanded={cardExpanded}
                    onToggleExpand={() => setCardExpanded(!cardExpanded)}
                  />
                </div>
              </motion.div>
            </>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-8 rounded-3xl bg-[#141722] border border-white/10 backdrop-blur-xl w-full shadow-2xl flex flex-col items-center justify-center my-auto"
            >
              <div className="w-16 h-16 rounded-full tinder-gradient flex items-center justify-center shadow-lg shadow-[#FD297B]/30 mb-4">
                <Flame className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">There's no one new around you</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                Expand your discovery radius, change tech skills, or check back later to see new developers and student builders.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full max-w-xs">
                <button
                  onClick={resetDeck}
                  className="w-full py-3 rounded-full tinder-gradient text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FD297B]/25 active:scale-95 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Rewind Deck
                </button>
                <button
                  onClick={onOpenFilters}
                  className="w-full py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/10 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Edit Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5 Iconic Tinder Bottom Action Floating Buttons */}
      {activeProfile && (
        <div className="flex items-center justify-center gap-3 sm:gap-4 py-4 w-full z-20">
          {/* 1. Rewind (Yellow) */}
          <button
            onClick={onRewind}
            disabled={!canRewind}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
              canRewind 
                ? 'bg-[#181b24] hover:bg-[#202532] text-[#F5B800] border-[#F5B800]/40 shadow-lg shadow-[#F5B800]/10 hover:scale-105 active:scale-95' 
                : 'bg-[#12141c] text-white/20 border-white/5 cursor-not-allowed'
            }`}
            title="Rewind (Undo)"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* 2. Nope (Red/Coral) */}
          <button
            onClick={() => triggerSwipe('left')}
            className="w-14 h-14 rounded-full bg-[#181b24] hover:bg-[#202532] border-2 border-[#FE3C72] text-[#FE3C72] flex items-center justify-center shadow-xl shadow-[#FE3C72]/15 transition-all hover:scale-108 active:scale-95 group"
            title="Nope (Swipe Left)"
          >
            <X className="w-7 h-7 stroke-[3] group-hover:scale-110 transition-transform" />
          </button>

          {/* 3. Super Like (Blue Star) */}
          <button
            onClick={() => triggerSwipe('super')}
            className="w-11 h-11 rounded-full bg-[#181b24] hover:bg-[#202532] border-2 border-[#2DB1FF] text-[#2DB1FF] flex items-center justify-center shadow-lg shadow-[#2DB1FF]/15 transition-all hover:scale-108 active:scale-95 group"
            title="Super Like (Instant Match)"
          >
            <Star className="w-5 h-5 fill-[#2DB1FF] stroke-[2] group-hover:rotate-12 transition-transform" />
          </button>

          {/* 4. Like (Green Heart) */}
          <button
            onClick={() => triggerSwipe('right')}
            className="w-14 h-14 rounded-full bg-[#181b24] hover:bg-[#202532] border-2 border-[#20D5A0] text-[#20D5A0] flex items-center justify-center shadow-xl shadow-[#20D5A0]/15 transition-all hover:scale-108 active:scale-95 group"
            title="Like (Swipe Right)"
          >
            <Heart className="w-7 h-7 fill-[#20D5A0] stroke-[2] group-hover:scale-110 transition-transform" />
          </button>

          {/* 5. Boost / Fast Match (Purple Lightning) */}
          <button
            onClick={onBoost || onOpenFilters}
            className="w-11 h-11 rounded-full bg-[#181b24] hover:bg-[#202532] border border-[#A644FF]/40 text-[#A644FF] flex items-center justify-center shadow-lg shadow-[#A644FF]/10 transition-all hover:scale-105 active:scale-95 group"
            title="Boost Profile & Filters"
          >
            <Zap className="w-5 h-5 fill-[#A644FF] stroke-[2] group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
