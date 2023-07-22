<!-- 主界面 Editor -->
<template>
<!-- 编辑器 -->
	<div class="main">
		<div class="editor-pane" v-if="previewSetting < 2">
			<FileBar />
			<MonacoEditor v-model:value="currentFile.content" />
		</div>
		<div class="vertical-separate-line" v-if="previewSetting === 1"></div>
		<div class="preview-pane" v-html="previewText" v-if="previewSetting > 0"></div>
		<span class="preview-setting" @click="switchPreview()">
			<template v-if="previewSetting === 0"><icon-align-text-left/> 编辑</template>
			<template v-if="previewSetting === 1"><icon-contrast-view/> 分屏</template>
			<template v-if="previewSetting === 2"><icon-preview-open/> 预览</template>
		</span>
	</div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {storeToRefs} from "pinia";
import {marked} from "marked";

import {useFileStore, useSettingStore} from "../store.js";
import MonacoEditor from "../components/MonacoEditor.vue";
import FileBar from "../components/FileBar.vue";

const fileStore = useFileStore(),
		settingStore = useSettingStore()

const {previewSetting} = storeToRefs(settingStore),
    {currentFile} = storeToRefs(fileStore)

// 获取DOM元素
const input = ref(null),
		preview = ref(null)

let str = ref("")

// 更新文本
const previewText = computed(() => {
		return currentFile.value.content ? marked(currentFile.value.content) : ''
})

function switchPreview() {
		previewSetting.value = (previewSetting.value + 1) % 3
}

// 监听文件名变化, 动态修改网页标题
watch(() => fileStore.currentFile?.title, () => {
    document.title = fileStore.currentFile?.title + ' - 丁真编辑器'
})

onMounted(() => {
    if (fileStore.fileList.length === 0) {
				fileStore.newFile()
		}
})
</script>

<style scoped lang="scss">
.main{
	display: flex;
}

.editor-pane {
	width: 800px;
	height: 100vh;
	display: flex;
	flex-direction: column;
	flex: 1;
}

.preview-pane {
	overflow: auto;
	padding: 1rem;
	flex: 1;
}

.preview-setting{
	position: fixed;
	right: 0; top: 0;
	padding: .4rem .8rem;
	cursor: pointer;
	background-color: #eee;
	&:hover{
		background-color: #ddd;
	}
}
</style>
