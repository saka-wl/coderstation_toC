import request from './request'

/**
 * 分页获取问答
 */
export function getIssueByPage(params) {
  return request({
    url: "/api/issue",
    method: "GET",
    params: {
      ...params
    }
  })
}

/**
 * 新增问答
 */
export function addIssue(newIssue) {
  return request({
    url: "/api/issue",
    method: "POST",
    data: newIssue
  })
}

/**
 * 根据id获取问答
 */
export function getIssueById(issueId) {
  return request({
    url: "/api/issue/" + issueId,
    method: "GET"
  })
}
