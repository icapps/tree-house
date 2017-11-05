// jest.config.js
module.exports = {
  verbose: false,
  notify: false,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
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
