export interface Stat {
  value: string;
  label: string;
}

export interface StackGroup {
  area: string;
  skills: string[];
  accent?: boolean;
}

export interface AboutEvent {
  year: string;
  title: string;
  role?: string;
  description?: string;
  stats?: Stat[];
  heroImageUrl?: string | null;
  galleryImageUrls?: (string | null)[];
  featuredVideoUrl?: string | null;
}

export interface Achievement {
  year: string;
  title: string;
  result?: string;
  description?: string;
  heroImageUrl?: string | null;
  featuredVideoUrl?: string | null;
}

export interface AboutData {
  bio?: string;
  currentRoles?: string[];
  stats?: Stat[];
  stackGroups?: StackGroup[];
  pullQuote?: string;
  communityQuote?: string;
  closingTagline?: string;
  events?: AboutEvent[];
  achievements?: Achievement[];
}
