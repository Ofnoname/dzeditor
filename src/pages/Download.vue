<script setup>
import {storeToRefs} from "pinia";
import {computed, onMounted, ref} from "vue";

import {useGs} from "../store.js";

import PreviewPane from "../components/PreviewPane.vue";

const gs = useGs()
const {currentFile, previewCss} = storeToRefs(gs)

const targetURL = ref(null),
    targetType = ref("")

const statusMessage = ref("选择一个格式");
const status = ref(0);

const statusClass = computed(() => {
		switch (status.value) {
				case 0:
						return "initial";
				case 1:
						return "generating";
				case 2:
						return "finished";
		}
});

let previewPane, fileName,
		html2canvas, jsPDF


onMounted(async () => {
    try {
				// Load libraries
		    const jsPDFModule = await import("jspdf");
				jsPDF = jsPDFModule.jsPDF;
        const html2canvasModule = await import("html2canvas");
        html2canvas = html2canvasModule.default;

        // Existing onMounted code
        previewPane = document.querySelector('.preview-pane');
        fileName = currentFile.value.title;
    } catch (error) {
        if (error.message.includes("Failed to fetch")) {
            statusMessage.value = "加载失败，可能是网络原因。";
        } else {
            statusMessage.value = "加载库时发生错误。";
        }
    }
});

function download(type, data, fileName) {
    const a = document.createElement("a");
    if (type === "text") {
        const file = new Blob([data]);
        a.href = URL.createObjectURL(file);
    }
    else if (type === "url") {
        a.href = data;
    }

    a.download = fileName;
    a.click();
    statusMessage.value = "下载完成！";
}

// dom 转 canvas，然后转 pdf 或者图片
async function captureCanvas() {
    try {
        previewPane.style.overflow = 'visible';
        // 由于 html2canvas 的 bug，不能渲染视口之外的部分，所以修改 overflow 再恢复
        const canvas = await html2canvas(previewPane, {
            width: previewPane.scrollWidth,
            height: previewPane.scrollHeight + 100, // 考虑内边距
        });
        previewPane.style.overflow = 'auto';
        return canvas;
    } catch (error) {
        previewPane.style.overflow = 'auto'; // 确保在错误发生时恢复 overflow。
        throw error; // 重新抛出错误以在调用函数中处理。
    }
}

async function toPDF() {
    try {
        statusMessage.value = "正在生成 PDF...";
        status.value = 1
        const canvas = await captureCanvas();
        const imgURL = canvas.toDataURL('image/jpg', 1.0);

        const imgProps = {
            width: canvas.width * 25.4 / 72,
            height: canvas.height * 25.4 / 72
        };

        const pdf = new jsPDF('p', 'mm', [imgProps.width, imgProps.height]);
        pdf.addImage(imgURL, 'JPEG', 0, 0, imgProps.width, imgProps.height);
        targetURL.value = pdf.output('datauristring');
        targetType.value = 'pdf'
        statusMessage.value = "PDF 生成完成！";
        status.value = 2
    } catch (error) {
        console.error('Error in toPDF:', error);
        statusMessage.value = `生成 PDF 时出错了：${error}`;
        status.value = -1
    }
}

async function toJPG() {
    try {
        statusMessage.value = "正在生成 JPG...";
        status.value = 1
        const canvas = await captureCanvas();
        targetURL.value = canvas.toDataURL('image/jpg', 1.0);
        targetType.value = 'jpg'
        statusMessage.value = "JPG 生成完成！";
        status.value = 2
    } catch (error) {
        console.error('Error in toJPG:', error);
        statusMessage.value = `生成 JPG 时出错了：${error}`;
    }
}

function toHTML() {
    try {
        const html = previewPane.outerHTML + `<style>${previewCss.value.css}</style>`;
        const blob = new Blob([html], { type: 'text/html' });
        targetURL.value = URL.createObjectURL(blob);
        targetType.value = 'html';
        statusMessage.value = "HTML 生成完成！";
        status.value = 2
    } catch (error) {
        console.error('Error in toHTML:', error);
        window.alert(`输出 html 时出错了：${error}`);
    }
}

function toRawHTML() {
    try {
        const html = previewPane.outerHTML;
        const blob = new Blob([html], { type: 'text/html' });
        targetURL.value = URL.createObjectURL(blob);
        targetType.value = 'html';
        statusMessage.value = "RawHTML 生成完成！";
        status.value = 2
    } catch (error) {
        console.error('Error in toRawHTML:', error);
        window.alert(`输出 RawHTML 时出错了：${error}`);
    }
}

function toMarkdown() {
    try {
        const md = currentFile.value.content;
        const blob = new Blob([md], { type: 'text/plain' });
        targetURL.value = URL.createObjectURL(blob);
        targetType.value = 'md';
        statusMessage.value = "Markdown 生成完成！";
        status.value = 2
    } catch (error) {
        console.error('Error in toMarkdown:', error);
        window.alert(`输出 Markdown 时出错了：${error}`);
    }
}


async function copyToClipboard() {
    try {
        switch (targetType.value) {
            case 'jpg':
            case 'pdf':
                // 对于图片和PDF，我们复制二进制数据
                const response = await fetch(targetURL.value);
                const blob = await response.blob();
                const clipboardItem = new ClipboardItem({ [blob.type]: blob });
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
        statusMessage.value = "复制完成！";
    } catch (err) {
        console.error('复制数据到剪贴板失败:', err);
        statusMessage.value = `复制数据到剪贴板失败：${err}`;
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
		{
				name: 'RawHTML',
				action: toRawHTML
		},
		{
				name: 'Markdown',
				action: toMarkdown
		},
		{
				name: 'JPG',
				action: toJPG
		},
]

</script>

<template>
	<div class="main">
		<div class="output-pane">
			<!-- Grouped buttons for outputs -->

			<h3>导出为</h3>
			<ul ul-layout="" class="button-group">
				<li class="button" v-for="button in buttongroup"  :class="{finished: status===2 && statusMessage.match(button.name)}" :key="button.name" @click="button.action">{{ button.name }}</li>
			</ul>
			<div class="status" :class="statusClass">{{ statusMessage }}</div>


			<!-- Separator -->
			<div class="separator"></div>


			<div class="button download" :class="{disabled: !targetURL}" @click="download('url', targetURL, fileName + `.${targetType}`)">下载文件</div>
			<div class="button copy" :class="{disabled: targetType !== 'jpg'}" @click="copyToClipboard">复制到剪贴板（仅图片）</div>
		</div>

		<PreviewPane :text="currentFile.content"/>
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
		border-radius: 0;  /* Reset border-radius for middle buttons */
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
	.button.finished{
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

	.output-pane {
		flex: 1 1 0;
		background-color: #f5f5f5;

		padding: 1rem 3rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-right: 1px solid #ccc;

		.separator {
			height: 1px;
			background-color: #ccc;
			margin: 1rem 0;
		}
		.status {
			padding: 0.5rem 1rem;
			height: fit-content;
			transition: .2s all;
			border-radius: 9px;
			&.initial {
				background: saturate($theme, 10%)
			}
			&.generating {
				background: $theme;
			}
			&.finished {
				background: desaturate($theme, 10%);
			}
		}
	}

	.preview-pane {
		flex: 1 1 0;
	}
}
</style>
