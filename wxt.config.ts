import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'GCal Auto Fill',
    host_permissions: ['https://calendar.google.com/*'],
  },
});