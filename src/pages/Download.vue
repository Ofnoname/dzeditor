<script setup>
import {onMounted, reactive, ref} from "vue";

import {NButton, NButtonGroup, NInputNumber, useMessage} from "naive-ui";

import {useGs} from "../store.js";
import PreviewPane from "../components/PreviewPane.vue";

import domToImage from 'dom-to-image';

const gs = useGs()

const target = reactive({
    url: '',
    type: '',
})

const m = useMessage()

let html2canvas, jsPDF
let previewPane

onMounted(async () => {
    try {
        // Load libraries
        const jsPDFModule = await import("jspdf");
        jsPDF = jsPDFModule.jsPDF;
        const html2canvasModule = await import("html2canvas");
        html2canvas = html2canvasModule.default;

        previewPane = document.querySelector('.preview-pane')
    } catch (error) {
        m.error(`加载库时出错了：${error}`)
    }
});

function download() {
    try {
        const a = document.createElement("a");

        a.href = target.url;
        a.download = `${gs.currentFile.title}.${target.type}`;
        a.click();

        m.success(`下载文件完成！`)
    } catch (error) {
       m.error(`下载文件时出错了：${error}`)
    }
}

async function copy() {
    try {
        const response = await fetch(target.url);
        const blob = await response.blob();
        console.log(blob)
        const clipboardItem = new ClipboardItem({[blob.type]: blob});
        await navigator.clipboard.write([clipboardItem]);

        m.success(`复制到剪贴板完成！`)
    } catch (err) {
        m.error(`复制到剪贴板时出错了：${err}`)
    }
}

async function toPDF() {
    previewPane.style.overflow = 'visible';
    const url = await domToImage.toPng(previewPane, {
        bgcolor: 'white',
    })
    previewPane.style.overflow = 'auto';

    const dpi = 96; // 假设屏幕的DPI为96，这个值可能需要根据你的实际情况进行调整
    const widthInMm = (previewPane.scrollWidth / dpi) * 25.4;
    const heightInMm = (previewPane.scrollHeight / dpi) * 25.4;

    const pdf = new jsPDF('p', 'mm', [widthInMm, heightInMm]); // 设置PDF的尺寸
    pdf.addImage(url, 'JPEG', 0, 0, widthInMm, heightInMm); // 将图片添加到PDF中

    target.url = pdf.output('bloburl'); // 将PDF的URL保存到 target.url 中
    target.type = 'pdf';
}

async function toPNG() {
    previewPane.style.overflow = 'visible';
    const url = await domToImage.toPng(previewPane, {
        bgcolor: 'white',
    })
    previewPane.style.overflow = 'auto';

    target.url = url;
    target.type = 'jpg';
}

function toHTML() {
    const html = previewPane.outerHTML + `<style>${gs.previewCss.css}</style>`;
    const blob = new Blob([html], {type: 'text/html'});
    target.url = URL.createObjectURL(blob);
    target.type = 'html';
}

function toRawHTML() {
    const html = previewPane.outerHTML
    const blob = new Blob([html], {type: 'text/html'});
    target.url = URL.createObjectURL(blob);
    target.type = 'html';
}

function toMarkdown() {
    const md = gs.currentFile.content;
    const blob = new Blob([md], {type: 'text/plain'});
    target.url = URL.createObjectURL(blob);
    target.type = 'md';
}

const buttongroup = [
    {
        name: 'PDF',
        action: toPDF
    },
    {
        name: 'HTML',
        action: toHTML
    },
		{
				name: 'Raw HTML',
				action: toRawHTML
		},
    {
        name: 'Markdown',
        action: toMarkdown
    },
    {
        name: 'PNG',
        action: toPNG
    },
]

function generate(button) {
    m.info(`正在生成${button.name}...`)

    try {
        button.action()
        m.success(`生成${button.name}完成！`)
    } catch (error) {
        m.error(`生成${button.name}时出错了：${error}`)
    }
}
</script>

<template>
	<div class="main">
		<div class="output-pane">

			<!-- Grouped buttons for outputs -->
			<h3>导出为</h3>
			<NButtonGroup>
				<NButton v-for="button in buttongroup" :key="button.name" ghost
				         @click="generate(button)">{{ button.name }}
				</NButton>
			</NButtonGroup>

			<!-- Separator -->
			<div class="separator"></div>

			<NButton :disabled="!target.url" @click="download" type="primary">
				下载文件
			</NButton>
			<NButton secondary :disabled="target.type !== 'jpg'" @click="copy" type="primary">
				复制图片
			</NButton>

			<h4>打印宽度</h4>
			<NInputNumber class="n-i" v-model:value="gs.printWidth" :step="100" :min="0" :max="3000" />

		</div>
		<PreviewPane :style="{width: gs.printWidth + 'px'}" :text="gs.currentFile.content"/>
	</div>
</template>


<style scoped lang="scss">
$theme: #539cea;

.main {
	display: flex;
}

.separator {
	height: 1px;
	background-color: #ccc;
	margin: 1rem 0;
}

.output-pane {
	flex: 1;
	background-color: #f5f5f5;

	padding: 1rem 3rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	border-right: 1px solid #ccc;
	user-select: none;
}

.preview-pane {
	max-width: 3000px;
}

.n-i {
	width: 200px;
}
</style>
