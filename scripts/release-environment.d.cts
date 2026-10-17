export function approvedLegalContent(document: unknown): boolean;
export function buildIdentity(
  env: Record<string, string | undefined>,
): Record<string, string>;
export function assertBuildIdentity(
  env: Record<string, string | undefined>,
  receipt: unknown,
  buildId: string,
  legalHash: string,
): void;
export function validateBuildEnvironment(
  env: Record<string, string | undefined>,
  legal?: unknown,
): { target: string; release: boolean };
