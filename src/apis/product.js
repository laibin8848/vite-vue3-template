import request from "@/utils/request";

export const getProductList = (data) => {
    return request.post(`/unilever/robot/goods/listByPage?pageNo=${data.pageNo}&pageSize=${data.pageSize}`, data)
}

export const deleteProduct = (id) => {
    return request.delete('/unilever/robot/goods/delete/' + id)
}

export const getProductDetail = (id) => {
    return request.get('/unilever/robot/goods/getById/' + id)
}

export const saveProduct = (data) => {
    return request.post('/unilever/robot/goods/save', data)
}

export const deleteProductBatch = (ids) => {
    return request.delete('/unilever/robot/goods/deleteBatch?ids=' + ids)
}

export const uploadPic = (data) => {
    const postData = new FormData()
    for (const key in data) {
        postData.append(key, data[key])
    }
    return request.post('/unilever/robot/goods/upload/pic', postData, {
        uploadFile: true
    })
}
