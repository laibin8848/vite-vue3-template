<template>
  <dialog>dialog</dialog>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'yue-dialog',
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
