import request from "@/utils/request";

export const getOptionList = (data) => {
    return request.post('/unilever/robot/option/listByPage', data)
}

export const deleteOption = (id) => {
    return request.delete('/unilever/robot/option/delete/' + id)
}

export const getOptionDetail = (id) => {
    return request.get('/unilever/robot/option/getById/' + id)
}

export const saveOption = (data) => {
    return request.post('/unilever/robot/option/save', data)
}

export const deleteOptionBatch = (ids) => {
    return request.delete('/unilever/robot/option/deleteBatch?ids=' + ids)
}

