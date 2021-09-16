import request from "@/utils/request";
import { buildQuery } from "@/utils";

export const enterpriseVideo = (data) => {
  return request.get(`/system/content/video/enterprise?${buildQuery(data)}`)
}

export const deleteVideo = (id) => {
  return request.delete('/system/content/video/' + id)
}

export const uploadVideo = (data) => {
  const postData = new FormData()
  for(const key in data) {
    postData.append(key, data[key])
  }
  return request.post('/system/content/video', postData, {
    uploadFile: true
  })
}

export const videoStatus = (data) => {
  return request.put(`/system/content/video/status`, data)
}
