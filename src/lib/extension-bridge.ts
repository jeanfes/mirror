const EXTENSION_ID_STORAGE_KEY = "mirror_extension_id"
const EXTENSION_ID_PATTERN = /^[a-p]{32}$/
const DEFAULT_SYNC_TIMEOUT_MS = 1600

type ExtensionPullSyncMessage = {
  type: "SYNC_SETTINGS_PULL"
  force?: boolean
}

type ExtensionSignOutMessage = {
  type: "SIGN_OUT"
}

type ExtensionPullSyncResponse = {
  ok?: boolean
  reason?: string
}

type ExtensionRuntimeBridge = {
  lastError?: {
    message?: string
  }
  sendMessage: (
    extensionId: string,
    message: ExtensionPullSyncMessage | ExtensionSignOutMessage,
    callback: (response: ExtensionPullSyncResponse | undefined) => void
  ) => void
}

type BrowserWindowWithChromeRuntime = Window & {
  chrome?: {
    runtime?: ExtensionRuntimeBridge
  }
}

function isValidExtensionId(value: string | null | undefined): value is string {
  return typeof value === "string" && EXTENSION_ID_PATTERN.test(value)
}

export function saveConnectedExtensionId(extensionId: string): void {
  if (typeof window === "undefined" || !isValidExtensionId(extensionId)) {
    return
  }

  try {
    window.localStorage.setItem(EXTENSION_ID_STORAGE_KEY, extensionId)
  } catch {
    // Ignore storage failures; runtime bridge remains optional.
  }
}

export function getConnectedExtensionId(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const stored = window.localStorage.getItem(EXTENSION_ID_STORAGE_KEY)
    return isValidExtensionId(stored) ? stored : null
  } catch {
    return null
  }
}

export async function notifyExtensionSettingsChanged(options?: {
  force?: boolean
  extensionId?: string | null
  timeoutMs?: number
}): Promise<{ ok: boolean; reason?: string }> {
  return await sendExtensionMessage({
    type: "SYNC_SETTINGS_PULL",
    force: options?.force !== false
  }, options)
}

export async function notifyExtensionSignedOut(options?: {
  extensionId?: string | null
  timeoutMs?: number
}): Promise<{ ok: boolean; reason?: string }> {
  return await sendExtensionMessage({ type: "SIGN_OUT" }, options)
}

async function sendExtensionMessage(
  message: ExtensionPullSyncMessage | ExtensionSignOutMessage,
  options?: {
    extensionId?: string | null
    timeoutMs?: number
  }
): Promise<{ ok: boolean; reason?: string }> {
  if (typeof window === "undefined") {
    return { ok: false, reason: "runtime_unavailable" }
  }

  const extensionId =
    options?.extensionId && isValidExtensionId(options.extensionId)
      ? options.extensionId
      : getConnectedExtensionId()

  if (!extensionId) {
    return { ok: false, reason: "extension_not_linked" }
  }

  const runtime = (window as BrowserWindowWithChromeRuntime).chrome?.runtime
  if (!runtime?.sendMessage) {
    return { ok: false, reason: "runtime_unavailable" }
  }

  const timeoutMs = Math.max(300, options?.timeoutMs ?? DEFAULT_SYNC_TIMEOUT_MS)

  return await new Promise((resolve) => {
    let settled = false
    const finish = (value: { ok: boolean; reason?: string }) => {
      if (settled) {
        return
      }

      settled = true
      resolve(value)
    }

    const timeoutId = window.setTimeout(() => {
      finish({ ok: false, reason: "sync_timeout" })
    }, timeoutMs)

    try {
      runtime.sendMessage(extensionId, message, (response) => {
        window.clearTimeout(timeoutId)

        const lastErrorMessage = runtime.lastError?.message
        if (lastErrorMessage) {
          finish({ ok: false, reason: lastErrorMessage })
          return
        }

        if (response?.ok === true) {
          finish({ ok: true })
          return
        }

        finish({ ok: false, reason: response?.reason ?? "sync_pull_failed" })
      })
    } catch (error) {
      window.clearTimeout(timeoutId)
      finish({
        ok: false,
        reason: error instanceof Error ? error.message : "sync_pull_exception"
      })
    }
  })
}