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
      :data="pageDatas"
      class="table"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
    >
      <el-table-column prop="menuName" label="名称" align="center"></el-table-column>
      <el-table-column prop="parentName" label="上级菜单" align="center"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template #default="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type_dictText" label="类型" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type_dictText">{{scope.row.type_dictText}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sortOrder" label="序号" align="center"></el-table-column>
      <el-table-column prop="url" label="URL" align="center"></el-table-column>
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

    <edit-dialog
      v-if="showDialog"
      :showDialog="showDialog"
      :data="data"
      @confirm="confirm"
      @cancel="cancel"
    ></edit-dialog>
  </div>
</template>
<script>
import { defineComponent, ref, computed, reactive, toRefs, watch } from 'vue'
import useListMethods from '@/hooks/useListMethods'
import { saveMenu, delMenu, getMenuList } from '@/apis/menu'
import { store } from '@/store/index'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'user-list',
  setup() {
    let showDialog = ref(false)

    const addOrEdit = (type, item) => {
      showDialog.value = true
      if (type === 'add') {
        state.data = {
          id: '',
          isDelete: '',
          createBy: '',
          type: 0,
          type_dictText: '',
          menuName: '',
          menuCode: '',
          buttonName: '',
          parentId: '',
          url: '',
          authorizationId: '',
          sortOrder: '',
          icon: 'el-icon-refresh',
          updateBy: ''
        }
      } else {
        state.data = item
      }
    }

    const confirm = data => {
      showDialog.value = false
      saveMenu(data)
        .then(e => {
          if (e.code == 200) {
            hooks.fetchData()
          } else {
            ElMessage.error(e.message)
          }
        })
        .catch(error => {
          ElMessage.error(error.message)
        })
    }

    const cancel = data => {
      showDialog.value = false
    }

    const hooks = useListMethods({
      listLoader: getMenuList,
      delFun: delMenu
    })

    const setMsg = item => {
      if (item && item.length) {
        for (let i = 0; i < item.length; i++) {
          if (item[i] && item[i].children && item[i].children.length) {
            item[i].delMsg = '此操作会同时删除下面的子目录，是否继续？'
            setMsg(item[i].children)
          }
        }
      }
    }

    const getItemParentName = item => {
      if (item && item.length) {
        let id = ''
        let name = ''
        for (let i = 0; i < item.length; i++) {
          if (item[i] && item[i].children && item[i].children.length) {
            id = item[i].id;
            name = item[i].menuName;

            for (let j = 0; j < item[i].children.length; j++) {
              if (item[i].children[j].parentId === id) {
                item[i].children[j].parentName = name;
              }
              getItemParentName(item[i].children);
            }
          }
        }
      }
    }

    watch(hooks.pageDatas, item => {
      // console.log(item)
      getItemParentName(item);
      setMsg(item)
    })

    const state = reactive({
      showDialog,
      data: {},
      getMenuList,
      addOrEdit,
      confirm,
      cancel,
      ...hooks
    })
    return toRefs(state)
  }
})
</script>
