<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="8" align="left">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="add">新增</el-button>
        <el-button type="success" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
      </el-col>
    </el-row>
    <br />
    <el-table border v-loading="pageParams.loading" :data="pageDatas" class="table">
      <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
      <el-table-column prop="roleCode" label="角色标识" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
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

    <el-dialog title="添加用户" v-model="formVisible">
      <el-form :model="configForm">
        <el-form-item label="角色名" label-width="120px">
          <el-input v-model="configForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" label-width="120px">
          <el-input v-model="configForm.roleCode" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="授权" label-width="120px">
          <el-tree
            :data="treeData.menuList"
            show-checkbox
            default-expand-all
            node-key="id"
            :ref="(el)=>{tree = el}"
            highlight-current
            :props="{
            children: 'children',
            label: 'menuName'
          }"
          ></el-tree>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" @click="onFormCommit">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, ref, reactive } from 'vue'
import useListMethods from '@/hooks/useListMethods'
import { getRoleList, delRole, addRole } from '@/apis/role'
import { getMenuList } from '@/apis/menu'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'role-list',
  setup() {
    const tree = ref(null)
    const formVisible = ref(false)
    const configForm = reactive({
      roleName: '',
      roleCode: '',
      menuIds: []
    })

    const treeData = reactive({
      menuList: []
    })

    const hooks = useListMethods({
      listLoader: getRoleList,
      delFun: delRole
    })

    getMenuList().then(res => {
      if (res.result && res.result.length) {
        treeData.menuList = res.result
      }
    })

    const onFormCommit = () => {
      configForm.menuIds = tree.value.getCheckedKeys()
      // console.log(configForm.menuIds)
      // return;
      addRole(configForm).then(res => {
        if (res.code == 200) {
          ElMessage.success('添加用户操作成功！')
          formVisible.value = false
          hooks.fetchData()
        }
      })
    }
    const add = () => {
      formVisible.value = true
      configForm.roleName = ''
      configForm.roleCode = ''
      configForm.menuIds = []
      tree.value && tree.value.setCheckedKeys(configForm.menuIds)
    }
    const onEdit = item => {
      formVisible.value = true
      console.log({ ...item })
      configForm.id = item.id
      configForm.roleName = item.roleName
      configForm.roleCode = item.roleCode
      configForm.menuIds = item.menuIds
      // configForm.menuIds = ['1419565724695384065']
      setTimeout(() => {
        tree.value && tree.value.setCheckedKeys(configForm.menuIds)
      }, 20)
    }

    return {
      tree,
      ...hooks,
      onFormCommit,
      formVisible,
      configForm,
      treeData,
      onEdit,
      add
    }
  }
})
</script>
