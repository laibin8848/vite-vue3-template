import { defineConfig, mergeConfig } from 'vite'
import { minifyHtml } from 'vite-plugin-html'
import baseConfig from './config.base'

export default defineConfig(mergeConfig(baseConfig, {
  plugins: [
    minifyHtml()
  ],
  build:{
    commonjsOptions:{
      ignoreDynamicRequires:false,
      transformMixedEsModules:true,
      brotliSize:false,
      sourceMap:false
    }
  }
}))
