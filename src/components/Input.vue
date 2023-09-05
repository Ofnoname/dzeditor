<template>
	<div class="input-container">
		<input v-model="inputValue" @focus="onFocus" @blur="onBlur" @input="updateValue" />
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        required: false,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

let inputValue = ref(props.modelValue);
let isFocused = ref(false);

const onFocus = () => {
    isFocused.value = true;
};

const onBlur = () => {
    isFocused.value = false;
};

const updateValue = () => {
    emit('update:modelValue', inputValue.value);
};

watch(inputValue, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>

<style scoped lang="scss">
.input-container {
	padding: 8px;
	border: 1px solid #000;
	background-color: white;
	border-radius: 4px;
	transition: .2s;

	input {
		width: 100%;
		border: none;
		outline: none;
		background: transparent;
		color: #333;
		font-size: 1rem;
	}
	&:has(input:focus){
		box-shadow: 0 0 1px 1px #539cea;
	}
}
</style>
