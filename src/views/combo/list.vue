<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="8" align="left">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addUser()">新增</el-button>
        <el-button type="success" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
      </el-col>
    </el-row>
    <br />
    <el-table border v-loading="pageParams.loading" :data="pageDatas" class="table">
      <el-table-column prop="username" label="用户名" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
      <el-table-column prop="mobile" label="手机" align="center"></el-table-column>
      <el-table-column prop="sex_dictText" label="性别" align="center"></el-table-column>
      <el-table-column prop="status_dictText" label="状态" align="center"></el-table-column>
      <el-table-column prop="realName" label="真实姓名" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <template #default="scope">
          <el-button type="text" @click="onRowEdit(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
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
      >
      </el-pagination>
    </div>

    <el-dialog title="添加用户" v-model="formVisible">
      <el-form :model="configForm">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="configForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="configForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="configForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="120px">
          <el-input v-model="configForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" label-width="120px">
          <el-input v-model="configForm.realName" autocomplete="off"></el-input>
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
import { defineComponent, reactive, ref } from 'vue'
import useListMethods from '@/hooks/useListMethods'
import { getUserList, deleteUser, getUserDetail, saveUser } from '@/apis/users'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'user-list',
  setup() {
    const formVisible = ref(false)
    const configForm = ref({
      username: '',
      email: '',
      mobile: '',
      password: '',
      realName: ''
    })
    const hooks = useListMethods({
      listLoader: getUserList,
      delFun: deleteUser
    })

    const addUser = () => {
      formVisible.value = true
      configForm.value = {}
    }

    const onFormCommit = () => {
      saveUser(configForm.value).then((res) => {
        if (res.code == 'E000') {
          ElMessage.success('添加用户操作成功！')
          formVisible.value = false
          hooks.fetchData()
        } else {
          ElMessage.error(res.message)
        }
      })
    }

    const onRowEdit = (id) => {
      formVisible.value = true
      configForm.value = {}
      getUserDetail(id)
        .then((result) => {
          configForm.value.username = result.result.username
          configForm.value.email = result.result.email
          configForm.value.mobile = result.result.mobile
          // configForm.value.password = result.result.password
          configForm.value.realName = result.result.realName
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    return {
      ...hooks,
      formVisible,
      configForm,
      onFormCommit,
      onRowEdit,
      addUser
    }
  }
})
</script>
