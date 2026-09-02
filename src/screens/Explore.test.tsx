import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/render'
import userEvent from '@testing-library/user-event'

const mockReplace = vi.fn()
let mockSearch = ''

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(mockSearch),
}))

vi.mock('@/lib/api', () => ({ getProjectsPaginated: vi.fn() }))

vi.mock('../components', async () => {
  const actual = await vi.importActual<typeof import('../components')>('../components')
  return {
    ...actual,
    ProjectCard: ({ name }: { name: string }) => <article data-testid="card">{name}</article>,
  }
})

import { getProjectsPaginated } from '@/lib/api'
import { Explore } from './Explore'
import type { Project, ProjectType } from '../data'

const mockGetProjectsPaginated = vi.mocked(getProjectsPaginated)

/** A registry large enough to span several pages. */
function makeProjects(count: number, type: ProjectType = 'Solar', offset = 0): Project[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1 + offset),
    name: `Project ${i + 1 + offset}`,
    location: 'Nowhere',
    type,
    credit: 80,
    green: 80,
    funded: 50,
    fundingGoal: 1000,
    fundedAmount: 500,
  })) as unknown as Project[]
}

const cards = () => screen.queryAllByTestId('card')

const nextButton = () => screen.getByRole('button', { name: /go to next page/i })

describe('Explore — incremental loading', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearch = ''
  })

  /** Serve `all` through the paginated API, as the real backend would. */
  function mockPaginated(all: Project[]) {
    mockGetProjectsPaginated.mockImplementation((page = 1, pageSize = 12) => {
      const start = (page - 1) * pageSize
      return Promise.resolve({
        projects: all.slice(start, start + pageSize),
        total: all.length,
        page,
        pageSize,
        hasMore: start + pageSize < all.length,
      })
    })
  }

  it('renders only the first page of a large registry', async () => {
    mockPaginated(makeProjects(40))
    render(<Explore onOpen={vi.fn()} />)
    // The whole point of the change: 40 projects must not all mount at once.
    await waitFor(() => expect(cards().length).toBe(6))
  })

  it('grows a page at a time when asked for more', async () => {
    const user = userEvent.setup()
    mockPaginated(makeProjects(40))
    render(<Explore onOpen={vi.fn()} />)
    await waitFor(() => expect(cards()[0]).toHaveTextContent('Project 1'))

    await user.click(nextButton())
    await waitFor(() => expect(cards()[0]).toHaveTextContent('Project 7'))

    await user.click(nextButton())
    await waitFor(() => expect(cards()[0]).toHaveTextContent('Project 13'))
  })

  it('offers only the remainder on the final page, then stops', async () => {
    const user = userEvent.setup()
    mockPaginated(makeProjects(14))
    render(<Explore onOpen={vi.fn()} />)
    await waitFor(() => expect(cards()[0]).toHaveTextContent('Project 1'))

    // Page 2 holds projects 7–12, page 3 the final 2.
    await user.click(nextButton())
    await waitFor(() => expect(cards()[0]).toHaveTextContent('Project 7'))

    await user.click(nextButton())
    await waitFor(() => expect(cards().length).toBe(2))

    // Nothing left to load — the control retires rather than sitting there inert.
    expect(screen.getByRole('button', { name: /go to next page/i })).toBeDisabled()
  })

  it('does not show the control when everything already fits', async () => {
    mockPaginated(makeProjects(5))
    render(<Explore onOpen={vi.fn()} />)
    await waitFor(() => expect(cards().length).toBe(5))
    expect(screen.queryByRole('button', { name: /go to next page/i })).not.toBeInTheDocument()
  })

  it('reports progress through the list as text', async () => {
    mockPaginated(makeProjects(40))
    render(<Explore onOpen={vi.fn()} />)
    await waitFor(() => expect(screen.getByText(/showing 1-6 of 40/i)).toBeInTheDocument())
  })

  it('falls back to the bundled registry when the API fails', async () => {
    mockGetProjectsPaginated.mockRejectedValue(new Error('offline'))
    render(<Explore onOpen={vi.fn()} />)
    // The fallback path must still paginate rather than dumping the list.
    await waitFor(() => expect(cards().length).toBeGreaterThan(0))
    expect(cards().length).toBeLessThanOrEqual(6)
  })

  it('restarts at the first page when the filter changes', async () => {
    const user = userEvent.setup()
    mockPaginated([...makeProjects(20, 'Solar'), ...makeProjects(20, 'Wind', 20)])
    render(<Explore onOpen={vi.fn()} />)
    await waitFor(() => expect(cards()[0]).toHaveTextContent('Project 1'))

    await user.click(nextButton())
    await waitFor(() => expect(cards()[0]).toHaveTextContent('Project 7'))

    // Switching filter yields a different list; carrying the old page over
    // would reveal more of the new list than a first page should.
    await user.click(screen.getByRole('button', { name: 'Wind' }))
    await waitFor(() => expect(cards()[0]).toHaveTextContent('Project 21'))
  })
})
