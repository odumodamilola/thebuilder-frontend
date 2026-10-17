import content from "../../contracts/legal-content.json";
import type { Edition } from "./types";
export type PolicyKind = "terms" | "privacy" | "sponsored";
export interface PolicyDocument {
  title: string;
  status: string;
  version: string;
  approvedBy: string;
  approvedAt: string;
  sections: { id: string; heading: string; paragraphs: string[] }[];
}
export const publisherForEdition = (edition: Edition) =>
  content.publishers[edition];
export const policyForEdition = (
  edition: Edition,
  kind: PolicyKind,
): PolicyDocument => content.policies[edition][kind];
