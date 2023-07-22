import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { install } from '@icon-park/vue-next/es/all'
import '@icon-park/vue-next/styles/index.css';


import App from './App.vue'
import Editor from "./pages/Editor.vue";
import {saveState, useFileStore, useSettingStore} from "./store.js";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Editor},
    ]
})

const app = createApp(App)
install(app)

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