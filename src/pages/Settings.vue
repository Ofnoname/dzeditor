<script setup>
import {storeToRefs} from "pinia";

import {useSettingStore} from "../store.js";

import MonacoEditor from "../components/MonacoEditor.vue";
import DropdownSelector from "../components/DropdownSelector.vue";
import Input from "../components/Input.vue";

const settingStore = useSettingStore(),
		{previewCssCode, presetCssName, editorSetting} = storeToRefs(settingStore)

let presetCssOption = "rightblue";

</script>

<template>
<div class="main">
		<h2>编辑器设置</h2>
		<div class="settings-editor">

		<!-- automaticLayout -->
		<h4>Automatic Layout</h4>
		<DropdownSelector
			:options="['true', 'false']"
			v-model="editorSetting.automaticLayout"
		/>

		<!-- wordWrap -->
		<h4>Word Wrap</h4>
		<DropdownSelector
			:options="['bounded', 'off', 'on']"
			v-model="editorSetting.wordWrap"
		/>

		<!-- theme -->
		<h4>Theme</h4>
		<DropdownSelector
			:options="['vs', 'hc-black', 'vs-dark']"
			v-model="editorSetting.theme"
		/>

		<!-- foldingStrategy -->
		<h4>Folding Strategy</h4>
		<DropdownSelector
			:options="['indentation']"
			v-model="editorSetting.foldingStrategy"
		/>

		<!-- lineNumbers -->
		<h4>Line Numbers</h4>
		<DropdownSelector
			:options="['on', 'off']"
			v-model="editorSetting.lineNumbers"
		/>

		<!-- cursorStyle -->
		<h4>Cursor Style</h4>
		<DropdownSelector
			:options="['line']"
			v-model="editorSetting.cursorStyle"
		/>

		<!-- cursorBlinking -->
		<h4>Cursor Blinking</h4>
		<DropdownSelector
			:options="['Solid']"
			v-model="editorSetting.cursorBlinking"
		/>

		<!-- renderLineHighlight -->
		<h4>Render Line Highlight</h4>
		<DropdownSelector
			:options="['all', 'line', 'none', 'gutter']"
			v-model="editorSetting.renderLineHighlight"
		/>

		<!-- autoClosingBrackets -->
		<h4>Auto Closing Brackets</h4>
		<DropdownSelector
			:options="['always', 'languageDefined', 'beforeWhitespace', 'never']"
			v-model="editorSetting.autoClosingBrackets"
		/>

		<!-- autoClosingDelete -->
		<h4>Auto Closing Delete</h4>
		<DropdownSelector
			:options="['always', 'never', 'auto']"
			v-model="editorSetting.autoClosingDelete"
		/>

		<!-- autoClosingQuotes -->
		<h4>Auto Closing Quotes</h4>
		<DropdownSelector
			:options="['always', 'languageDefined', 'beforeWhitespace', 'never']"
			v-model="editorSetting.autoClosingQuotes"
		/>

		<!-- wordWrapColumn -->
		<h4>Word Wrap Column</h4>
		<Input v-model="editorSetting.wordWrapColumn" />

		<!-- fontSize -->
		<h4>Font Size</h4>
		<Input v-model="editorSetting.fontSize" />

		<!-- fontFamily -->
		<h4>Font Family</h4>
		<Input v-model="editorSetting.fontFamily" />

		<!-- lineHeight -->
		<h4>Line Height</h4>
		<Input v-model="editorSetting.lineHeight" />

		<!-- tabSize -->
		<h4>Tab Size</h4>
		<Input v-model="editorSetting.tabSize" />

	</div>

		<h2>预览区设置</h2>
		<h4>选择预设</h4>
		<DropdownSelector :options="presetCssName" v-model="presetCssOption" class="selector"/>

		<h4>自定义 CSS</h4>
		<MonacoEditor class="css-editor" v-model:value="previewCssCode" :language="'css'"/>
</div>
</template>

<style scoped lang="scss">
.main{
	padding: 2rem;
	overflow: auto;
}

.css-editor {
	height: 400px;
	width: 100%;
	margin-top: 1rem;
}
</style>

