<template>
	<div class="dropdown" @click="toggleOpen" :class="{ open: isOpen }">
		<div class="selected">{{ selected }}</div>
		<div class="dropdown-list">
			<div class="dropdown-item" v-for="option in options" :key="option" @click="selectOption(option)">
				{{ option }}
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, watchEffect} from 'vue';

const props = defineProps({
    options: {
        type: Array,
        required: true,
    },
    modelValue: {
        type: String,
        required: false,
    },
});

const emit = defineEmits(['update:modelValue']);

let selected = ref(props.modelValue || null);
let isOpen = ref(false);

const selectOption = (option) => {
    selected.value = option;
    emit('update:modelValue', option);
    isOpen.value = false;
};

const toggleOpen = () => {
    isOpen.value = !isOpen.value;
};

window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown, .dropdown *')) {
        isOpen.value = false;
    }
});
</script>

<style scoped lang="scss">
.dropdown {
	width: 200px;
	border: 1px solid #007bff;
	border-radius: 4px;
	padding: 10px;
	background: white;
	position: relative;
	cursor: pointer;

	&.open .dropdown-list {
		display: block;
	}
}

.selected {
	font-size: 16px;
	color: #007bff;
}

.dropdown-list {
	display: none;
	position: absolute;
	width: 100%;
	top: 100%;
	left: 0;
	margin-top: 10px;
	border: 1px solid #007bff;
	border-radius: 4px;
	background: white;
}

.dropdown-item {
	padding: 10px;
	font-size: 14px;
	color: #007bff;

	&:hover {
		background: #007bff;
		color: white;
	}
}
</style>
