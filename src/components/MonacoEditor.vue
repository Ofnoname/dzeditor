<template>
<div ref="editor" class="monaco-editor"></div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch, computed} from 'vue'
import * as monaco from 'monaco-editor'
import {useGs} from "../store.js";
import {usePasteImage} from "../util/pasteImage.js";

const editor = ref(null);

const props = defineProps(['text', 'language', 'options'])
const emits = defineEmits(['update:text', 'updated'])

const gs = useGs()

let textModel, monacoEditor

const onResize = () => {
    editor.value.style.display = 'none'
    monacoEditor.layout()
    editor.value.style.display = 'block'
};

onMounted(() => {
    textModel = monaco.editor.createModel(props.text, props.language);
    monacoEditor = monaco.editor.create(editor.value, {
        model: textModel,
        automaticLayout: true,
        ...props.options
    });

    textModel.onDidChangeContent(e => {
        const newValue = textModel.getValue();
        if (newValue !== props.text) {
            emits('update:text', newValue);
        }
    });

    emits('updated', {
        wordCount: computed(() => monacoEditor.getValue().length),
        cursorPosition: computed(() => monacoEditor.getPosition()),
    })
    monacoEditor.onDidChangeCursorPosition(e => {
				emits('updated', {
            wordCount: computed(() => monacoEditor.getValue().length),
            cursorPosition: computed(() => monacoEditor.getPosition()),
        })
		})

    watch(() => props.text, (newValue) => {
        if (newValue !== textModel.getValue()) {
            textModel.setValue(newValue);
        }
    })

    window.addEventListener('resize', onResize);
    watch(() => gs.previewMode, onResize)
		usePasteImage(monacoEditor)
});


onBeforeUnmount(() => {
    monacoEditor.dispose()
    window.removeEventListener('resize', onResize)
})
</script>