import { createApp } from 'vue'
import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import { createPinia } from 'pinia'

import '@icon-park/vue-next/styles/index.css';

import App from './App.vue'
// import Editor from "./pages/Editor.vue";
// import Settings from "./pages/Settings.vue";
// import Download from "./pages/Download.vue";
// import About from "./pages/About.vue";
import {saveState, useGs} from "./store.js";

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'

/* 路由 */
const router = createRouter({
    history: createWebHistory(),
    base: '/dzeditor',
    routes: [
        { path: '', component: () => import("./pages/Editor.vue")},
        { path: '/editor', component: () => import("./pages/Editor.vue")},
        { path: '/settings', component: () => import("./pages/Settings.vue")},
        { path: '/download', component: () => import("./pages/Download.vue")},
        { path: '/about', component: () => import("./pages/About.vue")},
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
    navigator.serviceWorker.register('serviceWorker.js')
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
        if (label === 'css') {
            return new cssWorker()
        }
        return new editorWorker()
    }
}