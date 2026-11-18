import { DEMO_USER_HEADER } from '@devlab/contracts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4400';
const DEFAULT_DEMO_USER = 'clseeduser000000000000001';

export async function apiRequest<T>(path: string, demoUserId = DEFAULT_DEMO_USER): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      [DEMO_USER_HEADER]: demoUserId,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}
