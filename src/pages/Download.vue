<script setup>
import {onMounted, reactive, ref} from "vue";

import {useGs} from "../store.js";
import PreviewPane from "../components/PreviewPane.vue";

import domToImage from 'dom-to-image';

const gs = useGs()

const target = reactive({
    url: '',
    type: '',
})

const status = reactive({
    message: "选择一个格式",
    type: "info",
})

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
        if (error.message.includes("Failed to fetch")) {
            status.message = "加载失败，可能是网络原因。";
        } else {
            status.message = "加载库时发生错误。";
        }
    }
});

function download() {
    try {
        const a = document.createElement("a");

        a.href = target.url;
        a.download = `${gs.currentFile.title}.${target.type}`;
        a.click();
    } catch (error) {
        status.message = `下载时出错了：${error}`;
        status.type = 'error';
    } finally {
        status.message = "下载完成！";
        status.type = "downloaded";
    }
}

async function toPDF() {
    previewPane.style.overflow = 'visible';
    const url = await domToImage.toJpeg(previewPane, {
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

async function toJPG() {
    previewPane.style.overflow = 'visible';
    const url = await domToImage.toJpeg(previewPane, {
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
    const md = currentFile.value.content;
    const blob = new Blob([md], {type: 'text/plain'});
    target.url = URL.createObjectURL(blob);
    target.type = 'md';
}


async function copyToClipboard() {
    try {
        switch (targetType.value) {
            case 'jpg':
            case 'pdf':
                // 对于图片和PDF，我们复制二进制数据
                const response = await fetch(targetURL.value);
                const blob = await response.blob();
                const clipboardItem = new ClipboardItem({[blob.type]: blob});
                await navigator.clipboard.write([clipboardItem]);
                break;

            case 'html':
            case 'md':
                // 对于文本数据，我们可以使用更简单的 writeText 方法
                await navigator.clipboard.writeText(targetURL.value);
                break;

            default:
                console.error('未知的 targetType:', targetType.value);
                break;
        }
        status.message = "复制完成！";
    } catch (err) {
        console.error('复制数据到剪贴板失败:', err);
        status.message = `复制数据到剪贴板失败：${err}`;
    }
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
    // {
    //     name: 'RawHTML',
    //     action: toRawHTML
    // },
    {
        name: 'Markdown',
        action: toMarkdown
    },
    {
        name: 'JPG',
        action: toJPG
    },
]

function generate(button) {
    status.message = `正在生成${button.name}...`
    status.type = 'info'

    try {
        button.action()
    } catch (error) {
        status.message = `生成${button.name}时出错了：${error}`
        status.type = 'error'
    } finally {
        status.message = `生成${button.name}完成！`
        status.type = 'success'
    }
}

</script>

<template>
	<div class="main">
		<div class="output-pane">

			<!-- Grouped buttons for outputs -->
			<h3>导出为</h3>
			<ul ul-layout class="button-group">
				<li class="button" v-for="button in buttongroup" :key="button.name"
				    :class="{finished: status.message.match(button.name)}"
				    @click="generate(button)">{{ button.name }}
				</li>
			</ul>

			<!--	status message	-->
			<div class="status"
			     :class="status.type">
				{{ status.message }}
			</div>

			<!-- Separator -->
			<div class="separator"></div>

			<div class="button download" :class="{disabled: !target.url}" @click="download">下载文件</div>
			<div class="button copy" :class="{disabled: target.type !== 'jpg'}" @click="copyToClipboard">
				复制到剪贴板（仅图片）
			</div>
		</div>

		<PreviewPane :text="gs.currentFile.content"/>
	</div>
</template>


<style scoped lang="scss">
$theme: #539cea;
$download: #0ecb0e;
$copy: rgba(213, 51, 213, 0.93);

.button-group {
	display: flex;
	flex-wrap: wrap;

	.button:not(:first-child):not(:last-child) {
		border-radius: 0; /* Reset border-radius for middle buttons */
		border-left: none;
	}

	.button:first-child {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		border-left: 1px solid $theme;
	}

	.button:last-child {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: none;
	}

	.button.finished {
		background-color: $theme;
		color: white;
	}
}

.button {
	padding: 0.5rem 1rem;
	display: inline-block;
	background-color: transparent;
	text-align: center;
	border-radius: .25rem;
	transition: .2s;
	cursor: pointer;

	// 默认按钮颜色
	$button-color: $theme;
	color: $button-color;
	border: 1px solid $button-color;

	&:hover {
		background-color: $button-color;
		color: white;
	}

	&.copy {
		$button-color: $copy; // 为 .copy 重写局部变量
		color: $button-color;
		border-color: $button-color;

		&:hover {
			background-color: $button-color;
			color: white;
		}
	}

	&.download {
		$button-color: $download; // 为 .download 重写局部变量
		color: $button-color;
		border-color: $button-color;

		&:hover {
			background-color: $button-color;
			color: white;
		}
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.5;
	}
}


.main {
	display: flex;
}

.separator {
	height: 1px;
	background-color: #ccc;
	margin: 1rem 0;
}

.status {
	margin: 1rem 0;
	height: fit-content;
	border-radius: 1rem;
	transition: .2s;
	padding: .5rem 1rem;

	&.info {
		background-color: #eee;
		color: #666;
	}

	&.success {
		background-color: #d4edda;
		color: #155724;
	}

	&.error {
		background-color: #f8d7da;
		color: #721c24;
	}

	&.downloaded {
		background-color: #d1ecf1;
		color: #0c5460;
	}
}

.output-pane {
	flex: 1 1 0;
	background-color: #f5f5f5;

	padding: 1rem 3rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	border-right: 1px solid #ccc;
	user-select: none;
}

.preview-pane {
	flex: 1 1 0;
}
</style>
