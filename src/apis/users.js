import request from "@/utils/request";

export const getUserList = (data) => {
  return request.post('/system/user/listByPage', data)
}

export const delUser = (row) => {
  return request.get(`/system/user/delete/${row.id}`)
}

export const addUser = (data) => {
  return request.post('/system/user/save', data)
}
