<template>
  <div class="navbar">
    <el-header height="50px">
      <yue-hamburger id="Hamburger" :is-active="opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <yue-bread-crumb class="breadcrumb-container" />
      <div class="right-menu">
        <div id="Message">
          <el-dropdown>
            <el-badge :value="messageNum" :max="99" class="message-badge" type="danger">
              <el-button class="message">
                <i class="el-icon-message-solid"></i>
              </el-button>
            </el-badge>
            <template #dropdown>
              <!-- <el-dropdown-menu>
                <el-dropdown-item command="a">这是一条测试消息</el-dropdown-item>
              </el-dropdown-menu> -->
            </template>
          </el-dropdown>
        </div>
        <el-button id="fullScreen" class="full-screen">
          <el-tooltip content="全屏浏览" effect="dark" placement="left">
            <i v-show="fullScreen == false" class="el-icon-full-screen" @click="toShowFullScreen()"></i>
          </el-tooltip>
          <el-tooltip content="退出全屏" effect="dark" placement="left">
            <i v-show="fullScreen == true" class="el-icon-bottom-left" @click="toExitFullScreen()"></i>
          </el-tooltip>
        </el-button>
        <div>当前登录用户：{{ loginInfo.userInfo.username }}
          <el-button @click="logout" type="text">退出</el-button>
        </div>
      </div>
    </el-header>
  </div>
</template>
<script>
import { defineComponent, computed, ref } from 'vue'
import avatar from '@/assets/avatar-default.jpg'
import { useRouter } from 'vue-router'
import { toFullScreen, exitFullScreen } from '@/utils/screen'
import { useStore } from '@/store/index'

export default defineComponent({
  name: 'Navbar',
  props: {
    primary: {
      default: '#fff',
      type: String
    }
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const opened = computed(() => store.getters['appModule/getSidebarState'])
    const nickname = '' //computed(() => JSON.parse(localStorage.getItem('userInfo')).userName || '')
    const fullScreen = ref(false)
    const loginInfo = ref(JSON.parse(sessionStorage.getItem('loginInfo')))
    const messageNum = computed(() => store.getters['messageModule/getMessageNum'])
    // methods
    const toggleSideBar = () => {
      console.log('into toggleSideBar')
      store.dispatch('appModule/toggleSideBar')
    }

    const toShowFullScreen = () => {
      toFullScreen()
      fullScreen.value = true
    }

    const toExitFullScreen = () => {
      exitFullScreen()
      fullScreen.value = false
    }
    const logout = () => {
      sessionStorage.removeItem('auth')
      router.replace('/login')
    }
    return {
      messageNum,
      toShowFullScreen,
      toExitFullScreen,
      toFullScreen,
      exitFullScreen,
      fullScreen,
      nickname,
      avatar,
      toggleSideBar,
      opened,
      logout,
      loginInfo
    }
  }
})
</script>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.28);
  z-index: 1;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .nickname {
    float: right;
    padding: 0px 25px 0px 25px;
    line-height: 40px;
    outline: none;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    &:focus {
      outline: none;
    }
    .message-badge {
      .is-fixed {
        top: 12px !important;
        right: 28px !important;
      }
      .message {
        border: none;
        padding: 5px 20px;

        i {
          background-color: transparent;
          border: none;
          color: #2c3e50;
          font-size: 25px;
        }
      }
    }

    .full-screen {
      background-color: transparent;
      border: none;
      padding: 5px 20px;

      i {
        background-color: transparent;
        border: none;
        color: #2c3e50;
        font-size: 28px;
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        cursor: pointer;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
