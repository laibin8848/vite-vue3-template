<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="24" align="left">
        <el-form :inline="true" class="search-form" label-width="80px" label-position="left" :model="searchForm">
          <el-form-item label="字典名称:">
            <el-input size="small" placeholder="请输入字典名称" suffix-icon="el-icon-search" v-model="searchForm.dictName"></el-input>
          </el-form-item>
          <el-form-item label="字典编号:" style="margin-left: 20px">
            <el-input size="small" placeholder="请输入字典编号" suffix-icon="el-icon-search" v-model="searchForm.dictCode"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
            <el-button size="small" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" align="left">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addDic">新增</el-button>
        <el-button type="success" icon="el-icon-refresh" size="small" @click="searchDictionary({})">刷新</el-button>
      </el-col>
    </el-row>
    <br />
    <el-table border :data="dicList" class="table">
      <el-table-column prop="dictName" label="字典名称" align="center"></el-table-column>
      <el-table-column prop="dictCode" label="字典编码" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="text" @click="editDicFun(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="deleteDicFun(scope.row.id)">删除</el-button>
          <el-button type="text" @click="editDic(scope.row.id)">字典配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="global-pagination">
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
    </div> -->
    <el-drawer title="字典列表" v-model="dialogWord" direction="rtl" size="70%"
      ><div class="demo-drawer__content">
        <div class="global-tab-con">
          <el-row>
            <el-col :span="24" align="left">
              <el-form :inline="true" class="search-form" label-width="60px" label-position="left" :model="searchForm">
                <el-form-item label="名称:">
                  <el-input size="small" placeholder="请输入字典选项名称" suffix-icon="el-icon-search" v-model="searchForm.dictName"></el-input>
                </el-form-item>
                <el-form-item label="数据值:" style="margin-left: 20px;">
                  <el-input size="small" placeholder="请输入字典选项数据值" suffix-icon="el-icon-search" v-model="searchForm.dictCode"></el-input>
                </el-form-item>
                <el-form-item style="margin-left: 20px;">
                  <el-button size="small" type="primary" @click="onSubmitItem">查询</el-button>
                  <el-button size="small" @click="onResetItem">重置</el-button>
                </el-form-item>
              </el-form></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="12" align="left">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addDicItem()">新增</el-button>
              <el-button type="success" icon="el-icon-refresh" size="small" @click="searchDictionaryItem({ dictId: dictId.value })">刷新</el-button>
            </el-col>
          </el-row>
          <br />
          <el-table :data="dicItemList" style="width: 100%" height="400">
            <el-table-column label="名称">
              <template #default="scope">
                <span>{{ scope.row.itemName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数据值">
              <template #default="scope">
                <span>{{ scope.row.itemValue }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="mini" @click="editDicItemFun(scope.row.id)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteDicItemFun(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="字典" v-model="AddVisible">
      <el-form :model="dicForm">
        <el-form-item label="字典名称" label-width="120px">
          <el-input v-model="dicForm.dictName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典编码" label-width="120px">
          <el-input v-model="dicForm.dictCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input v-model="dicForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="AddVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDicFun()">保 存</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="字典选项" v-model="AddItemVisible">
      <el-form :model="dicItemForm">
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="dicItemForm.itemName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据值" label-width="120px">
          <el-input v-model="dicItemForm.itemValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <el-input v-model="dicItemForm.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序值" label-width="120px" class="sort">
          <el-input v-model="dicItemForm.sortOrder" style="width: 100px"></el-input>
          <span style="margin-left: 10px">值越小越靠前</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="AddItemVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDicItemFun()">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { computed, defineComponent, ref } from 'vue'
import useListMethods from '@/hooks/useListMethods'
import { ElMessage, ElMessageBox } from 'element-plus'
import RightDrawer from '../../layout/components/RightSetting/RightDrawer.vue'
import { deleteDic, getDicDetail, searchDic, saveDic, deleteDicItem, getDicItemDetail, searchDicItem, saveDicItem } from '@/apis/dictionary.js'

export default defineComponent({
  name: 'user-list',
  components: {
    RightDrawer
  },
  setup() {
    const dicList = ref([])
    const wordValue = ref('')
    const dictId = ref('')
    const dicItemList = ref([])
    const AddVisible = ref(false)
    const AddItemVisible = ref(false)
    const dialogWord = ref(false)

    const searchForm = ref({
      dictName: '',
      dictCode: ''
    })

    const searchFormItem = ref({
      itemName: '',
      itemValue: '',
      dictId: ''
    })

    const dicForm = ref({
      id: '',
      dictName: '',
      dictCode: '',
      description: ''
    })

    const dicItemForm = ref({
      dictId: '',
      id: '',
      itemName: '',
      itemValue: '',
      description: '',
      sortOrder: ''
    })

    // // const pageParams = ref({
    // //   page: 1,
    // //   limit: 10,
    // //   total: 0,
    // //   pageSize: [5, 10, 20],
    // //   layout: 'sizes,prev,pager,next,total',
    // //   loading: false
    // // })

    const searchDictionary = (data) => {
      searchDic(data)
        .then((e) => {
          if (e.code == 200) {
            dicList.value = e.result
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }
    searchDictionary({})

    const searchDictionaryItem = (data) => {
      searchDicItem(data)
        .then((e) => {
          if (e.code == 200) {
            dicItemList.value = e.result
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const editDic = (id) => {
      dialogWord.value = true
      dictId.value = id
      searchDicItem({ dictId: dictId.value })
        .then((e) => {
          if (e.code == 200) {
            dicItemList.value = e.result
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const addDic = () => {
      AddVisible.value = true
      dicForm.value = {}
    }

    const addDicItem = () => {
      AddItemVisible.value = true
      dicItemForm.value = {}
    }

    const saveDicFun = () => {
      AddVisible.value = false
      saveDic(dicForm.value)
        .then((result) => {
          if (result.code == 200) {
            searchDictionary({})
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const saveDicItemFun = () => {
      AddItemVisible.value = false
      dicItemForm.value.dictId = dictId
      saveDicItem(dicItemForm.value)
        .then((result) => {
          if (result.code == 200) {
            searchDictionaryItem({ dictId: dictId.value })
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const deleteDicFun = (id) => {
      ElMessageBox.confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDic(id)
            .then((result) => {
              if (result.code == 200) {
                ElMessage.success({
                  message: '删除成功',
                  type: 'success'
                })
                searchDictionary({})
              }
            })
            .catch((error) => {
              ElMessage.error(error.message)
            })
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const deleteDicItemFun = (id) => {
      ElMessageBox.confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDicItem(id)
            .then((result) => {
              if (result.code == 200) {
                ElMessage.success({
                  message: '删除成功',
                  type: 'success'
                })
                searchDictionaryItem({ dictId: dictId.value })
              }
            })
            .catch((error) => {
              ElMessage.error(error.message)
            })
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const editDicFun = (id) => {
      AddVisible.value = true
      dicForm.value = {}
      getDicDetail(id)
        .then((result) => {
          dicForm.value.dictName = result.result.dictName
          dicForm.value.id = result.result.id
          dicForm.value.dictCode = result.result.dictCode
          dicForm.value.description = result.result.description
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const onSubmit = () => {
      searchDictionary(searchForm.value)
    }

    const onReset = () => {
      searchForm.value = {
        dictName: '',
        dictCode: ''
      }
      searchDictionary({})
    }

    const onSubmitItem = () => {
      searchForm.value.dictId = dictId.value
      searchDictionaryItem(searchForm.value)
    }

    const onResetItem = () => {
      searchForm.value = {
        itemName: '',
        itemValue: '',
        dictId: ''
      }
      searchDictionaryItem({ dictId: dictId.value })
    }

    const editDicItemFun = (id) => {
      AddItemVisible.value = true
      dicItemForm.value = {}
      getDicItemDetail(id)
        .then((result) => {
          dicItemForm.value.itemName = result.result.itemName
          dicItemForm.value.id = result.result.id
          dicItemForm.value.itemValue = result.result.itemValue
          dicItemForm.value.description = result.result.description
          dicItemForm.value.sortOrder = result.result.sortOrder
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    // const hosss = useListMethods({
    //     listLoader: getUserList,
    //     delFun: delUser
    //   })

    //   const xxxx = computed(()=> {
    //     hosss.pageDatas.value = pageDatas
    //     return hosss.pageDatas.value
    //   })

    return {
      // ...hosss,
      searchDictionary,
      AddVisible,
      addDic,
      dicForm,
      dicList,
      saveDicFun,
      deleteDicFun,
      editDicFun,
      dialogWord,
      editDic,
      dicItemList,
      wordValue,
      AddItemVisible,
      dicItemForm,
      addDicItem,
      saveDicItemFun,
      dictId,
      searchDicItem,
      editDicItemFun,
      deleteDicItemFun,
      searchForm,
      onSubmit,
      onReset,
      searchDictionaryItem,
      searchFormItem,
      onSubmitItem,
      onResetItem
    }
  }
})
</script>

<style lang="scss">
.sort .el-form-item__content{
  flex: none;
}
</style>