import { Header } from '@shared'
import { RaffleContent } from '@raffles'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RafflePage({ params }: PageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Header showBack showLogo={false} />
      <RaffleContent raffleId={id} />
    </main>
  )
}
