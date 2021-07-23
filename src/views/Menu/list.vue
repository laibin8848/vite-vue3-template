<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="8" align="left">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addOrEdit('add')">新增</el-button>
        <el-button type="success" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
      </el-col>
    </el-row>
    <br />
    <el-table
      v-loading="pageParams.loading"
      :data="dataList"
      class="table"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="menuName" label="菜单名" align="center"></el-table-column>
      <el-table-column prop="isDisplay" label="是否显示" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isDisplay"
            disabled
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="text" @click="addOrEdit('edit',scope.row)">编辑</el-button>
          <el-button type="text" @click="onRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="global-pagination">
      <el-pagination
        :current-page="pageParams.page"
        :page-size="pageParams.limit"
        :layout="pageParams.layout"
        :page-sizes="pageParams.pageSize"
        :total="pageParams.total"
        background
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      ></el-pagination>
    </div>

    <edit-dialog v-if="showDialog" :showDialog="showDialog" @hide="hide" :data="data"></edit-dialog>
  </div>
</template>
<script>
import { defineComponent, ref, computed, reactive, toRefs } from 'vue'
import useListMethods from '@/hooks/useListMethods'
import { saveMenu, delMenu, getMenuList } from '@/apis/menu'
import { dialog } from '@/components/base'
import { store } from '@/store/index'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'user-list',
  components: {
    [dialog.name]: dialog
  },
  setup() {
    const addOrEdit = (type, item) => {
      store.commit('permissionModule/setShowDialog', true)
      if (type === 'add') {
        state.data = { id: '', menuName: '', isDisplay: false, submenu: [{ id: '', menuName: '' }] }
      } else {
        item.isFolder = item.type === 0
        state.data = item
      }
    }

    const hide = (type, data) => {
      store.commit('permissionModule/setShowDialog', false)
      if (type === 'confirm') {
        const oldData = store.state.permissionModule.menuList
        if (data) {
          saveMenu([{...data}]).then(res => {
            if (res.status === 200) {
              if (data.children && data.children.length) {
                saveMenu(data.children).then(res => {
                  if (res.status === 200) {
                    ElMessage({
                      type: 'success',
                      message: '保存成功'
                    })
                  }
                })
              } else {
                ElMessage({
                  type: 'success',
                  message: '保存成功'
                })
              }
            }
          })
          // if(!data.id){
          //   let id = store.state.permissionModule.menuList.length+1;
          //   data.id = id;
          //   oldData.push(data);
          // }
          // for(let i = 0; i < oldData.length; i++){
          //   if(oldData[i].id==data.id){
          //     oldData[i] = data;
          //     break;
          //   }
          // }
          store.commit('permissionModule/setMenuList', oldData)
        }
      }
    }

    const state = reactive({
      showDialog: computed(() => store.state.permissionModule.showDialog),
      data: {},
      ...useListMethods({
        listLoader: getMenuList,
        delFun: delMenu
      }),
      dataList: computed(() => store.state.permissionModule.menuList),
      addOrEdit,
      hide
    })
    return toRefs(state)
  }
})
</script>

<style lang="scss">
// .el-table__row--level-1{
//   background:#eee!important;
// }
</style>