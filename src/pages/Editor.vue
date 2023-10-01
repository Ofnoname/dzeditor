<template>
<div class="main">
	<div class="editor-pane" v-show="pm < 2">
		<FileBar />
		<MonacoEditor v-if="cf" class="content-editor"
		              @updated="mi = $event"
		              v-model:text="cf.content"
		              :language="'markdown'" :options="gs.editorSetting"/>

		<!--	无文件时的占位界面	-->
		<section v-else class="content-empty">
			Ctrl + Alt + N 新建文件 <br>
			Ctrl + Alt + O 打开文件
		</section>

		<!--	状态栏		-->
		<section class="status-bar">
			<div class="from-left">
				<div class="status-item">{{mi?.cursorPosition.lineNumber}}:{{mi?.cursorPosition.column}}</div>
				<div class="status-item">{{mi?.wordCount}} 个字符</div>
			</div>
		</section>
	</div>

	<PreviewPane :text="cf?.content" v-if="pm > 0"/>

	<!--	切换预览模式按钮 	-->
	<section class="preview-setting" @click="gs.switchPreviewMode">
		<template v-if="pm === 0"><IconAlignTextLeft/> 编辑</template>
		<template v-if="pm === 1"><IconContrastView/> 分屏</template>
		<template v-if="pm === 2"><IconPreviewOpen/> 预览</template>
	</section>
</div>
</template>

<script setup>
import {onMounted, watch, ref} from 'vue'
import {storeToRefs} from "pinia";

import {
    AlignTextLeft as IconAlignTextLeft,
		ContrastView as IconContrastView,
		PreviewOpen as IconPreviewOpen,
} from "@icon-park/vue-next";

import {useGs} from "../store.js";
import {useFileSC} from "../util/shortcut.js";
import MonacoEditor from "../components/MonacoEditor.vue";
import FileBar from "../components/FileBar.vue";
import PreviewPane from "../components/PreviewPane.vue";

const gs = useGs()
const {previewMode: pm, currentFile: cf} = storeToRefs(gs)

const name = '丁真编辑器'
const mi = ref(null)

watch(() => cf.value?.title, (val) => {
		document.title = val ? val + ' - ' + name : name
}, {immediate: true})

watch(cf, (val) => {
		if (!val) pm.value = 0
})

useFileSC()

onMounted(() => {
	  const index = gs.fileList.findIndex(file => file.sign === cf.value.sign)
	  gs.switchFile(index)
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

	.content-editor, .content-empty{
		flex: 1 1 0;
	}
}

.content-empty {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.5rem;
	color: #aaa;
	user-select: none;
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
	height: 2rem;
	cursor: pointer;
	background-color: #eee;
	color: #666;
	&:hover{
		color: #000;
		background-color: #ddd;
	}
}
</style>
