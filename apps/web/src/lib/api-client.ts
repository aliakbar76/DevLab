import { DEMO_USER_HEADER } from '@devlab/contracts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4400';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  demoUserId: string;
};

export async function apiRequest<T>(path: string, options: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    [DEMO_USER_HEADER]: options.demoUserId,
  };

  const hasBody = options.body !== undefined;
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof (body as { message: unknown }).message === 'string'
        ? (body as { message: string }).message
        : `Request failed (${response.status})`;
    throw new ApiError(message, response.status, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
