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
        './index.html',
        './404.html',
        './legal.html',
        './legal/agreement.html',
        './legal/cookies.html',
        './legal/offer.html',
        './legal/privacy.html',
      ],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
