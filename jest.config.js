export default {
  // Test environment
  testEnvironment: 'node',
  
  // Support ES modules
  preset: null,
  transform: {},
  extensionsToTreatAsEsm: ['.ts'],
  
  // Test file patterns
  testMatch: [
    "**/test/**/*.test.js",
    "**/src/**/*.test.js"
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  
  // Coverage configuration
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/build/'
  ],
  
  // Module resolution
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Detect open handles (for database connections)
  detectOpenHandles: true,
  forceExit: true
};