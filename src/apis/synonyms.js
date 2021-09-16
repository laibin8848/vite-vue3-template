import request from "@/utils/request";

export const getSynonymsList = (data) => {
    return request.post('/unilever/robot/option-synonyms/listByPage', data)
}

export const deleteSynonyms = (id) => {
    return request.delete('/unilever/robot/option-synonyms/delete/' + id)
}

export const getSynonymsDetail = (id) => {
    return request.get('/unilever/robot/option-synonyms/getById/' + id)
}

export const saveSynonyms = (data) => {
    return request.post('/unilever/robot/option-synonyms/save', data)
}

export const deleteSynonymsBatch = (ids) => {
    return request.delete('/unilever/robot/option-synonyms/deleteBatch?ids=' + ids)
}

