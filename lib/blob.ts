/**
 * Vercel Blob helpers. Used by the upload API and optionally by admin UI
 * to show a clear error when Blob is not configured.
 */

export const BLOB_NOT_CONFIGURED_MESSAGE =
  "Blob storage not configured. Add BLOB_READ_WRITE_TOKEN to your environment (Vercel Storage)."

/**
 * Returns the Blob read-write token if configured, otherwise null.
 * Use in API routes before calling put(); return 503 with BLOB_NOT_CONFIGURED_MESSAGE when null.
 */
export function getBlobToken(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  return token?.trim() || null
}

export function isBlobConfigured(): boolean {
  return getBlobToken() !== null
}
