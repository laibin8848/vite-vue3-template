import request from "@/utils/request";

export const searchCouponList = (data) => {
    return request.post('/system/coupon/listByPage', data)
}

export const deleteCoupon = (id) => {
    return request.delete('/system/coupon/delete/' + id)
}

export const getCouponDetail = (id) => {
    return request.get('/system/coupon/detail/' + id)
}

export const saveCoupon = (data) => {
    return request.post('/system/coupon/save', data)
}

export const getShopTree = () => {
    return request.get('/system/user/enterprise-shop/getShopTree')
}