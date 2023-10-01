<template>
<div class="file-bar">

	<!-- tab -->
	<div class="title"
	     v-for="(file, index) in gs.fileList" :key="file.sign"
	     :class="{active: file.sign === cf.sign}">
		<IconAlignTextLeft class="icon-file"/>
		<span class="title-name"
		      @input="(event) => gs.updateCurrentTitle(event.target.innerText)"
		      @dblclick="(event) => re(event, true)"
		      @blur="(event) => re(event, false)"
		      @keyup.enter="(event) => re(event, false)"
		      @click.middle="gs.removeFile(index)"
		      @click="gs.switchFile(index)" >{{file.title}}</span>
		<IconClose class="icon-close" @click="gs.removeFile(index)" title="删除文件"/>
	</div>

	<IconAdd class="icon-add" @click="gs.newFile('')" title="新建文件"/>
	<IconFileAddition class="icon-add" @click="gs.openFile" title="打开文件"/>
</div>
</template>

<script setup>
import {storeToRefs} from "pinia";

import {useGs} from "../store.js";

import {
    AlignTextLeft as IconAlignTextLeft,
		Add as IconAdd,
		Close as IconClose,
		FileAddition as IconFileAddition,
} from "@icon-park/vue-next";

const gs = useGs()
const {currentFile: cf} = storeToRefs(gs)

function re(event, val) {
    event.target.setAttribute('contenteditable', val.toString());
}
</script>

<style scoped lang="scss">
.file-bar {
	display: flex;
	flex-wrap: wrap;
	height: 2rem;
	background-color: #f0f0f0;
	> * {
		padding: .4rem .8rem;
		cursor: pointer;
	}
}

.title{
	font-size: .6rem;
	.title-name { padding: 0 .5rem; }

	&:hover{
		background-color: #f8f8f8;
	}
	&.active{
		background-color: #fff;
	}
	:is(&.active, &:hover) .icon-close{
		opacity: 1;
	}
}

.icon-close{
	padding: .2rem;
	opacity: 0;
	&:hover{
		background-color: #eee;
	}
}

.icon-add:hover{
	background-color: #f8f8f8;
}
</style>
