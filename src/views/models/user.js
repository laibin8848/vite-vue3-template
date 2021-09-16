import { ref } from 'vue'
import { saveUser } from '@/apis/users'
import { ElMessage } from 'element-plus'

export default function userModelForm() {
  const userFormRef = ref(null)
  const modelOnSaving = ref(false)

  const userModel = ref({
    id: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    realName: ''
  })

  const userFormSave = (cb) => {
    modelOnSaving.value = true
    userFormRef.value && userFormRef.value.validate().then(() => {
      saveUser(userModel.value).then((res) => {
        modelOnSaving.value = false
        if (res.code == 'E000') {
          ElMessage.success('添加用户操作成功！')
          userFormVisible.value = false
          cb && cb()
        } else {
          ElMessage.error(res.message)
        }
      })
    }).catch(() => {
      modelOnSaving.value = false
    })
  }

  const userFormValidateRules = {
    username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
    email: [ { required: true, message: '请输入密码', trigger: 'blur' } ],
    mobile: [ { required: true, message: '请输入邮箱', trigger: 'blur' } ],
    password: [ { required: true, message: '请输入手机', trigger: 'blur' } ],
    realName: [ { required: true, message: '请输入真实姓名', trigger: 'blur' } ]
  }

  const userFormVisible = ref(false)

  const userFormShow = () => {
    userFormVisible.value = true
    userModel.value = {}
  }

  const userFormHide = () => {
    userFormVisible.value = false
  }

  return {
    userModel,
    userFormRef,
    userFormSave,
    userFormValidateRules,
    userFormVisible,
    userFormShow,
    userFormHide,
    modelOnSaving
  }
}
