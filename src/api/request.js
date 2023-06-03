import axios from 'axios'

const service = axios.create({
  timeout: 5000
})

service.interceptors.request.use((config) => {
  // token 处理
  const token = localStorage.getItem("userToken")
  if(token) {
    config.headers['Authorization'] = "Bearer " + token
  }
  return config
}, (err) => {
  console.log("请求拦截出错")
})

service.interceptors.response.use((resp) => {
  const res = resp.data
  return res
}, (err) => {
  console.log("响应拦截出错")
})

export default service