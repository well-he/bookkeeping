<template>
    <van-config-provider :theme-vars="themeVars">
        <nav-bar :title="title"></nav-bar>
        <router-view />
        <tab-bar></tab-bar>
    </van-config-provider>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import TabBar from '../components/TabBar.vue';

const title = ref(useRoute().meta.title);
onBeforeRouteUpdate(to => {
    title.value = to.meta.title;
});

// themeVars 内的值会被转换成对应 CSS 变量
// 比如 sliderBarHeight 会转换成 `--van-slider-bar-height`
const themeVars = reactive({
    ThemeColor: '#e0f0e9',
    TextColor: '#161823',
    NavBarBackground: '#e9e7ef',
    CellBackground: '#e0f0e9',
    GridItemContentBackground: '#e0f0e9',
    ProgressColor: '#e0f0e9',
});
</script>

<style lang="scss" scoped></style>
