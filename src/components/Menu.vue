<script setup lang="jsx">
import {NMenu} from "naive-ui";
import {
    AlignTextLeft as IconAlignTextLeft,
    Download as IconDownload, Info as IconInfo,
    Setting as IconSetting
} from "@icon-park/vue-next";

const pages = [
    {name: '编辑', icon: IconAlignTextLeft, route: "/editor"},
    {name: '设置', icon: IconSetting, route: "/settings"},
    {name: '输出', icon: IconDownload, route: "/download"},
    {name: '关于', icon: IconInfo, route: "/about"}
];

const menuOptions = pages.map(page => ({
    label: () => <RouterLink to={page.route}>{page.name}</RouterLink>,
    icon: () => <page.icon/>,
    key: page.route,
}));
</script>

<template>
<NMenu
	collapsed
	class="sidebar"
	:options="menuOptions"
/>
</template>

<style scoped lang="scss">
.sidebar {
	background-color: #e0e0e0;
	user-select: none;
}
</style>