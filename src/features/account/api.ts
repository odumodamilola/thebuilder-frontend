import { http, type ApiEnvelope } from '@/lib/http'

export type AuthUser = { id: string; name: string; email: string; onboardingComplete: boolean }
export type LoginInput = { email: string; password: string }
export type RegisterInput = LoginInput & { name: string; country?: string; city?: string; profession?: string }
export type OnboardingInput = { interests: string[]; country?: string; city?: string; profession?: string }
export type StorySubmissionInput = { title: string; pitch: string; whyNow?: string; links?: string }
export type NominationInput = { type: 'Builder' | 'Startup'; name: string; industry: string; country: string; city: string; website?: string; reason: string; nomineeEmail?: string; nomineePhone?: string; submitterName: string; submitterEmail: string; relationship: string; consent: true }

// These adapters are the sole Laravel boundary for this feature. They intentionally
// perform no client-side session or authorization simulation.
export const accountApi = {
  login: (input: LoginInput) => http<ApiEnvelope<AuthUser>>('/auth/login', { method: 'POST', body: input }),
  register: (input: RegisterInput) => http<ApiEnvelope<AuthUser>>('/auth/register', { method: 'POST', body: input }),
  resendVerification: (email: string) => http<ApiEnvelope<null>>('/auth/email/verification-notification', { method: 'POST', body: { email } }),
  forgotPassword: (email: string) => http<ApiEnvelope<null>>('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (input: { token: string; email: string; password: string; password_confirmation: string }) => http<ApiEnvelope<null>>('/auth/reset-password', { method: 'POST', body: input }),
  verifyMfa: (code: string) => http<ApiEnvelope<AuthUser>>('/auth/two-factor-challenge', { method: 'POST', body: { code } }),
  saveOnboarding: (input: OnboardingInput) => http<ApiEnvelope<AuthUser>>('/account/onboarding', { method: 'PUT', body: input }),
  submitStory: (input: StorySubmissionInput) => http<ApiEnvelope<{ reference: string }>>('/account/submissions', { method: 'POST', body: input }),
  nominate: (input: NominationInput) => http<ApiEnvelope<{ reference: string }>>('/nominations', { method: 'POST', body: input }),
}
