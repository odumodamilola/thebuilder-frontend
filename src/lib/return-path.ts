/** Only accept a same-origin site path from an untrusted return parameter. */
export function safeReturnPath(value: unknown): string | undefined {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  )
    return undefined;
  if (/[\u0000-\u0020\u007f\\]/.test(value)) return undefined;
  try {
    const decoded = decodeURIComponent(value);
    if (/[\u0000-\u001f\u007f\\]/.test(decoded)) return undefined;
    const path = decodeURIComponent(value.split(/[?#]/, 1)[0]!);
    if (path.startsWith("//")) return undefined;
    if (
      new URL(value, "https://return.invalid").origin !==
      "https://return.invalid"
    )
      return undefined;
    return value;
  } catch {
    return undefined;
  }
}

export function withReturnPath(step: string, value: unknown): string {
  const destination = safeReturnPath(value);
  return destination
    ? step +
        (step.includes("?") ? "&" : "?") +
        "redirect=" +
        encodeURIComponent(destination)
    : step;
}

export function signInDestination(
  user: {
    email: string;
    emailVerified: boolean;
    mfaRequired: boolean;
    mfaEnabled: boolean;
    onboardingComplete: boolean;
  },
  requested: unknown,
): string {
  if (!user.emailVerified)
    return withReturnPath(
      "/verify-email?email=" + encodeURIComponent(user.email),
      requested,
    );
  if (user.mfaRequired)
    return withReturnPath(user.mfaEnabled ? "/mfa" : "/mfa-setup", requested);
  return (
    safeReturnPath(requested) ||
    (user.onboardingComplete ? "/account" : "/onboarding")
  );
}
