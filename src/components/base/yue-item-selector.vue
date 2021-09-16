<template>
    <el-dialog>
      <template v-if="mode == 'keywords'">
        <keywords ref="selectorRef" as-selector :multiple="multiple" :single="single" />
      </template>
      <template v-else-if="mode == 'products'">
        <products ref="selectorRef" as-selector :multiple="multiple" :single="single" />
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeMe">取 消</el-button>
          <el-button type="primary" @click="onConfirm">选 择</el-button>
        </span>
      </template>
    </el-dialog>
</template>
<script>
  import { defineComponent, ref } from 'vue'
  import keywords from '@/views/keywords/index.vue'
  import products from '@/views/products/index.vue'
  import { ElMessage } from 'element-plus'

  export default defineComponent({
    name: 'yue-item-selector',
    components: {
      'keywords': keywords,
      'products': products
    },
    props: {
      mode: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      single: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      const closeMe = () => {
        emit('update:modelValue', false)
      }
      const selectorRef = ref(null)

      const onConfirm = () => {
        if(!selectorRef.value || !selectorRef.value.pageParams.selRows.id) {
          ElMessage.error('请选择数据！')
        } else {
          emit('on-selected', selectorRef.value.pageParams.selRows)
          closeMe()
        }
      }
      return {
        closeMe,
        onConfirm,
        selectorRef
      }
    }
  })
</script>
