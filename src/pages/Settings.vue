<script setup>
import {storeToRefs} from "pinia";

import {useSettingStore} from "../store.js";
import MonacoEditor from "../components/MonacoEditor.vue";
import DropdownSelector from "../components/DropdownSelector.vue";

const settingStore = useSettingStore(),
		{previewCssCode, presetCssName} = storeToRefs(settingStore)

let presetCssOption = "rightblue";

</script>

<template>
<div class="main">
		<h2>预览区样式</h2>
		<h3>选择预设</h3>
		<DropdownSelector :options="presetCssName" v-model="presetCssOption" class="selector"/>

		<h3>自定义 CSS</h3>
		<MonacoEditor class="css-editor" v-model:value="previewCssCode" :language="'css'"/>
</div>
</template>

<style scoped lang="scss">
.main{
	padding: 2rem;
}

.css-editor {
	height: 70vh;
	width: 100%;
	margin-top: 1rem;
}
</style>

