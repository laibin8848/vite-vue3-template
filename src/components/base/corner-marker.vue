<template>
  <div class="corner-marker">{{sign}}</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { compile } from 'path-to-regexp'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'corner-marker',
  props:['sign'],
  setup(props, ctx) {
    const sign = ref(props.sign)
    return {
      sign
    }
  }
})
</script>
<style lang="scss" scoped>
.corner-marker {
  position: absolute;
  top: 0;
  left: 0;
  background: green;
  color: #fff;
  text-align: left;
  padding-left: 78px;
  width: 200px;
  height: 35px;
  line-height: 35px;
  transform: rotate(316deg);
  z-index: 100000;
  top: 1px;
  left: -72px;
  opacity: 0.7;
}
</style>
