module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverageFrom: ["src/**/*.ts"],
  coverageReporters: [["lcov", { projectRoot: "../../" }]],
};
