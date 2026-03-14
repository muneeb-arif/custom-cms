export interface StorageBlob {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
}

export interface ListResult {
  blobs: StorageBlob[]
  cursor?: string
  hasMore: boolean
}

export interface ListOptions {
  prefix?: string
  cursor?: string
  limit?: number
}

export interface IStorageService {
  upload(file: File, prefix?: string): Promise<{ url: string }>
  list(options?: ListOptions): Promise<ListResult>
  delete(urlOrPathname: string | string[]): Promise<void>
}
