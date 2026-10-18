const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Add the configured Next.js basePath to a local public asset exactly once. */
export function publicImage(path, fallback = "/images/doctor-placeholder.svg") {
  const source = typeof path === "string" && path.trim() ? path.trim() : fallback;
  if (!source.startsWith("/") || !basePath || basePath === "/") return source;
  if (source === basePath || source.startsWith(`${basePath}/`)) return source;
  return `${basePath}${source}`;
}
