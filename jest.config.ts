module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended'],
  collectCoverage: true,
  modulePaths: ['<rootDir>/src'],
  displayName: {
    name: 'M3',
    color: 'cyan'
  },
  modulePathIgnorePatterns: [
    'dist'
  ],
  silent: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/node_modules/**'
  ]
}
