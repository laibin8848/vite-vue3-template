<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="8" align="left">
        <el-button type="primary" icon="el-icon-plus" size="small">新增</el-button>
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
      <el-table-column prop="realname" label="真实姓名" align="center"></el-table-column>
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
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import useListMethods from '@/hooks/useListMethods';
  import { getUserList, delUser } from '@/apis/users';

  export default defineComponent({
    name: 'user-list',
    setup() {
      return {
        ...useListMethods({
          listLoader: getUserList,
          delFun: delUser
        })
      }
    }
  })
</script>
