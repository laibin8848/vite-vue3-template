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
    name: '',
    content: '',
    parentId: '',
    instanceId: '',
    remark: '',
    type: ''//类型（1:问题,2:关键词,3:商品）
  })

  const gimmickFormSave = async (cb) => {
    let valide = true
    if(gimmickFormRef.value) {
      valide = await gimmickFormRef.value.validate()
    }
    if(valide) {
      modelOnSaving.value = true
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
    }
  }

  const gimmickFormValidateRules = {
    name: [
      {
        validator: (rule, value, callback) => {
          if(!gimmickModel.value.parentId) {
            if(!value) {
              callback(new Error('请输入问题名称'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
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
    gimmickModel.value = {
      type: 1
    }
  }

  const gimmickTreeFormShow = (data = null, selectDialog = true) => {
    optMode = 'edit'
    gimmickFormVisible.value = selectDialog
    if(data.ptype) {
      switch(data.ptype) {
        case 1:
          data.type = 2;
          break;
        default:
          data.type = 1;
          break;
      }
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
    gimmickModel.value.instanceName = row.name
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
