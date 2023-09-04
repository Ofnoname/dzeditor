<!-- 主界面 Editor -->
<template>
	<div class="main">
		<div class="editor-pane" v-show="previewSetting < 2">
			<FileBar />
			<MonacoEditor v-if="currentFile" class="content-editor"
			              v-model:value="currentFile.content"
			              :language="'markdown'"
			              :options="editorSetting"
			              @sendEditorInfo="updateEditorInfo"/>
			<div v-else class="content-empty">
				Alt + N 新建文件 <br>
				Alt + O 打开文件
			</div>
			<div class="status-bar">
				<div class="from-left">
					<div class="status-item">{{editorInfo.cursorPosition?.lineNumber}}:{{editorInfo.cursorPosition?.column}}</div>
					<div class="status-item">{{editorInfo.wordCount}} 个字符</div>
				</div>
				<div class="from-right">
					<div class="status-item">{{editorInfo.eolType}}</div>
					<div class="status-item">{{editorInfo.indentType}}</div>
				</div>
			</div>
		</div>
		<div class="preview-pane" v-html="previewText" v-if="previewSetting > 0"></div>
		<span class="preview-setting" @click="switchPreview()">
			<template v-if="previewSetting === 0"><IconAlignTextLeft/> 编辑</template>
			<template v-if="previewSetting === 1"><IconContrastView/> 分屏</template>
			<template v-if="previewSetting === 2"><IconPreviewOpen/> 预览</template>
		</span>
	</div>
</template>

<script setup>
import {computed, onMounted, watch, onBeforeUnmount, ref} from 'vue'
import {storeToRefs} from "pinia";

import {
    AlignTextLeft as IconAlignTextLeft,
		ContrastView as IconContrastView,
		PreviewOpen as IconPreviewOpen,
} from "@icon-park/vue-next";
import {marked} from "marked";

import {useFileStore, useSettingStore} from "../store.js";
import MonacoEditor from "../components/MonacoEditor.vue";
import FileBar from "../components/FileBar.vue";

const fileStore = useFileStore(),
		settingStore = useSettingStore()

const {previewSetting, editorSetting} = storeToRefs(settingStore),
    {currentFile, fileList} = storeToRefs(fileStore)

// 更新文本
const previewText = computed(() => {
		return currentFile.value ? marked(currentFile.value.content) : ''
})

const editorInfo = ref({})

function updateEditorInfo(info) {
		editorInfo.value = info
}

function switchPreview() {
		previewSetting.value = (previewSetting.value + 1) % 3
}

// 响应快捷键
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
        else if (event.key === 'q') {
            switchPreview()
        }
    }
}

// 监听文件名变化, 动态修改网页标题
watch(() => currentFile.value?.title, (val) => {
    if (val)
      document.title = val + ' - 丁真编辑器'
		else
			document.title = '丁真编辑器'
}, {immediate: true})

watch(() => currentFile.value, (val) => {
		if (!val)
        previewSetting.value = 0
})

onMounted(() => {
    // 如果是第一次打开, 则新建一个文件
		if (fileList.value.length === 0 && fileStore.increment === 1000) {
				fileStore.newFile()
		}
    // 加载文件
		else {
        const index = fileList.value.findIndex(file => file.sign === currentFile.value.sign)
        fileStore.switchFile(index)
		}

		window.addEventListener('keyup', keyEvent)
})

onBeforeUnmount(() => {
		window.removeEventListener('keyup', keyEvent)
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
	.content-empty{
		flex: 1 1 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.5rem;
		color: #aaa;
		user-select: none;
	}
}

.status-bar{
	background-color: #eee;
	user-select: none;

	display: flex;
	justify-content: space-between; /* 两端分布 */
}

.from-left, .from-right{
	display: flex;
	align-items: center;
}

.status-item{
	display: inline-block;
	font-size: .85rem;
	color: #666;
	padding: .2rem 1rem;
	&:hover{
		color: #000;
		background-color: #ddd;
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
	color: #666;
	&:hover{
		color: #000;
		background-color: #ddd;
	}
}
</style>
