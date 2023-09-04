<template>
	<div class="sidebar">
		<div v-for="(page, idx) in pages" :key="idx"
		     @click="currentPageIdx = idx"
		     class="sidebar-option" :class="{active: idx===currentPageIdx}">
			<component :is="page.icon" class="icon"/>
			{{ page.name }}
		</div>
	</div>
	<component :is="pages[currentPageIdx].component" class="main"/>
</template>

<script setup>
import {onMounted, ref, watchEffect} from "vue";
import {storeToRefs} from "pinia";

import {
    AlignTextLeft as IconAlignTextLeft,
    Download as IconDownload,
    Info as IconInfo,
    Setting as IconSetting
} from "@icon-park/vue-next";

import {useSettingStore} from "./store.js";

import Editor from "./pages/Editor.vue";
import Settings from "./pages/Settings.vue";
import Download from "./pages/Download.vue";
import About from "./pages/About.vue";

const settingStore = useSettingStore(),
    {previewCssCode, presetCssName, presetCssCode} = storeToRefs(settingStore)

const pages = [{
		    name: '编辑',
		    component: Editor,
		    icon: IconAlignTextLeft
		},
    {
        name: '设置',
        component: Settings,
        icon: IconSetting
    },
    {
        name: '输出',
        component: Download,
        icon: IconDownload
    },
    {
        name: '关于',
        component: About,
        icon: IconInfo
    }]


let currentPageIdx = ref(0)

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
.sidebar {
	flex: 0 0 3rem;
	height: 100vh;

	display: flex;
	flex-direction: column;

	background-color: #f0f0f0;
	border-right: 1px solid #ccc;
}

.sidebar-option {
	flex: 0 1 3rem;
	width: 100%;

	padding-top: .5rem;
	color: #333;

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