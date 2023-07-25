<template>
		<div class="sidebar">
			<div v-for="(page, idx) in pages" :key="idx" @click="currentPageIdx = idx" class="sidebar-option" :class="{active: idx===currentPageIdx}">
				<icon-align-text-left class="icon"/>
				{{page.name}}
			</div>
		</div>
		<component :is="pages[currentPageIdx].component" class="main"/>
</template>

<script setup>
import {onMounted, ref, watchEffect} from "vue";

import {useSettingStore} from "./store.js";


import Editor from "./pages/Editor.vue";
import {storeToRefs} from "pinia";


const settingStore = useSettingStore(),
    {previewCssCode} = storeToRefs(settingStore)

const presetCssName = ['rightblue']
let presetCssCode = []

const pages = [{
    name: '编辑',
		component: Editor
}]
let currentPageIdx = ref(0)

watchEffect(() => {
    let styleTag = document.getElementById('previewCssCode');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'previewCssCode';
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = previewCssCode.value;
});

onMounted(() => {
    // open file
    for (name of presetCssName) {
        fetch(`/preset-${name}.css`)
            .then(response => response.text())
            .then(data => {
                presetCssCode.push(data)
		            if (previewCssCode.value === '') {
                        console.log('previewCssCode is empty')
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

	.sidebar-option {
		flex: 0 1 3rem;
		width: 100%;

		padding-top: .5rem;

		.icon{
			width: 100%;
			font-size: 1.4rem;
		}

		text-align: center;
		font-size: .6rem;
		cursor: pointer;

		&.active {
			background-color: #fff;
		}
	}
}

.main {
	flex: 1 1 0;
	height: 100vh;
}
</style>