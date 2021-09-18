<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="24" align="left">
        <el-form :inline="true" class="search-form" label-width="90px" label-position="left">
          <el-form-item label="关键词名称:">
            <el-input clearable size="small" placeholder="请输入关键词名称" v-model="pageParams.extParams.name" />
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
      <el-table-column v-if="single" width="45" align="center">
        <template #default="scope">
          <i v-if="singleSelItem && scope.row.id == singleSelItem.id" style="font-size: 22px;color: #66b1ff;" class="el-icon-success" />
          <i v-else style="font-size: 22px;color: #66b1ff;" class="el-icon-circle-check" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="关键词名称" align="center"></el-table-column>
      <el-table-column prop="remark" label="近义词" align="center">
        <template #default="scope">
          <el-tag class="mr10 mb10 mouse-pointer" effect="dark" type='success' @click="synonymsFormShow(item)" @close="onTagDel(item.id)" closable v-for="item in scope.row.synonymsList" :key="'tag'+item.id">{{item.name}}</el-tag>
          <el-tag class="mr10 mb10 mouse-pointer" @click="onTagAdd(scope.row.id)" type="info">+ 新增</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="120px" v-if="!asSelector">
        <template #default="scope">
          <!-- <el-button v-if="!multiple && !single" type="text" @click="$router.push(`/keywords/synonyms/index?id=${scope.row.id}&name=${scope.row.name}`)">近义词</el-button> -->
          <el-button type="text" @click="optionFormShow(scope.row)">编辑</el-button>
          <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <yue-pagination :pageParams="pageParams" @current-change="onCurrentChange" @size-change="onSizeChange" />
    <el-dialog v-if="!asSelector" width="30%" title="关键词信息编辑" v-model="optionFormVisible">
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
    <el-dialog width="30%" title="近义词信息编辑" v-model="synonymsFormVisible">
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
          <el-button type="primary" @click="synonymsFormSave">保 存</el-button>
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
  import synonymsModelForm from '@/views/models/synonyms'
  import { deleteSynonyms } from '@/apis/synonyms'
  import { ElMessage, ElMessageBox } from 'element-plus'

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
      const synonymsManager = synonymsModelForm()

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

      const onTagDel = (id) => {
        ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          deleteSynonyms(id).then(res=> {
            if(res.code == 'E000') {
              ElMessage.success('删除成功！')
              hooks.fetchData()
            } else {
              ElMessage.error(res.message)
            }
          })
        })
      }

      const onTagAdd = (optionId) => {
        synonymsManager.setOptionId(optionId)
        synonymsManager.synonymsFormShow()
      }

      const synonymsFormSave = ()=> {
        synonymsManager.synonymsFormSave(hooks.fetchData)
      }

      return {
        ...hooks,
        ...optionManager,
        optionFormSave,
        onTagDel,
        onTagAdd,
        ...synonymsManager,
        synonymsFormSave
      }
    }
  })
</script>
