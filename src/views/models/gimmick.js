import { ref } from 'vue'
import { saveGimmick, getGimmick } from '@/apis/gimmick'
import { ElMessage } from 'element-plus'

export default function gimmickModelForm() {
  let optMode = 'add'
  const modelOnSaving = ref(false)

  const getGimmickFullTree = ref(null)

  const gimmickFormRef = ref(null)

  const gimmickModel = ref({
    id: '',
    content: '',
    parentId: '',
    instanceId: '',
    remark: '',
    type: ''//类型（1:问题,2:选项,3:商品）
  })

  const gimmickFormSave = (cb) => {
    modelOnSaving.value = true
    gimmickFormRef.value && gimmickFormRef.value.validate().then(() => {
      saveGimmick(gimmickModel.value).then((res) => {
        modelOnSaving.value = false
        if (res.code == 'E000') {
          ElMessage.success('操作成功！')
          gimmickFormVisible.value = false
          cb && cb()
        } else {
          ElMessage.error(res.message)
        }
      })
    }).catch(() => {
      modelOnSaving.value = false
    })
  }

  const gimmickFormValidateRules = {
    type: [ { required: true, message: '请选择类型', trigger: 'blur' } ],
    content: [{
      validator: (rule, value, callback) => {
        let trueValue = ''
        switch(gimmickModel.value.type) {
          case 1:
            trueValue = gimmickModel.value.content;
            break;
          default:
            trueValue = gimmickModel.value.instanceId;
            break;
        }
        if(!trueValue) {
          callback(new Error('请完善内容！'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }]
  }

  const gimmickFormVisible = ref(false)

  const gimmickFormShow = () => {
    optMode = 'add'
    gimmickFormVisible.value = true
    gimmickModel.value = {}
  }

  const gimmickTreeFormShow = (data = null) => {
    optMode = 'edit'
    gimmickFormVisible.value = true
    switch(data.ptype) {
      case 1:
        data.type = 2;
        break;
      default:
        data.type = 1;
        break;
    }
    gimmickModel.value = JSON.parse(JSON.stringify(data))
  }

  const gimmickFormHide = () => {
    gimmickFormVisible.value = false
  }

  const gimmickTreeVisible = ref(false)

  const showEditGimmickTree = (id) => {
    getGimmick(id).then(res=> {
      getGimmickFullTree.value = res.data || []
      gimmickTreeVisible.value = true
    })
  }

  const gimmickChangeInstanceId = (row) => {
    gimmickModel.value.instanceId = row.id
  }

  return {
    gimmickModel,
    gimmickFormRef,
    gimmickFormSave,
    gimmickFormValidateRules,
    gimmickFormVisible,
    gimmickFormShow,
    gimmickFormHide,
    showEditGimmickTree,
    gimmickTreeVisible,
    getGimmickFullTree,
    gimmickTreeFormShow,
    modelOnSaving,
    gimmickChangeInstanceId
  }
}
