<script setup>
import {computed} from "vue";
import {storeToRefs} from "pinia";

import {marked} from "marked";

import {useGs} from "../store.js";

const props = defineProps({
		text: {
				type: String,
				required: true,
		},
})

const gs = useGs()
const {markedSetting} = storeToRefs(gs)

marked.setOptions({
		...markedSetting.value,
		headerIds: false,
		mangle: false,
})

const previewText = computed(() => {
    return props.text ? marked.parse(props.text, markedSetting.value) : ''
})
</script>

<template>
	<div class="preview-pane" v-html="previewText"></div>
</template>

<style scoped lang="scss">
.preview-pane {
	border-left: 1px solid #ddd;

	padding: 1rem 3rem;

	overflow-x: auto;
	overflow-y: auto;
	word-break: break-word;
	overflow-wrap: break-word;
}
</style>