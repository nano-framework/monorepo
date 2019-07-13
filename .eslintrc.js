const path = require('path');

module.exports = {
  env: {
    'jest/globals': true
  },
  parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:jest/recommended',
    'plugin:security/recommended',
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [
    'jest',
    'security',
  ],
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: require('./lerna.json').packages
          .map(p => path
            .resolve(__dirname, p)
            .split('/*').join('')
          )
      }
    }
  },
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
  },
  rules: {
    // '@typescript-eslint/explicit-function-return-type': [ // Explicit function return types, except in expressions
    //   'error',
    //   { 'allowExpressions': true }
    // ],
    // "@typescript-eslint/no-object-literal-type-assertion": ["error", {
    //   allowAsParameter: true // Allow type assertion in call and new expression, default false
    // }],
    // 'prettier/prettier': ['error', { 'tabWidth': 2 }], // Change prettier tab width to 2
    // 'dot-notation': 0,
    // 'no-underscore': 0,
    // 'class-methods-use-this': 0,
    // 'no-underscore-dangle': 0,
    // 'global-require': 'warn',
    // 'import/no-cycle': 'warn', // Warns if you are using circle dependencies
    // 'require-await': 'warn', // Warns if you forget to add await to a promise call
    // 'import/first': 'warn',
    // 'no-empty-function': 'warn',
    // 'no-useless-constructor': 'warn',
    // 'import/no-extraneous-dependencies': 'warn',
    // 'import/prefer-default-export': 'warn',
    // '@typescript-eslint/no-empty-interface': 0,
    // '@typescript-eslint/no-parameter-properties': 0,
  }
};