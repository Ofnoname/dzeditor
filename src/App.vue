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
import {onMounted, watchEffect} from "vue";
import {storeToRefs} from "pinia";
import {RouterLink, RouterView} from "vue-router";

import {
    AlignTextLeft as IconAlignTextLeft,
    Download as IconDownload,
    Info as IconInfo,
    Setting as IconSetting
} from "@icon-park/vue-next";

import {useSettingStore} from "./store.js";

const settingStore = useSettingStore(),
    {previewCssCode, presetCssName, presetCssCode} = storeToRefs(settingStore)

const pages = [
    { name: '编辑', icon: IconAlignTextLeft, route: "/editor" },
    { name: '设置', icon: IconSetting, route: "/settings" },
    { name: '输出', icon: IconDownload, route: "/download" },
    { name: '关于', icon: IconInfo, route: "/about" }
];

watchEffect(() => {
    document.getElementById('previewCssCode').innerHTML = previewCssCode.value;
});

onMounted(() => {
    presetCssCode.value = []
    for (name of presetCssName.value) {
        fetch(`/preset-${name}.css`)
            .then(response => response.text())
            .then(data => {
                presetCssCode.value.push(data)
                if (previewCssCode.value === '') {
                    previewCssCode.value = data
                }
            });
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
	flex: 0 0 3rem;
	height: 100vh;

	display: flex;
	flex-direction: column;

	background-color: #f0f0f0;
	border-right: 1px solid #ccc;

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
		color: #000;
		background-color: #fff;
	}
}

.main {
	flex: 1 1 0;
	height: 100vh;
}
</style>