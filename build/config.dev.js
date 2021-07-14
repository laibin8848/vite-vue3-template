import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path';
import styleImport from 'vite-plugin-style-import'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    styleImport({
     libs: [{
        libraryName: 'element-plus',
        esModule: true,
        ensureStyleFile: true,
        resolveStyle: (name) => {
          // eslint-disable-next-line no-param-reassign
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`;
        },
        resolveComponent: (name) => `element-plus/lib/${name}`,
      }]
    }),
    legacy({
       targets: ['ie >= 11'],
       additionalLegacyPolyfills: ['regenerator-runtime/runtime']
     })
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, '../'),
      '@': resolve(__dirname, '../src'),
    }
  },
  clearScreen:false,
  server: {
    host: '0.0.0.0',
    port: 404,
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
  },
  build:{
    commonjsOptions:{
      ignoreDynamicRequires:false,
      transformMixedEsModules:true,
      brotliSize:false,
      sourceMap:false
    }
  }
})
