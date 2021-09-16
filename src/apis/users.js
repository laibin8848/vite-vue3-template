import request from "@/utils/request";

export const getUserList = (data) => {
    return request.post('/unilever/sys/user/listByPage', data)
}

export const deleteUser = (id) => {
    return request.delete('/unilever/sys/user/delete/' + id)
}

export const getUserDetail = (id) => {
    return request.get('/unilever/sys/user/getById/' + id)
}

export const saveUser = (data) => {
    return request.post('/unilever/sys/user/save', data)
}

export const deleteUserBatch = (ids) => {
    return request.delete('/unilever/sys/user/deleteBatch?ids=' + ids)
}

