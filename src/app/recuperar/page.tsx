'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Ticket, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import { Input, Loading } from '@shared'
import { authService } from '@auth'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalido').min(1, 'El email es requerido')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError('')
    setSuccess(false)

    try {
      await authService.forgotPassword(data.email)
      setSuccess(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al enviar el correo'
      setServerError(message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <Ticket className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Recuperar Contrasena</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Te enviaremos un link para restablecer tu contrasena</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-400">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Correo enviado!</p>
              <p className="text-sm mt-1">Si el email existe en nuestro sistema, recibiras instrucciones para restablecer tu contrasena.</p>
            </div>
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
              label="Email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loading size="sm" />
              ) : (
                'Enviar Instrucciones'
              )}
            </button>
          </form>
        )}

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </Link>
        </div>
      </div>
    </main>
  )
}
