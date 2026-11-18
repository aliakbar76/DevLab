export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

/**
 * Replaceable identity port. Baseline ships only DemoIdentityAdapter.
 * Future episodes can introduce a real authentication adapter behind this shape.
 */
export interface IdentityResolver {
  resolveFromRequest(headers: Record<string, string | string[] | undefined>): Promise<CurrentUser>;
}

export const IDENTITY_RESOLVER = Symbol('IDENTITY_RESOLVER');
