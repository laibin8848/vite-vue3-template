import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'path';
import styleImport from 'vite-plugin-style-import'
import { injectHtml } from 'vite-plugin-html'
import { name } from '../package.json'

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
     }),
     injectHtml({
       injectData: {
         title: name
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
