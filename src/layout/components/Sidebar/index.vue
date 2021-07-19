<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :router="true"
        :unique-opened="false"
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
  import { computed, defineComponent, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { isExternal } from '@/utils/validate'
  import sidebarItem from '@/layout/components/Sidebar/sidebarItem.vue'
  import logo from './Logo.vue'
  import { useStore } from '@/store/index'

  export default defineComponent({
    components: {
      logo,
      sidebarItem
    },
    setup() {
      const router = useRouter()

      const store = useStore()
      const isCollapse = computed(() => !store.getters['appModule/getSidebarState'])
      const showLogo = computed(() => store.state.settingsModule.sideBarLogo)
      const routes = computed(() => store.state.permissionModule.routes)
      const activeMenu = computed(() => router.currentRoute.value.fullPath)

      onMounted(() => {
        console.log('activeMenu.value', activeMenu.value)
      })

      const handleOpen = (key, keyPath) => {
        console.log('key is ', key)
        console.log('keyPath is ', keyPath)
      }
      const handleClose = (key, keyPath) => {
        console.log(key, keyPath)
      }
      const handleSelect = (key) => {
        console.log('handleSelect is ', key)
        router.replace({ path: key })
      }

      const resolvePath = (routePath) => {
        if (isExternal(routePath)) {
          return routePath
        }
      }
      return {
        activeMenu,
        resolvePath,
        routes,
        showLogo,
        isCollapse,
        handleOpen,
        handleClose,
        handleSelect
      }
    }
  })
</script>
<style scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  text-align:left;
}
</style>
