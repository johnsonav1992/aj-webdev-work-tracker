import { defineConfig } from 'oxlint';

export default defineConfig({
  jsPlugins: ['./scripts/oxlint-plugin.ts'],
  overrides: [
    {
      files: ['app/**/*.{js,jsx,ts,tsx}', 'server.ts'],
      rules: {
        'aj-webdev-work-tracker/padding-around-multiline-blocks': 'error',
        'aj-webdev-work-tracker/only-arrow-functions': 'error'
      }
    }
  ]
});
