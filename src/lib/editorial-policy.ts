import policy from "../../contracts/editorial-policy.json";
import type { Edition } from "./types";

export const storyCategories = (edition: Edition) => policy.categories[edition];
export const focusRegions = policy.regions;
export const videoFormats = policy.videoFormats;
export const editionCredit = (edition: Edition) =>
  policy.footerCredits[edition];
export const categorySlug = (label: string) =>
  label.toLowerCase().replaceAll(" ", "-");
export const defaultFooter = (edition: Edition) =>
  `© The Builder. Powered by ${editionCredit(edition)}`;
