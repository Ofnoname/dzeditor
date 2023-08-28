<template>
	<div class="input-container">
		<input v-model="inputValue" @focus="onFocus" @blur="onBlur" @input="updateValue" />
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
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
	padding: 10px;
	border: 1px solid #000;
	border-radius: 4px;

	input {
		width: 100%;
		border: none;
		outline: none;
		background: transparent;
		color: #333;
		font-size: 1rem;
	}
}
</style>
