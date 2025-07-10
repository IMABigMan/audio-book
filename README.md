# 365睡前故事 - 移动端音频播放器

<p align='center'>
  🎵 基于 Vue 3 + Vite + Vant 的移动端 H5 音频播放器
</p>

<p align='center'>
  <b>中文</b> | <a href="./README.en.md">English</a>
</p>

## 项目简介

365睡前故事是一个专为移动端设计的音频播放器应用，主要用于播放睡前故事音频内容。项目采用现代化的前端技术栈，提供流畅的用户体验和丰富的播放功能。

## ✨ 主要功能

- 🎵 **音频播放** - 支持播放、暂停、上一首、下一首
- 🔍 **智能搜索** - 支持按故事名称或序号搜索
- 📱 **移动端优化** - 专为移动设备设计的响应式界面
- 🎛️ **播放控制** - 进度条拖拽、音量调节、单曲循环
- 📋 **播放列表** - 完整的播放列表管理
- 🎨 **美观界面** - 基于 Vant UI 的现代化设计

## 🛠️ 技术栈

### 核心框架

- ⚡️ [Vue 3](https://github.com/vuejs/core) - 渐进式 JavaScript 框架
- 🚀 [Vite](https://github.com/vitejs/vite) - 下一代前端构建工具
- 📦 [pnpm](https://pnpm.io/) - 快速、节省磁盘空间的包管理器
- 🔧 [ESBuild](https://github.com/evanw/esbuild) - 极速 JavaScript 打包器

### UI 框架

- � [Vant](https://vant-ui.github.io/vant/) - 轻量、可靠的移动端组件库
- 🎨 [UnoCSS](https://github.com/unocss/unocss) - 即时按需原子化 CSS 引擎
- 💫 [lib-flexible](https://github.com/amfe/lib-flexible) - 移动端自适应方案
- 📐 [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) - px 转 rem 工具

### 开发工具

- 🦾 [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- 🗂️ [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) - 基于文件的路由系统
- 📦 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) - 自动导入 API
- 🔧 [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) - 组件自动导入
- 🧪 [Vitest](http://vitest.dev/) - 单元测试框架
- 🌐 [Axios](https://axios-http.com/) - HTTP 客户端

## 📁 项目结构

```
src/
├── api/                 # API 接口
├── components/          # 公共组件
│   └── AudioPlaylist.vue # 音频播放器组件
├── composables/         # 组合式函数
├── pages/              # 页面组件
├── plugins/            # 插件配置
├── styles/             # 样式文件
└── utils/              # 工具函数
    └── http.ts         # HTTP 请求封装
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
# 克隆项目
git clone <your-repo-url>
cd vite-vant-h5

# 安装依赖
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:7000
```

### 构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 📱 功能特性

### 音频播放器

- 支持常见音频格式播放
- 实时显示播放进度和时长
- 支持拖拽进度条快速定位
- 音量控制和静音功能
- 单曲循环模式

### 播放列表

- 显示完整的音频列表
- 支持点击切换播放
- 当前播放项高亮显示
- 播放状态实时更新

### 搜索功能

- 支持按故事标题搜索
- 支持按序号精确查找
- 实时过滤播放列表

## 🔧 配置说明

### 环境变量

创建 `.env` 文件：

```bash
# API 基础地址
VITE_API_BASE_URL=https://your-api-domain.com

# 基础路径
VITE_BASE_URL=/

# 代理配置
VITE_PROXY_CONFIG=[{"path":"/api","target":"https://your-api-domain.com"}]

# 是否删除 console
VITE_DELETE_CONSOLE=false

# 是否显示 sourcemap
VITE_SHOW_SOURCEMAP=false
```

### Vite 配置

主要配置项说明：

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 7000,
    open: true,
  },
  plugins: [
    Vue(),
    VueRouter(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
    UnoCSS(),
  ],
})
```

## 📋 可用脚本

```bash
# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 运行测试
pnpm test

# 更新依赖
pnpm up

# 部署到 GitHub Pages
pnpm deploy
```

## 🎯 核心组件

### AudioPlaylist 组件

主要的音频播放器组件，包含以下功能：

- **播放控制**：播放/暂停、上一首/下一首、单曲循环
- **进度控制**：实时显示播放进度，支持拖拽定位
- **音量控制**：音量调节滑块
- **搜索功能**：支持按标题或序号搜索
- **播放列表**：显示所有音频文件，支持点击切换

### HTTP 工具类

封装了 Axios 请求，提供统一的错误处理和请求配置：

```typescript
// 使用示例
import { http } from '@/utils/http'

// GET 请求
const response = await http.get({
  url: '/api/music/list',
  params: { page: 1 },
  showError: true, // 是否显示错误提示
})

// POST 请求
const response = await http.post({
  url: '/api/music/create',
  data: { title: '新故事' },
})
```

## 🚀 部署

### Netlify 部署

1. 将项目推送到 GitHub
2. 在 [Netlify](https://netlify.com) 中导入项目
3. 构建设置：
   - Build command: `pnpm build`
   - Publish directory: `dist`
4. 点击部署

### GitHub Pages 部署

```bash
# 自动部署到 GitHub Pages
pnpm deploy
```

### Docker 部署

```bash
# 构建镜像
docker build -t vite-vant-h5 .

# 运行容器
docker run -p 8080:80 vite-vant-h5
```

## 🔧 开发指南

### 添加新页面

在 `src/pages/` 目录下创建 Vue 文件，路由会自动生成：

```
src/pages/
├── index.vue          # /
├── about.vue          # /about
└── user/
    └── profile.vue    # /user/profile
```

### 添加新组件

在 `src/components/` 目录下创建组件，会自动导入：

```vue
<!-- src/components/MyComponent.vue -->
<template>
  <div>我的组件</div>
</template>

<!-- 在其他文件中直接使用，无需导入 -->
<template>
  <MyComponent />
</template>
```

### 添加 API 接口

在 `src/api/` 目录下添加接口定义：

```typescript
// src/api/music.ts
import { http } from '@/utils/http'

export function getMusicDetail(id: string) {
  return http.get({
    url: `/api/music/${id}`,
  })
}
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Vant](https://vant-ui.github.io/vant/) - 移动端组件库
- [UnoCSS](https://unocss.dev/) - 即时按需原子化 CSS 引擎
- [Vitesse](https://github.com/antfu/vitesse) - 项目模板灵感来源

---

<p align='center'>
  Made with ❤️ by Your Team
</p>
