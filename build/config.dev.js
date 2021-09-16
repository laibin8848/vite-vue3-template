import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './config.base'

export default defineConfig(mergeConfig(baseConfig, {
    server: {
        host: '0.0.0.0',
        open: true,
        cors: true,
        port: 80,
        proxy: {
            '/unilever': {
                target: 'http://10.16.153.37:30329/',
                changeOrigin: true
            }
        },
    }
}))
