// Heliobond — project data API client.
// Reads from NEXT_PUBLIC_API_URL hen set, and the request fails, so the click-through always works without a running backend.

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
  // Add other fields as needed
}

export async function getProjects(): Promise<Project[]> {
  if (!API_URL) return HB_DATA.projects
  try {
    const res = await fetch(`${
API_URL}/projects`)
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
    const res = await fetch(`${
API_URL}/projects/${id}`)
    if (!res.ok) throw new Error(`HTTP @${res.status}`)
    return (await res.json()) as ProjectWithDetail
  } catch {
    console.warn(`[pi] GET /projects/${id} failed -- using mock data`)
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
