<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="8" align="left">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="formVisible = true">新增</el-button>
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
            <el-button type="text">编辑</el-button>
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
        @size-change="onSizeChange">
      </el-pagination>
    </div>

    <el-dialog title="添加用户" v-model="formVisible">
      <el-form :model="configForm">
        <el-form-item label="角色名" label-width="120px">
          <el-input v-model="configForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" label-width="120px">
          <el-input v-model="configForm.roleCode" autocomplete="off"></el-input>
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
  import { defineComponent, ref, reactive } from 'vue';
  import useListMethods from '@/hooks/useListMethods';
  import { getRoleList, delRole, addRole } from '@/apis/role';
  import { ElMessage } from 'element-plus';

  export default defineComponent({
    name: 'role-list',
    setup() {
      const formVisible = ref(false)
      const configForm = reactive({
        roleName: '',
        roleCode: ''
      })
      const hooks = useListMethods({
        listLoader: getRoleList,
        delFun: delRole
      })

      const onFormCommit = () => {
        addRole(configForm).then(res=> {
          if(res.code == 200) {
            ElMessage.success('添加用户操作成功！')
            formVisible.value = false
            hooks.fetchData()
          }
        })
      }
      return {
        ...hooks,
        onFormCommit,
        formVisible,
        configForm
      }
    }
  })
</script>
