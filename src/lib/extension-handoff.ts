const EXTENSION_PROTOCOL = "chrome-extension:"
const EXTENSION_ID_PATTERN = /^[a-p]{32}$/

const ALLOWED_EXTENSION_PATHS = new Set(["/sync.html"])

export interface ParsedExtensionNext {
  extensionId: string
  pathname: string
  normalized: string
}

export function parseExtensionNext(value: string | null): ParsedExtensionNext | null {
  if (typeof value !== "string") {
    return null
  }

  const candidate = value.trim()
  if (!candidate) {
    return null
  }

  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return null
  }

  if (parsed.protocol !== EXTENSION_PROTOCOL) {
    return null
  }

  const extensionId = parsed.hostname.toLowerCase()
  if (!EXTENSION_ID_PATTERN.test(extensionId)) {
    return null
  }

  if (parsed.username || parsed.password || parsed.port) {
    return null
  }

  const pathname = parsed.pathname || "/"
  if (!ALLOWED_EXTENSION_PATHS.has(pathname)) {
    return null
  }

  if (parsed.search || parsed.hash) {
    return null
  }

  return {
    extensionId,
    pathname,
    normalized: `chrome-extension://${extensionId}${pathname}`
  }
}

export function sanitizeExtensionNext(value: string | null): string | null {
  return parseExtensionNext(value)?.normalized ?? null
}

export function sanitizeAuthNext(value: string | null): string | null {
  const extensionNext = sanitizeExtensionNext(value)
  if (extensionNext) {
    return extensionNext
  }

  if (typeof value !== "string") {
    return null
  }

  const candidate = value.trim()
  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return null
  }

  return candidate
}

export function isExtensionNext(value: string | null): boolean {
  return sanitizeExtensionNext(value) !== null
}
