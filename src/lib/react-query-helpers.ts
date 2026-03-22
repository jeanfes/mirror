/**
 * Helpers for React Query.
 * Hooks that need the current user should use useSession() directly.
 */

export function makeQueryKey(key: string, userId: string): string[] {
  return [key, userId]
}
