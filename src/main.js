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

/* 路由 */
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


/* 挂载主程序和响应插件 */
const app = createApp(App)

app.use(createPinia())
.use(router)
.mount('#app')


/* 配置 Gs 的自动保存 */
const gs = useGs()
gs.$subscribe((mutation, state) => {
    saveState('globalStore', state)
})


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
 * 为 Monaco Editor 加载 worker
 * From https://github.com/vitejs/vite/discussions/1791 */
window.MonacoEnvironment = {
    getWorker(_, label) {
        return new editorWorker()
    }
}