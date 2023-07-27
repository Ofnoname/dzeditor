<script setup>
import {storeToRefs} from "pinia";

import {useSettingStore} from "../store.js";
import MonacoEditor from "../components/MonacoEditor.vue";
import DropdownSelector from "../components/DropdownSelector.vue";

const settingStore = useSettingStore(),
		{previewCssCode, presetCssName} = storeToRefs(settingStore)


</script>

<template>
<div class="main">
	<div class="preview-setting">
		<h1>预览区样式</h1>
		<DropdownSelector :options="presetCssName"/>
		<MonacoEditor class="css-editor" v-model:value="previewCssCode" :language="'css'"/>
	</div>
</div>
</template>

<style scoped lang="scss">
.main{
	display: flex;
}

.preview-setting{
	flex: 1 1 0;
	padding: 0 3rem;
}

.button {
	padding: 0.5rem 1rem;
	background-color: transparent;
	color: #007BFF; /* 你可以根据需要更改字体颜色 */
	border: 1px solid #007BFF; /* 你可以根据需要更改边框样式 */
	border-radius: .25rem; /* 给按钮添加圆角 */
	transition: .2s;
	cursor: pointer;

	&:hover {
		background-color: #007BFF; /* 当鼠标悬停在按钮上时，填充背景颜色 */
		color: white; /* 当鼠标悬停在按钮上时，改变字体颜色 */
	}
}

.css-editor {
	height: 70vh;
	margin-top: 1rem;
}
</style>

