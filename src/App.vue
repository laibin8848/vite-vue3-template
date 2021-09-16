<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useStore } from '@/store/index'

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore()

    const resizeHeight = () => {
      const { clientHeight } = document.body // 获取文档可视区域的宽度
      const height = Math.max(600, clientHeight - 170) // 保证最小值大于600
      store.commit('settingsModule/setTableHeight', height) // 设置tableHeight
    }
    resizeHeight()
    return {
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
