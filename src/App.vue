<template>
		<div class="sidebar">
			<div @click="goToEditor"></div>
			<!-- 你可以在这里添加更多的按钮来切换功能 -->
		</div>
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
	flex: 0 0 3rem;
	height: 100vh;
	background-color: #f0f0f0;
}

.main {
	flex: 1 1 0;
	height: 100vh;
}
</style>