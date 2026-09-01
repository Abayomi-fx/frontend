import { describe, it, expect } from 'vitest'
import { formatSharePrice } from './format'

describe('formatSharePrice', () => {
  it('formats to 4 decimals', () => {
    expect(formatSharePrice(1.0058)).toBe('1.0058')
  })

  it('rounds to 4 decimals consistently', () => {
    expect(formatSharePrice(1.00585)).toBe('1.0059')
    expect(formatSharePrice(1.00584)).toBe('1.0058')
  })

  it('pads shorter values with trailing zeros', () => {
    expect(formatSharePrice(1.5)).toBe('1.5000')
    expect(formatSharePrice(1)).toBe('1.0000')
  })
})
