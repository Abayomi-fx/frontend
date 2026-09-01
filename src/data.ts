// Heliobond — fake data for the click-through. Not production: these stand in
 // for live reads from the InvestmentVault + ProjectRegistry Soroban contracts.

export type ProjectType = 'Solar' | 'Wind' | 'Hydro'

/**
 * Whether a project ("bond", in investor-facing copy) is currently open for
 * funding from the pool. Used by the watchlist to tell people which of their
 * saved bonds they can act on now. `upcoming` = not yet available;
 * `funded` = fully funded, no further capacity.
 */
export type BondStatus = 'open' | 'upcoming' | 'funded'

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
  }
  projects: Project[]
  activity: Activity[]
  search: (query: string) => Project[]
}

const INITIAL_PROJECTS: Project[] = []
export const OFF_SCREEN_PROJECTS_COUNT = 8
const PROJECTS_FUNDED = INITIAL_PROJECTS.length + OFF_SCREEN_PROJECTS_COUNT

// The pool has 14 funded projects in total: 6 active demo projects in the local registry,
// plus 8 historical or off-screen projects funded in the past.

const INITIAL_FUNDED_COUNT = INITIAL_PROJECTS.filter((p) => {
  const n = Number(p.funded.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n > 0
}).length

// Helper to derive the portfolio risk indicator from the bond mix.
// Credit scores are 0–100; higher credit = lower risk.
// The risk score is inverted so a higher number means higher risk, and the
// risk level is determined by the share of holdings in each credit band.
function getRiskIndicator(projects: Project[]): { riskScore: number; riskLevel: 'conservative' | 'moderate' | 'aggressive' } {
  const totalFunded = projects.reduce((sum, p) => sum + p.fundedAmount, 0)
  if (totalFunded === 0) {
    return { riskScore: 0, riskLevel: 'conservative' }
  }

  const weightedCredit = projects.reduce((sum, p) => sum + p.credit * p.fundedAmount, 0) / totalFunded
  const riskScore = Math.round((100 - weightedCredit) * 10) / 10

  // Determine the mix of holdings by rating class.
  let highGradeShare = 0 // credit >= 80
  let lowGradeShare = 0 // credit < 70

  for (const p of projects) {
    if (p.fundedAmount <= 0) continue
    const share = p.fundedAmount / totalFunded
    if (p.credit >= 80) highGradeShare += share
    else if (p.credit < 70) lowGradeShare += share
  }

  let riskLevel: 'conservative' | 'moderate' | 'aggressive'
  if (lowGradeShare > 0.2 || highGradeShare < 0.5) {
    riskLevel = 'aggressive'
  } else if (highGradeShare >= 0.7 && lowGradeShare <= 0.1) {
    riskLevel = 'conservative'
  } else {
    riskLevel = 'moderate'
  }

  return { riskScore, riskLevel }
}

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
  },
  projects: INITIAL_PROJECTS,
  activity: [],
  search: (_query: string) => INITIAL_PROJECTS,
}