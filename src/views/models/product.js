import { ref } from 'vue'
import { saveProduct } from '@/apis/product'
import { ElMessage } from 'element-plus'

export default function productModelForm() {
  let optMode = 'add'

  const productFormRef = ref(null)
  const modelOnSaving = ref(false)

  const productModel = ref({
    id: '',
    name: '',
    description: '',
    remark: '',
    picture: '',
    price: '',
    code: ''
  })

  const productFormSave = (cb) => {
    modelOnSaving.value = true
    productFormRef.value && productFormRef.value.validate().then(() => {
      saveProduct(productModel.value).then((res) => {
        modelOnSaving.value = false
        if (res.code == 'E000') {
          ElMessage.success(`${optMode == 'edit' ? '编辑': '添加'}商品操作成功！`)
          productFormVisible.value = false
          cb && cb()
        } else {
          ElMessage.error(res.message)
        }
      })
    }).catch(() => {
      modelOnSaving.value = false
    })
  }

  const productFormValidateRules = {
    name: [ { required: true, message: '请输入商品名称', trigger: 'blur' } ],
    description: [ { required: true, message: '请输入商品描述', trigger: 'blur' } ],
    picture: [ { required: true, message: '请上传商品图片', trigger: 'blur' } ],
    price: [ { type: 'number', message: '价格必须为数字值'} ]
  }

  const productFormVisible = ref(false)

  const productFormShow = (data = null) => {
    optMode = 'add'
    productFormVisible.value = true
    productModel.value = {}
    if(data.id) {
      optMode = 'edit'
      productModel.value = JSON.parse(JSON.stringify(data))
    }
  }

  const productFormHide = () => {
    productFormVisible.value = false
  }

  return {
    productModel,
    productFormRef,
    productFormSave,
    productFormValidateRules,
    productFormVisible,
    productFormShow,
    productFormHide,
    modelOnSaving
  }
}
