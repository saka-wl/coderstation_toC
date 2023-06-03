import request from './request'

export function getTypeList() {
  return request({
    url: "/api/type",
    method: "GET"
  })
}