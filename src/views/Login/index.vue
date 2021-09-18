<template>
  <div class="container">
    <div class="login-container">
      <div class="login-right">
        <h2 style="padding-top: 20px;margin-bottom: 50px;color: #666;">用户登录</h2>
        <Login />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import viteLogo from '@/assets/logo-vite.svg'
import vueLogo from '@/assets/logo.png'
import Login from './components/loginForm.vue'

export default defineComponent({
  name: 'Index',
  components: {
    Login
  },
  setup() {
    return {
      vueLogo,
      viteLogo
    }
  }
})
</script>

<style lang="scss" scoped>
@keyframes show-login {
  0% {
    opacity: 0;
    top: -500px;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
    top: 200px;
  }
}
.container {
  padding: 20px;
  ::v-deep(.el-input__inner) {
    border-radius: 0 !important;
  }
  ::v-deep(.el-button) {
    border-radius: 0 !important;
  }
  position: relative;
  // background-image: linear-gradient(160deg, #00CC9D 20%, #008cff 80%);
  background: #f5e6e6;
  height: 100vh;
  display: flex;
  justify-content: center;
  .login-container {
    position: absolute;
    top: 200px;
    animation:show-login 1s;
    -webkit-animation:show-login 1s;
    height: auto;
    flex-direction: row;
    display: flex;
    justify-content: space-evenly;
    // border-radius: 10px;
    overflow: hidden;
    background-color: white;
    // box-shadow: 0 0 20px 5px rgba(34, 84, 142, 0.26);
    box-shadow: 0 0 10px rgb(61 61 61 / 25%);
    .login-left {
      width: 50%;
      padding: 47px 54px;
      img {
        width: 90px;
        height: 100px;
        margin: 0px 20px;
      }
      .top {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin: 40px 0px;
        .title {
          font-size: 32px;
          margin-bottom: 16px;
        }
        .desc {
          font-size: 28px;
          text-align: left;
          color: rgb(166, 175, 188);
        }
      }
      .bottom {
        .viteLogo {
          transform: rotate(45deg);
        }
        .vueLogo {
          transform: rotate(-45deg);
        }
      }
    }
    .login-right {
      width: 500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 30px;
      // border: 1px #67c23a solid;
    }
  }
}
</style>
