export type Screen =
  | 'landing' // /
  | 'connect' // /connect
  | 'explore' // /explore
  | 'project' // /project/[id]
  | 'deposit' // /deposit
  | 'portfolio' // /portfolio
  | 'withdraw' // /withdraw

export interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
}

export interface ProjectFilters {
  search: string;
  type: string;
}

export type RiskScore = 'conservative' | 'moderate' | 'aggressive';
