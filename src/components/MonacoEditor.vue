<template>
	<div ref="editor" class="monaco-editor"></div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch} from 'vue'
import * as monaco from 'monaco-editor'
import {storeToRefs} from "pinia";
import {useGs} from "../store.js";

const editor = ref(null);

const props = defineProps(['value', 'language', 'options'])
const emits = defineEmits(['update:value', 'send-editor-info'])

const gs = useGs()
const {previewMode} = storeToRefs(gs)

let textModel, monacoEditor

// Resize the editor whenever the window size changes or the preview setting changes
const resizeListener = () => {
    // switch editor to display:none and back to fix layout issues
		editor.value.style.display = 'none'
		monacoEditor.layout()
		editor.value.style.display = 'block'
};

onMounted(() => {
		textModel = monaco.editor.createModel(props.value, props.language)
    monacoEditor = monaco.editor.create(editor.value, {
        model: textModel,
		    automaticLayout: true,
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

watch(()=>previewMode.value, resizeListener)

onBeforeUnmount(() => {
    monacoEditor.dispose()
		window.removeEventListener('resize', resizeListener)
})
</script>