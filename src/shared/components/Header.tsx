'use client'

import Link from 'next/link'
import { ArrowLeft, Ticket, Trophy } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '../lib/utils'

interface HeaderProps {
  showLogo?: boolean
  showBack?: boolean
  backHref?: string
  backLabel?: string
  title?: string
  showNav?: boolean
  children?: React.ReactNode
  className?: string
}

export function Header({
  showLogo = true,
  showBack = false,
  backHref = '/',
  backLabel = 'Volver',
  title,
  showNav = true,
  children,
  className
}: HeaderProps) {
  return (
    <header className={cn(
      'bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/50 sticky top-0 z-30 transition-colors',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {showBack && (
            <Link
              href={backHref}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          )}

          {showLogo && (
            <Link href="/" className="flex items-center gap-2">
              <Ticket className="w-7 h-7 text-amber-500" />
              <span className="text-xl font-bold text-slate-800 dark:text-white">
                {title || 'RifaApp'}
              </span>
            </Link>
          )}

          {!showLogo && title && (
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              {title}
            </h1>
          )}

          {/* Navigation */}
          {showNav && (
            <nav className="hidden sm:flex items-center gap-1 ml-4">
              <Link
                href="/ganadores"
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors text-sm font-medium"
              >
                <Trophy className="w-4 h-4" />
                Ganadores
              </Link>
            </nav>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {children}
        </div>
      </div>
    </header>
  )
}
