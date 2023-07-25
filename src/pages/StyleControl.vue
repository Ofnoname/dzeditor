<script setup>
import {watchEffect} from "vue";

import {useSettingStore} from "../store.js";

const settingStore = useSettingStore(),
		{previewCssCode} = settingStore


</script>

<template>
<div class="main">
	<div class="preview">

	</div>
</div>
</template>

<style scoped lang="scss">
.main{
	display: flex;
}

</style>

