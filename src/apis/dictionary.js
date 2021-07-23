import request from "@/utils/request"

//字典
export const deleteDic = (id) => {
    return request.get('/system/dict/delete/' + id)
}

export const getDicList = (dictCode) => {
    return request.get('/system/dict/getDictItemsByCode?dictCode=' + dictCode)
}

export const getDicDetail = (id) => {
    return request.get('/system/dict/getById/' + id)
}

export const searchDic = (data) => {
    return request.post('/system/dict/list', data)
}

export const saveDic = (data) => {
    return request.post('/system/dict/save', data)
}

export const deleteDicItem = (id) => {
    return request.get('/system/dict-item/delete?ids=' + id)
}

export const getDicItemDetail = (id) => {
    return request.get('/system/dict-item/getById/' + id)
}

export const searchDicItem = (sysDict) => {
    return request.post('/system/dict-item/list', sysDict)
}

export const saveDicItem = (data) => {
    return request.post('/system/dict-item/save', data)
}
