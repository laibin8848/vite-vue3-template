import { ref } from 'vue'
import { saveSynonyms } from '@/apis/synonyms'
import { ElMessage } from 'element-plus'

export default function synonymsModelForm() {
  let optMode = 'add'
  const optionId = { value: '' }

  const synonymsFormRef = ref(null)
  const modelOnSaving = ref(false)

  const synonymsModel = ref({
    id: '',
    name: '',
    remark: '',
    optionId: ''
  })

  const setOptionId = (id) => {
    optionId.value = id
  }

  const synonymsFormSave = (cb) => {
    modelOnSaving.value = true
    synonymsFormRef.value && synonymsFormRef.value.validate().then(() => {
      saveSynonyms(synonymsModel.value).then((res) => {
        modelOnSaving.value = false
        if (res.code == 'E000') {
          ElMessage.success(`${optMode == 'edit' ? '编辑': '添加'}同义词操作成功！`)
          synonymsFormVisible.value = false
          cb && cb()
        } else {
          ElMessage.error(res.message)
        }
      })
    }).catch(() => {
      modelOnSaving.value = false
    })
  }

  const synonymsFormValidateRules = {
    name: [ { required: true, message: '请输入同义词名称', trigger: 'blur' } ]
  }

  const synonymsFormVisible = ref(false)

  const synonymsFormShow = (data = null) => {
    optMode = 'add'
    synonymsFormVisible.value = true
    synonymsModel.value = {}
    synonymsModel.value.optionId = optionId.value
    if(data.id) {
      optMode = 'edit'
      synonymsModel.value = JSON.parse(JSON.stringify(data))
    }
  }

  const synonymsFormHide = () => {
    synonymsFormVisible.value = false
  }

  return {
    synonymsModel,
    synonymsFormRef,
    synonymsFormSave,
    synonymsFormValidateRules,
    synonymsFormVisible,
    synonymsFormShow,
    synonymsFormHide,
    setOptionId,
    modelOnSaving
  }
}
