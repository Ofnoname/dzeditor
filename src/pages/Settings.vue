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

.css-editor {
	height: 70vh;
	margin-top: 1rem;
}
</style>

