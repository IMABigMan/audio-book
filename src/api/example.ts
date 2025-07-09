import { http } from '@/utils/http'

// 定义用户数据接口
interface User {
  id: number
  name: string
  email: string
}

// 定义 API 响应接口
interface UserListResponse {
  code: number
  data: User[]
  msg: string
}

interface UserResponse {
  code: number
  data: User
  msg: string
}

// API 请求示例
export const userApi = {
  // GET 请求 - 获取用户列表
  getUserList: (params?: { page?: number, size?: number }) => {
    return http.get<UserListResponse>({
      url: '/api/users',
      params,
    })
  },

  // GET 请求 - 获取用户详情（不显示错误提示）
  getUserDetail: (id: number) => {
    return http.get<UserResponse>({
      url: `/api/users/${id}`,
      showError: false, // 不显示错误提示
    })
  },

  // POST 请求 - 创建用户
  createUser: (userData: Omit<User, 'id'>) => {
    return http.post<UserResponse>({
      url: '/api/users',
      data: userData,
      showError: true,
    })
  },

  // PUT 请求 - 更新用户
  updateUser: (id: number, userData: Partial<User>) => {
    return http.put<UserResponse>({
      url: `/api/users/${id}`,
      data: userData,
      showError: true,
    })
  },

  // DELETE 请求 - 删除用户
  deleteUser: (id: number) => {
    return http.delete({
      url: `/api/users/${id}`,
      showError: true,
    })
  },

  // 带自定义配置的请求
  getUserWithCustomConfig: (id: number) => {
    return http.get<UserResponse>({
      url: `/api/users/${id}`,
      showError: false,
      config: {
        timeout: 5000, // 自定义超时时间
        headers: {
          'Custom-Header': 'custom-value',
        },
      },
    })
  },
}
