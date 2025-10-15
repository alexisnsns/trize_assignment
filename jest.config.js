/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // for React component tests
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json", // <- your custom TS config for Jest
    },
  },
  moduleNameMapper: {
    "\\.(css|scss|sass|png|jpg|jpeg|gif|svg)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
};
