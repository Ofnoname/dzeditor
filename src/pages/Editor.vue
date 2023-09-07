<!-- 主界面 Editor -->
<template>
	<div class="main">
		<div class="editor-pane" v-show="previewMode < 2">
			<FileBar />
			<MonacoEditor v-if="currentFile" class="content-editor"
			              v-model:value="currentFile.content"
			              :language="'markdown'"
			              :options="editorSetting"
			              @sendEditorInfo="updateEditorInfo"/>

			<!--	无文件时的占位界面	-->
			<div v-else class="content-empty">
				Alt + N 新建文件 <br>
				Alt + O 打开文件
			</div>

			<!--	状态栏		-->
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

		<PreviewPane :text="currentFile?.content" v-if="previewMode > 0"/>

		<!--	切换预览模式按钮 	-->
		<span class="preview-setting" @click="switchPreview()">
			<template v-if="previewMode === 0"><IconAlignTextLeft/> 编辑</template>
			<template v-if="previewMode === 1"><IconContrastView/> 分屏</template>
			<template v-if="previewMode === 2"><IconPreviewOpen/> 预览</template>
		</span>
	</div>
</template>

<script setup>
import {onMounted, watch, onBeforeUnmount, ref} from 'vue'
import {storeToRefs} from "pinia";

import localforage from 'localforage'

import {
    AlignTextLeft as IconAlignTextLeft,
		ContrastView as IconContrastView,
		PreviewOpen as IconPreviewOpen,
} from "@icon-park/vue-next";

import {useGs} from "../store.js";
import MonacoEditor from "../components/MonacoEditor.vue";
import FileBar from "../components/FileBar.vue";
import PreviewPane from "../components/PreviewPane.vue";

const gs = useGs()
const {previewMode, editorSetting, currentFile, fileList} = storeToRefs(gs)

const editorInfo = ref({})

function updateEditorInfo(info) {
		editorInfo.value = info
}

function switchPreview() {
		previewMode.value = (previewMode.value + 1) % 3
}

// 响应快捷键
function keyEvent(event) {
    if (event.altKey) {
        if (event.key === 'w') {
            gs.removeCurrentFile()
        }
        else if (event.key === 'n') {
            gs.newFile()
        }
        else if (event.key === 'o') {
            gs.openFile()
        }
        else if (event.key === 'q') {
            switchPreview()
        }
    }
}

// 在 monaco 捕获粘贴之前捕获粘贴事件，如果是图片则插入图片
function pasteImageEvent(event) {
    if (gs.pasteImage === "off")
				return
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const index in items) {
        const item = items[index];
        if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = async function(event){
                const dataURL = event.target.result;
                const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

                // Save the image to IndexedDB
                await localforage.setItem(uniqueName, dataURL);

                // Use the saved image's name in the editor content
		            const t = (gs.pasteImage === "asMarkdown") ?
				            `![](image/${uniqueName})` :
				            `<img src="image/${uniqueName}">`

		            // insert t to monaco from its current cursor


                event.stopPropagation();
            };
            reader.readAsDataURL(blob);
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

watch(currentFile, (val) => {
		if (!val)
        previewMode.value = 0
})

onMounted(() => {
    // 如果是第一次打开, 则新建一个文件
		if (fileList.value.length === 0 && gs.fileAutoInc === 1000) {
				gs.newFile()
		}
    // 加载文件
		else {
        const index = fileList.value.findIndex(file => file.sign === currentFile.value.sign)
        gs.switchFile(index)
		}

		window.addEventListener('keyup', keyEvent)
    window.addEventListener('paste', pasteImageEvent, true)
})

onBeforeUnmount(() => {
		window.removeEventListener('keyup', keyEvent)
		window.removeEventListener('paste', pasteImageEvent, true)
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
