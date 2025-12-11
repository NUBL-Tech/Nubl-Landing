import { defineConfig } from 'vite'

// Плагин для замены %%VITE_*%% в HTML
function htmlEnvPlugin() {
  let env = {}
  return {
    name: 'html-env-replace',
    configResolved(config) {
      env = config.env
    },
    transformIndexHtml(html) {
      // Заменяем %%VITE_*%% на значения из env
      return html.replace(/%%(\w+)%%/g, (match, key) => {
        return env[key] !== undefined ? env[key] : match
      })
    }
  }
}

export default defineConfig({
  plugins: [htmlEnvPlugin()],
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
