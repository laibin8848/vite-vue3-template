<template>
  <div>
    <el-table default-expand-all :data="treeDataGet" row-key="id" border :tree-props="{children: 'children'}" :indent="20" :show-header="false">
      <el-table-column prop="date" label="" :show-overflow-tooltip="true">
        <template #default="scope">
          <template v-if="scope.row.type == 1">
              <i class="el-icon-question" style="color: #999;font-size: 22px;" />
              {{scope.row.content}}
          </template>
          <template v-if="scope.row.type == 2">
            <el-tag effect="dark" type="success">
              <i class="el-icon-chat-line-round" />
              {{scope.row.instanceInfo ? scope.row.instanceInfo.name : '-'}}
            </el-tag>
            <span v-if="scope.row.instanceInfo && scope.row.instanceInfo.keywords.length > 0"> 近义词：{{scope.row.instanceInfo.keywords}}</span>
          </template>
          <template v-if="scope.row.type == 3">
            <el-image style="width: 100px;" :src="picServer + scope.row.instanceInfo.picture" :preview-src-list="[picServer + scope.row.instanceInfo.picture]" />
            <i class="tree_goods_info" v-if="scope.row.instanceInfo">
               产品名称：{{scope.row.instanceInfo.name || '-'}}<br />
               产品价格：{{scope.row.instanceInfo.price || '-'}}<br />
            </i>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="120px">
        <template #default="scope">
          <div v-if="scope.row.type == 1">
            <el-button type="text" @click="gimmickTreeFormShow({parentId: scope.row.id, ptype: 1})"><i title="添加子项" class="tree_icon el-icon-circle-plus-outline"></i></el-button>
            <el-button v-if="scope.row.parentId" type="text" @click="gimmickTreeFormShow(scope.row)"><i title="编辑" class="tree_icon el-icon-edit"></i></el-button>
            <el-button v-if="scope.row.parentId" type="text" @click="onRowDel(scope.row.id)"><i title="删除" class="tree_icon el-icon-delete"></i></el-button>
          </div>
          <div v-else-if="scope.row.type == 2">
            <el-button v-if="!scope.row.children" type="text" @click="gimmickTreeFormShow({parentId: scope.row.id, ptype: 2})"><i title="添加子项" class="tree_icon el-icon-circle-plus-outline"></i></el-button>
            <el-button type="text" @click="gimmickTreeFormShow(scope.row)"><i title="编辑" class="tree_icon el-icon-edit"></i></el-button>
            <el-button type="text" @click="onRowDel(scope.row.id)"><i title="删除" class="tree_icon el-icon-delete"></i></el-button>
          </div>
          <div v-else-if="scope.row.type == 3">
            <el-button type="text" @click="onRowDel(scope.row.id)"><i title="删除" class="tree_icon el-icon-delete"></i></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="30%" title="信息编辑" v-model="gimmickFormVisible">
      <el-form ref="gimmickFormRef" :status-icon="true" :rules="gimmickFormValidateRules" :model="gimmickModel" label-width="80px">
        <el-form-item label="类型" prop="type" v-if="gimmickModel.ptype == 2">
          <el-select v-model="gimmickModel.type">
            <el-option v-show="[2].includes(gimmickModel.ptype)" :value="1" label="问题" />
            <el-option v-show="[1].includes(gimmickModel.ptype)" :value="2" label="关键词" />
            <el-option v-show="[2].includes(gimmickModel.ptype)" :value="3" label="商品" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="名称" prop="name" v-if="gimmickModel.parentId == ''">
          <el-input v-model="gimmickModel.name" />
        </el-form-item> -->
        <el-form-item label="内容" prop="content">
          <template v-if="gimmickModel.type == 1">
            <el-input type="textarea" rows="4" v-model="gimmickModel.content" />
          </template>
          <template v-if="gimmickModel.type == 2">
            <el-button type="primary" @click="showSelector('keywords')">
              请选择一个关键词
            </el-button>
            <span v-if="gimmickModel.instanceName">当前选择：{{gimmickModel.instanceName}}</span>
          </template>
          <template v-if="gimmickModel.type == 3">
            <el-button type="primary" @click="showSelector('products')">
              请选择一个商品
            </el-button>
            <span v-if="gimmickModel.instanceName">当前选择：{{gimmickModel.instanceName}}</span>
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
    <yue-item-selector width="60%" v-model="selectorVisable" @on-selected="onSlected" :mode="selectorMode" single />
  </div>
</template>
<script>
  import { computed, defineComponent } from 'vue'
  import gimmickModelForm from '@/views/models/gimmick'
  import { deleteGimmick } from '@/apis/gimmick'
  import { ElMessageBox } from 'element-plus'
  import useSelector from '@/hooks/useSelector'
  import { picServer } from '@/config'

  export default defineComponent({
    name: 'gimmick-tree',
    props: {
      treeData: {
        type: Array,
        default: function() {
          return []
        }
      },
      treeId: {
        type: String,
        default: ''
      }
    },
    setup(props, { emit }) {
      const gimmickManager = gimmickModelForm()

      const treeDataGet = computed(()=> {
        if(props.treeId) {
          return gimmickManager.getGimmickFullTree.value
        } else {
          return props.treeData
        }
      })

      if(props.treeId) {
        gimmickManager.showEditGimmickTree(props.treeId)
      }

      const emitRefresh = ()=> {
        if(props.treeId) {
          gimmickManager.showEditGimmickTree(props.treeId)
        } else {
          emit('force-refresh', treeDataGet.value[0].id)
        }
      }

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

      const gimmickTreeFormShow = (data) => {
        if(data.ptype == 1 || data.type == 2) {
          gimmickManager.gimmickTreeFormShow(data, false)
          selectorHooks.showSelector('keywords')
        } else {
          gimmickManager.gimmickTreeFormShow(data)
        }
      }

      const onSlected = (row) => {
        gimmickManager.gimmickChangeInstanceId(row)
        gimmickFormSave()
      }

      return {
        ...gimmickManager,
        gimmickFormSave,
        onRowDel,
        ...selectorHooks,
        picServer,
        treeDataGet,
        gimmickTreeFormShow,
        onSlected
      }
    }
  })
</script>
