<template>
	<div class="editor">
		<div class="editor-pane">
			<div class="file-bar">
				<div class="title" contenteditable
				     v-for="text in fileStore.fileList"
				     :class="{active: text.id===fileStore.currentFile.id}"
				     @input="updateTitle($event)"
				     @blur="updateTitle($event)"
						 @click="clickTitle(text.id)" >
					{{text.title}}
					<icon-close class="icon-close" @click="fileStore.removeFile(text.id)"/>
				</div>
				<div class="new-file-button" @click="fileStore.newFile()">+</div>
			</div>
			<div class="input" ref="input" contenteditable
			     @input="updateText"
			     @blur="updateText">
				{{fileStore?.currentFile?.content}}
			</div>
		</div>

		<div class="vertical-separate-line"></div>
		<div class="preview-pane" ref="preview" v-html="previewText"></div>
	</div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {marked} from "marked";

import {useFileStore} from "../store.js";
import {storeToRefs} from "pinia";

const fileStore = useFileStore()

// 获取DOM元素
const input = ref(null),
		preview = ref(null)

// 更新文本
// const previewText = computed(() => {
// 		return marked(fileStore.text)
// })

function updateText() {
    fileStore.currentFile.content = input.value.innerText
}

function updateTitle(event) {
		fileStore.currentFile.title = event.target.innerText
}

function clickTitle(id) {
		const index = fileStore.fileList.findIndex(item => item.id === id)
    fileStore.currentFile = fileStore.fileList[index]
}

watch(() => fileStore.currentFile, () => {
    document.title = fileStore.currentFile.title + ' - 丁真编辑器'
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
		.icon-close{
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

	.new-file-button:hover{
		background-color: #fff;
	}
}

.preview-pane {
	width: 800px;
	/* 添加更多的样式来美化你的预览区 */
}
</style>
