import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { install } from '@icon-park/vue-next/es/all'
import '@icon-park/vue-next/styles/index.css';


import App from './App.vue'
import Editor from "./components/Editor.vue";
import {saveState, useFileStore} from "./store.js";

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

const fileStore = useFileStore()
fileStore.$subscribe((mutation, state) => {
    saveState('file', state)
})