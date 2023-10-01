/**
 * @description: 控制预览区的 CSS
 * */
import {watchEffect} from 'vue';
import { useGs } from '../store.js';

export function usePreview() {
    const gs = useGs();

    /* 将 gs.preview.css 的样式文本同步到页面 */
    watchEffect(() => {
        const dynamicStyle = document.getElementById('dynamic-style')
        dynamicStyle.innerHTML = gs.previewCss.css
    });

    /* 当选择预设时，fetch 预设样式 */
    watchEffect(async () => {
        const fileName = `preset-${gs.previewCss.presetChoice}.css`
        const response = await fetch(fileName)
        gs.previewCss.css = await response.text()
    })
}
