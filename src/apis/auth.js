import request from "@/utils/request";

export const doLogin = (data) => {
  return request.post(`/system/login/sysUserLogin`, data)
}
