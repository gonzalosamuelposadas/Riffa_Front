'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { raffleSchema, type RaffleFormData, Input, Textarea, Select, type Raffle } from '@shared'
import { raffleService } from '../services/raffles'

interface RaffleFormProps {
  raffle?: Raffle
}

const statusOptions = [
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'ACTIVE', label: 'Activa' },
  { value: 'COMPLETED', label: 'Completada' },
  { value: 'CANCELLED', label: 'Cancelada' }
]

const currencyOptions = [
  { value: 'MXN', label: 'MXN - Peso Mexicano' },
  { value: 'USD', label: 'USD - Dólar Estadounidense' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'ARS', label: 'ARS - Peso Argentino' },
  { value: 'COP', label: 'COP - Peso Colombiano' },
  { value: 'CLP', label: 'CLP - Peso Chileno' },
  { value: 'PEN', label: 'PEN - Sol Peruano' }
]

export function RaffleForm({ raffle }: RaffleFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<RaffleFormData>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      name: raffle?.name || '',
      description: raffle?.description || '',
      prize: raffle?.prize || '',
      prizeImage: raffle?.prizeImage || '',
      price: raffle?.price || 100,
      currency: raffle?.currency || 'MXN',
      totalNumbers: raffle?.totalNumbers || 100,
      maxPerUser: raffle?.maxPerUser || 10,
      status: raffle?.status || 'DRAFT',
      drawDate: raffle?.drawDate
        ? new Date(raffle.drawDate).toISOString().slice(0, 16)
        : ''
    }
  })

  const mutation = useMutation({
    mutationFn: (data: RaffleFormData) =>
      raffle
        ? raffleService.update(raffle.id, data)
        : raffleService.create(data),
    onSuccess: () => {
      toast.success(
        raffle ? 'Rifa actualizada correctamente' : 'Rifa creada correctamente'
      )
      router.push('/admin/rifas')
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al guardar la rifa')
    }
  })

  const onSubmit = (data: RaffleFormData) => {
    toast.loading(
      raffle ? 'Actualizando rifa...' : 'Creando rifa...',
      { id: 'raffle-mutation' }
    )
    mutation.mutate(data, {
      onSettled: () => {
        toast.dismiss('raffle-mutation')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Nombre de la Rifa"
            placeholder="Ej: Gran Rifa Navideña 2024"
            required
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Descripcion"
            placeholder="Describe tu rifa..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Premio"
            placeholder="Ej: iPhone 15 Pro Max"
            required
            error={errors.prize?.message}
            {...register('prize')}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="URL de Imagen del Premio"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            error={errors.prizeImage?.message}
            {...register('prizeImage')}
          />
        </div>

        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <Input
              label="Precio por Numero"
              type="number"
              min="1"
              step="0.01"
              required
              error={errors.price?.message}
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
            />
          )}
        />

        <Select
          label="Moneda"
          options={currencyOptions}
          error={errors.currency?.message}
          {...register('currency')}
        />

        <Controller
          name="totalNumbers"
          control={control}
          render={({ field }) => (
            <Input
              label="Total de Numeros"
              type="number"
              min="10"
              max="1000"
              required
              disabled={!!raffle}
              error={errors.totalNumbers?.message}
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          )}
        />
        {raffle && (
          <p className="text-sm text-gray-500 dark:text-slate-400 -mt-4 md:col-span-1">
            No se puede modificar despues de crear
          </p>
        )}

        <Controller
          name="maxPerUser"
          control={control}
          render={({ field }) => (
            <Input
              label="Maximo por Usuario"
              type="number"
              min="1"
              max="100"
              required
              error={errors.maxPerUser?.message}
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          )}
        />

        <Select
          label="Estado"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />

        <div className="md:col-span-2">
          <Input
            label="Fecha del Sorteo"
            type="datetime-local"
            error={errors.drawDate?.message}
            {...register('drawDate')}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t dark:border-slate-700">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {raffle ? 'Actualizar Rifa' : 'Crear Rifa'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
