<script setup>
import {computed, ref, watchEffect} from "vue";

import {useGs} from "../store.js";
import {useMarked} from "../util/marked.js";

const props = defineProps({
		text: {
				type: String,
				required: true,
		},
})

const gs = useGs()
const marked = useMarked()

const p = computed(() => {
    marked.loading.value;
    return props.text ? marked.parse(props.text, gs.markedSetting) : ''
})
</script>

<template>
<div class="preview-pane" v-html="p"></div>
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