<template>
  <div>
    <gimmick-tree :treeId="$route.query.id" />
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import gimmickTree from './components/gimmick-tree.vue'

  export default defineComponent({
    name: 'gimmick-detail',
    components: {
      [gimmickTree.name]: gimmickTree
    },
    setup() {

      return {
      }
    }
  })
</script>
