<template>
	<div ref="editor" class="monaco-editor"></div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch} from 'vue'
import * as monaco from 'monaco-editor'
import {storeToRefs} from "pinia";
import {useSettingStore} from "../store.js";

const editor = ref(null);

const props = defineProps(['value'])
const emits = defineEmits(['update:value'])

const settingStore = useSettingStore(),
		{previewSetting} = storeToRefs(settingStore)

let textModel, monacoEditor

const resizeListener = () => {
    console.log('resize')
		debugger
    monacoEditor.layout();
};

onMounted(() => {
		textModel = monaco.editor.createModel(props.value, 'markdown')
    monacoEditor = monaco.editor.create(editor.value, {
        model: textModel,
        wordWrap: "bounded",
        fontFamily: "Consolas, 'Courier New', Monaco, 'Lucida Console', Menlo, 'Liberation Mono', sans-serif",
        fontSize: 16,
        // automaticLayout: true,
		    minimap: {
            enabled: false
		    }
    })
    textModel.onDidChangeContent(e => {
        emits('update:value', textModel.getValue())
    })
		// window.addEventListener('resize', resizeListener)
})

watch(props, (newProps) => {
    // Update the editor's content whenever props.value changes
    if (textModel.getValue() !== newProps.value) {
        textModel.setValue(newProps.value)
    }
}, { deep: true })  // Watch object deeply

watch(()=>previewSetting.value, resizeListener)

onBeforeUnmount(() => {
    monacoEditor.dispose()
		window.removeEventListener('resize', resizeListener)
})
</script>

<style scoped>
.monaco-editor {
	width: 100%;
	flex: 1 0 0;
}
</style>
