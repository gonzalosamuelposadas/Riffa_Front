'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { raffleService } from '@raffles'
import { ConfirmModal } from '@shared'

interface DeleteRaffleButtonProps {
  raffleId: string
  raffleName: string
  onDeleted?: () => void
}

export function DeleteRaffleButton({ raffleId, raffleName, onDeleted }: DeleteRaffleButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const deleteMutation = useMutation({
    mutationFn: () => raffleService.delete(raffleId),
    onSuccess: () => {
      toast.success('Rifa eliminada correctamente')
      setIsModalOpen(false)
      if (onDeleted) {
        onDeleted()
      } else {
        router.refresh()
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar la rifa')
    }
  })

  const handleConfirm = () => {
    deleteMutation.mutate()
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Eliminar"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="Eliminar Rifa"
        message={`¿Estas seguro de eliminar la rifa "${raffleName}"? Esta accion no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  )
}
