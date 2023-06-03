import request from './request'

/**
 * @params current: 当前页
 * @params pageSize: 每页多少条数据
 */
export function getBooksByPage(params) {
  return request({
    url: '/api/book',
    method: "GET",
    params
  })
}

/**
 * 根据 id 获取书籍
 * @param {*} id 
 * @returns 
 */
export function getBookById(id) {
  return request({
    url: "/api/book/" + id,
    method: "GET"
  })
}