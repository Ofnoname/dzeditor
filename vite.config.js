import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: "test.html", //分析图生成的文件名
      open: true //如果存在本地服务端口，将在打包后自动展示
    }),
  ],
    build: {
        rollupOptions: {
          external: ['vue', 'monaco-editor'],
        }
    },
  base: "/dzeditor",//打包上传服务器的相对路径
});
