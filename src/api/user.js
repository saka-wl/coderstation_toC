import request from './request'

/**
 * 用户相关的 api
 */

// 获取验证码
export function getCaptcha() {
  return request({
    url: "/res/captcha",
    method: "GET"
  })
}

// 验证用户是否存在
export function userIsExist(loginId) {
  return request({
    url: "/api/user/userIsExist/" + loginId,
    method: "GET"
  })
}

// 用户注册
export function addUser(newUserInfo) {
  return request({
    url: "/api/user",
    data: newUserInfo,
    method: "POST"
  })
}

// 用户登录
export function userLogin(loginInfo) {
  return request({
    url: "/api/user/login",
    method: "POST",
    data: loginInfo
  })
}

// 根据 id 查找用户
export function getUserById(id) {
  return request({
    url: "/api/user/" + id,
    method: "GET"
  })
}

// 恢复登录
export function getInfo() {
  return request({
    url: "/api/user/whoami",
    method: "GET"
  })
}

// 获取积分前十
export function getUserByPointsRank() {
  return request({
    url: "/api/user/pointsrank",
    method: "GET"
  })
}

// 根据 id 修改用户
export function editUser(userId, newUserInfo) {
  return request({
    url: '/api/user/' + userId,
    method: "PATCH",
    data: newUserInfo
  })
}

/**
 * 确认旧密码是否正确
 * @param {*} data { userId, loginPwd }
 * @returns 
 */
export function userPasswordCheck(data) {
  return request({
    url: '/api/user/passwordcheck',
    method: "POST",
    data
  })
}