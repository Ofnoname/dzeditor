<template>
	<NConfigProvider :theme-overrides="themeOverrides">
	<NMessageProvider>
	<div id="app">
		<section class="sidebar">
<!--			<RouterLink :to="page.route" active-class="active"-->
<!--			            v-for="(page, idx) in pages" :key="idx"-->
<!--			            class="sidebar-option" />-->
<!--				<component :is="page.icon" class="icon"/>-->
<!--				{{ page.name }}-->
<!--			</RouterLink>-->
<!--				:collapsed="collapsed"-->
			<NMenu
				collapsed
				collapsed-width="48"
				:options="menuOptions"
			/>
		</section>
		<RouterView class="main"/>
	</div>
	</NMessageProvider>
	</NConfigProvider>
</template>

<script setup lang="jsx">
import {watch, ref, h} from "vue";
import {RouterLink, RouterView} from "vue-router";

import {NMessageProvider, NConfigProvider, NMenu, NIcon, darkTheme} from "naive-ui";

import {
    AlignTextLeft as IconAlignTextLeft,
    Download as IconDownload,
    Info as IconInfo,
    Setting as IconSetting
} from "@icon-park/vue-next";

import {useGs} from "./store.js";

const gs = useGs()

function renderIcon (icon) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

function renderMenuItem (item) {
		return () => <RouterLink to={item.route}>{item.name}</RouterLink>
}

const pages = [
    {name: '编辑', icon: IconAlignTextLeft, route: "/editor"},
    {name: '设置', icon: IconSetting, route: "/settings"},
    {name: '输出', icon: IconDownload, route: "/download"},
    {name: '关于', icon: IconInfo, route: "/about"}
];

const menuOptions = ref(pages.map(page => ({
		label: renderMenuItem(page),
		icon: renderIcon(page.icon),
		key: page.route,
})));

const themeOverrides = {
    common: {
        primaryColor: '#539cea',
        primaryColorHover: '#8bbcf0',
        primaryColorPressed: '#1b7be2',
        primaryColorSuppl: '#539cea', // 你可以根据需要进一步调整这个颜色
    },
}

/* 将 gs.previewCss.css 的样式文本同步到页面 */
watch(() => gs.previewCss.css, (value) => {
    const dynamicStyle = document.getElementById('dynamic-style')
    dynamicStyle.innerHTML = value
}, {immediate: true});

/* 当选择预设时，fetch 预设样式 */
watch(() => gs.previewCss.presetChoice, async (value) => {
    const fileName = `preset-${value}.css`
    const response = await fetch(fileName)
    gs.previewCss.css = await response.text()
}, {immediate: true});
</script>

<style scoped lang="scss">
#app {
	display: flex;
	height: 100vh;
	width: 100vw;
}

.sidebar {
	width: 48px;
	height: 100vh;
	background-color: #e0e0e0;
	user-select: none;
}

.main {
	width: calc(100vw - 3rem);
}
</style>