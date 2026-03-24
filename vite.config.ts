import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    // 生成静态资源的目录名
    assetsDir: 'assets',
    // 设置最终包的输出目录
    outDir: 'yjwblogs.top_8002',
    // 是否生成 source map 文件
    sourcemap: false,
    // 分割代码
    chunkSizeWarningLimit: 2000, // 分割代码块的大小限制（单位kb）
    // 压缩配置
    terserOptions: {
      compress: {
        drop_console: true, // 删除console
        drop_debugger: true // 删除debugger
      }
    },
    // 启用/禁用 CSS 代码拆分
    cssCodeSplit: true,
    // 构建后是否清除输出目录
    emptyOutDir: true,
    // 构建时是否重写 import 的路径（例如，将相对路径转为绝对路径）
    reportCompressedSize: true,
  }
})
