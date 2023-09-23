import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

import '@icon-park/vue-next/styles/index.css';

import App from './App.vue'
import Editor from "./pages/Editor.vue";
import Settings from "./pages/Settings.vue";
import Download from "./pages/Download.vue";
import About from "./pages/About.vue";
import {saveState, useGs} from "./store.js";

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'

/**
 * 路由设置
 */
const router = createRouter({
    history: createWebHistory(),
    base: '/dzeditor',
    routes: [
        { path: '', component: Editor},
        { path: '/editor', component: Editor},
        { path: '/settings', component: Settings},
        { path: '/download', component: Download},
        { path: '/about', component: About},
    ]
})


/**
 *  挂载主程序和响应插件 */
const app = createApp(App)

app.use(createPinia())
.use(router)
.mount('#app')

/**
 *  配置 Gs 的自动保存 */
const gs = useGs()
gs.$subscribe((mutation, state) => {
    saveState('globalStore', state)
})

if ('serviceWorker' in navigator && 'localStorage' in window) {}
else {
    window.alert("您的浏览器不支持 Service Worker 或者 localStorage，无法使用本地粘贴图片功能。")
}

/* 注册 Service Worker */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js')
        .then(() => {
            console.log('Service Worker registered.');
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
    });
}


/**
 * From https://github.com/vitejs/vite/discussions/1791
 * 为 Monaco Editor 加载 worker */
window.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        return new editorWorker()
    }
}