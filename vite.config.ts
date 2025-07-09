/// <reference types="vitest" />

import path from 'node:path'
import process from 'node:process'
import { VantResolver } from '@vant/auto-import-resolver'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  console.log('command, mode -> ', command, mode)

  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const {
    VITE_DELETE_CONSOLE,
    VITE_SHOW_SOURCEMAP,
    VITE_PROXY_CONFIG,
    VITE_BASE_URL,
  } = env

  console.log('环境变量 env -> ', env)
  return {
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    server: {
      host: '0.0.0.0',
      port: 7000,
      open: true,
      proxy: {
        ...Object.fromEntries(JSON.parse(VITE_PROXY_CONFIG).map((item: Recordable) => [item.path, {
          target: item.target,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(new RegExp(`^${item.path}`), ''),
        }])),
      },
    },
    plugins: [
      VueMacros({
        defineOptions: false,
        defineModels: false,
        plugins: {
          vue: Vue({
            script: {
              propsDestructure: true,
              defineModel: true,
            },
          }),
        },
      }),

      // https://github.com/posva/unplugin-vue-router
      VueRouter(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            // add any other imports you were relying on
            'vue-router/auto': ['useLink'],
          },
        ],
        resolvers: [VantResolver()],
        dts: true,
        dirs: [
          './src/composables',
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        resolvers: [VantResolver()],
        dts: true,
      }),

      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      UnoCSS(),
    ],
    // CSS相关配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`,
          api: 'modern-compiler',
        },
      },
    },
    base: VITE_BASE_URL,
    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: VITE_SHOW_SOURCEMAP === 'true', // 默认是false
      // 开发环境不用压缩
      minify: mode === 'development' ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: VITE_DELETE_CONSOLE === 'true',
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // 控制资源输出格式，避免下划线
          chunkFileNames: 'assets/chunk-[hash].js',
          entryFileNames: 'assets/entry-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // 手动控制chunk命名，避免下划线
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            if (id.includes('src/')) {
              return 'app'
            }
          },
        },
      },
    },

    // https://github.com/vitest-dev/vitest
    test: {
      environment: 'jsdom',
    },
  }
})
