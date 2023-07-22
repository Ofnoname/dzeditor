<!-- 主界面 Editor -->
<template>
<!-- 编辑器 -->
	<div class="main">
		<div class="editor-pane" v-if="previewSetting < 2">
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
			<MonacoEditor v-model:value="currentFile.content" />
		</div>

		<div class="vertical-separate-line" v-if="previewSetting === 1"></div>
		<div class="preview-pane" ref="preview" v-html="previewText" v-if="previewSetting > 0"></div>
		<span class="preview-setting" @click="switchPreview()">
			<template v-if="previewSetting === 0"><icon-align-text-left/> 编辑</template>
			<template v-if="previewSetting === 1"><icon-contrast-view/> 分屏</template>
			<template v-if="previewSetting === 2"><icon-preview-open/> 预览</template>
		</span>
	</div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'

import {marked} from "marked";

import {useFileStore, useSettingStore} from "../store.js";
import {storeToRefs} from "pinia";
import MonacoEditor from "../components/MonacoEditor.vue";

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

// 双击重命名，失去焦点和回车时取消编辑
function setRename(event, val) {
    event.target.setAttribute('contenteditable', val.toString());
}

function switchPreview() {
		previewSetting.value = (previewSetting.value + 1) % 3
}
function updateTitle(event) {
		fileStore.currentFile.title = event.target.innerText
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
	padding: 1rem;
	flex: 1;
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
