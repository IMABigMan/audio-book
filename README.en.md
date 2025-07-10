# 365 Bedtime Stories - Mobile Audio Player

<p align='center'>
  🎵 Mobile H5 Audio Player based on Vue 3 + Vite + Vant
</p>

<p align='center'>
  <a href="./README.md">中文</a> | <b>English</b>
</p>

## Project Introduction

365 Bedtime Stories is a mobile-first audio player application designed specifically for playing bedtime story audio content. The project uses modern frontend technology stack to provide smooth user experience and rich playback features.

## ✨ Key Features

- 🎵 **Audio Playback** - Support play, pause, previous, next
- 🔍 **Smart Search** - Search by story title or sequence number
- 📱 **Mobile Optimized** - Responsive interface designed for mobile devices
- 🎛️ **Playback Control** - Progress bar dragging, volume control, single loop
- 📋 **Playlist Management** - Complete playlist management
- 🎨 **Beautiful UI** - Modern design based on Vant UI

## 🛠️ Tech Stack

### Core Framework
- ⚡️ [Vue 3](https://github.com/vuejs/core) - Progressive JavaScript framework
- 🚀 [Vite](https://github.com/vitejs/vite) - Next generation frontend build tool
- 📦 [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- 🔧 [ESBuild](https://github.com/evanw/esbuild) - Extremely fast JavaScript bundler

### UI Framework
- 📱 [Vant](https://vant-ui.github.io/vant/) - Lightweight, reliable mobile component library
- 🎨 [UnoCSS](https://github.com/unocss/unocss) - Instant on-demand atomic CSS engine
- 💫 [lib-flexible](https://github.com/amfe/lib-flexible) - Mobile adaptive solution
- 📐 [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) - px to rem conversion tool

### Development Tools
- 🦾 [TypeScript](https://www.typescriptlang.org/) - JavaScript superset
- 🗂️ [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) - File-based routing system
- 📦 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) - Auto import APIs
- 🔧 [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) - Auto import components
- 🧪 [Vitest](http://vitest.dev/) - Unit testing framework
- 🌐 [Axios](https://axios-http.com/) - HTTP client

## 📁 Project Structure

```
src/
├── api/                 # API interfaces
├── components/          # Common components
│   └── AudioPlaylist.vue # Audio player component
├── composables/         # Composable functions
├── pages/              # Page components
├── plugins/            # Plugin configurations
├── styles/             # Style files
└── utils/              # Utility functions
    └── http.ts         # HTTP request wrapper
```

## 🚀 Quick Start

### Requirements

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Clone project
git clone <your-repo-url>
cd vite-vant-h5

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Visit http://localhost:7000
```

### Build

```bash
# Build for production
pnpm build

# Preview build
pnpm preview
```

## 📱 Features

### Audio Player
- Support common audio format playback
- Real-time display of playback progress and duration
- Support dragging progress bar for quick positioning
- Volume control and mute function
- Single loop mode

### Playlist
- Display complete audio list
- Support click to switch playback
- Current playing item highlighted
- Real-time playback status update

### Search Function
- Support search by story title
- Support exact search by sequence number
- Real-time filter playlist

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
# API base URL
VITE_API_BASE_URL=https://your-api-domain.com

# Base path
VITE_BASE_URL=/

# Proxy configuration
VITE_PROXY_CONFIG=[{"path":"/api","target":"https://your-api-domain.com"}]

# Whether to remove console
VITE_DELETE_CONSOLE=false

# Whether to show sourcemap
VITE_SHOW_SOURCEMAP=false
```

### Vite Configuration

Main configuration items:

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

## 📋 Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Preview build
pnpm preview

# Type check
pnpm typecheck

# Lint code
pnpm lint

# Run tests
pnpm test

# Update dependencies
pnpm up

# Deploy to GitHub Pages
pnpm deploy
```

## 🎯 Core Components

### AudioPlaylist Component

Main audio player component with the following features:

- **Playback Control**: Play/pause, previous/next, single loop
- **Progress Control**: Real-time progress display, drag positioning support
- **Volume Control**: Volume adjustment slider
- **Search Function**: Search by title or sequence number
- **Playlist**: Display all audio files, support click to switch

### HTTP Utility Class

Encapsulated Axios requests with unified error handling and request configuration:

```typescript
// Usage example
import { http } from '@/utils/http'

// GET request
const response = await http.get({
  url: '/api/music/list',
  params: { page: 1 },
  showError: true, // Whether to show error message
})

// POST request
const response = await http.post({
  url: '/api/music/create',
  data: { title: 'New Story' },
})
```

## 🚀 Deployment

### Netlify Deployment

1. Push project to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
4. Click deploy

### GitHub Pages Deployment

```bash
# Auto deploy to GitHub Pages
pnpm deploy
```

### Docker Deployment

```bash
# Build image
docker build -t vite-vant-h5 .

# Run container
docker run -p 8080:80 vite-vant-h5
```

## 🔧 Development Guide

### Adding New Pages

Create Vue files in `src/pages/` directory, routes will be auto-generated:

```
src/pages/
├── index.vue          # /
├── about.vue          # /about
└── user/
    └── profile.vue    # /user/profile
```

### Adding New Components

Create components in `src/components/` directory, they will be auto-imported:

```vue
<!-- src/components/MyComponent.vue -->
<template>
  <div>My Component</div>
</template>

<!-- Use directly in other files without import -->
<template>
  <MyComponent />
</template>
```

### Adding API Interfaces

Add interface definitions in `src/api/` directory:

```typescript
// src/api/music.ts
import { http } from '@/utils/http'

export function getMusicDetail(id: string) {
  return http.get({
    url: `/api/music/${id}`,
  })
}
```

## 🤝 Contributing

1. Fork this project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source under MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Vite](https://vitejs.dev/) - Next generation frontend build tool
- [Vant](https://vant-ui.github.io/vant/) - Mobile component library
- [UnoCSS](https://unocss.dev/) - Instant on-demand atomic CSS engine
- [Vitesse](https://github.com/antfu/vitesse) - Project template inspiration

---

<p align='center'>
  Made with ❤️ by Your Team
</p>
