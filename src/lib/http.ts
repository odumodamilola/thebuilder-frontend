export type QueryValue = string | number | boolean | null | undefined

export interface PageMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface ApiEnvelope<T> {
  data: T
  message?: string
  meta?: PageMeta | Record<string, unknown>
  links?: Record<string, string | null>
}

export interface ApiValidationError {
  message: string
  errors: Record<string, string[]>
}

export class HttpError<T = unknown> extends Error {
  constructor(public readonly status: number, message: string, public readonly body?: T, public readonly requestId?: string) {
    super(message)
    this.name = 'HttpError'
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, QueryValue>
  body?: BodyInit | Record<string, unknown> | null
  signal?: AbortSignal
}

function buildUrl(baseUrl: string, path: string, query?: RequestOptions['query']) {
  const root = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const url = new URL(path.replace(/^\//, ''), root)
  Object.entries(query ?? {}).forEach(([key, value]) => { if (value !== null && value !== undefined) url.searchParams.set(key, String(value)) })
  return url.toString()
}

export function createHttpClient(baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/') {
  return async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers)
    headers.set('Accept', 'application/json')
    const isSerializable = options.body !== null && typeof options.body === 'object' && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams) && !(options.body instanceof Blob) && !(options.body instanceof ArrayBuffer)
    if (isSerializable && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    const response = await fetch(buildUrl(baseUrl, path, options.query), {
      ...options,
      headers,
      body: isSerializable ? JSON.stringify(options.body) : options.body as BodyInit | null | undefined,
      credentials: options.credentials ?? 'include',
    })
    if (response.status === 204) return undefined as T
    const contentType = response.headers.get('content-type') ?? ''
    const body: unknown = contentType.includes('application/json') ? await response.json() : await response.text()
    if (!response.ok) {
      const message = typeof body === 'object' && body && 'message' in body ? String(body.message) : `Request failed with status ${response.status}`
      throw new HttpError(response.status, message, body, response.headers.get('x-request-id') ?? undefined)
    }
    return body as T
  }
}

export const http = createHttpClient()
