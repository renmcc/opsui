import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果存在 token 则附带在 http header 中
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    Message({
      message: error.response.data,
      type: 'error',
      duration: 5 * 1000
    })
    console.log(error)
    // 非法的token, 401 其他客户端登录了
    if (error.response.status === 401) {
      MessageBox.confirm(
        '你已被登出，可以取消继续留在该页面，或者重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }
    return Promise.reject(error)
  }
)

export default service
