/**
* @description: 快捷键配置
* */
import {useGs} from '../store.js';
import {onBeforeUnmount, onMounted} from "vue";

export function useFileSC(event) {
    const gs = useGs();
    const h = (event) => {
        if (!(event.ctrlKey && event.altKey)) return;
        switch (event.key) {
            case 'n':
                gs.newFile("")
                break
            case 'o':
                gs.openFile()
                break
            case 'w':
                gs.removeCurrentFile()
                break
            case 'q':
                gs.switchPreviewMode()
                break
        }
    }

    onMounted(() => {
        window.addEventListener('keydown', h)
    })
    onBeforeUnmount(() => {
        window.removeEventListener('keydown', h)
    })
}