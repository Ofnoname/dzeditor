<template>
<div ref="dropdown" class="dropdown" :class="{ open: isOpen }" tabindex="0">
	<div class="selected" @click="toggleOpen">
		{{ selected }}
		<IconSort class="icon"  theme="filled"/>
	</div>

	<ul ul-layout class="dropdown-list">
		<li class="dropdown-item" v-for="option in options" :key="option" @click="selectOption(option)">
			{{ option }}
		</li>
	</ul>
</div>
</template>

<script setup>
import {onMounted, onBeforeUnmount, ref} from 'vue';

import {
		Sort as IconSort,
} from "@icon-park/vue-next";

const props = defineProps({
    options: {
        type: Array,
        required: true,
    },
    modelValue: {
        required: false,
    },
});

const emit = defineEmits(['update:modelValue']);

let selected = ref(props.modelValue || null);
let isOpen = ref(false);

const dropdown = ref(null);

const selectOption = (option) => {
    selected.value = option;
    emit('update:modelValue', option);
    isOpen.value = false;
};

const toggleOpen = () => {
    isOpen.value = !isOpen.value;
};

// Close the dropdown when clicking outside
const outsideClickListener = (event) => {
    if (!dropdown.value.contains(event.target)) {
        isOpen.value = false;
    }
}

onMounted(() => {
    window.addEventListener('click', outsideClickListener);
})

onBeforeUnmount(() => {
		window.removeEventListener('click', outsideClickListener);
})
</script>

<style scoped lang="scss">
$theme: #539cea;
$background: #fff;

$global-padding: 8px;
$global-border-radius: 4px;
$global-width: 200px;

$shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 轻微的阴影效果
$deep-shadow: 0 2px 4px rgba(0, 0, 0, 0.4); // 轻微的阴影效果
$deeper-shadow: 0 0px 1px 1px #000;

.dropdown {
	width: $global-width;

	position: relative;
	border-radius: $global-border-radius;
	background: $background;
	box-shadow: $shadow;
	color: #333;

	cursor: pointer;
	user-select: none;
	transition: .15s;

	&.open .dropdown-list {
		visibility: visible;
	}

	&:hover, &.open, &:focus{
		box-shadow: $deep-shadow;
	}

	&.open, &:focus {
		box-shadow: $deeper-shadow;
	}
}

.selected{
	padding: $global-padding;
}

.icon{
	float: right;
}

.dropdown-list {
	visibility: hidden;
	position: absolute;
	top: 100%;
	left: 0;

	width: 100%;
	margin-top: 10px;

	border-radius: $global-border-radius;
	background: $background;
	z-index: 1;

	box-shadow: $shadow; // 为下拉列表添加阴影效果
	transition: .2s;
	transform-origin: top center; // 设置过渡效果的原点
	transform: scaleY(0.95); // 初始时稍微缩小列表的大小
	opacity: 0; // 初始时使列表透明

	.dropdown.open & {
		visibility: visible;
		opacity: 1;
		box-shadow: $deeper-shadow;
	}
}

.dropdown-item {
	padding: $global-padding;
	transition: .2s;
	&:hover {
		background: $theme;
		color: white;
	}
}

.dropdown-item {
	opacity: 0; // 初始时完全透明
	transform: translateY(-10px); // 初始时稍微向上移动
	transition: opacity 0.1s ease, transform 0.1s ease;

	.dropdown.open .dropdown-list & {
		opacity: 1; // 当下拉框打开时，设置为完全不透明
		transform: translateY(0); // 回到原始位置
	}

	$delay-interval: 0.03s;  // 定义每个项目之间的延迟间隔


	@for $i from 1 through 10 {  // 假设您有10个项目，可以根据需要调整
		&:nth-child(#{$i}) {
			transition-delay: min($delay-interval * $i, 0.1s);
		}
	}
}
</style>
