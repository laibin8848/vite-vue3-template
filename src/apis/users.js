import request from "@/utils/request";

export const getUserList = (data) => {
  return request.post('/system/user/listByPage', data)
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
