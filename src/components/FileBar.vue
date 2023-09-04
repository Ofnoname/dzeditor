<!-- FileBar.vue -->
<template>
	<div class="file-bar">
		<div class="title"
		     v-for="(file, index) in fileList" :key="file.sign"
		     :class="{active: file.sign===currentFile.sign}">
			<IconAlignTextLeft class="icon-file"/>
			<span class="title-name"
			      @input="updateTitle($event)"
			      @dblclick="setRename($event, true)"
			      @blur="setRename($event, false)"
			      @keyup.enter="setRename($event, false)"
			      @click.middle="fileStore.removeFile(index)"
			      @click="fileStore.switchFile(index)" >{{file.title}}</span>
			<IconClose class="icon-close" @click="fileStore.removeFile(index)" title="删除文件"/>
		</div>
		<IconAdd class="icon-add" @click="fileStore.newFile()" title="新建文件"/>
		<IconFileAddition class="icon-add" @click="fileStore.openFile()" title="打开文件"/>
	</div>
</template>

<script setup>
import {storeToRefs} from "pinia";

import {useFileStore} from "../store.js";

import {
    AlignTextLeft as IconAlignTextLeft,
		Add as IconAdd,
		Close as IconClose,
		FileAddition as IconFileAddition,
} from "@icon-park/vue-next";

const fileStore = useFileStore(),
    {currentFile, fileList} = storeToRefs(fileStore)

function setRename(event, val) {
    event.target.setAttribute('contenteditable', val.toString());
}

function updateTitle(event) {
    currentFile.value.title = event.target.innerText
}
</script>

<style scoped lang="scss">
.file-bar {
	display: flex;
	flex-wrap: wrap;
	background-color: #f0f0f0;
	> * {
		padding: .4rem .8rem;
		cursor: pointer;
	}

	.title{
		font-size: .6rem;
		.title-name{ padding: .5rem; }
		.icon-close{
			padding: .2rem;
			opacity: 0;
		}
		.icon-close:hover{
			background-color: #eee;
		}
		&:hover{
			background-color: #f8f8f8;
			.icon-close{
				opacity: 1;
			}
		}
		&.active{
			background-color: #fff;
			.icon-close{
				opacity: 1;
			}
		}
	}

	.icon-add:hover{
		background-color: #f8f8f8;
	}
}
</style>
