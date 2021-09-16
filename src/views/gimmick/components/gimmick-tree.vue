<template>
  <div>
    <el-table :data="treeData" row-key="id" border :tree-props="{children: 'children'}" :indent="20" :show-header="false">
      <el-table-column prop="date" label="" :show-overflow-tooltip="true">
        <template #default="scope">
          <template v-if="scope.row.type == 1">
              <i class="el-icon-question" style="color: #999;font-size: 22px;" />
              {{scope.row.content}}
          </template>
          <template v-if="scope.row.type == 2">
            <el-tag effect="dark" type="success">
              <i class="el-icon-chat-line-round" />
              {{scope.row.content}}
            </el-tag>
            <span v-if="scope.row.instanceInfo && scope.row.instanceInfo.keywords"> 近义词：{{scope.row.instanceInfo.keywords}}</span>
          </template>
          <template v-if="scope.row.type == 3">
            <el-image :src="scope.row.instanceInfo.picture" :preview-src-list="[scope.row.instanceInfo.picture]" />
            {{scope.row.instanceInfo.name}}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200px">
        <template #default="scope">
          <div v-if="scope.row.type == 1">
            <el-button type="text" @click="gimmickTreeFormShow({parentId: scope.row.id, ptype: 1})">添加子项</el-button>
            <el-button type="text" @click="gimmickTreeFormShow(scope.row)">编辑</el-button>
            <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
          </div>
          <div v-else-if="scope.row.type == 2">
            <el-button v-if="!scope.row.children" type="text" @click="gimmickTreeFormShow({parentId: scope.row.id, ptype: 2})">添加子项</el-button>
            <el-button type="text" @click="gimmickTreeFormShow(scope.row)">编辑</el-button>
            <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
          </div>
          <div v-else-if="scope.row.type == 3">
            <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="30%" title="信息编辑" v-model="gimmickFormVisible">
      <el-form ref="gimmickFormRef" :status-icon="true" :rules="gimmickFormValidateRules" :model="gimmickModel" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="gimmickModel.type">
            <el-option v-show="[2].includes(gimmickModel.ptype)" :value="1" label="问题" />
            <el-option v-show="[1].includes(gimmickModel.ptype)" :value="2" label="选项" />
            <el-option v-show="[2].includes(gimmickModel.ptype)" :value="3" label="商品" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <template v-if="gimmickModel.type == 1">
            <el-input v-model="gimmickModel.content" />
          </template>
          <template v-if="gimmickModel.type == 2">
            <el-button type="primary" @click="showSelector('keywords')">
              请选择一个选项
            </el-button>
          </template>
          <template v-if="gimmickModel.type == 3">
            <el-button type="primary" @click="showSelector('products')">
              请选择一个商品
            </el-button>
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="gimmickFormHide">取 消</el-button>
          <el-button :disabled="modelOnSaving" :loading="modelOnSaving" type="primary" @click="gimmickFormSave">保 存</el-button>
        </span>
      </template>
    </el-dialog>
    <yue-item-selector width="70%" v-model="selectorVisable" @on-selected="gimmickChangeInstanceId" :mode="selectorMode" single />
  </div>
</template>
<script>
  import { defineComponent } from 'vue'
  import gimmickModelForm from '@/views/models/gimmick'
  import { deleteGimmick } from '@/apis/gimmick'
  import { ElMessageBox } from 'element-plus'
  import useSelector from '@/hooks/useSelector'

  export default defineComponent({
    name: 'gimmick-tree',
    props: {
      treeData: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    setup(props, { emit }) {
      const gimmickManager = gimmickModelForm()

      const emitRefresh = ()=> emit('force-refresh', props.treeData[0].id)

      const gimmickFormSave = () => {
        gimmickManager.gimmickFormSave(
          ()=> { emitRefresh() }
        )
      }

      const onRowDel = (id) => {
        ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            deleteGimmick(id).then(() => {
              ElMessageBox.alert('删除成功').then(()=> {
                emitRefresh()
              })
            })
        })
      }

      const selectorHooks = useSelector()

      return {
        ...gimmickManager,
        gimmickFormSave,
        onRowDel,
        ...selectorHooks
      }
    }
  })
</script>
