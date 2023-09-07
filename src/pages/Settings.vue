<script setup>
import { ref } from 'vue';
import {storeToRefs} from "pinia";

import {useGs} from "../store.js";

import MonacoEditor from "../components/MonacoEditor.vue";
import DropdownSelector from "../components/DropdownSelector.vue";
import Input from "../components/Input.vue";

const gs = useGs(),
    {previewCss, editorSetting} = storeToRefs(gs)

let presetCssOption = "rightblue";


const isCollapsed = ref({
    edS: true, // editorSetting
		prS: true, // previewSetting
		poS: false, // programSetting
    // Add more sections as needed
});

const editorSettingsConfig = [
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
</script>

<template>
	<div class="main">
		<h2 :class="{expanded: !isCollapsed.edS}" @click="isCollapsed.edS ^= 1">
			编辑器设置
		</h2>
		<div v-if="!isCollapsed.edS" class="settings-editor">
			<div v-for="setting in editorSettingsConfig" :key="setting.label">
				<h4>{{ setting.label }}</h4>
				<DropdownSelector v-if="setting.type === 'dropdown'" :options="setting.options" v-model="editorSetting[setting.model]" />
				<Input v-else-if="setting.type === 'input'" v-model="editorSetting[setting.model]" />
				<!-- Add other components for different types as needed -->
			</div>
		</div>

		<h2 :class="{expanded: !isCollapsed.prS}" @click="isCollapsed.prS ^= 1">
			预览区设置
		</h2>
		<div v-if="!isCollapsed.prS" class="settings-preview">
			<h4>选择预设</h4>
			<DropdownSelector :options="previewCss.preset" v-model="previewCss.presetChoice"/>

			<h4>自定义 CSS</h4>
			<MonacoEditor class="css-editor" v-model:value="previewCss.css" :language="'css'"/>
		</div>

		<h2 :class="{expanded: !isCollapsed.poS}" @click="isCollapsed.poS ^= 1">
			程序设置
		</h2>
		<div v-if="!isCollapsed.poS" class="settings-program">
			<h4>在编辑器中粘贴图片</h4>
			<DropdownSelector :options="['off', 'asMarkdown', 'asHTML']" v-model="gs.pasteImage"/>
		</div>
	</div>
</template>

<style scoped lang="scss">
/* General Styles */
.main {
	color: #333;

	overflow: auto;

	padding: 0 32px;
	background-color: #f5f5f5;
	border-radius: 5px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2, h3, h4 {
	user-select: none;
}

h4 {
	margin-bottom: .5rem;
}

h2{
	font-size: 1.2rem;
	cursor: pointer;

	padding: 10px;
	border-radius: 4px;

	transition: .2s all;

	&:hover {
		background-color: #e6e6e6;
	}
	&::before {
		content: '▶';
		display: inline-block;
		transition: transform 0.2s;
	}
	&.expanded::before {
		transform: rotate(90deg);
	}
}

.css-editor {
	height: 360px;
}

/* Button styles (if any) */
 button {
 	padding: 10px 15px;
 	background-color: #007BFF;
 	color: white;
 	border: none;
 	border-radius: 4px;
 	cursor: pointer;
 	transition: background-color 0.3s;
 }

 button:hover {
 	background-color: #0056b3;
 }

/* Additional styles can be added based on specific components and requirements */

</style>

