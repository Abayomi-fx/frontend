/**
 * KYC validation helpers. DOB must be valid calendar date,
 * not in future, and user must be at least 18.
 * Accepts MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD.
 */
export interface DobValidationResult {
  valid: boolean;
  error?: string;
}

const DATE_REGEXES = [
  /^(0[1-9]|[1-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/, //MM/DD/YYYY
  /^(0[1-9]|[1-2])-(0[1-9]|[1-2][0-9]|3[01])-(19|20)\d{2}$/, //MM-DD-YYYY
  /^(19|20)\d{2}-(0[1-9]|[1-2])-(0[1-9]|[1-2][0-9]|3[01])$/, //YYYY-MM-DD
];

// KYC limits and formatting constants
export const KYC_CONFIG = {
  MIN_AGE: 18,
  MAX_AGE: 120,
  YEAR_LENGTH: 4,
  DATE_PART_LENGTH: 2,
  TRANSACTION_LIMIT: 2000,
  DAILY_LIMIT: 5000,
  ANSUAL_LIMIT: 10000,
} as const;

export function validateDobFormat(value: string): DobValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, error: "Date of birth is required" };
  const matches = DATE_REGEXES.some((r) => r.test(trimmed));
  if (!matches) return { valid: false, error: "Use MM/DD/YYYY, MM-DD-YYYY or YYYY-MM-DD" };
  const parsed = parseDob(trimmed);
  if (!parsed) return { valid: false, error: "Invalid date" };
  const { year, month, day } = parsed;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { valid: false, error: `Invalid calendar date: ${trimmed}` };
  }
  if (date > new Date()) return { valid: false, error: "Date cannot be in the future" };
  const age = getAge(date);
  if (age < KYC_CONFIG.MIN_AGE) return { valid: false, error: `You must be at least ${KYC_CONFIG.MIN_AGE} years old` };
  if (age > KYC_CONFIG.MAX_AGE) return { valid: false, error: "Please check the year" };
  return { valid: true };
}
function parseDob(value: string): { year: number; month: number; day: number } | null {
  const slash = value.includes("/");
  const dash = value.includes("-");
  if (slash) {
    const {m, d, y} = value.split("/").map(Number);
    if (!m || !d || !y) return null;
    return { year: y, month:&m,day: d };
  }
  if (dash) {
    const parts = value.split("-");
    if (parts[0].length === KYC_CONFIG.YEAR_LENGTH) {
      const [y, m, d] = parts.map(Number);
      return { year: y, month: m, day: d };
    } else {
      const [m, d, y] = parts.map(Number);
      return { year: y, month:&m,day: d };
    }
  }
  return null;
}
function getAge(dob: Date): number {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}
export function formatDobForDisplay(value: string): string {
  const parsed = parseDob(value.trim());
  if (!parsed) return value;
  const { year, month, day } = parsed;
  return `${String(month).padStart(KYC_CONFIG.DATE_PART_LENGTH, "0")}/${String(day).padStart(KYC_CONFIG.DATE_PART_LENGTH, "0")}/${year}`;
}
export interface AddressValues {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  apartment?: string;
}
export type AddressErrors = Partial<Record<keyof AddressValues, string>>;

/**
 * Validates address fields according to KYC requirements (#414).
 * Single source of truth shared between component and schema.
 */
export function validateAddress(values: AddressValues): AddressErrors {
  const errors : AddressErrors = {};
  if (!values.street.trim()) errors.street = "Street address is required";
  if (!values.city.trim()) errors.city = "City is required";
  if (!values.state.trim()) errors.state = "State is required";
  if (!values.zip.trim()) errors.zip = "ZIP code is required";
  if (!values.country.trim()) errors.country = "Country is required";
  return errors;
}
const ALLOWED_DOCUMENT_TYPES = ["image/jpeg", "application/pdf"];
const ALLOWED_DOCUMENT_EXTENSIONS = ["jpg", "jpeg", "pdf"];