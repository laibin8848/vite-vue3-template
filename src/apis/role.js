import request from "@/utils/request";

export const getRoleList = (data) => {
  return request.post('/system/role/listByPage', data)
}

export const delRole = (row) => {
  return new Promise(reslove => {
      setTimeout(()=> {
        reslove({
          code: 200
        })
      }, 1000)
  })
}
