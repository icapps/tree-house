// jest.config.js
module.exports = {
  verbose: false,
  notify: false,
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json',
  ],
  testRegex: '/tests/[^lib].*\\.(ts|tsx|js)$',
  mapCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/lib/base',
    'src/lib/helpers',
  ],
};
