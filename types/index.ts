export interface Profile {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  bio: string;
  cityOrCollege: string;
  occupation: string | null;
  interests: string[];
  verified?: boolean;
}

export interface MatchItem {
  id: string;
  createdAt: string;
  matchedAt: string;
  profile: Profile | null;
}

export type TabType = 'home' | 'discover' | 'matches';
