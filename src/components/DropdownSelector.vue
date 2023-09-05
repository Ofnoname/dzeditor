<template>
<div ref="dropdown" class="dropdown" @click="toggleOpen" :class="{ open: isOpen }" tabindex="0">
	<div class="selected">
		{{ selected }}
		<IconDown class="icon"/>
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
		Down as IconDown,
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

    toggleOpen();
};

const toggleOpen = () => {
    isOpen.value = !isOpen.value;
};

const cListener = (event) => {
    // 如果点击的元素不是 dropdown 或其子元素
    if (!dropdown.value.contains(event.target)) {
        isOpen.value = false;
    }
}

onMounted(() => {
    window.addEventListener('click', cListener);
})

onBeforeUnmount(() => {
		window.removeEventListener('click', cListener);
})
</script>

<style scoped lang="scss">
$theme: #539cea;
$global-padding: 8px;

.dropdown {
	width: 200px;

	position: relative;
	border-radius: 4px;
	padding: $global-padding;
	border: 1px solid #000;
	background: white;
	color: #333;

	cursor: pointer;
	user-select: none;

	transition: .1s;

	&.open .dropdown-list {
		display: block;
	}
	&.open .icon{
		transform: rotate(180deg);
	}
	&:hover, &.open {
		box-shadow: 0 0 1px 1px #539cea;
	}
}

.icon{
	float: right;
}

.dropdown-list {
	display: none;
	position: absolute;
	width: 100%;
	top: 100%;
	left: 0;
	margin-top: 10px;
	border: 1px solid #000;
	border-radius: 4px;
	background: white;
	z-index: 1;
}

.dropdown-item {
	padding: $global-padding;
	transition: .2s;

	&:hover {
		background: $theme;
		color: white;
	}
}
</style>
