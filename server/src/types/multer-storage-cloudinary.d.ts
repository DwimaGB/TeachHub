declare module 'multer-storage-cloudinary' {
  import type { StorageEngine } from 'multer'

  export interface CloudinaryStorageOptions {
    cloudinary: any
    params?: any
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(opts: CloudinaryStorageOptions)
  }

  const _default: any
  export default _default
}
