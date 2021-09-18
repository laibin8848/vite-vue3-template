<template>
  <div class="global-tab-con">
    <el-row class="mb10">
      <el-col :span="24" align="right">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="gimmickFormShow">创建问题集</el-button>
      </el-col>
    </el-row>
    <el-table border v-loading="pageParams.loading" :data="pageDatas" class="table">
      <el-table-column prop="name" label="名称" align="center">
        <template #default="scope">
          {{scope.row.name || '-'}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="content" label="内容" align="center"></el-table-column> -->
      <el-table-column prop="remark" label="备注" align="center">
        <template #default="scope">
          {{scope.row.remark || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="180px">
        <template #default="scope">
          <el-button type="text" @click="gimmickTreeFormShow(scope.row)">修改名称</el-button>
          <el-button type="text" @click="$router.push(`/gimmick/detail?id=${scope.row.id}`)">管理树</el-button>
          <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <yue-pagination :pageParams="pageParams" @current-change="onCurrentChange" @size-change="onSizeChange" />
    <el-dialog width="30%" title="信息编辑" v-model="gimmickFormVisible">
      <el-form ref="gimmickFormRef" :status-icon="true" :rules="gimmickFormValidateRules" :model="gimmickModel" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="gimmickModel.name" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" rows="4" v-model="gimmickModel.content" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="gimmickFormHide">取 消</el-button>
          <el-button :disabled="modelOnSaving" :loading="modelOnSaving" type="primary" @click="gimmickFormSave">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import useListMethods from '@/hooks/useListMethods'
  import { getGimmickList, deleteGimmick } from '@/apis/gimmick'
  import gimmickModelForm from '@/views/models/gimmick'

  export default defineComponent({
    name: 'gimmick',
    setup() {
      const gimmickManager = gimmickModelForm()

      const hooks = useListMethods({
        listLoader: getGimmickList,
        delFun: deleteGimmick
      })

      const gimmickFormSave = ()=> {
        gimmickManager.gimmickFormSave(hooks.fetchData)
      }

      const onTreeRefresh = (id) => {
        gimmickManager.showEditGimmickTree(id)
      }

      return {
        ...hooks,
        ...gimmickManager,
        gimmickFormSave,
        onTreeRefresh
      }
    }
  })
</script>
