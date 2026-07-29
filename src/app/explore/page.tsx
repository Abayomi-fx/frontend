'use client'

import { useRouter } from 'next/navigation'
import { Explore } from '../../screens/Explore'

export default function ExplorePage() {
  const router = useRouter()
  return <Explore onOpen={(p) => router.push(`/project/${p.id}`)} />
}
