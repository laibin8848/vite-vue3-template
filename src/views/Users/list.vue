<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="24" align="left">
        <el-form :inline="true" class="search-form" label-width="60px" label-position="left">
          <el-form-item label="用户名:">
            <el-input clearable size="small" placeholder="请输入用户名" v-model="pageParams.extParams.username" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="fetchData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="mb10">
      <el-col :span="24" align="right">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="userFormShow">新增</el-button>
        <el-button icon="el-icon-remove" size="small" @click="onRowDelBatch">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table border v-loading="pageParams.loading" :data="pageDatas" class="table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45" align="center"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="mobile" label="手机" align="center"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80" align="center">
        <template #default="scope">
          {{['未知','男', '女'][scope.row.sex] || '未知'}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template #default="scope">
          {{['禁用','正常'][scope.row.status] || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="realName" label="真实姓名" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="100px">
        <template #default="scope">
          <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <yue-pagination :pageParams="pageParams" @current-change="onCurrentChange" @size-change="onSizeChange" />
    <el-dialog width="30%" title="用户信息编辑" v-model="userFormVisible">
      <el-form ref="userFormRef" :status-icon="true" :rules="userFormValidateRules" :model="userModel" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userModel.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userModel.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userModel.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userModel.mobile" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="userModel.realName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userFormHide">取 消</el-button>
          <el-button :disabled="modelOnSaving" :loading="modelOnSaving" type="primary" @click="userFormSave">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import useListMethods from '@/hooks/useListMethods'
  import { getUserList, deleteUser, deleteUserBatch } from '@/apis/users'
  import userModelForm from '@/views/models/user'

  export default defineComponent({
    name: 'user-list',
    setup() {
      const userManager = userModelForm()

      const hooks = useListMethods({
        listLoader: getUserList,
        delFun: deleteUser,
        delBatchFun: deleteUserBatch,
        extParams: {
          username: ''
        }
      })

      const userFormSave = ()=> {
        userManager.userFormSave(hooks.fetchData)
      }

      return {
        ...hooks,
        ...userManager,
        userFormSave
      }
    }
  })
</script>
