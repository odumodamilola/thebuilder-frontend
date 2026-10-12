import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores(['.next/**', 'node_modules/**', 'coverage/**', 'public/**', '*.html']),
  {
    files: ['pages/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    rules: {
      '@next/next/no-html-link-for-pages': ['warn', './pages'],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
])
