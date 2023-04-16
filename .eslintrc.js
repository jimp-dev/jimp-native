module.exports = {
  root: true,
  env: {
    jest: true,
  },
  extends: [
    "xo",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
  ],
  ignorePatterns: [".eslintrc.js", "**/dist/*.js", "**/es/*.js"],

  plugins: ["import", "prettier"],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
  },

  globals: {
    window: true,
    document: true,
  },

  rules: {
    "prettier/prettier": "error",
    "capitalized-comments": "off",
    camelcase: "off",
    "default-param-last": "off",
    complexity: ["error", { max: 41 }],
    "no-unused-vars": "off",
    "object-shorthand": "off",
    "no-bitwise": "off",
    "prefer-exponentiation-operator": "off",
    "no-control-regex": "off",
    "arrow-body-style": "off",
    "no-constructor-return": "off",
    "max-params": "off",
  },
  overrides: [
    {
      files: ["*.spec.*", "**/types/**/spec.ts"],
      rules: {
        "no-promise-executor-return": "off",
      },
    },
  ],
};
