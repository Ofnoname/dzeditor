import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {visualizer} from "rollup-plugin-visualizer";
import {VitePWA} from 'vite-plugin-pwa'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        visualizer({
            gzipSize: true,
            brotliSize: true,
            emitFile: false,
            filename: "package.html", //分析图生成的文件名
            open: true //如果存在本地服务端口，将在打包后自动展示
        }),

        // VitePWA({
        //     registerType: 'autoUpdate',
        //     manifest: {
        //         name: '丁真编辑器',
        //         short_name: '丁真编辑器',
        //         display: 'standalone',
        //     },
        //     workbox: {
        //         // workbox options for generateSW
        //         mode: 'generateSW',
        //         navigateFallback: '/index.html',
        //         globPatterns: ['**/*.{js,css,html}', 'assets/**/*.{js,css,html}', 'assets/**/*.{png,jpg,jpeg,svg}'],
        //         skipWaiting: true,
        //         clientsClaim: true,
        //     }
        //
        // })
    ],
    build: {
        rollupOptions: {
            external: [
                'vue',
                'monaco-editor',
                "marked-highlight",
                "marked-katex-extention",
                "jspdf",
                "dom-to-image",
                "highlight.js",
                "katex",],
        }
    },
    base: "/dzeditor",//打包上传服务器的相对路径
});
