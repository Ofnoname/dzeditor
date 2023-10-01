<template>
<NConfigProvider :theme-overrides="theme">
<NMessageProvider>
<div id="app">
	<Menu class="sidebar"/>
	<RouterView class="main"/>
</div>
</NMessageProvider>
</NConfigProvider>
</template>

<script setup>
import {onMounted} from "vue";
import {RouterView} from "vue-router";

import {NMessageProvider, NConfigProvider, darkTheme} from "naive-ui";

import Menu from "./components/Menu.vue";
import {usePreview} from "./util/preview.js";

const theme = {
    common: {
        primaryColor: '#539cea',
        primaryColorHover: '#8bbcf0',
        primaryColorPressed: '#1b7be2',
        primaryColorSuppl: '#539cea', // 你可以根据需要进一步调整这个颜色
    },
}

usePreview()

onMounted(() => {
    if ('serviceWorker' in navigator && 'localStorage' in window) {}
    else {
        window.alert("您的浏览器不支持 Service Worker 或者 localStorage，无法使用本地粘贴图片功能。")
    }
})
</script>

<style scoped lang="scss">
#app {
	display: flex;
	height: 100vh;
	width: 100vw;
}

.sidebar {
	width: 3rem;
}

.main {
	width: calc(100vw - 3rem);
}
</style>