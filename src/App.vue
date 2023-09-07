<template>
	<div id="app">
		<section class="sidebar">
			<RouterLink :to="page.route" active-class="active"
			            v-for="(page, idx) in pages" :key="idx"
			            class="sidebar-option">
				<component :is="page.icon" class="icon"/>
				{{ page.name }}
			</RouterLink>
		</section>
		<RouterView class="main"/>
	</div>
</template>

<script setup>
import {watch} from "vue";
import {RouterLink, RouterView} from "vue-router";

import {
    AlignTextLeft as IconAlignTextLeft,
    Download as IconDownload,
    Info as IconInfo,
    Setting as IconSetting
} from "@icon-park/vue-next";

import {useGs} from "./store.js";

const gs = useGs()

const pages = [
    { name: '编辑', icon: IconAlignTextLeft, route: "/editor" },
    { name: '设置', icon: IconSetting, route: "/settings" },
    { name: '输出', icon: IconDownload, route: "/download" },
    { name: '关于', icon: IconInfo, route: "/about" }
];

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
	flex: 0 0 3rem;
	height: 100vh;

	display: flex;
	flex-direction: column;

	background-color: #e0e0e0;

	user-select: none;
}

.sidebar-option {
	flex: 0 1 3rem;
	width: 100%;

	padding-top: .5rem;
	color: #333;
	text-decoration: none;

	.icon {
		width: 100%;
		font-size: 1.4rem;
	}

	text-align: center;
	font-size: .6rem;
	cursor: pointer;

	&.active, &:hover {
		background-color: #fff;
	}
}

.main {
	width: calc(100vw - 3rem);
}
</style>