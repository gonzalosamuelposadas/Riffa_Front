'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
  selectedNumbers: number[]
  raffleId: string | null
  maxNumbers: number
  addNumber: (number: number, raffleId: string, maxNumbers?: number) => boolean
  removeNumber: (number: number) => void
  clearCart: () => void
  isNumberSelected: (number: number) => boolean
  canAddMore: () => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      selectedNumbers: [],
      raffleId: null,
      maxNumbers: 10,

      addNumber: (number: number, raffleId: string, maxNumbers = 10) => {
        const state = get()

        // Check if we can add more numbers
        if (state.selectedNumbers.length >= maxNumbers) {
          return false
        }

        // Check if number is already selected
        if (state.selectedNumbers.includes(number)) {
          return false
        }

        // If different raffle, clear cart first
        if (state.raffleId && state.raffleId !== raffleId) {
          set({
            selectedNumbers: [number],
            raffleId,
            maxNumbers
          })
          return true
        }

        set({
          selectedNumbers: [...state.selectedNumbers, number],
          raffleId,
          maxNumbers
        })
        return true
      },

      removeNumber: (number: number) => {
        const state = get()
        const newNumbers = state.selectedNumbers.filter(n => n !== number)
        set({
          selectedNumbers: newNumbers,
          raffleId: newNumbers.length > 0 ? state.raffleId : null
        })
      },

      clearCart: () => {
        set({
          selectedNumbers: [],
          raffleId: null
        })
      },

      isNumberSelected: (number: number) => {
        return get().selectedNumbers.includes(number)
      },

      canAddMore: () => {
        const state = get()
        return state.selectedNumbers.length < state.maxNumbers
      }
    }),
    {
      name: 'rifa-cart',
      partialize: (state) => ({
        selectedNumbers: state.selectedNumbers,
        raffleId: state.raffleId,
        maxNumbers: state.maxNumbers
      })
    }
  )
)
