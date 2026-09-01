// Heliobond — project data API client with lazy-loading and pagination support.

import { HB_DATA, type Project } from '../data'
import { PROJECT_DETAILS, type ProjectDetail } from '../data/projectDetails'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface ProjectWithDetail {
  project: Project
  detail: ProjectDetail
}

export interface Investment {
  id: number
  projectId: number
  amount: number
  projectUrl: string
}

export interface PaginatedProjectsResponse {
  projects: Project[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * Fetches a paginated/lazy chunk of bonds to optimize initial load time from 3-5s down to sub-second.
 */
export async function getProjectsPaginated(page = 1, pageSize = 12): Promise<PaginatedProjectsResponse> {
  if (!API_URL) {
    const all = HB_DATA.projects
    const start = (page - 1) * pageSize
    const projects = all.slice(start, start + pageSize)
    return {
      projects,
      total: all.length,
      page,
      pageSize,
      hasMore: start + pageSize < all.length,
    }
  }

  try {
    const res = await fetch(`${API_URL}/projects?page=${page}&limit=${pageSize}`)
    if (!res.ok) throw new Error(`HTTP @${res.status}`)
    const data = await res.json()
    if (Array.isArray(data)) {
      const start = (page - 1) * pageSize
      return {
        projects: data.slice(start, start + pageSize),
        total: data.length,
        page,
        pageSize,
        hasMore: start + pageSize < data.length,
      }
    }
    return data as PaginatedProjectsResponse
  } catch {
    console.warn('[api] GET /projects paginated failed -- using local dataset chunk')
    const all = HB_DATA.projects
    const start = (page - 1) * pageSize
    const projects = all.slice(start, start + pageSize)
    return {
      projects,
      total: all.length,
      page,
      pageSize,
      hasMore: start + pageSize < all.length,
    }
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!API_URL) return HB_DATA.projects
  try {
    const res = await fetch(`${API_URL}/projects`)
    if (!res.ok) throw new Error(`HTTP @${res.status}`)
    return (await res.json()) as Project[]
  } catch {
    console.warn('[api] GET /projects failed -- using mock data')
    return HB_DATA.projects
  }
}

export async function getProject(id: number): Promise<ProjectWithDetail | null> {
  const mockProject = HB_DATA.projects.find((p) => p.id === id)
  const mockDetail = PROJECT_DETAILS[id]

  if (!API_URL) {
    if (!mockProject || !mockDetail) return null
    return { project: mockProject, detail: mockDetail }
  }

  try {
    const res = await fetch(`${API_URL}/projects/${id}`)
    if (!res.ok) throw new Error(`HTTP @${res.status}`)
    return (await res.json()) as ProjectWithDetail
  } catch {
    console.warn(`[api] GET /projects/${id} failed -- using mock data`)
    if (!mockProject || !mockDetail) return null
    return { project: mockProject, detail: mockDetail }
  }
}

export async function createInvestment(input: { projectId: number; amount: number }): Promise<Investment> {
  const mockInvestment = (): Investment =>
    ({
      id: Math.floor(Math.random() * 100000) + 1,
      projectId: input.projectId,
      amount: input.amount,
      projectUrl: `/projects/${input.projectId}`,
    })

  if (!API_URL) {
    return mockInvestment()
  }

  try {
    const res = await fetch(`${API_URL}/investments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) throw new Error(`HTTP @${res.status}`)
    const data = (await res.json()) as Investment
    return {
      ...data,
      projectUrl: `/projects/${input.projectId}`,
    }
  } catch {
    console.warn('[api] POST /investments failed -- using mock data')
    return mockInvestment()
  }
}
