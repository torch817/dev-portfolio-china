export type RouteView = 'home' | 'demo';

/**
 * Normalizes a pathname by stripping query parameters, hashes,
 * and trailing slashes (except root '/').
 */
export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  const stripped = pathname.split('?')[0].split('#')[0];
  const normalized = stripped.replace(/\/+$/, '') || '/';
  return normalized;
}

/**
 * Determines whether the given pathname corresponds to 'home' or 'demo'.
 * Unknown routes fallback to 'home' (SPA shell).
 */
export function getRouteView(pathname: string): RouteView {
  const norm = normalizePath(pathname);
  if (norm === '/demo') {
    return 'demo';
  }
  return 'home';
}
