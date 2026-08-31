'use client'

import { useRouter } from 'next/navigation'
import { Watchlist } from '../../screens/Watchlist'

export default function WatchlistPage() {
  const router = useRouter()
  return <Watchlist onOpen={(p) => router.push(`/project/${p.id}`)} />
}
