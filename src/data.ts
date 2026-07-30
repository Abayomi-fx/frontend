// Heliobond — fake data for the click-through. Not production: these stand in
// for live reads from the InvestmentVault + ProjectRegistry Soroban contracts.

export type ProjectType = 'Solar' | 'Wind' | 'Hydro'

export interface Project {
  id: number
  name: string
  location: string
  type: ProjectType
  /** Credit Quality, oracle-verified, 0–100 */
  credit: number
  /** Green Impact, oracle-verified, 0–100 */
  green: number
  /** Capital deployed to this project from the pool (display string) */
  funded: string
  /** Capital deployed, as a number */
  fundedAmount: number
  /** Stated funding goal */
  fundingGoal: number
}

export interface Activity {
  kind: 'Deposit' | 'Withdrawal' | 'Score update'
  amount: string
  shares: string
  when: string
  hash: string
}

export interface HeliobondData {
  pool: {
    totalAssets: number
    sharePrice: number
    projectedRate: number
    liquid: number
    projectsFunded: number
  }
  you: {
    value: number
    deltaAbs: number
    deltaPct: number
    hbs: number
    poolSharePct: number
    weightedGreen: number
    backed: number
  }
  projects: Project[]
  activity: Activity[]
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Sokoto community solar',
    location: 'Sokoto, Nigeria',
    type: 'Solar',
    credit: 82,
    green: 91,
    funded: '$420,000',
  },
  {
    id: 2,
    name: 'Ría de Vigo tidal array',
    location: 'Galicia, Spain',
    type: 'Hydro',
    credit: 74,
    green: 88,
    funded: '$1,180,000',
  },
  {
    id: 3,
    name: 'Atacama agrivoltaics',
    location: 'Antofagasta, Chile',
    type: 'Solar',
    credit: 88,
    green: 79,
    funded: '$640,000',
  },
  {
    id: 4,
    name: 'Jämtland wind co-op',
    location: 'Östersund, Sweden',
    type: 'Wind',
    credit: 91,
    green: 84,
    funded: '$960,000',
  },
  {
    id: 5,
    name: 'Kerala micro-hydro',
    location: 'Idukki, India',
    type: 'Hydro',
    credit: 69,
    green: 93,
    funded: '$310,000',
  },
  {
    id: 6,
    name: 'Oaxaca rooftop network',
    location: 'Oaxaca, Mexico',
    type: 'Solar',
    credit: 77,
    green: 86,
    funded: '$520,000',
  },
]

// The pool has 14 funded projects in total: 6 active demo projects in the local registry,
// plus 8 historical or off-screen projects funded in the past.
export const OFF_SCREEN_PROJECTS_COUNT = 8

const INITIAL_FUNDED_COUNT = INITIAL_PROJECTS.filter((p) => {
  const n = Number(p.funded.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n > 0
}).length

export const HB_DATA: HeliobondData = {
  pool: {
    totalAssets: 4862014.55,
    sharePrice: 1.0058,
    projectedRate: 7.4,
    liquid: 1420300,
    projectsFunded: INITIAL_FUNDED_COUNT + OFF_SCREEN_PROJECTS_COUNT,
  },
  you: {
    value: 24180.45,
    deltaAbs: 612.18,
    deltaPct: 2.6,
    hbs: 24041.231,
    poolSharePct: 0.49,
    weightedGreen: 88,
    backed: INITIAL_FUNDED_COUNT + OFF_SCREEN_PROJECTS_COUNT,
  },
  projects: [
    {
      id: 1,
      name: 'Sokoto community solar',
      location: 'Sokoto, Nigeria',
      type: 'Solar',
      credit: 82,
      green: 91,
      funded: '$420,000',
      fundedAmount: 420000,
      fundingGoal: 600000,
    },
    {
      id: 2,
      name: 'Ría de Vigo tidal array',
      location: 'Galicia, Spain',
      type: 'Hydro',
      credit: 74,
      green: 88,
      funded: '$1,180,000',
      fundedAmount: 1180000,
      fundingGoal: 1500000,
    },
    {
      id: 3,
      name: 'Atacama agrivoltaics',
      location: 'Antofagasta, Chile',
      type: 'Solar',
      credit: 88,
      green: 79,
      funded: '$640,000',
      fundedAmount: 640000,
      fundingGoal: 800000,
    },
    {
      id: 4,
      name: 'Jämtland wind co-op',
      location: 'Östersund, Sweden',
      type: 'Wind',
      credit: 91,
      green: 84,
      funded: '$960,000',
      fundedAmount: 960000,
      fundingGoal: 1200000,
    },
    {
      id: 5,
      name: 'Kerala micro-hydro',
      location: 'Idukki, India',
      type: 'Hydro',
      credit: 69,
      green: 93,
      funded: '$310,000',
      fundedAmount: 310000,
      fundingGoal: 400000,
    },
    {
      id: 6,
      name: 'Oaxaca rooftop network',
      location: 'Oaxaca, Mexico',
      type: 'Solar',
      credit: 77,
      green: 86,
      funded: '$520,000',
      fundedAmount: 520000,
      fundingGoal: 700000,
    },
  ],
  activity: [
    {
      kind: 'Deposit',
      amount: '+$5,000.00',
      shares: '+4,971.06 HBS',
      when: '2 days ago',
      hash: 'a91f…3c0d',
    },
    {
      kind: 'Score update',
      amount: 'Sokoto solar · green 89 → 91',
      shares: '',
      when: '2 days ago',
      hash: 'd44b…77a2',
    },
    {
      kind: 'Deposit',
      amount: '+$12,000.00',
      shares: '+11,950.12 HBS',
      when: '3 weeks ago',
      hash: '7c1e…b8f5',
    },
  ],
}
