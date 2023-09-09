<script setup>
import {computed} from "vue";
import {storeToRefs} from "pinia";

import {marked} from "marked";
import {markedHighlight} from "marked-highlight";
import markedKatex from "marked-katex-extension";
import hljs from "highlight.js";
import "highlight.js/styles/default.css"

import {useGs} from "../store.js";

const props = defineProps({
		text: {
				type: String,
				required: true,
		},
})

const gs = useGs()
const {markedSetting} = storeToRefs(gs)

marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
}))

marked.use(markedKatex({
		throwOnError: false,
		errorColor: '#cc0000',
		delimiters: [
				{left: "$$", right: "$$", display: true},
				{left: "$", right: "$", display: false},
				{left: "\\[", right: "\\]", display: true},
				{left: "\\(", right: "\\)", display: false},
		],
}))

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