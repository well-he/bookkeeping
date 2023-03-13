<template>
    <van-nav-bar
        :title="props.title"
        left-arrow
        @click-left="back"
        v-if="route.meta.active !== 1"
    />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
    title: {
        type: String,
        default: '记账本',
    },
});

const router = useRouter();
const route = useRoute();
const back = () => {
    // 有上一页则返回
    if (window.history.state.back) {
        router.back();
    } else {
        // 没有上一页则返回到首页
        router.replace({ path: '/home' });
    }
};
</script>
