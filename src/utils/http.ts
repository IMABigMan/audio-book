import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { showToast } from 'vant'

// 扩展 Axios 配置类型
declare module 'axios' {
  interface AxiosRequestConfig {
    showError?: boolean
  }
}

// 定义响应数据接口
interface ApiResponse<T = any> {
  code: number
  data: T
  msg: string
}

// 定义请求参数接口
interface RequestOptions {
  url: string
  params?: any
  data?: any
  config?: AxiosRequestConfig
  showError?: boolean // 是否显示错误提示，默认为 true
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 基础请求地址
  timeout: 15000, // 请求超时设置
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理，例如添加 token
    // const token = localStorage.getItem('token')
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    // 处理请求错误
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const res = response.data
    const showError = response.config.showError !== false // 默认显示错误

    // 根据自定义错误码处理错误
    if (res.code && res.code !== 200) {
      // 处理各种错误情况
      console.error('Response error:', res.msg || 'Error')

      // 401: 未登录或 token 过期
      if (res.code === 401) {
        // 可以在这里处理登出逻辑
      }

      // 根据配置决定是否显示错误提示
      if (showError) {
        showToast(res.msg || 'Error')
      }

      return Promise.reject(new Error(res.msg || 'Error'))
    }

    // HTTP 状态码错误处理
    if (response.status !== 200) {
      if (showError) {
        showToast(res.msg || 'Network Error')
      }
      return Promise.reject(new Error(res.msg || 'Network Error'))
    }

    return res
  },
  (error) => {
    // 处理 HTTP 错误状态码
    const showError = error.config?.showError !== false // 默认显示错误
    console.error('Response error:', error)

    if (showError) {
      const message = error.response?.data?.msg || error.message || 'Network Error'
      showToast(message)
    }

    return Promise.reject(error)
  },
)

// 封装请求方法
export const http = {
  get<T = ApiResponse>(options: RequestOptions): Promise<T> {
    const { url, params, config, showError = true } = options
    const requestConfig = {
      params,
      showError,
      ...config,
    }
    return service.get(url, requestConfig)
  },

  post<T = ApiResponse>(options: RequestOptions): Promise<T> {
    const { url, data, config, showError = true } = options
    const requestConfig = {
      showError,
      ...config,
    }
    return service.post(url, data, requestConfig)
  },

  put<T = ApiResponse>(options: RequestOptions): Promise<T> {
    const { url, data, config, showError = true } = options
    const requestConfig = {
      showError,
      ...config,
    }
    return service.put(url, data, requestConfig)
  },

  delete<T = ApiResponse>(options: RequestOptions): Promise<T> {
    const { url, params, config, showError = true } = options
    const requestConfig = {
      params,
      showError,
      ...config,
    }
    return service.delete(url, requestConfig)
  },
}
