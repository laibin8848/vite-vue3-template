<template>
  <div class="form-container">
    <el-form ref="loginFormRef" :model="loginForm" status-icon :hide-required-asterisk="true" :rules="rules" label-width="50px" class="login-form">
      <el-form-item label="账号" prop="username">
        <el-input v-model="loginForm.username" autocomplete="off" placeholder="请输入登录帐号admin"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" autocomplete="off" placeholder="请输入密码(123456)"></el-input>
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
  import { doLogin } from '@/apis/auth'

  export default defineComponent({
    name: 'LoginForm',
    setup() {
      const router = useRouter()
      const route = useRoute()
      const loginFormRef = ref()

      const state = reactive({
        loginForm: {
          username: '',
          password: ''
        },
        loading: false
      })

      const rules = {
        username: [{ required: true, message: '请输入帐号', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }

      const submitForm = () => {
        loginFormRef.value.validate(async (valid) => {
          if (valid) {
            state.loading = true
            const res = await doLogin(state.loginForm)
            state.loading = false
            if (res.data.accessToken) {
              sessionStorage.setItem('auth', 'true')
              sessionStorage.setItem('accessToken', res.data.accessToken)
              if (route.query.redirect) {
                const path = route.query.redirect
                router.push({ path })
              } else {
                router.push('/')
              }
            } else {
              ElMessage({
                type: 'warning',
                message: '账号或者密码有误'
              })
            }
          }
          return false
        })
      }

      return {
        ...toRefs(state),
        loginFormRef,
        rules,
        submitForm
      }
    }
  })
</script>
<style lang="scss" scoped>
.form-container{
  width:100%;
   :deep .el-input-group__append, .el-input-group__prepend{
      padding:0px 7px;
    }
    .login-form{
         width:100%;
         margin: 0 auto;
     }
     .go-login{
       font-size: 12px;
       cursor: pointer;
       display:flex;
       flex-direction:row ;
       justify-content: center;
       align-items :center;
        .to-login{
           color: #9fa2a8;
           em{
             color: #2878ff;
           }
         }
     }
     .operation{
       font-size: 12px;
       cursor: pointer;
       display:flex;
       flex-direction:row ;
       justify-content: space-between;
       align-items :center;
        .free-register{
           color: #2878ff;
         }
         .forget-password{
           color: #9fa2a8;
         }
        .btn-container{
          display :flex;
          flex-direction:row;
          justify-content :flex-start;
          align-items :center;
        }
     }
  }
</style>
