import request from "@/utils/request";

export const doLogin = (data) => {
  const valid = data.username == 'admin' && data.password == '123456'
  return new Promise((reslove, reject) => {
      setTimeout(()=> {
        valid && reslove({
          data: { accessToken: 'accessToken' }
        })
        !valid && reslove({
          data: { error: 'accessToken' }
        })
      }, 1000)
  })
}
