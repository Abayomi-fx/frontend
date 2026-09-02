import { describe, it, expect, afterEach, vi } from 'vitest'
import { isConstrainedCanvas } from './HelioWebGL'

/**
 * jsdom's navigator exposes none of the client hints we read, and its
 * defaults (e.g. `hardwareConcurrency`) are unreliable across environments.
 * Each test stubs exactly the hints it cares about and restores the real
 * navigator afterwards.
 */
type NavHints = {
  connection?: { saveData?: boolean; effectiveType?: string }
  deviceMemory?: number
  hardwareConcurrency?: number
}

const stubNavigator = (hints: NavHints) => {
  vi.stubGlobal('navigator', { ...hints })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isConstrainedCanvas', () => {
  it('is false on a capable device with no data-saving', () => {
    stubNavigator({
      connection: { saveData: false, effectiveType: '4g' },
      deviceMemory: 8,
      hardwareConcurrency: 8,
    })
    expect(isConstrainedCanvas()).toBe(false)
  })

  it('is true when Save-Data is enabled', () => {
    stubNavigator({
      connection: { saveData: true, effectiveType: '3g' },
      deviceMemory: 8,
      hardwareConcurrency: 8,
    })
    expect(isConstrainedCanvas()).toBe(true)
  })

  it('is true on low device memory (≤ 4 GiB)', () => {
    stubNavigator({ deviceMemory: 4, hardwareConcurrency: 8 })
    expect(isConstrainedCanvas()).toBe(true)
  })

  it('is false with 8 GiB of device memory', () => {
    stubNavigator({ deviceMemory: 8, hardwareConcurrency: 8 })
    expect(isConstrainedCanvas()).toBe(false)
  })

  it('is true on few CPU cores (≤ 4)', () => {
    stubNavigator({ deviceMemory: 8, hardwareConcurrency: 4 })
    expect(isConstrainedCanvas()).toBe(true)
  })

  it('is false with 8 CPU cores', () => {
    stubNavigator({ hardwareConcurrency: 8 })
    expect(isConstrainedCanvas()).toBe(false)
  })

  it('is true on a slow-2g / 2g effective connection', () => {
    stubNavigator({ connection: { saveData: false, effectiveType: '2g' }, hardwareConcurrency: 8 })
    expect(isConstrainedCanvas()).toBe(true)
    stubNavigator({ connection: { saveData: false, effectiveType: 'slow-2g' }, hardwareConcurrency: 8 })
    expect(isConstrainedCanvas()).toBe(true)
  })

  it('is false on a 3g connection with capable hardware and no Save-Data', () => {
    stubNavigator({ connection: { saveData: false, effectiveType: '3g' }, hardwareConcurrency: 8 })
    expect(isConstrainedCanvas()).toBe(false)
  })

  it('is false when no client hints are exposed at all', () => {
    stubNavigator({})
    expect(isConstrainedCanvas()).toBe(false)
  })
})