import request from './request'

/**
 * 根据问答id获取评论
 * @param {*} id
 * @param {*} params
 * @returns
 */
export function getIssueCommentById(id, params) {
  return request({
    url: '/api/comment/issuecomment/' + id,
    method: 'GET',
    params
  })
}

/**
 * 
 * @param {*} id 
 * @param {*} params { currentPage, eachPage }
 * @returns 
 */
export function getBookCommentById(id, params) {
  return request({
    url: '/api/comment/bookcomment/' + id,
    method: "GET",
    params
  })
}

// 新增评论（issue）
export function addIssueCommentById(data) {
  return request({
    url: '/api/comment',
    method: 'POST',
    data
  })
}

// 更新问答
export function updateIssue(issueId, newIssueInfo) {
  return request({
    url: '/api/issue/' + issueId,
    method: "PATCH",
    data: newIssueInfo
  })
}

// 更新book
export function updateBook(bookId, newBookInfo) {
  return request({
    url: '/api/book/' + bookId,
    method: 'PATCH',
    data: newBookInfo
  })
}
