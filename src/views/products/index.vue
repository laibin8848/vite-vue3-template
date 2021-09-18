<template>
  <div class="global-tab-con">
    <el-row>
      <el-col :span="24" align="left">
        <el-form :inline="true" class="search-form" label-width="80px" label-position="left">
          <el-form-item label="商品名称:">
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
        <el-button type="primary" icon="el-icon-plus" size="small" @click="productFormShow">新增</el-button>
        <el-button v-if="multiple" icon="el-icon-remove" size="small" @click="onRowDelBatch">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table border v-loading="pageParams.loading" :highlight-current-row="single" :data="pageDatas" class="table" @current-change="handleSelectionChange" @selection-change="handleSelectionChange">
      <el-table-column v-if="multiple" type="selection" width="45" align="center"></el-table-column>
      <el-table-column v-if="single" width="45" align="center">
        <template #default="scope">
          <i v-if="singleSelItem && scope.row.id == singleSelItem.id" style="font-size: 22px;color: #66b1ff;" class="el-icon-success" />
          <i v-else style="font-size: 22px;color: #66b1ff;" class="el-icon-circle-check" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="description" label="描述" align="center"></el-table-column>
      <el-table-column prop="code" label="商品编码" align="center"></el-table-column>
      <el-table-column prop="picture" label="图片" align="center">
        <template #default="scope">
          <el-image style="width: 60px;" :src="picServer + scope.row.picture" :preview-src-list="[picServer + scope.row.picture]" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column prop="price" label="价格" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="100px" v-if="!asSelector">
        <template #default="scope">
          <el-button type="text" @click="productFormShow(scope.row)">编辑</el-button>
          <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <yue-pagination :pageParams="pageParams" @current-change="onCurrentChange" @size-change="onSizeChange" />
    <el-dialog :lock-scroll="false" :modal="false" width="30%" title="产品信息编辑" v-model="productFormVisible">
      <el-form ref="productFormRef" :status-icon="true" :rules="productFormValidateRules" :model="productModel" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="productModel.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="productModel.description" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="productModel.price" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" rows="4" v-model="productModel.remark" />
        </el-form-item>
        <el-form-item label="图片" prop="picture">
          <el-image style="width: 200px;" :src="picServer + productModel.picture" :preview-src-list="[picServer + productModel.picture]" />
          <el-upload
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleFileChange"
            :show-file-list="false"
            :auto-upload="false">
            <el-button :disabled="uploading" :loading="uploading" size="small" type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="productFormHide">取 消</el-button>
          <el-button type="primary" @click="productFormSave">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue'
  import useListMethods from '@/hooks/useListMethods'
  import { getProductList, deleteProduct, uploadPic } from '@/apis/product'
  import productModelForm from '@/views/models/product'
  import { picServer } from '@/config'
  import { ElMessage } from 'element-plus'

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
      const productManager = productModelForm()

      const hooks = useListMethods({
        listLoader: getProductList,
        delFun: deleteProduct,
        extParams: {
          name: ''
        }
      })

      const productFormSave = ()=> {
        productManager.productFormSave(hooks.fetchData)
      }

      const uploading = ref(false)

      const handleFileChange = (file) => {
        uploading.value = true
        uploadPic({
          file: file.raw
        }).then(res=> {
          uploading.value = false
          if(res.code == 'E000') {
            productManager.productModel.value.picture = res.data
          } else {
            ElMessage.error(res.message)
          }
        })
      }

      return {
        ...hooks,
        ...productManager,
        productFormSave,
        handleFileChange,
        picServer,
        uploading
      }
    }
  })
</script>
