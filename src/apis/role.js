import request from "@/utils/request";

export const getRoleList = (data) => {
  return request.post('/system/role/listByPage', data)
}

export const delRole = (row) => {
  return request.get(`/system/role/delete/${row.id}`)
}

export const addRole = (data) => {
  return request.post('/system/role/save', data)
}
