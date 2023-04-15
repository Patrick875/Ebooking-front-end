module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    quotes: 'off',
    allowTemplateLiterals: 'true',
    'prettier/prettier': ['error', { semi: true }],
    eqeqeq: 1,
  },
  plugins: ['prettier'],
}
