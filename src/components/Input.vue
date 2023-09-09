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
$theme: #539cea;
$background: #fff;

$global-padding: 8px;
$global-border-radius: 4px;

$shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 轻微的阴影效果
$deep-shadow: 0 2px 4px rgba(0, 0, 0, 0.4); // 轻微的阴影效果
$deeper-shadow: 0 0px 1px 1px #000;

.input-container {
	padding: $global-padding;
	background-color: $background;
	border-radius: $global-border-radius;
	box-shadow: $shadow;
	transition: .1s;

	input {
		width: 100%;
		border: none;
		outline: none;
		background: transparent;
		color: #333;

		font-size: 1rem;
	}
	&:hover {
		box-shadow: $deep-shadow;
	}
	&:has(input:focus){
		box-shadow: $deeper-shadow;
	}
}
</style>
