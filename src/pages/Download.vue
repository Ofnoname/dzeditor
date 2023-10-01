<script setup>
import {onMounted, reactive} from "vue";

import {NButton, NButtonGroup, NInputNumber, useMessage} from "naive-ui";

import {useGs} from "../store.js";
import PreviewPane from "../components/PreviewPane.vue";
import {useDownload} from "../util/download.js";

const gs = useGs()

const target = reactive({
    url: '',
    type: '',
})

const m = useMessage()
let dm = null

onMounted(async () => {
    try {
				dm = await useDownload(document.querySelector('.preview-pane'))
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
        const clipboardItem = new ClipboardItem({[blob.type]: blob});
        await navigator.clipboard.write([clipboardItem]);

        m.success(`复制到剪贴板完成！`)
    } catch (err) {
        m.error(`复制到剪贴板时出错了：${err}`)
    }
}

const tps = ['PNG', 'PDF', 'HTML', 'Markdown', 'RawHTML']

async function generate(tp) {
    m.info(`正在生成${tp}...`)

    try {
        target.url = await dm[tp]()
        target.type = tp.toLowerCase()
        m.success(`生成${tp}完成！`)
    } catch (error) {
        m.error(`生成${tp}时出错了：${error}`)
    }
}

const isImage = (tp) => ['png', 'jpg'].includes(tp)
</script>

<template>
<div class="main">
	<div class="output-pane">

		<!-- Grouped buttons for outputs -->
		<h3>导出为</h3>
		<NButtonGroup>
			<NButton v-for="t in tps" :key="t" ghost
			         @click="generate(t)">{{ t }}
			</NButton>
		</NButtonGroup>

		<!-- Separator -->
		<div class="separator"></div>

		<NButton :disabled="!target.url" @click="download" type="primary">
			下载文件
		</NButton>
		<NButton secondary :disabled="!isImage(target.type)" @click="copy" type="primary">
			复制图片
		</NButton>

		<h4>打印宽度</h4>
		<NInputNumber class="n-i" v-model:value="gs.printWidth" :step="100" :min="0" :max="3000" />

	</div>
	<PreviewPane class="preview-pane" :style="{width: gs.printWidth + 'px'}" :text="gs.currentFile.content"/>
</div>
</template>


<style scoped lang="scss">
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
