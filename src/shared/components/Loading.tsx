'use client'

import { Ticket } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
  const sizes = {
    sm: { icon: 'w-5 h-5', container: 'w-8 h-8', ring: 'w-8 h-8', text: 'text-sm' },
    md: { icon: 'w-6 h-6', container: 'w-12 h-12', ring: 'w-12 h-12', text: 'text-base' },
    lg: { icon: 'w-8 h-8', container: 'w-16 h-16', ring: 'w-16 h-16', text: 'text-lg' }
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size].container} relative flex items-center justify-center`}>
        {/* Spinning ring - fixed size */}
        <div
          className={`absolute ${sizes[size].ring} rounded-full border-2 border-slate-200 border-t-amber-500 animate-spin`}
        />
        {/* Center icon - static */}
        <Ticket className={`${sizes[size].icon} text-slate-600`} />
      </div>
      {text && (
        <p className={`${sizes[size].text} text-slate-500 font-medium`}>{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-8">
      {content}
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loading size="lg" text="Cargando..." />
    </div>
  )
}

export function LoadingInline() {
  return <Loading size="sm" />
}
