import { VercelBlobStorageService } from "./vercel-adapter"
import type { IStorageService } from "./types"

let _instance: IStorageService | null = null

/**
 * Returns the storage service instance. Currently uses Vercel Blob.
 * Swap the adapter here to change storage providers (e.g., S3, R2).
 */
export function getStorageService(): IStorageService {
  if (!_instance) {
    _instance = new VercelBlobStorageService()
  }
  return _instance
}

export type { IStorageService, StorageBlob, ListResult, ListOptions } from "./types"
