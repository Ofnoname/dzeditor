<template>
	<div ref="editor" class="monaco-editor"></div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch} from 'vue'
import * as monaco from 'monaco-editor'

let editor = ref(null)

const props = defineProps(['value'])
const emits = defineEmits(['update:value'])

let textModel, monacoEditor

onMounted(() => {
		textModel = monaco.editor.createModel(props.value, 'markdown')
    monacoEditor = monaco.editor.create(editor.value, {
        model: textModel,
        wordWrap: "wordWrapColumn",
        fontFamily: "Consolas, 'Courier New', Monaco, 'Lucida Console', Menlo, 'Liberation Mono', sans-serif",
        fontSize: 16,
        automaticLayout: true,
    })
    textModel.onDidChangeContent(e => {
        emits('update:value', textModel.getValue())
    })
})

onBeforeUnmount(() => {
    monacoEditor.dispose()
})
</script>

<style scoped>
.monaco-editor {
	width: 100%;
	flex: 1;
}
</style>
