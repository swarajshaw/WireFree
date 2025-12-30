const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^next/font/(.*)$': '<rootDir>/__mocks__/nextFontMock.js',
  },
}

module.exports = createJestConfig(customJestConfig)
