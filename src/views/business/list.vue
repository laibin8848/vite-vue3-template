<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="24" align="left">
        <el-form :inline="true" class="search-form" label-width="80px" label-position="left" :model="searchForm">
          <el-form-item label="门店名称:">
            <el-input size="small" placeholder="请输入门店名称" suffix-icon="el-icon-search" v-model="searchForm.name"></el-input>
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
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addEnterpriseFun">新增</el-button>
        <el-button type="success" icon="el-icon-refresh" size="small" @click="searchEnterprise(searchForm)">刷新</el-button>
      </el-col>
    </el-row>
    <br />
    <el-table border :data="enterpriseList" class="table">
      <el-table-column prop="name" label="商家名" align="center"></el-table-column>
      <el-table-column prop="address" label="门店地址" align="center"></el-table-column>
      <el-table-column prop="contactNumber" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="contactPerson" label="联系人" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <span v-if="scope.row.status == 0">禁用</span>
          <span v-else-if="scope.row.status == 1">正常</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="text" @click="editEnterpriseFun(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="deleteEnterpriseFun(scope.row.id)">删除</el-button>
          <el-button type="text" @click="fobidden(scope.row.id, scope.row.status)">{{ scope.row.status == 1 ? '禁用' : '正常' }}</el-button>
          <el-button type="text" @click="editShop(scope.row.id)">门店配置</el-button>
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
        @size-change="onSizeChange"
      >
      </el-pagination>
    </div>
    <el-drawer title="门店列表" v-model="shopDrawer" direction="rtl" size="70%">
      <div class="demo-drawer__content">
        <div class="global-tab-con">
          <el-row>
            <el-col :span="24" align="left">
              <el-form :inline="true" class="search-form" label-width="100px" label-position="left" :model="searchShopForm">
                <el-form-item label="门店名称:">
                  <el-input size="small" placeholder="请输入门店名称" suffix-icon="el-icon-search" v-model="searchShopForm.name"></el-input>
                </el-form-item>
                <el-form-item style="margin-left: 20px">
                  <el-button size="small" type="primary" @click="onSubmitItem">查询</el-button>
                  <el-button size="small" @click="onResetItem">重置</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" align="left">
              <el-button type="success" icon="el-icon-refresh" size="small" @click="onResetItem">刷新</el-button>
            </el-col>
          </el-row>
          <br />
          <el-table :data="shopList" style="width: 100%" height="400">
            <el-table-column label="门店地址">
              <template #default="scope">
                <span>{{ scope.row.address }}</span>
              </template>
            </el-table-column>
            <el-table-column label="门店名">
              <template #default="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系电话">
              <template #default="scope">
                <span>{{ scope.row.contactNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系人">
              <template #default="scope">
                <span>{{ scope.row.contactPerson }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="scope">
                <span v-if="scope.row.status == 0">停业</span>
                <span v-else-if="scope.row.status == 1">正常</span>
              </template>
            </el-table-column>
            <el-table-column label="门店图片">
              <template #default="scope">
                <el-image
                  :preview-src-list="['https://minio.gdii-yueyun.com/open-douyin/' + scope.row.shopPicture]"
                  style="width: 100px; height: 100px"
                  :src="'https://minio.gdii-yueyun.com/open-douyin/' + scope.row.shopPicture"
                  :fit="fit"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="mini" @click="editShopFun(scope.row.id)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteShopFun(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-drawer>
    <el-drawer title="商家" v-model="AddVisible" direction="rtl" size="40%">
      <el-form :model="enterpriseForm">
        <el-form-item label="企业名" label-width="120px">
          <el-input v-model="enterpriseForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业编码" label-width="120px" v-if="addEnterprisebool">
          <el-input v-model="enterpriseForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" label-width="120px">
          <el-input v-model="enterpriseForm.contactPerson" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="120px">
          <el-input v-model="enterpriseForm.contactNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工商注册地址" label-width="120px">
          <el-input v-model="enterpriseForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" label-width="120px" v-if="addEnterprisebool">
          <el-input v-model="enterpriseForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" v-if="addEnterprisebool">
          <el-input v-model="enterpriseForm.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="AddVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEnterpriseFun()">保 存</el-button>
      </div>
    </el-drawer>
    <el-dialog title="店铺编辑" v-model="AddItemVisible">
      <el-form :model="shopForm">
        <el-form-item label="门店名" label-width="120px">
          <el-input v-model="shopForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="门店标题" label-width="120px">
          <el-input v-model="shopForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="门店地址" label-width="120px">
          <el-input v-model="shopForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" label-width="120px">
          <el-input v-model="shopForm.contactPerson" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="120px">
          <el-input v-model="shopForm.contactNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="门店简介" label-width="120px">
          <el-input type="textarea" :rows="2" placeholder="请输入门店简介" v-model="shopForm.introduction"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px" v-if="!addShopbool">
          <el-radio-group v-model="shopForm.status">
            <el-radio label="0">停业</el-radio>
            <el-radio label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片文件：" label-width="120px" v-if="!addShopbool">
          <el-upload :show-file-list="false" :on-change="handleUploadChange" :auto-upload="false" style="display: flex" action>
            <el-button>选择文件</el-button>
            {{ shopPic.fileName }}
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="AddItemVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveShopFun()">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { computed, defineComponent, ref } from 'vue'
import { ElMessage, ElMessageBox, ElStep } from 'element-plus'
import RightDrawer from '../../layout/components/RightSetting/RightDrawer.vue'
import {
  searchEnterpriseList,
  deleteEnterprise,
  getEnterpriseDetail,
  saveEnterprise,
  addEnterprise,
  searchShopList,
  deleteShop,
  getShopDetail,
  saveShop,
  getShopTree,
  uploadPic,
  freeze
} from '@/apis/business.js'

export default defineComponent({
  name: 'user-list',
  components: {
    RightDrawer
  },
  setup() {
    const enterpriseList = ref([])
    const enterpriseId = ref('')
    const shopList = ref([])
    const AddVisible = ref(false)
    const AddItemVisible = ref(false)
    const shopDrawer = ref(false)
    const addEnterprisebool = ref(true)
    const addShopbool = ref(true)

    const searchForm = ref({
      name: '',
      pageNo: 1,
      pageSize: 10
    })

    const searchShopForm = ref({
      name: '',
      enterpriseId: enterpriseId.value
    })

    const enterpriseForm = ref({
      address: '',
      code: '',
      contactNumber: '',
      contactPerson: '',
      name: '',
      password: '',
      username: ''
      // status: ''
    })

    const shopForm = ref({
      enterpriseId: '',
      id: '',
      address: '',
      contactNumber: '',
      contactPerson: '',
      name: '',
      introduction: '',
      title: '',
      shopPicture: '',
      status: ''
    })

    const shopPic = ref({
      file: null,
      shopId: '',
      fileName: ''
    })

    const pageParams = ref({
      page: 1,
      limit: 10,
      total: 0,
      pageSize: [5, 10, 20],
      layout: 'sizes,prev,pager,next,total',
      loading: false
    })

    const searchEnterprise = (data) => {
      searchEnterpriseList(data)
        .then((e) => {
          if (e.code == 'E000') {
            enterpriseList.value = e.result.records
            pageParams.value.total = e.result.total
          } else {
            ElMessage.error(e.message)
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }
    searchEnterprise(searchForm.value)

    const onCurrentChange = (page) => {
      pageParams.value.page = page
      searchForm.value.pageNo = page
      searchEnterprise(searchForm.value)
    }

    const onSizeChange = (size) => {
      pageParams.value.pageNo = 1
      pageParams.value.limit = size
      searchForm.value.pageNo = 1
      searchForm.value.pageSize = size
      searchEnterprise(searchForm.value)
    }

    const searchShop = (data) => {
      searchShopList(data)
        .then((e) => {
          if (e.code == 'E000') {
            shopList.value = e.result.records
          } else {
            ElMessage.error(e.message)
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const editShop = (id) => {
      shopDrawer.value = true
      enterpriseId.value = id
      searchShopList({ enterpriseId: enterpriseId.value })
        .then((e) => {
          if (e.code == 'E000') {
            shopList.value = e.result.records
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const addEnterpriseFun = () => {
      AddVisible.value = true
      enterpriseForm.value = {}
      addEnterprisebool.value = true
    }

    const addShop = () => {
      AddItemVisible.value = true
      shopForm.value = {}
      addShopbool.value = true
    }

    const saveEnterpriseFun = () => {
      if (addEnterprisebool.value) {
        addEnterprise(enterpriseForm.value)
          .then((result) => {
            if (result.code == 'E000') {
              AddVisible.value = false
              searchEnterprise(searchForm.value)
            } else {
              ElMessage.error(result.message)
            }
          })
          .catch((error) => {
            ElMessage.error(error.message)
          })
      } else {
        saveEnterprise(enterpriseForm.value)
          .then((result) => {
            if (result.code == 'E000') {
              AddVisible.value = false
              searchEnterprise(searchForm.value)
            } else {
              ElMessage.error(result.message)
            }
          })
          .catch((error) => {
            ElMessage.error(error.message)
          })
      }
    }

    const saveShopFun = () => {
      shopForm.value.enterpriseId = enterpriseId
      if (addShopbool.value) {
        saveShop(shopForm.value)
          .then((result) => {
            if (result.code == 'E000') {
              AddItemVisible.value = false
              ElMessage.success('门店添加成功！')
              searchShop({ enterpriseId: enterpriseId.value })
            } else {
              ElMessage.error(result.message)
            }
          })
          .catch((error) => {
            ElMessage.error(error.message)
          })
      } else {
        if (shopPic.value.file) {
          uploadPic(shopPic.value).then((res) => {
            if (res.code == 'E000') {
              shopForm.value.shopPicture = res.result
              saveShop(shopForm.value)
                .then((result) => {
                  if (result.code == 'E000') {
                    AddItemVisible.value = false
                    ElMessage.success('门店操作成功！')
                    searchShop({ enterpriseId: enterpriseId.value })
                  } else {
                    ElMessage.error(result.message)
                  }
                })
                .catch((error) => {
                  ElMessage.error(error.message)
                })
            } else {
              ElMessage.error(res.message || '出错了')
            }
          })
        } else {
          saveShop(shopForm.value)
            .then((result) => {
              if (result.code == 'E000') {
                ElMessage.success('门店添加成功！')
                searchShop({ enterpriseId: enterpriseId.value })
              } else {
                ElMessage.error(result.message)
              }
            })
            .catch((error) => {
              ElMessage.error(error.message)
            })
        }
      }
    }

    const deleteEnterpriseFun = (id) => {
      ElMessageBox.confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteEnterprise(id)
            .then((result) => {
              if (result.code == 'E000') {
                ElMessage.success({
                  message: '删除成功',
                  type: 'success'
                })
                searchEnterprise(searchForm.value)
              } else {
                ElMessage.error(result.message)
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

    const fobidden = (id, status) => {
      status == 0 ? (status = 1) : (status = 0)
      freeze({ status: status, tenantId: id })
        .then((result) => {
          if (result.code == 'E000') {
            ElMessage.success({
              message: '成功',
              type: 'success'
            })
            searchEnterprise(searchForm.value)
          } else {
            ElMessage.error(result.message)
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const deleteShopFun = (id) => {
      ElMessageBox.confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteShop(id)
            .then((result) => {
              if (result.code == 'E000') {
                ElMessage.success({
                  message: '删除成功',
                  type: 'success'
                })
                searchShop({ enterpriseId: enterpriseId.value })
              } else {
                ElMessage.error(result.message)
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

    const editEnterpriseFun = (id) => {
      AddVisible.value = true
      enterpriseForm.value = {}
      addEnterprisebool.value = false
      getEnterpriseDetail(id)
        .then((result) => {
          enterpriseForm.value.address = result.result.address
          enterpriseForm.value.id = result.result.id
          enterpriseForm.value.contactNumber = result.result.contactNumber
          enterpriseForm.value.contactPerson = result.result.contactPerson
          enterpriseForm.value.name = result.result.name
          enterpriseForm.value.status = result.result.status.toString()
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const onSubmit = () => {
      searchEnterprise(searchForm.value)
    }

    const onReset = () => {
      searchForm.value = {
        name: '',
        pageNo: 1,
        pageSize: 10
      }
      searchEnterprise({})
    }

    const onSubmitItem = () => {
      searchShopForm.value.enterpriseId = enterpriseId.value
      searchShop(searchShopForm.value)
    }

    const onResetItem = () => {
      searchShop({ enterpriseId: enterpriseId.value })
    }

    const editShopFun = (id) => {
      AddItemVisible.value = true
      shopForm.value = {}
      addShopbool.value = false
      shopPic.value = {
        file: null,
        shopId: '',
        fileName: ''
      }
      getShopDetail(id)
        .then((result) => {
          shopForm.value.address = result.result.address
          shopForm.value.id = result.result.id
          shopForm.value.contactNumber = result.result.contactNumber
          shopForm.value.contactPerson = result.result.contactPerson
          shopForm.value.name = result.result.name
          shopForm.value.introduction = result.result.introduction
          shopForm.value.title = result.result.title
          shopForm.value.status = result.result.status.toString()
          shopPic.value.shopId = result.result.id
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const handleUploadChange = (file) => {
      let fileTypes = ['png']
      let fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
      if (!fileTypes.includes(fileType)) {
        ElMessage({ type: 'error', message: `仅支持上传${fileTypes.join('，')}格式的图片` })
        return
      }
      // if (file.size > 50000000) {
      //   ElMessage({ type: 'error', message: `最大只能上传50M的视频` })
      //   return
      // }
      shopPic.value.file = file.raw
      shopPic.value.fileName = file.name
    }

    return {
      searchEnterprise,
      AddVisible,
      addEnterpriseFun,
      enterpriseForm,
      enterpriseList,
      saveEnterpriseFun,
      deleteEnterpriseFun,
      editEnterpriseFun,
      shopDrawer,
      editShop,
      shopList,
      AddItemVisible,
      shopForm,
      addShop,
      saveShopFun,
      enterpriseId,
      searchShopList,
      editShopFun,
      deleteShopFun,
      searchForm,
      onSubmit,
      onReset,
      searchShop,
      searchShopForm,
      onSubmitItem,
      onResetItem,
      addEnterprisebool,
      handleUploadChange,
      shopPic,
      addShopbool,
      fobidden,
      pageParams,
      onCurrentChange,
      onSizeChange
    }
  }
})
</script>

<style lang="scss">
.el-form-item__content {
  flex: none;
}
.global-tab-con {
  padding-top: 0;
}
</style>
