import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default function useListMethods(options) {

    const pageParams = ref({
        pageNo: 1,
        pageSize: options.pageSize || 10,
        total: 0,
        pageGroup: [5, 10, 20],
        layout: "sizes,prev,pager,next,total",
        loading: false,
        extParams: options.extParams || {},
        selRows: []
    })

    const handleSelectionChange = (rows)=> {
      pageParams.value.selRows = rows
    }

    const pageDatas = ref([])

    const fetchData = () => {
      handleSelectionChange([])
      if (!options.listLoader || typeof options.listLoader !== 'function') {
          console.error('请定义一个函数用于获取列表数据')
      }
      pageParams.value.loading = true
      options.listLoader(Object.assign({
          pageNo: pageParams.value.pageNo,
          pageSize: pageParams.value.pageSize
      }, pageParams.value.extParams)).then(res => {
          pageParams.value.loading = false
          if (res.code == 'E000') {
              pageDatas.value = res.data.records || [];
              pageParams.value.total = res.data.total
          } else {
              ElMessage({
                  type: 'error',
                  message: res.message
              })
          }
      })
    }

    //首次加载
    if (!options.lazy)
        fetchData()

    const onCurrentChange = (page) => {
        pageParams.value.pageNo = page
        fetchData()
    }

    const onSizeChange = (size) => {
        pageParams.value.pageNo = 1
        pageParams.value.pageSize = size
        fetchData()
    }

    const onRowDelBatch = () => {
      const ids = []
      pageParams.value.selRows.map(item=> ids.push(item.id))
      if (!options.delFun || typeof options.delFun !== 'function') {
          console.error('请定义一个函数用于删除数据')
      }
      if(!ids.length) {
        ElMessage.error('请选择要删除的数据！')
        return
      }
      ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          options.delBatchFun(ids.join(',')).then(() => {
              ElMessageBox.alert('删除成功').then(()=> { fetchData() })
          })
      })
    }

    const onRowDel = (row) => {
        if (!options.delFun || typeof options.delFun !== 'function') {
            console.error('请定义一个函数用于删除数据')
        }
        ElMessageBox.confirm(row.delMsg || '此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            options.delFun(row).then(() => {
              ElMessageBox.alert('删除成功').then(()=> { fetchData() })
            })
        })
    }

    return {
        fetchData,
        pageParams,
        onCurrentChange,
        onSizeChange,
        onRowDel,
        pageDatas,
        onRowDelBatch,
        handleSelectionChange
    }
}
