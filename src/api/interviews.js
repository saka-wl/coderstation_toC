import request from './request'

/**
 * 获取面试题标题
 */
export function getInterviewTitle() {
  return request({
    url: "/api/interview/interviewTitle",
    method: "GET"
  })
}

/**
 * 根据 id 获取面试题详情
 * @param {*} id 
 */
export function getInterviewById(id) {
  return request({
    url: "/api/interview/" + id,
    method: "GET"
  })
}