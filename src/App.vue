<template>
		<div class="sidebar">
			<div @click="goToEditor"></div>
			<!-- 你可以在这里添加更多的按钮来切换功能 -->
		</div>
		<div class="vertical-separate-line"></div>
		<router-view class="main"></router-view>
</template>

<script>
export default {
    methods: {
        goToEditor() {
            this.$router.push('/')
        },
    },
}
</script>

<style scoped>
.sidebar {
	width: 3rem;
	height: 100vh;
	background-color: #f0f0f0;
}

.main {
	flex-grow: 1;
	height: 100vh;
}
</style>

<style>
.vertical-separate-line {
	width: 1px;
	background-color: #ccc;
}
</style>
