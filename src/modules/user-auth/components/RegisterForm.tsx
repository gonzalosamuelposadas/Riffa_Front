'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import { Input, Loading } from '@shared'
import { useAuth } from '@auth'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const registerSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string()
    .email('Email invalido')
    .min(1, 'El email es requerido'),
  password: z.string()
    .min(6, 'La contrasena debe tener al menos 6 caracteres'),
  confirmPassword: z.string()
    .min(1, 'Confirma tu contrasena'),
  phone: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contrasenas no coinciden',
  path: ['confirmPassword']
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const { register: registerUser, loginWithGoogle } = useAuth()

  const [serverError, setServerError] = useState('')
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('')

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined
      })
      router.push('/mi-cuenta')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrarse'
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Crear Cuenta</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Registrate para participar en rifas</p>
        </div>

        {/* Social login */}
        <div className="mb-6">
          <button
            type="button"
            onClick={async () => {
              setIsGoogleLoading(true)
              try {
                await loginWithGoogle()
              } finally {
                setIsGoogleLoading(false)
              }
            }}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Loading size="sm" />
            ) : (
              <>
                <GoogleIcon className="w-5 h-5" />
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  Registrarse con Google
                </span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              O registrate con email
            </span>
          </div>
        </div>

        {/* Error messages */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Tu nombre"
            autoComplete="name"
            icon={<User className="w-5 h-5" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Telefono (opcional)"
            type="tel"
            placeholder="+52 123 456 7890"
            autoComplete="tel"
            icon={<Phone className="w-5 h-5" />}
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="Contrasena"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock className="w-5 h-5" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirmar contrasena"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            icon={<Lock className="w-5 h-5" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {/* Terms acceptance */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-amber-600 border-slate-300 dark:border-slate-600 rounded focus:ring-amber-500"
                {...register('acceptTerms')}
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                He leído y acepto los{' '}
                <Link
                  href="/legal/terminos"
                  target="_blank"
                  className="text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Términos y Condiciones
                </Link>
                , la{' '}
                <Link
                  href="/legal/privacidad"
                  target="_blank"
                  className="text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Política de Privacidad
                </Link>
                {' '}y la{' '}
                <Link
                  href="/legal/antifraude"
                  target="_blank"
                  className="text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Política Anti-fraude
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500 dark:text-red-400 ml-7">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loading size="sm" />
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors"
            >
              Inicia sesion
            </Link>
          </p>
          <Link
            href="/"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors block"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
