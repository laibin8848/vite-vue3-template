<template>
  <div class="global-tab-con">
    <div class="isPc">
      <el-row>
        <el-col :span="24" align="left">
          <el-form :inline="true" class="search-form" label-width="80px" label-position="left" :model="searchForm">
            <el-form-item label="状态:">
              <el-select v-model="searchForm.couponState" clearable placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称:" style="margin-left: 20px">
              <el-input size="small" placeholder="请输入名称" v-model="searchForm.couponName" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 20px">
              <el-button size="small" type="primary" @click="onSearch">查询</el-button>
              <el-button size="small" @click="onReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" align="left">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addOrEditFun()">新增</el-button>
          <el-button type="success" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
        </el-col>
        <el-col :span="18">
          <el-button style="float: right" type="success" icon="el-icon-refresh" size="small" @click="onWriteOff(couponInfo)">消券</el-button>
          <el-input
            style="width: 20%; margin-left: 10px; float: right"
            size="small"
            placeholder="请输入编码"
            :ref="
              (el) => {
                myInput = el
              }
            "
            @keyup.enter="onWriteOff(couponInfo)"
            v-model="couponInfo"
            clearable
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <br />
    <el-table border :data="pageDatas" class="table isPc">
      <el-table-column prop="title" label="名称" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-tag type="{{scope.row.status==='0'?'success':scope.row.status==='1'?'info':''}}">{{ scope.row.status === '0' ? '待使用' : scope.row.status === '1' ? '已使用' : '已过期' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="消券码" align="center">
        <template #default="scope">
          <el-input size="small" placeholder="请输入code" v-model="scope.row.code" clearable :disabled="scope.row.state == '已使用'"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="text" @click="addOrEditFun(scope.row)">编辑</el-button>
          <el-button type="text" @click="onRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="global-pagination isPc">
      <el-pagination
        :current-page="pageParams.page"
        :page-size="pageParams.pageSize"
        :layout="pageParams.layout"
        :page-sizes="pageParams.pageGroup"
        :total="pageParams.total"
        background
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      ></el-pagination>
    </div>

    <el-dialog title="优惠券" v-model="dialogFrom">
      <el-form label-position="right" :model="newCoupon" :rules="rules">
        <el-form-item label="名称" prop="name" label-width="120px">
          <el-input style="width: 80%" v-model="newCoupon.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc" label-width="120px">
          <el-input style="width: 80%" v-model="newCoupon.desc"></el-input>
        </el-form-item>
        <el-form-item v-if="newCoupon.newFlag" label="数量" label-width="120px" style="text-align: left">
          <el-input-number style="margin-left: 10%" v-model="newCoupon.num" @change="handleChange" :min="1" :max="50" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFrom = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <div class="isPhone phoneCouponWrapper">
      <div class="phoneContent">
        <div v-show="activeTab == 0" style="width: 100%; height: 100%; position: relative">
          <div style="position: relative; width: 100%; height: 100%; z-index: 10; background: #000" v-show="scanCodeShow">
            <i class="el-icon-error" @click="closeScanCode"></i>
            <div class="video_block" id="videowrapper">
              <video id="video" class="video" width="375" height="667" />
            </div>
          </div>

          <div v-if="couponInfo" style="width: 100%; height: 100px; position: absolute; left: 0; top: 150px">
            我是优惠券信息：{{ couponInfo }}
            <el-button style="flex: 1" type="primary" icon="el-icon-plus" size="medium" @click="onWriteOff(couponInfo)">消券</el-button>
          </div>

          <el-button type="primary" circle @click="decode" class="scanbtn">扫码消券</el-button>
        </div>
        <div v-show="activeTab == 1">
          <div class="refreshText" v-show="showRefresh"></div>
          <el-tabs id="ulWrapper" v-model="tabActiveName" @tab-click="tabHhandleClick" style="width: 100%; padding-bottom: 10px">
            <el-tab-pane v-for="item in options" :key="item.value" :label="item.label" :name="item.value">
              <ul class="infinite-list" infinite-scroll-distance="10" v-infinite-scroll="loadMore" infinite-scroll-immediate>
                <li :key="index" v-for="(item, index) in pageDatas" class="infinite-list-item couponli">
                  <div class="couponmain">
                    <div>￥{{ item.faceValue }}</div>
                    <div>
                      <span class="couponTitle">{{ item.title }}</span>
                      <span class="couponCondition">满{{ item.threshold }}可用</span>
                    </div>
                  </div>
                  <div class="useTime" v-if="item.status == 1">
                    <span>使用时间：{{ item.useTime }}</span>
                  </div>
                </li>
                <p v-if="noMore">没有更多了</p>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div style="position: absolute; left: 0; bottom: 0; width: 100%">
        <div style="display: flex">
          <el-button style="flex: 1; margin: 0" :type="activeTab === 0 ? 'primary' : 'info'" plain icon size="medium" @click="changeTab(0)">扫码</el-button>
          <el-button style="flex: 1; margin: 0" :type="activeTab === 1 ? 'primary' : 'info'" plain icon size="medium" @click="changeTab(1)">列表</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, defineComponent, ref, watch, onMounted } from 'vue'
import useListMethods from '@/hooks/useListMethods'
import { ElMessage, ElMessageBox, ElDialog } from 'element-plus'
import { getCouponList, delCouponItem, useCoupon } from '@/apis/coupon.js'
import { useRouter, useRoute } from 'vue-router'
import { BrowserQRCodeReader } from '@zxing/library'

export default defineComponent({
  name: 'coupon-list',
  components: {
    ElDialog
  },
  setup() {
    const router = useRouter()

    const options = ref([
      { value: '-1', label: '全部' },
      { value: '0', label: '待使用' },
      { value: '1', label: '已使用' },
      { value: '2', label: '已过期' }
    ])
    const couponInfo = ref('') //优惠券信息
    const activeTab = ref(0) //默认tab页
    const newCoupon = ref()
    const myInput = ref()
    const scanCodeShow = ref(false)
    const searchForm = ref({ couponState: '', couponName: '' })
    const dialogFrom = ref(false)
    const noMore = ref(false)
    const showRefresh = ref(false)
    const tabActiveName = ref('-1')

    const rules = {
      name: { required: true, message: '请输入名称', trigger: 'change' }
    }

    const codeReader = new BrowserQRCodeReader()
    let deviceID = null
    let videowrapper = null
    let ulWrapper = null
    onMounted(() => {
      videowrapper = document.getElementById('videowrapper')
      ulWrapper = document.getElementById('ulWrapper')
      let startPos = 0
      let transitionHeight = 0
      let refreshText = document.querySelector('.refreshText')

      ulWrapper.addEventListener(
        'touchstart',
        (e) => {
          console.log('初始位置：', e.touches[0].pageY)
          startPos = e.touches[0].pageY
          ulWrapper.style.position = 'relative'
          ulWrapper.style.transition = 'transform 0s'
        },
        false
      )
      ulWrapper.addEventListener(
        'touchmove',
        function (e) {
          // console.log('当前位置：', e.touches[0].pageY);
          transitionHeight = e.touches[0].pageY - startPos
          if (transitionHeight < 0) {
            // let scrollTop = document.documentElement.scrollTop;//卷动值
            // let clientHeight  = document.documentElement.clientHeight; //浏览器高度
            // let scrollHeight = document.body.scrollHeight;//文档高度
            // console.log(scrollTop,clientHeight,scrollHeight)
            return false
          }
          if (ulWrapper.scrollTop <= 0 && transitionHeight > 0 && transitionHeight < 60) {
            showRefresh.value = true
            refreshText.innerText = '下拉刷新'
            if (transitionHeight > 55) {
              refreshText.innerText = '释放更新'
            }
          }
          if (parseInt(refreshText.style.height) >= 50) {
            return
          }
          ulWrapper.style.transform = 'translateY(' + transitionHeight + 'px)'
          refreshText.style.height = transitionHeight + 'px'
        },
        false
      )

      ulWrapper.addEventListener(
        'touchend',
        function (e) {
          ulWrapper.style.transition = 'all 0.5s ease 1s'
          ulWrapper.style.transform = 'translateY(0px)'
          refreshText.innerText = '更新中...'
          // todo...
          if (ulWrapper.scrollTop <= 0 && showRefresh.value) {
            onSearch(tabActiveName.value)
          }
        },
        false
      )
    })

    codeReader
      .getVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length <= 0) {
          throw Error('没找到摄像头啊')
        }
        deviceID = videoInputDevices[0].deviceId
        console.log('deviceID', deviceID)
      })
      .catch((err) => {
        console.log(err)
      })

    const decode = () => {
      scanCodeShow.value = true
      videowrapper.style.display = 'block'
      codeReader
        .decodeFromInputVideoDevice(deviceID, 'video')
        .then((result) => {
          //todo get the code value
          //result.text
          console.log(result, 1111111)
          codeReader.reset()
          videowrapper.style.display = 'none'
          scanCodeShow.value = false

          couponInfo.value = result.text
        })
        .catch((err) => {
          codeReader.reset()
          videowrapper.style.display = 'none'
          scanCodeShow.value = false
        })
    }

    const tabHhandleClick = async (tab, event) => {
      // console.log({...tab},event)
      hooks.pageParams.value.pageNo = 1
      hooks.pageParams.value.couponStatus = tab.paneName
      const params = { ...hooks.pageParams.value }
      const res = await getCouponList({
        pageNo: params.pageNo,
        pageSize: params.pageSize,
        couponStatus: params.couponStatus == '-1' ? undefined : params.couponStatus
      })
      if (res.code == 'E000') {
        hooks.pageDatas.value = res.result.records
        hooks.pageParams.value.total = res.result.total
        showRefresh.value = false
      }
    }

    const closeScanCode = () => {
      scanCodeShow.value = false
      codeReader.reset()
      videowrapper.style.display = 'none'
    }

    const changeTab = (code) => {
      activeTab.value = code
    }

    const hooks = useListMethods({
      listLoader: function (params) {
        return getCouponList(params)
      },
      delFun: delCouponItem
    })

    const confirm = () => {
      dialogFrom.value = false
      console.log(newCoupon.value)
    }

    const onReset = () => {
      searchForm.value.couponState = ''
      searchForm.value.couponName = ''
    }

    const onSearch = async (couponStatus) => {
      hooks.pageParams.value.pageNo = 1
      const params = { ...hooks.pageParams.value }
      const res = await getCouponList({
        pageNo: params.pageNo,
        pageSize: params.pageSize,
        couponStatus: couponStatus == '-1' ? undefined : couponStatus
      })
      if (res.code == 'E000') {
        hooks.pageDatas.value = res.result.records
        hooks.pageParams.value.total = res.result.total
        showRefresh.value = false
      }
    }

    const addOrEditFun = (item) => {
      dialogFrom.value = true
      newCoupon.value = { name: '', desc: '', num: 1, newFlag: true }
      if (item) {
        newCoupon.value = item
      }
    }

    const onWriteOff = (code) => {
      if (!code) {
        ElMessage({ type: 'error', message: '请先输入消券码' })
        return
      }
      useCoupon(code)
        .then((res) => {
          const result = res.result
          if (res.code === 'E000') {
            ElMessage({ type: 'success', message: '消券成功' })
            hooks.fetchData()
          } else {
            ElMessage({ type: 'error', message: res.message || '消券失败，请重试' })
          }
        })
        .catch((err) => {})
      // console.log(code);
      myInput && myInput.value.focus()
      couponInfo.value = ''
    }
    let loadMoreFlag = false
    const loadMore = async () => {
      if (loadMoreFlag) return
      loadMoreFlag = true
      hooks.pageParams.value.pageNo++
      const params = { ...hooks.pageParams.value }
      const res = await getCouponList({ pageNo: params.pageNo, pageSize: params.pageSize })
      if (res.code == 'E000') {
        if (!res.result || !res.result.records || !res.result.records.length) {
          noMore.value = true
        }
        hooks.pageDatas.value = hooks.pageDatas.value.concat(res.result.records)
        hooks.pageParams.value.total = res.result.total
        loadMoreFlag = false
      }
    }

    return {
      options,
      searchForm,
      ...hooks,
      onReset,
      onSearch,
      onWriteOff,
      dialogFrom,
      addOrEditFun,
      newCoupon,
      confirm,
      rules,
      myInput,
      activeTab,
      changeTab,
      decode,
      scanCodeShow,
      closeScanCode,
      couponInfo,
      loadMore,
      noMore,
      showRefresh,
      tabActiveName,
      tabHhandleClick
    }
  }
})
</script>

<style lang="scss" scoped>
.global-tab-con {
  width: 100%;
  height: 100%;
  height: calc(100vh - 20px);
  padding: 0;
}
.sort .el-form-item__content {
  flex: none;
}
.el-form-item__error {
  margin-left: 10%;
}
.footertabs {
  position: absolute;
  bottom: 0;
  left: 0;
}
.video_block {
  width: 100%;
  height: 270px;
  position: absolute;
  top: 100px;
  display: none;
  .video {
    position: absolute;
    top: -200px;
    left: 0;
  }
}
.video_block::before {
  content: '';
  width: 100%;
  height: 100%;
  background: url('@/assets/scan.gif');
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  background-size: 100% 100%;
}

.phoneCouponWrapper {
  width: 100%;
  height: 100%;
  background: #ccc;
}
.phoneContent {
  background: #eee;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // overflow: scroll;
  // padding-bottom:40px;
}
.scanbtn {
  width: 100px;
  height: 100px;
  line-height: 85px;
  margin: 0 auto;
  font-size: 18px;
  position: absolute;
  top: 460px;
  left: 50%;
  margin-left: -50px;
}
.el-icon-error {
  position: absolute;
  top: 30px;
  left: 30px;
  font-size: 40px;
  z-index: 1000;
}
.el-tabs__nav.is-top {
  transform: translateX(21%) !important;
}
.refreshText {
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.6);
  border-bottom-left-radius: 100%;
  border-bottom-right-radius: 100%;
  color: #fff;
}
.couponli {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  list-style: none;
  height: 120px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 10px;
  background: #f1eaea;
  .couponmain {
    width: 100%;
    padding: 20px;
    display: flex;
    div:nth-child(1) {
      flex: 1;
      font-size: 30px;
      color: red;
    }
    div:nth-child(2) {
      flex: 3;
      display: flex;
      flex-direction: column;
      .couponTitle {
        font-weight: bold;
        font-size: 18px;
        padding-bottom: 7px;
      }
      .couponCondition {
        color: red;
      }
    }
  }
}
.infinite-list {
  height: calc(100vh - 95px);
  overflow: scroll;
}
</style>