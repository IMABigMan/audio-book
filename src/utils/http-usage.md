# HTTP 工具类使用说明

## 概述

HTTP 工具类已经重构为对象传参的方式，并增加了控制错误提示显示的功能。

## 主要特性

1. **对象传参**：所有请求方法都使用对象作为参数，提高代码可读性
2. **错误提示控制**：通过 `showError` 参数控制是否显示错误提示
3. **类型安全**：完整的 TypeScript 类型支持
4. **统一的错误处理**：在响应拦截器中统一处理错误

## 接口定义

### RequestOptions

```typescript
interface RequestOptions {
  url: string // 请求 URL
  params?: any // GET/DELETE 请求参数
  data?: any // POST/PUT 请求数据
  config?: AxiosRequestConfig // 额外的 Axios 配置
  showError?: boolean // 是否显示错误提示，默认为 true
}
```

## 使用方法

### GET 请求

```typescript
// 基本用法
const response = await http.get({
  url: '/api/users',
  params: { page: 1, size: 10 },
  showError: true, // 可选，默认为 true
})

// 不显示错误提示
const response = await http.get({
  url: '/api/users/1',
  showError: false,
})
```

### POST 请求

```typescript
// 创建数据
const response = await http.post({
  url: '/api/users',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
  },
  showError: true,
})
```

### PUT 请求

```typescript
// 更新数据
const response = await http.put({
  url: '/api/users/1',
  data: {
    name: 'Jane Doe',
  },
  showError: true,
})
```

### DELETE 请求

```typescript
// 删除数据
const response = await http.delete({
  url: '/api/users/1',
  showError: true,
})

// 带参数的删除
const response = await http.delete({
  url: '/api/users',
  params: { ids: [1, 2, 3] },
  showError: true,
})
```

### 自定义配置

```typescript
const response = await http.get({
  url: '/api/users/1',
  showError: false,
  config: {
    timeout: 5000,
    headers: {
      'Custom-Header': 'custom-value',
    },
  },
})
```

## 错误处理

### showError 参数

- `showError: true`（默认）：显示错误提示 Toast
- `showError: false`：不显示错误提示，但仍会抛出异常

### 错误处理逻辑

1. **业务错误**：当响应中的 `code` 不等于 200 时
2. **HTTP 错误**：当 HTTP 状态码不等于 200 时
3. **网络错误**：网络连接失败等情况

### 手动错误处理

```typescript
try {
  const response = await http.get({
    url: '/api/users/1',
    showError: false, // 不显示自动错误提示
  })
  console.log(response.data)
}
catch (error) {
  // 手动处理错误
  console.error('请求失败:', error.message)
  // 可以在这里显示自定义的错误提示
  showToast('获取用户信息失败，请重试')
}
```

## 迁移指南

### 旧版本用法

```typescript
// 旧版本
const response = await http.get('/api/users', { page: 1 })
const response = await http.post('/api/users', userData)
```

### 新版本用法

```typescript
// 新版本
const response = await http.get({
  url: '/api/users',
  params: { page: 1 },
})

const response = await http.post({
  url: '/api/users',
  data: userData,
})
```

## 最佳实践

1. **API 封装**：建议在 `src/api/` 目录下创建具体的 API 模块
2. **类型定义**：为每个 API 响应定义具体的类型
3. **错误处理**：根据业务需求决定是否显示错误提示
4. **统一管理**：将相关的 API 请求封装在同一个模块中

## 示例

参考 `src/api/example.ts` 文件查看完整的使用示例。
