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
  desc: string;
}

export interface Benefit {
  target: string;
  prize: string;
}

export interface Criterion {
  weight: string;
  name: string;
  desc: string;
}

export interface IdeathonContent {
  title: string;
  tagline: string;
  period: string;
  periodRange: string;
  process: ProcessStep[];
  howTo: { title: string; method: string; items: string[] };
  benefits: Benefit[];
  selection: { title: string; round1: string; round2: string };
  criteria: { title: string; items: Criterion[] };
  /** Internal groupware board URL. May live here or at the top level of
   *  SiteContent — groupwareHref() reads either. Optional during the curator's
   *  move from ideathon.* to top-level. */
  groupwareUrl?: string;
  groupwareUrlVerified?: boolean;
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
  /** Curator is moving the groupware fields here from ideathon.*; groupwareHref()
   *  reads top-level first, then falls back to ideathon. Both optional in transit. */
  groupwareUrl?: string;
  groupwareUrlVerified?: boolean;
}

export const content = raw as unknown as SiteContent;

/** public/ asset URL resolved against the GH Pages base path. */
export function iconUrl(file: string): string {
  return `${import.meta.env.BASE_URL}icons/${file}`;
}

/** The groupware submission link, only when it's a real verified URL. Returns null
 *  while it's still the placeholder so CTAs render hover affordance without a
 *  broken href — print/presentation safety (no dead link on a scanned page).
 *
 *  Reads the top-level groupwareUrl first, then falls back to ideathon.groupwareUrl
 *  (the curator is moving the field up to the top level).
 *
 *  TO GO LIVE: in src/data/content.json set groupwareUrl to the real board URL
 *  (currently the "GROUPWARE_BOARD_URL_HERE" placeholder) and flip
 *  groupwareUrlVerified to true. The Showcase coming-soon CTA and the Outro CTA
 *  then become clickable links automatically — no component change. */
export function groupwareHref(): string | null {
  const url = content.groupwareUrl ?? content.ideathon.groupwareUrl;
  const verified = content.groupwareUrlVerified ?? content.ideathon.groupwareUrlVerified;
  if (verified && url && /^https?:\/\//.test(url) && !url.includes("_HERE")) return url;
  return null;
}
