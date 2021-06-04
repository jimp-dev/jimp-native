module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "node": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 2020
    },
    "rules": {
        // enable additional rules
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "linebreak-style": ["error", "unix"],
        "semi": ["error", "always"],

        // disable rules from base configurations
        "no-console": "off",
        "no-extra-semi": "off",
        "prefer-const": "warn",
        "comma-dangle": "error",
        "no-unused-vars": "warn"
    }
};