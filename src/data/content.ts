import raw from "./content.json";

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  stats: HeroStat[];
}

export interface ProcessStep {
  step: number;
  name: string;
  duration: string;
  desc: string;
}

export interface Reward {
  target: string;
  prize: string;
}

export interface IdeathonContent {
  title: string;
  tagline: string;
  period: string;
  process: ProcessStep[];
  howTo: { method: string; items: string[] };
  rewards: Reward[];
  judging: { round1: string; round2: string; outcome: string };
}

export interface WorkflowItem {
  name: string;
  desc: string;
}

export interface WorkflowContent {
  title: string;
  tagline: string;
  concept: string;
  highlights: WorkflowItem[];
  steps: WorkflowItem[];
  link: string;
}

export interface ShowcaseContent {
  title: string;
  lead: string;
}

export interface AppItem {
  id: string;
  name: string;
  icon: string | null;
  tagline: string;
  desc: string;
  url: string | null;
  verified: boolean;
  /** Placeholder "next lineup" card inviting an idea submission. */
  comingSoon?: boolean;
  cta?: string;
}

export interface OutroContent {
  title: string;
  message: string;
  cta: string;
}

export interface SiteContent {
  hero: HeroContent;
  ideathon: IdeathonContent;
  workflow: WorkflowContent;
  showcase: ShowcaseContent;
  apps: AppItem[];
  outro: OutroContent;
}

export const content = raw as unknown as SiteContent;

/** public/ asset URL resolved against the GH Pages base path. */
export function iconUrl(file: string): string {
  return `${import.meta.env.BASE_URL}icons/${file}`;
}
