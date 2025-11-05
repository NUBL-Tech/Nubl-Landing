import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Используем esbuild вместо terser
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      input: [
        './404.html',
        './agreement.html',
        './cookies.html',
        './index.html',
        './offer.html',
        './privacy.html',
      ],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
