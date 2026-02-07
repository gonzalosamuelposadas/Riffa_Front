'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, Lock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { Input, Loading } from '@shared'
import { authService } from '@auth'

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contrasena')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contrasenas no coinciden',
  path: ['confirmPassword']
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [validating, setValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  useEffect(() => {
    const validateToken = async () => {
      try {
        await authService.validateResetToken(token)
        setTokenValid(true)
      } catch {
        setTokenValid(false)
      } finally {
        setValidating(false)
      }
    }

    if (token) {
      validateToken()
    }
  }, [token])

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError('')

    try {
      await authService.resetPassword(token, data.password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al restablecer la contrasena'
      setServerError(message)
    }
  }

  if (validating) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Validando enlace...</p>
        </div>
      </main>
    )
  }

  if (!tokenValid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Enlace Invalido</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Este enlace de recuperacion ha expirado o es invalido. Por favor solicita uno nuevo.
          </p>
          <Link
            href="/recuperar"
            className="inline-block bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <Ticket className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Nueva Contrasena</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Ingresa tu nueva contrasena</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-700 dark:text-green-400 font-medium">Contrasena actualizada!</p>
            <p className="text-green-600 dark:text-green-500 text-sm mt-1">
              Redirigiendo al login...
            </p>
          </div>
        )}

        {/* Error message */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{serverError}</p>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Nueva Contrasena"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirmar Contrasena"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loading size="sm" />
              ) : (
                'Cambiar Contrasena'
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
