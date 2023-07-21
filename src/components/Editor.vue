<!-- 主界面 Editor -->
<template>
<!-- 编辑器 -->
	<div class="editor">
		<div class="editor-pane">
			<!-- 上栏	-->
			<div class="file-bar">
				<div class="title"
				     v-for="(file, index) in fileStore.fileList" :key="file.sign"
				     :class="{active: file.sign===fileStore.currentFile.sign}">
					<icon-align-text-left class="icon-file"/>
					<span class="title-name"
					      @input="updateTitle($event)"
					      @dblclick="setRename($event, true)"
					      @blur="setRename($event, false)"
					      @keyup.enter="setRename($event, false)"
					      @click="fileStore.switchFile(index)" >{{file.title}}</span>
					<icon-close class="icon-close" @click="fileStore.removeFile(index)" title="删除文件"/>
				</div>
				<icon-add class="icon-add" @click="fileStore.newFile()" title="新建文件"/>
			</div>
			<!-- 输入	-->
			<div class="input" ref="input" contenteditable
			     @input="updateText"
			     @blur="updateText">
				{{fileStore?.currentFile?.content}}
			</div>
		</div>

		<div class="vertical-separate-line"></div>
		<div class="preview-pane" ref="preview" v-html="previewText"></div>
		<span class="preview-setting" @click="setPreview()">
			<icon-align-text-left v-if="previewSetting === 0" title="编辑"/>
			<icon-preview-open v-if="previewSetting === 1" title="预览"/>
			<icon-contrast-view v-if="previewSetting === 2" title="分屏"/>
		</span>
	</div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'

import {marked} from "marked";

import {useFileStore, useSettingStore} from "../store.js";
import {storeToRefs} from "pinia";

const fileStore = useFileStore(),
		settingStore = useSettingStore()

const {previewSetting} = storeToRefs(settingStore)

// 获取DOM元素
const input = ref(null),
		preview = ref(null)

// 更新文本
const previewText = computed(() => {
		return marked(fileStore.currentFile?.content)
})

// 双击重命名，失去焦点和回车时取消编辑
function setRename(event, val) {
    event.target.setAttribute('contenteditable', val.toString());
}

function setPreview() {
		previewSetting.value = (previewSetting.value + 1) % 3
}

function updateText() {
    fileStore.currentFile.content = input.value.innerText
}

function updateTitle(event) {
		fileStore.currentFile.title = event.target.innerText
}

watch(() => fileStore.currentFile?.title, () => {
    document.title = fileStore.currentFile?.title + ' - 丁真编辑器'
})

onMounted(() => {
    if (fileStore.fileList.length === 0) {
				fileStore.newFile()
		}
		input.value.focus()
})
</script>

<style lang="scss">
.editor{
	display: flex;
}

.editor-pane {
	width: 800px;
	height: 100vh;

	font-family: Consolas;

	.input {
		padding: 1rem;
		width: 100%;
		outline: none;
		background-color: red;
		/* 添加更多的样式来美化你的输入区 */
	}
	/* 添加更多的样式来美化你的编辑器 */
}

.file-bar {
	display: flex;
	flex-wrap: wrap;
	background-color: #f0f0f0;
	> * {
		padding: .4rem .8rem;
		cursor: pointer;
	}

	.title{
		font-size: .6rem;
		.title-name{ padding: .5rem; }
		.icon-close{
			padding: .2rem;
			opacity: 0;
		}
		.icon-close:hover{
			background-color: #eee;
		}
		&:hover{
			background-color: #f8f8f8;
			.icon-close{
				opacity: 1;
			}
		}
		&.active{
			background-color: #fff;
			.icon-close{
				opacity: 1;
			}
		}
	}

	.icon-add:hover{
		background-color: #f8f8f8;
	}
}

.preview-pane {
	width: 800px;
	/* 添加更多的样式来美化你的预览区 */
}

.preview-setting{
	position: fixed;
	right: 0; top: 0;
	padding: .4rem .8rem;
	cursor: pointer;
	&:hover{
		background-color: #f8f8f8;
	}
}
</style>
