export type Screen =
  | 'landing' // 
  | 'connect' //connect
  | 'explore' //explore
  | 'project' //project/[id]
  | 'deposit' //deposit
  | 'portfolio' //portfolio
  | 'withdraw' //withdraw

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

export type BondRating = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC';

export interface Bond {
  id: string;
  rating: BondRating;
  amount: number;
}

export interface Portfolio {
  id: string;
  name: string;
  holdings: Bond[];
  riskScore: RiskScore;
}

export const KYC_ALLOWED_DOCUMENT_TYPES = ['image/jpeg', 'application/pdf'] as const;
export type KYC_AllowedDocumentType = typeof KYC_ALLOWED_DOCUMENT_TYPES[number];

export function isKycAllowedDocumentType(fileType: string): fileType is KycAllowedDocumentType {
  const normalized = fileType.trim().toLowerCase();
  return (KYC_ALLOWED_DOCUMENT_TYPES as readonly string[]).some(
    (allowed) => allowed.toLowerCase() === normalized
  );
}
