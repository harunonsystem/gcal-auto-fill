import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'Google Calendar Magic Filler',
    permissions: ['storage'],
    host_permissions: ['https://calendar.google.com/*'],
  },
});