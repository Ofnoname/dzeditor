/**
 * @description: 粘贴图片, 在 monaco 捕获粘贴之前捕获粘贴事件，如果是图片则插入图片
 * */
import localforage from "localforage";
import {v4 as uuidv4} from "uuid";

import {onBeforeUnmount, onMounted} from "vue";
import {useGs} from "../store.js";

let mi;

function txt(s) {
    const gs = useGs()
    if (gs.pasteImage === "asMarkdown") return `![](image/${s})`;
    else if (gs.pasteImage === 'asHTML') return `<img alt="" src="image/${s}">`;
    else return '';
}

async function pasteImage(dataURL) {
    const uniqueName = uuidv4();

    await localforage.setItem(uniqueName, dataURL);
    mi.trigger('keyboard', 'type', {text: txt(uniqueName)});
}

async function h(event) {
    console.log('paste', event);
    event.preventDefault();
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const index in items) {
        const item = items[index];
        if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
            console.log('image', item);
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = async (event) => {
                await pasteImage(event.target.result);
            };
            await reader.readAsDataURL(blob);
        }
    }
}

export function usePasteImage(monacoInstance) {
    mi = monacoInstance;

    window.addEventListener('paste', h, true);

    onBeforeUnmount(() => {
        window.removeEventListener('paste', h, true);
    })
}