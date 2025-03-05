module.exports = {
    preset: 'ts-jest',        // Use ts-jest for transforming TypeScript
    testEnvironment: 'node',  // Specify the test environment (node or jsdom)
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // Ensure ts-jest handles .ts and .tsx files
    },
    // If needed, add this to handle non-JS files
    moduleFileExtensions: ['js', 'ts', 'json', 'node'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'], // Optionally customize which node_modules to transform
  };
  