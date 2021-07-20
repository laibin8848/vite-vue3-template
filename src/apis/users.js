import request from "@/utils/request";

export const getUserList = () => {
  return new Promise(reslove => {
      setTimeout(()=> {
        reslove({
          code: 200,
          results: [
            { userName: '小明', roleName: '超级管理员', state: '正常' },
            { userName: '小红', roleName: '管理员', state: '冻结' }
          ],
          total: 2
        })
      }, 1000)
  })
}

export const delUser = (row) => {
  return new Promise(reslove => {
      setTimeout(()=> {
        reslove({
          code: 200
        })
      }, 1000)
  })
}
