module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
  overrides: [
    {
      files: ['__tests__/*', '__tests__/**/*'],
      env: {
        jest: true,
      },
    },
  ],
};
