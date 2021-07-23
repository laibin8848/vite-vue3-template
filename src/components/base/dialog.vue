
<template>
  <el-dialog title="菜单" v-model="showDialog">
    <el-form :model="menuItem">
      <el-form-item label="菜单名" label-width="20%">
        <div style="width:80%">
          <el-input v-model="menuItem.menuName" autocomplete="off"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="ICON" label-width="20%">
        <div style="width:80%">
          <el-input v-model="menuItem.icon" autocomplete="off"></el-input>
        </div>
      </el-form-item>
      <el-form-item v-if="!menuItem.isFolder"
        label="URL"
        label-width="20%"
      >
        <div style="width:80%">
          <el-input v-model="menuItem.url" autocomplete="off"></el-input>
        </div>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="是否为菜单" label-width="50%">
              <div style="width:80%;textAlign:left">
                <el-switch
                  v-model="menuItem.isFolder"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </div>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-form-item label="是否显示" label-width="50%">
              <div style="width:80%;textAlign:left">
                <el-switch
                  v-model="menuItem.isDisplay"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="50" style="marginLeft:0" v-if="menuItem.isFolder">
      <el-col :span="50">
        <div class="grid-content bg-purple">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addSubmenu()">新增子菜单</el-button>
        </div>
        <el-table :data="menuItem.children" style="width: 100%">
          <el-table-column prop="menuName" label="Menu Name" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.menuName" autocomplete="off"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="URL">
            <template #default="scope">
              <el-input v-model="scope.row.url" autocomplete="off"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="icon" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.icon" autocomplete="off"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Display" width="80">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isDisplay"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template #default="scope">
              <el-button type="text" @click="delsubMenu(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="hide('cancel')">取 消</el-button>
        <el-button type="primary" @click="hide('confirm')">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, toRef, toRefs, watch, reactive, computed } from 'vue'
import { store } from '@/store/index'
import { ElMessage, ElMessageBox } from 'element-plus'
export default defineComponent({
  name: 'edit-dialog',
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  setup(props, ctx) {
    const menuItem = computed(() => props.data)

    const hide = flag => {
      ctx.emit('hide', flag, props.data)
    }

    const addSubmenu = () => {
      props.data.children.push({type:1,parentId:''});
    }
    const delsubMenu = row => {
      ElMessageBox.confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = props.data.children.length - 1; i >= 0; i--) {
          if (props.data.children[i].id === row.id) {
            props.data.children.splice(i, 1);
            return
          }
        }
      })
    }
    return reactive({
      menuItem,
      showDialog: computed(() => store.state.permissionModule.showDialog),
      hide,
      addSubmenu,
      delsubMenu
    })
  }
})
</script>

<style>
</style>
