<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="24" align="left">
        <el-form :inline="true" class="search-form" label-width="80px" label-position="left">
          <el-form-item label="选项名称:">
            <el-input clearable size="small" placeholder="请输入选项名称" v-model="pageParams.extParams.name" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="fetchData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="mb10" v-if="!asSelector">
      <el-col :span="24" align="right">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="optionFormShow">新增</el-button>
        <el-button v-if="multiple" icon="el-icon-remove" size="small" @click="onRowDelBatch">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table border v-loading="pageParams.loading" :data="pageDatas" :highlight-current-row="single" class="table" @current-change="handleSelectionChange" @selection-change="handleSelectionChange">
      <el-table-column v-if="multiple" type="selection" width="45" align="center"></el-table-column>
      <el-table-column prop="name" label="选项名称" align="center"></el-table-column>
      <el-table-column prop="remark" label="描述" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="140px" v-if="!asSelector">
        <template #default="scope">
          <el-button type="text" @click="$router.push(`/keywords/synonyms/index?id=${scope.row.id}&name=${scope.row.name}`)">同义词</el-button>
          <el-button type="text" @click="optionFormShow(scope.row)">编辑</el-button>
          <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <yue-pagination :pageParams="pageParams" @current-change="onCurrentChange" @size-change="onSizeChange" />
    <el-dialog v-if="!asSelector" width="30%" title="选项信息编辑" v-model="optionFormVisible">
      <el-form ref="optionFormRef" :status-icon="true" :rules="optionFormValidateRules" :model="optionModel" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="optionModel.name" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="optionModel.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="optionFormHide">取 消</el-button>
          <el-button :disabled="modelOnSaving" :loading="modelOnSaving" type="primary" @click="optionFormSave">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import useListMethods from '@/hooks/useListMethods'
  import { getOptionList, deleteOption, deleteOptionBatch } from '@/apis/option'
  import optionModelForm from '@/views/models/option'

  export default defineComponent({
    name: 'option',
    props: {
      asSelector: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      single: {
        type: Boolean,
        default: false
      }
    },
    setup() {
      const optionManager = optionModelForm()

      const hooks = useListMethods({
        listLoader: getOptionList,
        delFun: deleteOption,
        delBatchFun: deleteOptionBatch,
        extParams: {
          name: ''
        }
      })

      const optionFormSave = ()=> {
        optionManager.optionFormSave(hooks.fetchData)
      }

      return {
        ...hooks,
        ...optionManager,
        optionFormSave
      }
    }
  })
</script>
