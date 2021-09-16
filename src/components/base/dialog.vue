
<template>
  <el-dialog title="菜单" v-model="showDialog" :before-close="cancel">
    <el-form :model="menuItem" @click="closeTree" :rules="rules">
      <el-form-item label="类型" label-width="20%">
        <div style="width:80%">
          <el-radio-group v-model="menuItem.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <!-- <el-radio :label="2">按钮</el-radio> -->
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item v-if="menuItem.type===0" label="目录名称" label-width="20%" prop="menuName">
        <div style="width:80%">
          <el-input v-model="menuItem.menuName" autocomplete="off"></el-input>
        </div>
      </el-form-item>

      <el-form-item v-if="menuItem.type===1" label="菜单名" label-width="20%" prop="menuName">
        <div style="width:80%">
          <el-input v-model="menuItem.menuName" autocomplete="off"></el-input>
        </div>
      </el-form-item>

      <el-form-item v-if="menuItem.type===2" label="按钮名称" label-width="20%" prop="menuName">
        <div style="width:80%">
          <el-input v-model="menuItem.buttonName" autocomplete="off"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="上级菜单" label-width="20%" @click.stop prop="superiorMenu">
        <div style="width:80%;position:relative;">
          <el-input
            v-model="menuItem.superiorMenu"
            autocomplete="off"
            @focus.prevent.stop="superiorMenuChange"
          ></el-input>
          <el-tree
            v-show="superiorMenuFocus"
            style="position:absolute;top:30;left:0;zIndex:100;background:#eee;padding:10px;minWidth:150px"
            :data="treeData"
            :props="{
              children: 'children',
              label: 'menuName'
            }"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </el-form-item>

      <el-form-item v-if="menuItem.type===1" label="菜单路由" label-width="20%" prop="superiorMenu">
        <div style="width:80%">
          <el-input v-model="menuItem.url" autocomplete="off"></el-input>
        </div>
      </el-form-item>

      <el-form-item v-if="menuItem.type===1 || menuItem.type===2" label="授权标识" label-width="20%">
        <div style="width:80%">
          <el-input v-model="menuItem.authorizationId" autocomplete="off"></el-input>
        </div>
      </el-form-item>

      <el-form-item v-if="menuItem.type===0 || menuItem.type===1" label="排序号" label-width="20%">
        <div style="width:80%">
          <el-input v-model="menuItem.sortOrder" autocomplete="off"></el-input>
        </div>
      </el-form-item>

      <el-form-item v-if="menuItem.type===0 || menuItem.type===1" label="菜单图标" label-width="20%">
        <div style="width:80%">
          <el-input v-model="menuItem.icon" autocomplete="off"></el-input>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, toRef, toRefs, watch, reactive, computed } from 'vue'
import { store } from '@/store/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllTree } from '@/apis/menu'
export default defineComponent({
  name: 'edit-dialog',
  emits: ['confirm','cancel'],
  props: {
    data: {
      type: Object,
      default: {}
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {

    const rules = {
      menuName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      superiorMenu: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
      url: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
    }

    let superiorMenuFocus = ref(false)
    let showDialog = ref(props.showDialog)

    const treeData = ref([])

    const menuItem = ref(JSON.parse(JSON.stringify(props.data)));

    const superiorMenuChange = () => {
      getAllTree().then(res => {
        if (res.result && res.result.length) {
          treeData.value = res.result
        }
      })
      superiorMenuFocus.value = true
    }
    const closeTree = () => {
      superiorMenuFocus.value = false
    }
    const handleNodeClick = data => {
      menuItem.value.superiorMenu = data.menuName
      menuItem.value.parentId = data.id
    }

    const cancel = () => {
      ctx.emit('cancel', menuItem.value)
    }

    const confirm = () => {
      ctx.emit('confirm', menuItem.value)
    }

    return reactive({
      rules,
      menuItem,
      treeData,
      superiorMenuFocus,
      showDialog,
      handleNodeClick,
      superiorMenuChange,
      closeTree,
      cancel,
      confirm
    })
  }
})
</script>

<style>
</style>
