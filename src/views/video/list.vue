<template>
  <div class="global-tab-con">
    <el-row style="margin-bottom: 10px">
      <el-col :span="24" align="left">
        <el-form ref="searchFormRef" :model="pageParams.extParams" :inline="true" class="search-form" label-width="80px">
          <el-form-item label="商家:" prop="enterpriseId">
            <shop-tree v-model:enterprise="pageParams.extParams.enterpriseId" :show-shop="false" />
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select placeholder="请选择状态" v-model="pageParams.extParams.status">
              <el-option v-for="item in videoStatusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button size="small" type="primary" @click="onSearch(true)">查询</el-button>
            <el-button size="small" @click="$refs.searchFormRef.resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" align="left">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addVideo()">新增</el-button>
        <el-button type="success" icon="el-icon-refresh" size="small" @click="onSearch">刷新</el-button>
      </el-col>
    </el-row>
    <br />
    <el-table border v-loading="pageParams.loading" :data="pageDatas" class="table">
      <el-table-column prop="title" label="标题" align="center"></el-table-column>
      <el-table-column prop="url" label="视频" align="center">
        <template #default="scope">
          <div style="position: relative">
            <video id="video" class="videoContent" width="100" :src="scope.row.url"></video>
            <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%">
              <i class="el-icon-video-play" style="position: absolute; font-size: 30px; top: 50%; left: 50%; transform: translate(-50%, -50%)" @click="playVideo(scope.row)"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shareCount" label="分享次数" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="createBy" label="创建者" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          {{ videoStatusMap[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column prop="videoDesc" label="视频描述" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="100px" fixed="right">
        <template #default="scope">
          <el-button type="text" @click="onUpdateStatus(scope.row)">{{ scope.row.status ? '下架' : '上架' }}</el-button>
          <el-button type="text" @click="onRowDel(scope.row.videoId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="global-pagination">
      <el-pagination
        :current-page="pageParams.pageNo"
        :page-size="pageParams.pageSize"
        :layout="pageParams.layout"
        :page-sizes="pageParams.pageGroup"
        :total="pageParams.total"
        background
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      >
      </el-pagination>
    </div>

    <el-dialog title="添加视频" v-model="formVisible">
      <el-form :model="configForm">
        <el-form-item label="商家/店铺：" label-width="120px">
          <shop-tree v-if="formVisible" v-model:enterprise="configForm.enterpriseId" v-model:shop="configForm.shopId" />
        </el-form-item>
        <el-form-item label="视频标题：" label-width="120px">
          <el-input v-model="configForm.title"></el-input>
        </el-form-item>
        <el-form-item label="视频描述：" label-width="120px">
          <el-input type="textarea" v-model="configForm.describe" maxlength="200" show-word-limit style="padding-right: 46px"></el-input>
        </el-form-item>
        <el-form-item label="视频文件：" label-width="120px">
          <el-upload :show-file-list="false" :on-change="handleUploadChange" :auto-upload="false" style="display: flex" action>
            <el-button>选择文件</el-button>
            {{ configForm.fileName }}
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit" v-loading.fullscreen.lock="fullscreenLoading">保 存</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title v-model="playVideoFlag" center :fullscreen="true">
      <span>{{ videoObj.title }}</span>
      <div style="width: 100%; height: 80vh; background: #000">
        <video id="p_video" style="width: 100%; height: 100%" controls :src="videoObj.url" autoplay></video>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import useListMethods from '@/hooks/useListMethods'
import useVideoStatus from '@/hooks/useVideoStatus'
import { enterpriseVideo, deleteVideo, uploadVideo, videoStatus } from '@/apis/video'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'video-list',
  setup() {
    const formVisible = ref(false)
    const playVideoFlag = ref(false)
    const fullscreenLoading = ref(false)
    const videoObj = ref({})
    const configForm = ref({
      enterpriseId: '',
      shopId: '',
      title: '',
      file: null,
      fileName: '',
      describe: ''
    })

    const hooks = useListMethods({
      listLoader: enterpriseVideo,
      delFun: deleteVideo,
      lazy: true,
      extParams: {
        enterpriseId: '',
        status: ''
      }
    })

    const addVideo = () => {
      formVisible.value = true
      configForm.value = {}
    }

    const onSearch = (reset = false) => {
      if (hooks.pageParams.value.extParams.enterpriseId == '') {
        ElMessage.error('请选择商家')
        return
      }
      reset && (hooks.pageParams.pageNo = 1)
      hooks.fetchData()
    }

    const onSubmit = () => {
      uploadVideo(configForm.value).then((res) => {
        if (res.code == 'E000') {
          fullscreenLoading.value = false
          ElMessage.success('视频上传成功！')
          formVisible.value = false
        } else {
          ElMessage.error(res.message || '出错了')
        }
      })
    }

    const handleUploadChange = (file) => {
      let fileTypes = ['avi', 'mov', 'rmvb', 'rm', 'flv', 'mp4', '3gp', 'ogv']
      let fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase()
      if (!fileTypes.includes(fileType)) {
        ElMessage({ type: 'error', message: `仅支持上传${fileTypes.join('，')}格式的视频` })
        return
      }
      if (file.size > 52428800) {
        ElMessage({ type: 'error', message: `最大只能上传50M的视频` })
        return
      }
      configForm.value.file = file.raw
      configForm.value.fileName = file.name
    }

    const playVideo = (data) => {
      let p_video = document.getElementById('p_video')
      playVideoFlag.value = true
      videoObj.value = data
      p_video.currentTime = 0
    }

    const onUpdateStatus = (row) => {
      ElMessageBox.confirm('是否确定更改视频状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { status, videoId } = row
        videoStatus({
          status: status ? 0 : 1,
          videoId
        }).then(() => {
          ElMessage({
            type: 'success',
            message: '更新成功'
          }).then(hooks.fetchData())
        })
      })
    }

    return {
      handleUploadChange,
      ...hooks,
      formVisible,
      configForm,
      addVideo,
      playVideoFlag,
      playVideo,
      videoObj,
      onSearch,
      onSubmit,
      onUpdateStatus,
      fullscreenLoading,
      ...useVideoStatus()
    }
  }
})
</script>
