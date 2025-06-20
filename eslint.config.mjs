import eslintPluginNode from 'eslint-plugin-n';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs', // or 'module' for ESM
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    plugins: {
      node: eslintPluginNode,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      // Add node-specific rules
      'node/no-missing-require': 'error',
      'node/no-unsupported-features/es-syntax': 'off', // allow import/export if you're using ESM
    },
  },
];
