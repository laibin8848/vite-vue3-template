<template>
  <div>
    <el-alert style="font-size: 16px;" :title="`当前正在维护选项 [${$route.query.name || '--'}] 下的同义词`" type="success" :closable="false" />
    <div class="global-tab-con">
      <el-row>
        <el-col :span="24" align="left">
          <el-form :inline="true" class="search-form" label-width="80px" label-position="left">
            <el-form-item label="同义词:">
              <el-input clearable size="small" placeholder="请输入选项名称" v-model="pageParams.extParams.name" />
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="fetchData">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="24" align="right">
          <el-button v-if="$route.query.id" type="primary" icon="el-icon-plus" size="small" @click="synonymsFormShow">新增</el-button>
          <el-button icon="el-icon-remove" size="small" @click="onRowDelBatch">批量删除</el-button>
        </el-col>
      </el-row>
      <el-table border v-loading="pageParams.loading" :data="pageDatas" class="table" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column prop="name" label="同义词名称" align="center"></el-table-column>
        <el-table-column prop="remark" label="描述" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="100px">
          <template #default="scope">
            <el-button type="text" @click="synonymsFormShow(scope.row)">编辑</el-button>
            <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <yue-pagination :pageParams="pageParams" @current-change="onCurrentChange" @size-change="onSizeChange" />
      <el-dialog width="30%" title="同义词信息编辑" v-model="synonymsFormVisible">
        <el-form ref="synonymsFormRef" :status-icon="true" :rules="synonymsFormValidateRules" :model="synonymsModel" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="synonymsModel.name" />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="synonymsModel.remark" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="synonymsFormHide">取 消</el-button>
            <el-button :disabled="modelOnSaving" :loading="modelOnSaving" type="primary" @click="synonymsFormSave">保 存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import useListMethods from '@/hooks/useListMethods'
  import { getSynonymsList, deleteSynonyms, deleteSynonymsBatch } from '@/apis/synonyms'
  import synonymsModelForm from '@/views/models/synonyms'
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: 'synonyms',
    setup() {
      const route = useRoute()
      const synonymsManager = synonymsModelForm()
      synonymsManager.setOptionId(route.query.id || '')

      const hooks = useListMethods({
        listLoader: getSynonymsList,
        delFun: deleteSynonyms,
        delBatchFun: deleteSynonymsBatch,
        extParams: {
          name: '',
          optionId: route.query.id || ''
        }
      })

      const synonymsFormSave = ()=> {
        synonymsManager.synonymsFormSave(hooks.fetchData)
      }

      return {
        ...hooks,
        ...synonymsManager,
        synonymsFormSave
      }
    }
  })
</script>
