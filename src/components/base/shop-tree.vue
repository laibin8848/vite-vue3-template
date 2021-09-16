<template>
  <div style="display: flex">
    <div style="margin-right: 4px">
      <el-select @change="enterpriseChange(false)" placeholder="请选择商家" v-model="enterpriseSel" filterable>
        <el-option v-for="item in enterpriseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div v-if="showShop">
      <el-select v-if="shopList.length" placeholder="请选择店铺" v-model="shopSel" filterable>
        <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { getShopTree } from '@/apis/business'

export default defineComponent({
  name: 'shop-tree',
  props: {
    enterprise: {
      type: String,
      default: ''
    },
    shop: {
      type: String,
      default: ''
    },
    showShop: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    const enterpriseList = ref([])
    const shopList = ref([])

    const enterpriseSel = ref(props.enterprise)
    const shopSel = ref(props.shop)

    const enterpriseChange = (init = false) => {
      if (!init) {
        shopSel.value = ''
        context.emit('update:enterprise', enterpriseSel.value)
        context.emit('update:shop', shopSel.value)
      }
      props.showShop &&
        enterpriseList.value.find((item) => {
          if (item.id == enterpriseSel.value) {
            shopList.value = item.children
            return true
          }
        })
    }

    getShopTree({}).then((res) => {
      if (res.code == 'E000') {
        enterpriseList.value = res.result
        enterpriseChange(true)
      }
    })

    watch(shopSel, () => {
      context.emit('update:shop', shopSel.value)
    })

    watch(props, () => {
      if (props.enterprise == '') {
        enterpriseSel.value = ''
        context.emit('update:enterprise', '')
      }
    })

    return {
      enterpriseChange,
      enterpriseList,
      enterpriseSel,
      shopList,
      shopSel
    }
  }
})
</script>
