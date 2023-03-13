<template>
    <van-tabbar v-model="active">
        <van-tabbar-item icon="orders-o" to="detail">明细</van-tabbar-item>
        <van-tabbar-item icon="bar-chart-o" to="chart">图表</van-tabbar-item>
        <van-tabbar-item icon="user-o" to="profile">我的</van-tabbar-item>
    </van-tabbar>
</template>

<script setup>
import { ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

const active = ref(0);

defineProps({
    title: {
        type: String,
        default: '记账本',
    },
});

onBeforeRouteUpdate(to => {
    active.value = to.meta.active;
});
</script>
