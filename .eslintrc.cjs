module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  // this is the root project for all sub modules. stop searching for any
  // eslintrc files in parent directories.
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 10,
  },
  plugins: [
    'header',
    'vue',
  ],
  extends: [
    'airbnb-base',
    // 'plugin:vue/vue3-recommended',
  ],
  rules: {
    strict: 0,
    'no-plusplus': 0,
    'max-len': [0, { code: 200 }],
    'import/extensions': 0,
    'no-restricted-syntax': 0,

    // allow dangling underscores for 'fields'
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
  },
};
