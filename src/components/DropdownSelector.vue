<template>
	<div class="dropdown">
		<div
			class="dropdown-toggle"
			@click="toggleDropdown"
			:class="{ active: isOpen }"
		>
			{{ selectedOption }}
		</div>
		<div v-if="isOpen" class="dropdown-menu">
			<div
				v-for="(option, index) in options"
				:key="index"
				class="dropdown-item"
				@click="selectOption(option)"
			>
				{{ option }}
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    options: {
        type: Array,
        required: true,
    },
});

const selectedOption = ref(null);
const isOpen = ref(false);

function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

function selectOption(option) {
    selectedOption.value = option;
    toggleDropdown();
}
</script>

<style>
.dropdown {
	position: relative;
}

.dropdown-toggle {
	cursor: pointer;
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	left: 0;
}

.dropdown-item {
	padding: 10px;
	cursor: pointer;
}

.active .dropdown-toggle {
	background-color: #f5f5f5;
}
</style>