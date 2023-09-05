import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import { createPinia } from 'pinia'

import '@icon-park/vue-next/styles/index.css';

import App from './App.vue'
import Editor from "./pages/Editor.vue";
import Settings from "./pages/Settings.vue";
import Download from "./pages/Download.vue";
import About from "./pages/About.vue";
import {saveState, useFileStore, useSettingStore} from "./store.js";

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

const app = createApp(App)

app.use(createPinia())
.use(router)
.mount('#app')

const fileStore = useFileStore(),
    settingStore = useSettingStore()
fileStore.$subscribe((mutation, state) => {
    saveState('file', state)
})
settingStore.$subscribe((mutation, state) => {
    saveState('setting', state)
})


/* From https://github.com/vitejs/vite/discussions/1791 */

// 解决 Monaco Editor 无法加载 worker 的问题
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'

window.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        return new editorWorker()
    }
}