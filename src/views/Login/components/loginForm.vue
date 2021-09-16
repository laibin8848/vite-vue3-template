<template>
  <div class="form-container">
    <el-form @keyup.enter.native="submitForm()" ref="loginFormRef" :model="loginForm" status-icon :hide-required-asterisk="true" :rules="rules" label-width="50px" class="login-form">
      <el-form-item label="账 号" prop="username" label-width="80px">
        <el-input v-model="loginForm.username" autocomplete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item label="密 码" prop="password" label-width="80px">
        <el-input v-model="loginForm.password" type="password" autocomplete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha" label-width="80px">
        <el-col :span="7">
          <el-input v-model="loginForm.captcha" type="text" autocomplete="off" placeholder="验证码"></el-input>
        </el-col>
        <el-col class="captchaWrapper" :span="5" @click="createCaptcha">
          <img
            width="125"
            height="30"
            src
            alt
            :ref="
              (el) => {
                captcha = el
              }
            "
          />
        </el-col>
      </el-form-item>
      <el-form-item>
        <div class="btn-container">
          <el-button :loading="loading" type="primary" style="width: 100%" @click="submitForm()">登录</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { defineComponent, ref, toRefs, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { doLogin, getCaptcha } from '@/apis/auth'
import md5 from 'js-md5'

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loginFormRef = ref()
    const captcha = ref()

    const state = reactive({
      loginForm: {
        username: '',
        password: '',
        checkKey: '',
        captcha: ''
      },
      loading: false
    })

    const rules = {
      username: [{ required: true, message: '请输入帐号', trigger: 'change' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
    }

    const createCaptcha = () => {
      // state.loginForm.checkKey = Math.random().toString(36).substr(2, 4)
      getCaptcha()
        .then((res) => {
          captcha.value.src = res.data.captchaBase64
          state.loginForm.checkKey = res.data.checkKey
        })
        .catch((error) => {
          ElMessage({
            type: 'error',
            center: true,
            message: error.message
          })
        })
    }
    createCaptcha()

    const submitForm = () => {
      // console.log({...state.loginForm});
      loginFormRef.value.validate(async (valid) => {
        if (valid) {
          state.loading = true
          const loginInfo = { ...state.loginForm }
          // loginInfo.password = md5(loginInfo.password)
          const res = await doLogin(loginInfo)
          console.log(res)
          if (res.code === 'E000') {
            state.loading = false
            // if (res.data.accessToken) {
            sessionStorage.setItem('auth', 'true')
            sessionStorage.setItem('loginInfo', JSON.stringify(res.data))
            // sessionStorage.setItem('accessToken', res.data.accessToken)
            if (route.query.redirect) {
              const path = route.query.redirect
              router.push({ path })
            } else {
              router.push('/')
            }
          } else {
            ElMessage({
              type: 'error',
              center: true,
              message: res.message || '登陆失败'
            })
            state.loading = false
          }
        }
        return false
      })
    }

    return {
      ...toRefs(state),
      loginFormRef,
      rules,
      submitForm,
      captcha,
      createCaptcha
    }
  }
})
</script>
<style lang="scss" scoped>
.form-container {
  width: 100%;
  :deep .el-input-group__append,
  .el-input-group__prepend {
    padding: 0px 7px;
  }
  .login-form {
    width: 100%;
    margin: 0 auto;
  }
  .go-login {
    font-size: 12px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .to-login {
      color: #9fa2a8;
      em {
        color: #2878ff;
      }
    }
  }
  .operation {
    font-size: 12px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .free-register {
      color: #2878ff;
    }
    .forget-password {
      color: #9fa2a8;
    }
    .btn-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .captchaWrapper {
    margin-left: 10px;
  }
}
</style>
