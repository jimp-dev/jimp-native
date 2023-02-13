// Wraps any errors that occur during a test.
class TestError extends Error {
  constructor(originalError, testName, testPhase, constructorName, unexpected) {
    super(originalError?.message);
    this.testName = testName;
    this.testPhase = testPhase;
    this.constructorName = constructorName;
    this.stack = originalError?.stack;
    this.originalError = originalError;
    this.unexpected = unexpected;
  }
}

// Dummy error so that we can tell it apart from other error types.
class ComparisonError extends Error {}

module.exports = {
  TestError,
  ComparisonError,
};
