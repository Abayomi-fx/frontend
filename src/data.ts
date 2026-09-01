export type ProjectType = 'Solar' | 'Wind' | 'Hydro'
type BondStatus = 'open' | 'upcoming' | 'funded'

export interface Project {
  id: number
  name: string
  location: string
  type: ProjectType
  credit: number
  green: number
  funded: string
  fundedAmount: number
  fundingGoal: number
  status?: BondStatus
}

export interface Activity {
  kind: 'Deposit' | 'Withdrawal' | 'Score update'
  amount: string
  shares: string
  when: string
  hash: string
}

export function formatCurrency(n: number): string {
  return '$' + Math.floor(n).toLocaleString('en-US')
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

export function formatFixed(n: number, digits: number = 1): string {
  return n.toFixed(digits)
}

export interface HeliobondData {
  pool: {
    totalAssets: number
    sharePrice: number
    projectedRate: number
    liquid: number
    projectsFunded: number
  }
  counters: {
    totalAssets: string
    projectsFunded: string
    projectedRate: string
  }
  you: {
    value: number
    deltaAbs: number
    deltaPct: number
    hbs: number
    poolSharePct: number
    weightedGreen: number
    backed: number
    riskScore: number
    riskLevel: 'conservative' | 'moderate' | 'aggressive'
    referralLink?: string
  }
  projects: Project[]
  activity: Activity[]
  search: (query: string) => Project[]
}

const INITIAL_PROJECTS: Project[] = []
const OFF_SCREEN_PROJECTS_COUNT = 8
const PROJECTS_FUNDED = INITIAL_PROJECTS.length + OFF_SCREEN_PROJECTS_COUNT

const POOL = {
  totalAssets: 4862014.55,
  sharePrice: 1.0058,
  projectedRate: 7.4,
  liquid: 1420300,
  projectsFunded: PROJECTS_FUNDED,
}

export const HB_DATA: HeliobondData = {
  pool: POOL,
  counters: {
    totalAssets: formatCurrency(POOL.totalAssets),
    projectsFunded: formatNumber(POOL.projectsFunded),
    projectedRate: formatFixed(POOL.projectedRate, 1),
  },
  you: {
    value: 24180.45,
    deltaAbs: 612.18,
    deltaPct: 2.6,
    hbs: 24041.231,
    poolSharePct: 0.49,
    weightedGreen: 88,
    backed: PROJECTS_FUNDED,
    riskScore: 0,
    riskLevel: 'conservative',
    referralLink: 'https://heliobond.fi/ref/HB24041',
  },
  projects: INITIAL_PROJECTS,
  activity: [],
  search: (_query: string) => INITIAL_PROJECTS,
}
