import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Nubl-Landing/', // Замените на имя вашего репозитория
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // Используем esbuild вместо terser
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
