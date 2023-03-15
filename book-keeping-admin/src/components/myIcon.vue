<template>
    <i :class="'iconfont icon-' + className"></i>
</template>

<script setup>
import { watch, ref } from 'vue';
const props = defineProps({
    icon: {
        type: String,
        default() {
            return '';
        },
    },
});

const className = ref(props.icon);

watch(props, value => {
    className.value = value.icon;
});
</script>
