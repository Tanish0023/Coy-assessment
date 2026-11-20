'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Profile, MatchItem, TabType } from '@/types';
import { TopHeader } from '@/components/navigation/TopHeader';
import { BottomNav } from '@/components/navigation/BottomNav';
import { CardStack } from '@/components/discover/CardStack';
import { HomePlaceholder } from '@/components/home/HomePlaceholder';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [activeMatch, setActiveMatch] = useState<MatchItem | null>(null);

  // Fetch Feed
  const fetchFeed = useCallback(async () => {
    setLoadingFeed(true);
    setFeedError(null);
    try {
      const res = await fetch('/api/feed', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load profiles');
      }
      setProfiles(data.profiles || []);
    } catch (err: any) {
      console.error('Error fetching feed:', err);
      setFeedError(err.message || 'Error connecting to server');
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  // Fetch Matches
  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/matches', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    fetchMatches();
  }, [fetchFeed, fetchMatches]);

  // Handle Swipe
  const handleSwipe = async (profile: Profile, action: 'like' | 'pass') => {
    // Optimistic removal: remove top card immediately for 60fps responsiveness
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: profile.id,
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error('Swipe error response:', data);
        return;
      }

      // Mutual Match Triggered!
      if (data.matched && data.match) {
        const newMatchItem: MatchItem = {
          id: data.match.id,
          createdAt: new Date().toISOString(),
          matchedAt: new Date().toISOString(),
          profile: data.match.profile,
        };

        setMatches((prev) => [newMatchItem, ...prev]);
        setActiveMatch(newMatchItem);
      }
    } catch (err) {
      console.error('Failed to record swipe:', err);
      // Rollback profile to stack in case of catastrophic network failure
      setProfiles((prev) => [profile, ...prev]);
    }
  };

  // Reset Feed
  const handleResetFeed = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        await fetchFeed();
        await fetchMatches();
      }
    } catch (err) {
      console.error('Error resetting feed:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <TopHeader
        activeTab={activeTab}
        matchesCount={matches.length}
        onOpenMatches={() => setActiveTab('matches')}
      />

      {/* Main Tab Views */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {activeTab === 'discover' && (
          <CardStack
            profiles={profiles}
            loading={loadingFeed}
            error={feedError}
            onSwipe={handleSwipe}
            onViewMatches={() => setActiveTab('matches')}
            onResetFeed={handleResetFeed}
            isResetting={isResetting}
          />
        )}

        {activeTab === 'home' && (
          <HomePlaceholder onGoToDiscover={() => setActiveTab('discover')} />
        )}

        {activeTab === 'matches' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-neutral-400 text-sm">
              Matches View (Implemented in Milestone 4)
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        matchesCount={matches.length}
      />
    </div>
  );
}
