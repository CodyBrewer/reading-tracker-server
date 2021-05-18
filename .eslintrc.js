module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'cypress/globals': true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: [
    'cypress'
  ],
  rules: {
  }
}
