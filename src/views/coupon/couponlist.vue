<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="24" align="left">
        <el-form :inline="true" class="search-form" label-width="120px" label-position="left" :model="searchForm">
          <el-form-item label="优惠券名称:">
            <el-input size="small" placeholder="请输入优惠券名称" suffix-icon="el-icon-search" v-model="searchForm.keyword"></el-input>
          </el-form-item>
          <el-form-item label="商家名称:">
            <el-select v-model="searchForm.enterpriseId" placeholder="请选择商家名称" filterable @change="valueChange">
              <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店名称:">
            <el-select v-model="searchForm.shopId" placeholder="请选择门店名称" filterable>
              <el-option v-for="item in shopChildList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select placeholder="请选择状态" v-model="searchForm.status">
              <el-option v-for="item in statusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addCoupon">新增</el-button>
        <el-button type="success" icon="el-icon-refresh" size="small" @click="searchCoupon(searchForm)">刷新</el-button>
      </el-col>
    </el-row>
    <br />
    <el-table border :data="couponList" class="table">
      <el-table-column prop="title" label="优惠券名称" align="center" width="100px"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="100px">
        <template #default="scope">
          <span v-if="scope.row.status == 0">未上架</span>
          <span v-else-if="scope.row.status == 1">已上架</span>
          <span v-else-if="scope.row.status == 2">已过期</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" align="center" width="100px"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" align="center" width="100px"></el-table-column>
      <el-table-column prop="expireDay" label="有效天数" align="center" width="100px"></el-table-column>
      <el-table-column prop="faceValue" label="面值" align="center" width="100px"></el-table-column>
      <el-table-column prop="threshold" label="阈值" align="center" width="100px"></el-table-column>
      <el-table-column prop="totalGet" label="总领取量" align="center" width="100px"></el-table-column>
      <el-table-column prop="totalIssuance" label="总发行量" align="center" width="100px"></el-table-column>
      <el-table-column prop="totalReceive" label="可获取量" align="center" width="100px"></el-table-column>
      <el-table-column prop="totalUse" label="总使用量" align="center" width="100px"></el-table-column>
      <el-table-column prop="description1" label="使用规则" align="center" width="100px"></el-table-column>
      <el-table-column prop="description2" label="适用范围" align="center" width="100px"></el-table-column>
      <el-table-column prop="description3" label="使用须知" align="center" width="100px"></el-table-column>
      <el-table-column label="操作" align="center" width="100px">
        <template #default="scope">
          <el-button type="text" @click="editCouponFun(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="deleteCouponFun(scope.row.id)">删除</el-button>
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
    <el-dialog title="优惠券" v-model="addVisible" width="700px">
      <el-form :model="couponForm" ref="couponFormRef" :rules="rules">
        <el-form-item label="优惠券名称" prop="title" label-width="120px" required class="fixedWidth">
          <el-input v-model="couponForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="总发行量" prop="totalIssuance" label-width="120px" required>
          <el-input-number v-model="couponForm.totalIssuance" :min="1" label="总发行量"></el-input-number>
        </el-form-item>
        <el-form-item label="限每人获取张数" prop="apieceLimit" label-width="120px" required>
          <el-input-number v-model="couponForm.apieceLimit" :min="1" label="限每人获取张数"></el-input-number>
        </el-form-item>
        <el-form-item label="有效时间类型" label-width="120px">
          <el-checkbox v-model="checked">领取后N天内有效</el-checkbox>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime" label-width="120px" class="fixedWidth" required>
          <el-date-picker type="datetime" placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" v-model="couponForm.startTime" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime" label-width="120px" class="fixedWidth" required>
          <el-date-picker width="500px" type="datetime" placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" v-model="couponForm.endTime" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="checked" label="有效天数" label-width="120px">
          <el-input-number v-model="couponForm.expireDay" :min="0" label="有效天数"></el-input-number>
        </el-form-item>
        <el-form-item label="面值" prop="faceValue" label-width="120px" required class="fixedWidth">
          <el-input v-model="couponForm.faceValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="阈值" prop="threshold" label-width="120px" required class="fixedWidth">
          <el-input v-model="couponForm.threshold" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商家名称" prop="enterpriseId" label-width="120px" required class="fixedWidth">
          <el-select v-model="couponForm.enterpriseId" placeholder="请选择商家名称" filterable @change="couponChange">
            <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称" prop="shopIds" label-width="120px" required class="fixedWidth">
          <el-select v-model="couponForm.shopIds" placeholder="请选择门店名称" filterable multiple>
            <el-option v-for="item in shopcouponList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节假日是否可用" label-width="120px">
          <el-switch v-model="switchForm.isHolidaysUnuse"></el-switch>
        </el-form-item>
        <el-form-item label="周末是否可用" label-width="120px">
          <el-switch v-model="switchForm.isWeekendsUnuse"></el-switch>
        </el-form-item>
        <el-form-item label="状态" prop="status" label-width="120px" required>
          <el-radio-group v-model="couponForm.status">
            <el-radio label="0">未上架</el-radio>
            <el-radio label="1">已上架</el-radio>
            <el-radio label="2">已过期</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="使用规则" label-width="120px">
          <el-input type="textarea" :rows="2" class="fixedWidth" placeholder="请输入使用规则" v-model="couponForm.description1"></el-input>
        </el-form-item>
        <el-form-item label="适用范围" label-width="120px">
          <el-input type="textarea" :rows="2" class="fixedWidth" placeholder="请输入适用范围" v-model="couponForm.description2"></el-input>
        </el-form-item>
        <el-form-item label="使用须知" label-width="120px">
          <el-input type="textarea" :rows="2" class="fixedWidth" placeholder="请输入使用须知" v-model="couponForm.description3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveCouponFun()">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { computed, defineComponent, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { searchCouponList, deleteCoupon, getCouponDetail, saveCoupon, getShopTree } from '@/apis/couponlist.js'

export default defineComponent({
  name: 'user-list',
  setup() {
    const couponList = ref([])
    const addVisible = ref(false)
    const couponFormRef = ref()
    const shopList = ref([])
    const shopChildList = ref([])
    const shopcouponList = ref([])
    const checked = ref(false)

    const rules = {
      apieceLimit: [{ required: true, message: '请输入每人可获取张数', trigger: 'blur' }],
      startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
      endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
      faceValue: [{ required: true, message: '请输入面值', trigger: 'blur' }],
      threshold: [{ required: true, message: '请输入阈值', trigger: 'blur' }],
      enterpriseId: [{ required: true, message: '请选择商家名称', trigger: 'change' }],
      shopIds: [{ required: true, message: '请选择门店名称', trigger: 'change' }],
      status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      title: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
      totalIssuance: [{ required: true, message: '请输入总发行量', trigger: 'blur' }]
    }

    const statusList = ref([
      { label: '未上架', value: 0 },
      { label: '已上架', value: 1 },
      { label: '已过期', value: 2 }
    ])

    const searchForm = ref({
      enterpriseId: '',
      keyword: '',
      pageNo: 1,
      pageSize: 10,
      shopId: '',
      status: ''
    })

    const switchForm = ref({
      isHolidaysUnuse: 0,
      isWeekendsUnuse: 0
    })

    const couponForm = ref({
      apieceLimit: '',
      endTime: '',
      enterpriseId: '',
      expireDay: '',
      expireType: '1',
      faceValue: '',
      id: '',
      isHolidaysUnuse: 0,
      isWeekendsUnuse: 0,
      shopIds: [],
      // source: '',
      startTime: '',
      status: '0',
      threshold: '',
      thresholdUnit: 1,
      // timeLimit: '',
      title: '',
      totalIssuance: '',
      type: 1,
      description1: '',
      description2: '',
      description3: ''
    })

    const pageParams = ref({
      page: 1,
      limit: 10,
      total: 0,
      pageSize: [5, 10, 20, 30, 50],
      layout: 'sizes,prev,pager,next,total',
      loading: false
    })

    const searchCoupon = (data) => {
      searchCouponList(data)
        .then((e) => {
          if (e.code == 'E000') {
            couponList.value = e.result.records
            pageParams.value.total = e.result.total
          } else {
            ElMessage.error(e.message)
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }
    searchCoupon(searchForm.value)

    const getShopTreeFun = () => {
      getShopTree()
        .then((e) => {
          if (e.code == 'E000') {
            shopList.value = e.result
          } else {
            ElMessage.error(e.message)
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }
    getShopTreeFun()

    const onCurrentChange = (page) => {
      pageParams.value.page = page
      searchForm.value.pageNo = page
      searchCoupon(searchForm.value)
    }

    const valueChange = () => {
      shopChildList.value = []
      var shop = shopList.value.filter((item) => item.id == searchForm.value.enterpriseId && isNaN(item))
      if (shop && shop.length > 0) {
        shopChildList.value = shop[0].children
      }
    }

    const couponChange = () => {
      shopcouponList.value = []
      var shop = shopList.value.filter((item) => item.id == couponForm.value.enterpriseId && isNaN(item))
      if (shop && shop.length > 0) {
        shopcouponList.value = shop[0].children
      }
    }

    const editCouponFun = (id) => {
      addVisible.value = true
      couponForm.value = {}
      getCouponDetail(id)
        .then((result) => {
          couponForm.value.apieceLimit = result.result.apieceLimit
          couponForm.value.endTime = result.result.endTime
          couponForm.value.expireDay = result.result.expireDay
          couponForm.value.expireType = result.result.expireType.toString()
          couponForm.value.expireType == 2 ? (checked.value = true) : (checked.value = false)
          couponForm.value.faceValue = result.result.faceValue.toString()
          switchForm.value.isHolidaysUnuse = result.result.isHolidaysUnuse
          switchForm.value.isWeekendsUnuse = result.result.isWeekendsUnuse
          couponForm.value.startTime = result.result.startTime
          couponForm.value.status = result.result.status.toString()
          couponForm.value.threshold = result.result.threshold.toString()
          couponForm.value.thresholdUnit = 1
          couponForm.value.title = result.result.title
          couponForm.value.totalIssuance = result.result.totalIssuance
          couponForm.value.description1 = result.result.description1
          couponForm.value.description2 = result.result.description2
          couponForm.value.description3 = result.result.description3
          couponForm.value.type = 1
          couponForm.value.id = result.result.id
          couponForm.value.enterpriseId = result.result.enterpriseId
          couponForm.value.shopIds = result.result.shopIds
          var shop = shopList.value.filter((item) => item.id == couponForm.value.enterpriseId && isNaN(item))
          if (shop && shop.length > 0) {
            shopcouponList.value = shop[0].children
          }
        })
        .catch((error) => {
          ElMessage.error(error.message)
        })
    }

    const onSizeChange = (size) => {
      pageParams.value.pageNo = 1
      pageParams.value.limit = size
      searchForm.value.pageNo = 1
      searchForm.value.pageSize = size
      searchCoupon(searchForm.value)
    }

    const addCoupon = () => {
      addVisible.value = true
      couponFormRef.value.clearValidate()
      couponForm.value = {
        apieceLimit: '',
        endTime: '',
        enterpriseId: '',
        expireDay: '',
        expireType: '1',
        faceValue: '',
        // id: '',
        isHolidaysUnuse: 0,
        isWeekendsUnuse: 0,
        shopIds: [],
        // source: '',
        startTime: '',
        status: '',
        threshold: '',
        thresholdUnit: 1,
        // timeLimit: '',
        title: '',
        totalIssuance: '',
        type: 1
      }
    }

    const saveCouponFun = () => {
      couponFormRef.value.validate((valid) => {
        if (valid) {
          addVisible.value = false
          switchForm.isHolidaysUnuse ? (couponForm.isHolidaysUnuse = 1) : (couponForm.isHolidaysUnuse = 0)
          switchForm.isWeekendsUnuse ? (couponForm.isWeekendsUnuse = 1) : (couponForm.isWeekendsUnuse = 0)
          checked.value ? (couponForm.value.expireType = '2') : (couponForm.value.expireType = '1')
          if (!checked.value) {
            couponForm.value.expireDay = ''
          }
          saveCoupon(couponForm.value)
            .then((result) => {
              if (result.code == 'E000') {
                ElMessage.success('优惠券操作成功！')
                searchCoupon(searchForm.value)
              } else {
                ElMessage.error(result.message)
              }
            })
            .catch((error) => {
              ElMessage.error(error.message)
            })
        }
      })
    }

    const deleteCouponFun = (id) => {
      ElMessageBox.confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCoupon(id)
            .then((result) => {
              if (result.code == 'E000') {
                ElMessage.success({
                  message: '删除成功',
                  type: 'success'
                })
                searchCoupon({})
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

    const onSubmit = () => {
      searchCoupon(searchForm.value)
    }

    const onReset = () => {
      searchForm.value = {}
      searchCoupon({})
    }

    return {
      pageParams,
      searchCoupon,
      addVisible,
      addCoupon,
      couponForm,
      couponList,
      saveCouponFun,
      deleteCouponFun,
      searchForm,
      onSubmit,
      onReset,
      onCurrentChange,
      onSizeChange,
      switchForm,
      editCouponFun,
      getShopTreeFun,
      shopList,
      shopChildList,
      valueChange,
      shopcouponList,
      couponChange,
      rules,
      couponFormRef,
      statusList,
      checked
    }
  }
})
</script>

<style lang="scss">
.el-form-item__content {
  flex: none;
}
.fixedWidth .el-input__inner,
.fixedWidth .el-textarea__inner {
  width: 300px;
}
.el-tabs.el-tabs--top {
  width: 100%;
}
</style>
