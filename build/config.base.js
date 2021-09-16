import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path';
import styleImport from 'vite-plugin-style-import'
import { injectHtml } from 'vite-plugin-html'
import { description } from '../package.json'

export default {
  base: './',
  plugins: [
    vue(),
    styleImport({
     libs: [{
        libraryName: 'element-plus',
        esModule: true,
        ensureStyleFile: true,
        resolveStyle: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`;
        },
        resolveComponent: (name) => {
          name = name.slice(3)
          return `element-plus/lib/components/${name}`
        },
      }]
    }),
    legacy({
       targets: ['ie >= 11'],
       additionalLegacyPolyfills: ['regenerator-runtime/runtime']
     }),
     injectHtml({
       injectData: {
         title: description
       },
     })
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, '../'),
      '@': resolve(__dirname, '../src'),
    }
  },
  clearScreen:false
}
