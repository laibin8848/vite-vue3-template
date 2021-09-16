<template>
  <div class="global-tab-con">
    <el-row class="mb10">
      <el-col :span="24" align="right">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="gimmickFormShow">创建问题集</el-button>
      </el-col>
    </el-row>
    <el-table border v-loading="pageParams.loading" :data="pageDatas" class="table">
      <el-table-column prop="content" label="内容" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" align="center">
        <template #default="scope">
          {{['','问题','选项','商品'][scope.row.type] || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="100px">
        <template #default="scope">
          <el-button type="text" @click="showEditGimmickTree(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <yue-pagination :pageParams="pageParams" @current-change="onCurrentChange" @size-change="onSizeChange" />
    <el-dialog width="30%" title="信息编辑" v-model="gimmickFormVisible">
      <el-form ref="gimmickFormRef" :status-icon="true" :rules="gimmickFormValidateRules" :model="gimmickModel" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="gimmickModel.type">
            <el-option :value="1" label="问题" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="gimmickModel.content" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="gimmickFormHide">取 消</el-button>
          <el-button :disabled="modelOnSaving" :loading="modelOnSaving" type="primary" @click="gimmickFormSave">保 存</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog width="50%" title="问题集编辑" v-model="gimmickTreeVisible">
      <gimmick-tree :treeData="getGimmickFullTree" @force-refresh="onTreeRefresh"/>
    </el-dialog>
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import useListMethods from '@/hooks/useListMethods'
  import { getGimmickList, deleteGimmick } from '@/apis/gimmick'
  import gimmickModelForm from '@/views/models/gimmick'
  import gimmickTree from './components/gimmick-tree.vue'

  export default defineComponent({
    name: 'gimmick',
    components: {
      [gimmickTree.name]: gimmickTree
    },
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
