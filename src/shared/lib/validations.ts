import { z } from 'zod'

// ==========================================
// LOGIN SCHEMA
// ==========================================
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email valido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export type LoginFormData = z.infer<typeof loginSchema>

// ==========================================
// RAFFLE SCHEMA
// ==========================================
export const raffleSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripcion no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  prize: z
    .string()
    .min(1, 'El premio es requerido')
    .min(3, 'El premio debe tener al menos 3 caracteres')
    .max(200, 'El premio no puede exceder 200 caracteres'),
  prizeImage: z
    .string()
    .url('Ingresa una URL valida')
    .optional()
    .or(z.literal('')),
  price: z
    .number({ message: 'El precio debe ser un numero' })
    .min(1, 'El precio minimo es $1')
    .max(100000, 'El precio maximo es $100,000'),
  currency: z.enum(['MXN', 'USD', 'EUR', 'ARS', 'COP', 'CLP', 'PEN'], {
    message: 'Selecciona una moneda valida'
  }),
  totalNumbers: z
    .number({ message: 'Debe ser un numero' })
    .int('Debe ser un numero entero')
    .min(10, 'Minimo 10 numeros')
    .max(1000, 'Maximo 1000 numeros'),
  maxPerUser: z
    .number({ message: 'Debe ser un numero' })
    .int('Debe ser un numero entero')
    .min(1, 'Minimo 1 numero por usuario')
    .max(100, 'Maximo 100 numeros por usuario'),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'], {
    message: 'Selecciona un estado valido'
  }),
  drawDate: z
    .string()
    .optional()
    .or(z.literal(''))
})

export type RaffleFormData = z.infer<typeof raffleSchema>

// ==========================================
// CHECKOUT SCHEMA
// ==========================================
export const checkoutSchema = z.object({
  buyerName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  buyerEmail: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email valido'),
  buyerPhone: z
    .string()
    .min(1, 'El telefono es requerido')
    .min(10, 'El telefono debe tener al menos 10 digitos')
    .regex(/^[0-9\s\-\+\(\)]+$/, 'Ingresa un telefono valido')
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

// ==========================================
// HELPER - Form Field Error Component Props
// ==========================================
export interface FieldErrorProps {
  message?: string
}
