import request from "@/utils/request";

export const saveGimmick = (data) => {
    return request.post('/unilever/robot/problem-option-goods/save', data)
}

export const getGimmickList = (data) => {
    return request.post('/unilever/robot/problem-option-goods/firstLayer', data)
}

export const deleteGimmick = (id) => {
  return request.delete('/unilever/robot/problem-option-goods/delete/' + id)
}

export const getGimmick = (id) => {
  return request.post('/unilever/robot/problem-option-goods/tree?parentId=' + id)
}

