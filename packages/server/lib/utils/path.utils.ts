function forceLeadingSlash(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function stripTrailingSlash(path: string) {
  return path.endsWith('/') ? path.slice(0, path.length - 1) : path;
}

export function joinPaths(basePath: string = '/', path: string = '/') {
  const sanitizePathComponent = (p: string) => stripTrailingSlash(forceLeadingSlash(p));
  const joinedPath = `${sanitizePathComponent(basePath)}${sanitizePathComponent(path)}`;
  return joinedPath.length === 0 ? '/' : joinedPath;
}
