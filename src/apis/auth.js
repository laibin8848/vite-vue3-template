import request from "@/utils/request";

export const doLogin = (data) => {
  const valid = data.username == 'admin' && data.password == '123456'
  console.log(valid, data)
  return new Promise((reslove, reject) => {
      setTimeout(()=> {
        valid && reslove({
          data: { accessToken: 'accessToken' }
        })
        !valid && reject('error')
      }, 2000)
  })
}
