<!-- todo： 复用创建 canvas 的代码
						复用 preview pane-->
<script setup>
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import {marked} from "marked";

import {storeToRefs} from "pinia";
import {computed, onMounted} from "vue";

import {useFileStore, useSettingStore} from "../store.js";

const fileStore = useFileStore(),
		settingStore = useSettingStore(),
		{currentFile} = storeToRefs(fileStore),
		{previewCssCode} = storeToRefs(settingStore)

// 更新文本
const previewText = computed(() => {
    return currentFile.value.content ? marked(currentFile.value.content) : ''
})

let previewPane, fileName

onMounted(() => {
		previewPane = document.querySelector('.preview-pane')
    fileName = currentFile.value.title;
})

function download(type, data, fileName, contentType) {
		const a = document.createElement("a");
		if (type === "text") {
				const file = new Blob([data], {type: contentType});
				a.href = URL.createObjectURL(file);
		}
    else if (type === "url") {
        a.href = data;
		}

		a.download = fileName;
		a.click();
}

async function toPDF() {
    try {
        previewPane.style.overflow = 'visible';
        /* 由于 html2canvas 的 bug，不能渲染视口之外的部分，所以修改 overflow 再恢复*/
        const canvas = await html2canvas(previewPane, {
            width: previewPane.scrollWidth,
            height: previewPane.scrollHeight + 100,
            /*  scrollHeight: 内容区（包括因为滚动而不可见的部分）的总高度
								scrollHeight 不包含内边距，所以+100 */
        });
        previewPane.style.overflow = 'auto';

        const imgURL = canvas.toDataURL('image/jpg', 1.0);
        /* by GPT4 */
        const imgProps = {
            width: canvas.width * 25.4 / 72,
            height: canvas.height * 25.4 / 72
        };

        const pdf = new jsPDF('p', 'mm', [imgProps.width, imgProps.height]);
        pdf.addImage(imgURL, 'JPEG', 0, 0, imgProps.width, imgProps.height);
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error('Error in toPDF:', error);
    }
}

async function toJPG() {
    try {
        previewPane.style.overflow = 'visible';
        /* 由于 html2canvas 的 bug，不能渲染视口之外的部分，所以修改 overflow 再恢复*/
        const canvas = await html2canvas(previewPane, {
            width: previewPane.scrollWidth,
            height: previewPane.scrollHeight + 100,
		        /*  scrollHeight: 内容区（包括因为滚动而不可见的部分）的总高度
		            scrollHeight 不包含内边距，所以+100 */
        });
        previewPane.style.overflow = 'auto';

        const imgURL = canvas.toDataURL('image/jpg', 1.0);
				download("url", imgURL, fileName + '.jpg', 'image/jpg');
    } catch (error) {
        console.error('Error in toJPG:', error);
    }
}

function toHTML() {
    const html = previewPane.outerHTML + `<style>${previewCssCode.value}</style>`
		download("text", html, fileName + '.html', 'text/html')
}

function toRawHTML() {
		const html = previewPane.outerHTML
		download("text", html, fileName + '.html', 'text/html')
}

function toMarkdown() {
		const md = currentFile.value.content
		download("text", md, fileName + '.md', 'text/plain')
}
</script>

<template>
<div class="main">
	<div class="output-pane">
		<div class="button" @click="toPDF">输出为 pdf</div>
		<div class="button" @click="toHTML">输出为 html</div>
		<div class="button" @click="toRawHTML">输出为无 css 的 html</div>
		<div class="button" @click="toMarkdown">输出为 md 原文</div>
		<div class="button" @click="toJPG">输出为 jpg</div>
	</div>
	<div class="preview-pane" v-html="previewText"></div>
</div>
</template>

<style scoped lang="scss">
.main{
	display: flex;

	.output-pane{
		flex: 1 1 0;

		padding: 1rem 3rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		border-right: 1px solid #ccc;
	}
	.preview-pane {
		flex: 1 1 0;

		overflow: auto;
		word-wrap: anywhere;
		padding: 0 3rem;
	}
}

.button {
	$button-color: #007BFF;
	width: 12rem;

	padding: 0.5rem 1rem;
	display: inline-block;

	background-color: transparent;
	text-align: center;
	color: $button-color;
	border: 1px solid $button-color;
	border-radius: .25rem;
	transition: .2s;
	cursor: pointer;

	&:hover {
		background-color: $button-color; /* 当鼠标悬停在按钮上时，填充背景颜色 */
		color: white; /* 当鼠标悬停在按钮上时，改变字体颜色 */
	}
}
</style>