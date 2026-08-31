import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/render'
import { Watchlist } from './Watchlist'
import { WATCHLIST_STORAGE_KEY } from '@/lib/watchlist'

describe('Watchlist screen', () => {
  beforeEach(() => localStorage.clear())

  it('shows the empty state when nothing is saved', async () => {
    render(<Watchlist onOpen={vi.fn()} />)
    expect(await screen.findByText('Nothing saved yet')).toBeInTheDocument()
  })

  it('lists saved bonds with a status marker and flags available ones', async () => {
    // id 1 (Sokoto) is status:'open', id 2 (Ría de Vigo) is status:'upcoming'
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify([1, 2]))
    render(<Watchlist onOpen={vi.fn()} />)

    expect(await screen.findByText('Sokoto community solar')).toBeInTheDocument()
    expect(screen.getByText('Ría de Vigo tidal array')).toBeInTheDocument()

    expect(screen.getByText('Open for funding')).toBeInTheDocument()
    expect(screen.getByText('Not yet available')).toBeInTheDocument()
    expect(screen.getByText(/saved bond is open for funding right now/i)).toBeInTheDocument()
  })
})
