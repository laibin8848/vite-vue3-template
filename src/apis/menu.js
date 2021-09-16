import request from "@/utils/request";

export const saveMenu = (data) => {
    return request.post('/system/menu/save' , data)
}

export const getAllTree = ()=>{
    return request.get('/system/menu/tree')
}

export const getMenuList = () => {
    // return request.post('/system/menu/list',{})
    return request.get('/system/menu/tree')
}

export const delMenu = (row) =>{
    return request.get('/system/menu/delete/'+row.id)
}