import { defineConfig, mergeConfig } from 'vite'
import { minifyHtml } from 'vite-plugin-html'
import baseConfig from './config.base'

//获取构建环境变量
// export default ({ mode }) => {
  // return defineConfig()
// });

export default defineConfig(mergeConfig(baseConfig, {
  plugins: [
    minifyHtml()
  ],
  build:{
    chunkSizeWarningLimit: 2000,
    emptyOutDir: true,
    // lib: {
      // formats: ['es', 'umd', 'iife'],
      // entry: '../src/mainx.js',
    // },
    commonjsOptions:{
      ignoreDynamicRequires:false,
      transformMixedEsModules:true,
      brotliSize:false,
      sourceMap:false
    }
  }
}))
