import { validateEnv } from './env.validation'

describe('Env validation', () => {
  const env: Record<string, unknown> = {}

  it('Should throw if env has invalid value', () => {
    expect(() => validateEnv(env)).toThrow()
  })
})
