import request from "@/utils/request";

export const searchEnterpriseList = (data) => {
    return request.post('/system/user/enterprise/listByPage?pageNo=' + data.pageNo + '&pageSize=' + data.pageSize, data)
}

export const deleteEnterprise = (id) => {
    return request.delete('/system/user/enterprise/delete/' + id)
}

export const getEnterpriseDetail = (id) => {
    return request.get('/system/user/enterprise/getById/' + id)
}

export const saveEnterprise = (data) => {
    return request.post('/system/user/enterprise/save', data)
}

export const addEnterprise = (data) => {
    return request.post('/system/tenant/add', data)
}

export const searchShopList = (data) => {
    return request.post('/system/user/enterprise-shop/listByPage', data)
}

export const deleteShop = (id) => {
    return request.delete('/system/user/enterprise-shop/delete/' + id)
}

export const getShopDetail = (id) => {
    return request.get('/system/user/enterprise-shop/getById/' + id)
}

export const saveShop = (data) => {
    return request.post('/system/user/enterprise-shop/save', data)
}

export const getShopTree = () => {
    return request.get('/system/user/enterprise-shop/getShopTree')
}

//添加店铺图片
export const uploadPic = (data) => {
    const postData = new FormData()
    for (const key in data) {
        postData.append(key, data[key])
    }
    return request.post('/system/user/enterprise-shop/addShopPicture', postData, {
        uploadFile: true
    })
}

export const freeze = (data) => {
    return request.put('/system/tenant/freeze?status=' + data.status + '&tenantId=' + data.tenantId)
}
