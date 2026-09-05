module.exports = [
  {
    ignores: ['node_modules/', 'dist/', '.git/', '.env', 'package-lock.json'],
  },
  // Server configuration (CommonJS)
  {
    files: ['src/server.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-var': 'warn',
      'prefer-const': 'warn',
      'eqeqeq': ['warn', 'always'],
    },
  },
  // Game logic (client-side)
  {
    files: ['src/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        Worker: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-var': 'warn',
      'prefer-const': 'warn',
      'eqeqeq': ['warn', 'always'],
    },
  },
];
