export interface Team {
  teamName: string;
  teamLogo?: string;
  coachName: string;
  contactEmail: string;
  contactPhone: string;
  disqualified?: boolean;
}

export interface Player {
  name: string;
  age: number;
  position: string;
  jerseyNumber: number;
  image?: string;
}

export interface Fixture {
  id: string;
  round: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue?: string;
  homeScore?: number;
  awayScore?: number;
  homeGoals?: Goal[];
  awayGoals?: Goal[];
  homeCleanSheet?: string;
  awayCleanSheet?: string;
  cancelled?: boolean;
  cancelReason?: string;
}

export interface Goal {
  scorer: string;
  assist?: string;
  minute?: number;
}

export interface NewsStory {
  story: string;
  title: string;
  date: string;
  content: string;
  image: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'team';
  teamName?: string;
  suspended?: boolean;
}