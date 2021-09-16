import request from "@/utils/request";

export const getCouponList = (data) => {
    return request.post(`/merchant-app/coupon/listByPageForBusiness`,data)
}

export const delCouponItem = () => {
    return request.post(`/system/menu/list` , {})
}
// 消券
export const useCoupon = (code) => {
    return request.post(`/merchant-app/coupon/useCoupon` , {"code":code})
}

