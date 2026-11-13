import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { vueTsConfigs, withVueTs } from '@vue/eslint-config-typescript'
import globals from 'globals'

// .ts と .vue の <script lang="ts"> を TypeScript として lint します。
export default withVueTs(
  {
    ignores: ['dist/**', 'node_modules/**', 'test-results/**', 'playwright-report/**']
  },
  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser
    }
  },
  {
    files: ['*.config.js', '*.config.ts', 'e2e/**'],
    languageOptions: {
      globals: globals.node
    }
  }
)
