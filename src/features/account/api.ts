import { http, type ApiEnvelope } from "@/lib/http";
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
  emailVerified: boolean;
  roles: string[];
  permissions: string[];
  mfaRequired: boolean;
  mfaEnabled: boolean;
};
export type LoginInput = { email: string; password: string };
export type RegisterInput = LoginInput & {
  name: string;
  country?: string;
  city?: string;
  profession?: string;
  turnstileToken?: string;
};
export type OnboardingInput = {
  interests: string[];
  country?: string;
  city?: string;
  profession?: string;
};
export type StorySubmissionInput = {
  title: string;
  pitch: string;
  whyNow?: string;
  links?: string;
};
export type NominationInput = {
  type: "Builder" | "Startup";
  name: string;
  industry: string;
  country: string;
  city: string;
  website?: string;
  reason: string;
  nomineeEmail?: string;
  nomineePhone?: string;
  submitterName: string;
  submitterEmail: string;
  relationship: string;
  consent: true;
  turnstileToken?: string;
};
const changed = () => {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("tb-session-changed"));
};
const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const accountApi = {
  me: () => http<ApiEnvelope<AuthUser>>("/me"),
  login: async (input: LoginInput) => {
    const result = await http<ApiEnvelope<AuthUser>>("/auth/login", {
      method: "POST",
      body: input,
    });
    changed();
    return result;
  },
  register: async (input: RegisterInput) => {
    const result = await http<ApiEnvelope<AuthUser>>("/auth/register", {
      method: "POST",
      body: input,
    });
    changed();
    return result;
  },
  logout: async () => {
    await http("/auth/logout", { method: "POST" });
    changed();
  },
  resendVerification: (email: string) =>
    http("/auth/email/resend", { method: "POST", body: { email } }),
  forgotPassword: (email: string) =>
    http("/auth/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (input: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => http("/auth/reset-password", { method: "POST", body: input }),
  verifyMfa: async (code: string, recoveryCode?: string) => {
    await http("/auth/mfa/challenge", {
      method: "POST",
      body: recoveryCode ? { recoveryCode } : { code },
    });
    changed();
  },
  setupMfa: () =>
    http<ApiEnvelope<{ secret: string; provisioningUri: string }>>(
      "/auth/mfa/setup",
      { method: "POST" },
    ),
  confirmMfa: async (code: string) => {
    const result = await http<ApiEnvelope<{ recoveryCodes: string[] }>>(
      "/auth/mfa/confirm",
      { method: "POST", body: { code } },
    );
    changed();
    return result;
  },
  saveOnboarding: async (input: OnboardingInput) => {
    const result = await http<ApiEnvelope<AuthUser>>("/me/onboarding", {
      method: "PUT",
      body: { ...input, interests: input.interests.map(slug) },
    });
    changed();
    return result;
  },
  submitStory: (input: StorySubmissionInput, key: string) =>
    http<ApiEnvelope<{ reference: string }>>("/me/submissions", {
      method: "POST",
      body: input,
      headers: { "Idempotency-Key": key },
    }),
  nominate: (input: NominationInput, key: string) =>
    http<ApiEnvelope<{ reference: string }>>("/nominations", {
      method: "POST",
      body: input,
      headers: { "Idempotency-Key": key },
    }),
  saveInterests: (interests: string[]) =>
    http("/me/interests", {
      method: "PUT",
      body: { interests: interests.map(slug) },
    }),
  bookmark: (id: string, save: boolean) =>
    http("/me/bookmarks/" + encodeURIComponent(id), {
      method: save ? "PUT" : "DELETE",
    }),
};
