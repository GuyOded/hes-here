// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  testPathIgnorePatterns: [
    "/dist/",
    "/node_modules/"
  ],
  coverageProvider: "babel",

  moduleDirectories: [
    "node_modules"
  ],
  moduleFileExtensions: ["ts", "js"],

  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },

  testMatch: [`${__dirname}/source/__tests__/**/*.{test, spec}.ts`]
};
