<template>
  <el-pagination
      class="global-pagination"
    :current-page="pageParams.pageNo"
    :page-size="pageParams.pageSize"
    :layout="pageParams.layout"
    :page-sizes="pageParams.pageGroup"
    :total="pageParams.total"
    background />
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'yue-pagination',
  props: {
    pageParams: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  setup() {
    return {
    }
  }
})
</script>
