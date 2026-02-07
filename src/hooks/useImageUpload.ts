import { useState, useCallback } from 'react'
import { api } from '@shared'

export interface UploadResult {
  url: string
  filename: string
  originalName: string
  size: number
  mimeType: string
}

export interface UseImageUploadOptions {
  folder?: string
  onSuccess?: (result: UploadResult) => void
  onError?: (error: Error) => void
}

export interface UseImageUploadReturn {
  upload: (file: File) => Promise<UploadResult>
  uploadMultiple: (files: File[]) => Promise<UploadResult[]>
  isUploading: boolean
  progress: number
  error: Error | null
  reset: () => void
}

export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const { folder = 'images', onSuccess, onError } = options
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setIsUploading(false)
    setProgress(0)
    setError(null)
  }, [])

  const upload = useCallback(async (file: File): Promise<UploadResult> => {
    setIsUploading(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await api.post<UploadResult>(
        `/upload/image?folder=${folder}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              setProgress(percentCompleted)
            }
          },
        }
      )

      onSuccess?.(data)
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al subir la imagen')
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [folder, onSuccess, onError])

  const uploadMultiple = useCallback(async (files: File[]): Promise<UploadResult[]> => {
    setIsUploading(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const { data } = await api.post<UploadResult[]>(
        `/upload/images?folder=${folder}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              )
              setProgress(percentCompleted)
            }
          },
        }
      )

      data.forEach((result) => onSuccess?.(result))
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al subir las imágenes')
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [folder, onSuccess, onError])

  return {
    upload,
    uploadMultiple,
    isUploading,
    progress,
    error,
    reset,
  }
}
