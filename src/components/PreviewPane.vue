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

const previewText = computed(() => {
    return props.text ? marked.parse(props.text, markedSetting) : ''
})
</script>

<template>
	<div class="preview-pane" v-html="previewText"></div>
</template>

<style scoped lang="scss">
.preview-pane {
	border-left: 1px solid #ddd;

	padding: 1rem 3rem;

	overflow: clip;
	overflow-y: auto;
	word-wrap: anywhere;
}
</style>