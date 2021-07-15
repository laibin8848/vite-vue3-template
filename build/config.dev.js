import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './config.base'

export default defineConfig(mergeConfig(baseConfig, {
  server: {
    host: '0.0.0.0',
    open: true,
    cors: true,
    proxy: {
      '/api_proxy': {
        target: 'http://localhost:9000/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/api_proxy', '')
      }
    },
  }
}))
