export const authSecret =
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "development" ? "mirror-dev-secret-change-me" : undefined)
