import request from "@/utils/request";

// export const doLogin = (data) => {
//   const valid = data.username == 'admin' && data.password == '123456'
//   return new Promise((reslove, reject) => {
//       setTimeout(()=> {
//         valid && reslove({
//           data: { accessToken: 'accessToken' }
//         })
//         !valid && reslove({
//           data: { error: 'accessToken' }
//         })
//       }, 1000)
//   })
// }

// export const getCaptcha = (key) => {
//     return request.get(`/system/login/randomImage/${key}`)
// }

export const getCaptcha = (key) => {
    return request.get(`/unilever/login/captcha`)
}

export const doLogin = (data) => {
    return request.post(`/unilever/login`, data);
}
