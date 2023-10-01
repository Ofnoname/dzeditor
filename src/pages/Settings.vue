<script setup>
import {storeToRefs} from "pinia";

import localforage from "localforage";
import {NButton, NInput, NSelect, NCollapse, NCollapseItem} from "naive-ui";

import {useGs} from "../store.js";
import MonacoEditor from "../components/MonacoEditor.vue";

const gs = useGs(),
    {previewCss, editorSetting} = storeToRefs(gs)

const es = [
    {
        label: "Automatic Layout",
        type: "dropdown",
        options: ["true", "false"],
        model: "automaticLayout"
    },
    {
        label: "Word Wrap",
        type: "dropdown",
        options: ["bounded", "off", "on"],
        model: "wordWrap"
    },
    {
        label: "Theme",
        type: "dropdown",
        options: ["vs", "hc-black", "vs-dark"],
        model: "theme"
    },
    {
        label: "Folding Strategy",
        type: "dropdown",
        options: ["indentation", "auto", "none"],
        model: "foldingStrategy"
    },
    {
        label: "Line Numbers",
        type: "dropdown",
        options: ["on", "off"],
        model: "lineNumbers"
    },
    {
        label: "Cursor Style",
        type: "dropdown",
        options: ["line", "block", "underline", "line-thin", "block-outline", "underline-thin"],
        model: "cursorStyle"
    },
    {
        label: "Cursor Blinking",
        type: "dropdown",
        options: ["solid", "blink", "smooth", "phase", "expand", "solid-reverse", "blink-reverse", "smooth-reverse", "phase-reverse", "expand-reverse"],
        model: "cursorBlinking"
    },
    {
        label: "Render Line Highlight",
        type: "dropdown",
        options: ["all", "line", "none", "gutter"],
        model: "renderLineHighlight"
    },
    {
        label: "Auto Closing Brackets",
        type: "dropdown",
        options: ["always", "languageDefined", "beforeWhitespace", "never"],
        model: "autoClosingBrackets"
    },
    {
        label: "Auto Closing Delete",
        type: "dropdown",
        options: ["always", "never", "auto"],
        model: "autoClosingDelete"
    },
    {
        label: "Auto Closing Quotes",
        type: "dropdown",
        options: ["always", "languageDefined", "beforeWhitespace", "never"],
        model: "autoClosingQuotes"
    },
    {
        label: "Word Wrap Column",
        type: "input",
        model: "wordWrapColumn"
    },
    {
        label: "Font Size",
        type: "input",
        model: "fontSize"
    },
    {
        label: "Font Family",
        type: "input",
        model: "fontFamily"
    },
    {
        label: "Line Height",
        type: "input",
        model: "lineHeight"
    },
    {
        label: "Tab Size",
        type: "input",
        model: "tabSize"
    },

    // ... (其他设置项可以按照类似的格式添加)
];
const om = li => li.map(i => ({label: i, value: i}));
</script>

<template>
<NCollapse class="n-collapse main" id="main"
           :default-expanded-names="['p']">
	<!--	编辑器设置	-->
	<NCollapseItem title="编辑器设置">
		<div v-for="setting in es" :key="setting.label">
			<h4>{{ setting.label }}</h4>
			<NSelect v-if="setting.type === 'dropdown'"
			         class="n-select"
			         v-model:value="editorSetting[setting.model]" :options="om(setting.options)" />
			<NInput v-else-if="setting.type === 'input'"
			        v-model:value="editorSetting[setting.model]" type="text" placeholder="" />
		</div>
	</NCollapseItem>

	<!--	预览区设置	-->
	<NCollapseItem title="预览区设置">
		<h4>选择预设</h4>
		<NSelect class="n-select"
		         v-model:value="previewCss.presetChoice" :options="om(previewCss.preset)" />

		<h4>自定义 CSS</h4>
		<MonacoEditor class="css-editor" v-model:text="previewCss.css" :language="'css'"/>
	</NCollapseItem>

	<!--	程序设置	-->
	<NCollapseItem title="程序设置" name="p">
		<h4>在编辑器中粘贴图片</h4>
		<NSelect class="n-select"
		         v-model:value="gs.pasteImage" :options="om(['off', 'asMarkdown', 'asHTML'])" />
		<NButton size="large" class="n-button" type="primary" @click="localforage.clear">清空本地图片</NButton>
		<NButton size="large" class="n-button" type="warning" @click="gs.$reset">恢复默认设置</NButton>
	</NCollapseItem>
</NCollapse>
</template>

<style scoped lang="scss">
.main {
	padding: 32px;
	background-color: #f5f5f5;
	overflow: auto;
}

h4 {
	margin-bottom: .5rem;
	user-select: none;
}

.css-editor {
	height: 360px;
	border-radius: 4px;
}

.n-select{
	max-width: 200px;
}

.n-button{
	display: block;
	margin-top: 1rem;
}
</style>

<style lang="scss">
/* 这个 class 用于覆盖 Naive UI 的样式。此样式在文中不存在，是由 Naive UI 生成的。*/
#main .n-collapse-item__header {
	font-weight: bolder;
	padding: 10px 0;
	border-radius: 4px;
	user-select: none;

	transition: .2s all;

	&:hover {
		background-color: #e6e6e6;
	}
}
</style>