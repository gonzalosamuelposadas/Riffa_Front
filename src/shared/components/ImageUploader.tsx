'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { useImageUpload, UploadResult } from '@/hooks/useImageUpload'
import { cn } from '../lib/utils'

export interface ImageUploaderProps {
  folder?: string
  maxFiles?: number
  maxSize?: number // in MB
  value?: string[]
  onChange?: (urls: string[]) => void
  onUpload?: (result: UploadResult) => void
  onError?: (error: Error) => void
  className?: string
  disabled?: boolean
  showPreview?: boolean
  previewSize?: 'sm' | 'md' | 'lg'
}

const previewSizes = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
}

export function ImageUploader({
  folder = 'images',
  maxFiles = 5,
  maxSize = 5,
  value = [],
  onChange,
  onUpload,
  onError,
  className,
  disabled = false,
  showPreview = true,
  previewSize = 'md',
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>(value)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const { upload, isUploading, progress } = useImageUpload({
    folder,
    onSuccess: (result) => {
      onUpload?.(result)
    },
    onError: (error) => {
      setUploadError(error.message)
      onError?.(error)
    },
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setUploadError(null)

      // Check max files limit
      if (previews.length + acceptedFiles.length > maxFiles) {
        setUploadError(`Máximo ${maxFiles} imágenes permitidas`)
        return
      }

      for (const file of acceptedFiles) {
        try {
          const result = await upload(file)
          const newPreviews = [...previews, result.url]
          setPreviews(newPreviews)
          onChange?.(newPreviews)
        } catch {
          // Error already handled in hook
        }
      }
    },
    [upload, previews, maxFiles, onChange]
  )

  const removeImage = useCallback(
    (index: number) => {
      const newPreviews = previews.filter((_, i) => i !== index)
      setPreviews(newPreviews)
      onChange?.(newPreviews)
    },
    [previews, onChange]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxSize: maxSize * 1024 * 1024,
    maxFiles: maxFiles - previews.length,
    disabled: disabled || isUploading || previews.length >= maxFiles,
    onDropRejected: (rejections) => {
      const rejection = rejections[0]
      if (rejection?.errors[0]?.code === 'file-too-large') {
        setUploadError(`El archivo excede el tamaño máximo de ${maxSize}MB`)
      } else if (rejection?.errors[0]?.code === 'file-invalid-type') {
        setUploadError('Tipo de archivo no permitido')
      } else {
        setUploadError('Error al procesar el archivo')
      }
    },
  })

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer',
          'flex flex-col items-center justify-center text-center',
          isDragActive && !isDragReject && 'border-amber-500 bg-amber-50 dark:bg-amber-900/20',
          isDragReject && 'border-red-500 bg-red-50 dark:bg-red-900/20',
          !isDragActive && !isDragReject && 'border-slate-300 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500',
          (disabled || isUploading || previews.length >= maxFiles) && 'opacity-50 cursor-not-allowed',
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <>
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Subiendo... {progress}%
            </p>
            <div className="w-full max-w-xs mt-2 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : isDragReject ? (
          <>
            <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
            <p className="text-sm text-red-600 dark:text-red-400">
              Archivo no permitido
            </p>
          </>
        ) : isDragActive ? (
          <>
            <Upload className="w-10 h-10 text-amber-500 mb-2" />
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Suelta la imagen aquí
            </p>
          </>
        ) : previews.length >= maxFiles ? (
          <>
            <ImageIcon className="w-10 h-10 text-slate-400 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Máximo de imágenes alcanzado
            </p>
          </>
        ) : (
          <>
            <Upload className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Haz clic para subir
              </span>{' '}
              o arrastra imágenes aquí
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              PNG, JPG, GIF o WEBP (máx. {maxSize}MB)
            </p>
            {maxFiles > 1 && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {previews.length}/{maxFiles} imágenes
              </p>
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{uploadError}</p>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Previews */}
      {showPreview && previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((url, index) => (
            <div
              key={url}
              className={cn(
                'relative group rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700',
                previewSizes[previewSize]
              )}
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
