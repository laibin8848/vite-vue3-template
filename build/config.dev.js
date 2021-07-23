import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './config.base'
import { mockhost } from '../package.json'

export default defineConfig(mergeConfig(baseConfig, {
  server: {
    host: '0.0.0.0',
    open: true,
    cors: true,
    proxy: {
      '/system': {
        target: mockhost || '',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace('/system', '')
      }
    },
  }
}))
