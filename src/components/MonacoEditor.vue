<template>
	<div ref="editor" class="monaco-editor"></div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch, computed} from 'vue'
import * as monaco from 'monaco-editor'
import {storeToRefs} from "pinia";
import {useSettingStore} from "../store.js";

const editor = ref(null);

const props = defineProps(['value', 'language', 'options'])
const emits = defineEmits(['update:value', 'send-editor-info'])

const settingStore = useSettingStore(),
		{previewSetting} = storeToRefs(settingStore)

let textModel, monacoEditor

const resizeListener = () => {
    monacoEditor.layout();
};

onMounted(() => {
		textModel = monaco.editor.createModel(props.value, props.language)
    monacoEditor = monaco.editor.create(editor.value, {
        model: textModel,
		   ...props.options
    })
    textModel.onDidChangeContent(e => {
        emits('update:value', textModel.getValue())
    })
    monacoEditor.onDidChangeCursorPosition(e => {
        updateEditorInfo();
    });
		window.addEventListener('resize', resizeListener)
    updateEditorInfo();
})

function updateEditorInfo() {
		emits('send-editor-info', {
				wordCount: monacoEditor.getValue().length,
				cursorPosition: monacoEditor.getPosition(),
				// eolType: monacoEditor.getModel().getEOL() === '\r\n' ? 'CRLF' : 'LF',
				// indentType: monacoEditor.getModel().getOptions().insertSpaces ? 'Space' : 'Tab'
		})
}

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
}
</style>
