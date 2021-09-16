<template>
  <div class="global-tab-con">
    <el-row class="mb10">
      <el-col :span="24" align="right">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addUser()">新增问题</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="name"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
      :indent="20"
    >
      <el-table-column prop="date" label="" :show-overflow-tooltip="true">
        <template #default="scope">
          <template v-if="scope.row.end">
              <i class="el-icon-paperclip" style="color: #999;font-size: 22px;" />
              {{scope.row.name}}
          </template>
          <template v-else>
            <span v-if="scope.row.option">
              <el-tag effect="dark" type="success">
                <i class="el-icon-chat-line-round" />
                {{scope.row.name}}
              </el-tag>
              <span v-if="scope.row.kw" style="padding-left: 10px;">[{{scope.row.kw}}……]</span>
            </span>
            <span v-else>
              <i class="el-icon-question" style="color: #999;font-size: 22px;" />
              {{scope.row.name}}
            </span>
          </template>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" fixed="right" align="center" width="150px">
        <template #default="scope">
          <div v-if="scope.row.option">
            <el-button type="text" @click="onRowDel(scope.row.id)">+问题</el-button>
            <el-button type="text" @click="onRowDel(scope.row.id)">+商品</el-button>
            <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
          </div>
          <div v-else>
            <el-button type="text" @click="onRowDel(scope.row.id)">添加关键词</el-button>
            <el-button type="text" @click="onRowDel(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <yue-pagination :pageParams="pageParams" @current-change="onCurrentChange" @size-change="onSizeChange" />
    <el-dialog width="30%" title="用户信息编辑" v-model="formVisible">
      <el-form ref="configFormRef" :model="configForm" label-width="80px">
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="configForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" required>
          <el-input v-model="configForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="configForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile" required>
          <el-input v-model="configForm.mobile" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName" required>
          <el-input v-model="configForm.realName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" @click="onFormCommit">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'category',
    setup() {
      const list = ref([
          {
            name: '你好，我是来自联合利华的U兔，作为联合利华共创中心的导购员，我可以为您介绍我们联合利华的相关产品。请问想了解什么品类的产品呢？我们联合利华一共包含7大品类的产品，根据屏幕提示告诉我你想了解的品类哦。',
            children: [
              {
                name: '洗发水',
                option: true,
                kw: '洗发液，洗头',
                children: [
                  {
                    name: '别看我没有头发，对于洗发水我可是比谁都了解哦，但是首先我要了解你是小哥哥还是小姐姐哦？',
                    children: [
                      {
                        name: '男士',
                        option: true,
                        kw: '男，男的，男神',
                        children: [
                          {
                            name: '好的呢，那您想要解决什么护发问题呢？可以根据提示选择你了解的问题哦，U兔可以推荐你最适合你的产品解决你的问题~',
                            children: [
                              {
                                name: '头皮屑',
                                kw: '出汗',
                                option: true,
                                children: [
                                  {
                                    name: '清扬男士洗发水~',
                                    end: true
                                  }
                                ]
                              },
                              {
                                name: '头发异味',
                                kw: '异味，毛糙',
                                option: true,
                                children: [
                                  {
                                    name: '清扬去屑洗发露-清樱花露香型',
                                    end: true
                                  }
                                ]
                              },
                              {
                                name: '发质干瘪',
                                kw: '受损，打结',
                                option: true,
                                children: [
                                  {
                                    name: '清扬小蓝瓶植觉洗发露~',
                                    end: true
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        name: '女士',
                        option: true,
                        children: [
                          {}
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: '沐浴露',
                option: true,
                children: [
                  {
                    name: '沐浴露和香香皂~水温刚刚好 淋淋水来搓泡泡 今天真是美妙~男生与女生的新陈代谢不一样所以U兔推荐不一样的沐浴给到大家哦。',
                    children: []
                  }
                ]
              }
            ]
          }
      ])

      return {
        list
      }
    }
  })
</script>
