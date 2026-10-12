import { builders, opportunities, startups } from './data';
import type { Builder, Opportunity, Startup } from './data';

export interface ExploreRepository {
  builders(): Promise<Builder[]>;
  builder(slug:string): Promise<Builder | null>;
  startups(): Promise<Startup[]>;
  startup(slug:string): Promise<Startup | null>;
  opportunities(): Promise<Opportunity[]>;
}

/** Swap this implementation for a Laravel JSON repository without changing screen components. */
export const exploreRepository: ExploreRepository = {
  builders: async () => builders,
  builder: async slug => builders.find(item => item.slug === slug) ?? null,
  startups: async () => startups,
  startup: async slug => startups.find(item => item.slug === slug) ?? null,
  opportunities: async () => opportunities,
};

