<!-- 主界面 Editor -->
<template>
	<div class="main">
		<div class="editor-pane" v-if="previewSetting < 2">
			<FileBar />
			<MonacoEditor class="content-editor" v-model:value="currentFile.content" :language="'markdown'"/>
		</div>
		<div class="preview-pane" v-html="previewText" v-if="previewSetting > 0"></div>
		<span class="preview-setting" @click="switchPreview()">
			<template v-if="previewSetting === 0"><icon-align-text-left/> 编辑</template>
			<template v-if="previewSetting === 1"><icon-contrast-view/> 分屏</template>
			<template v-if="previewSetting === 2"><icon-preview-open/> 预览</template>
		</span>
	</div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, watch, watchEffect} from 'vue'
import {storeToRefs} from "pinia";
import {marked} from "marked";

import {useFileStore, useSettingStore} from "../store.js";
import MonacoEditor from "../components/MonacoEditor.vue";
import FileBar from "../components/FileBar.vue";

const fileStore = useFileStore(),
		settingStore = useSettingStore()

const {previewSetting} = storeToRefs(settingStore),
    {currentFile, fileList} = storeToRefs(fileStore)

// 更新文本
const previewText = computed(() => {
		return currentFile.value.content ? marked(currentFile.value.content) : ''
})

function switchPreview() {
		previewSetting.value = (previewSetting.value + 1) % 3
}

let keyEventHandle = null
function keyEvent(event) {
    if (event.altKey) {
        if (event.key === 'w') {
            fileStore.removeCurrentFile()
        }
        else if (event.key === 'n') {
            fileStore.newFile()
        }
        else if (event.key === 'o') {
            fileStore.openFile()
        }
    }
}

// 监听文件名变化, 动态修改网页标题
watch(() => currentFile.value?.title, (val) => {
    if (val)
      document.title = val + ' - 丁真编辑器'
		else
			document.title = '丁真编辑器'
})

onMounted(() => {
    // 加载文件
    const index = fileList.value.findIndex(file => file.sign === currentFile.value.sign)
		fileStore.switchFile(index)
    if (fileStore.fileList.length === 0) {
				fileStore.newFile()
		}

		keyEventHandle = window.addEventListener('keyup', keyEvent)
})

onUnmounted(() => {
		window.removeEventListener('keyup', keyEventHandle)
})
</script>

<style scoped lang="scss">
.main{
	display: flex;
}

.editor-pane {
	flex: 1 1 0;

	display: flex;
	flex-direction: column;
	overflow: clip;
	.content-editor{
		flex: 1 1 0;
	}
}

.preview-pane {
	overflow: clip;
	overflow-y: auto;
	word-wrap: anywhere;
	padding: 0 3rem;
	flex: 1 1 0;
}

.preview-setting{
	position: fixed;
	right: 0; top: 0;
	padding: .3rem .8rem;
	cursor: pointer;
	background-color: #eee;
	&:hover{
		background-color: #ddd;
	}
}
</style>
