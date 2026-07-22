/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/$1",
    "^test/(.*)$": "<rootDir>/../test/$1",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  clearMocks: true,
};
