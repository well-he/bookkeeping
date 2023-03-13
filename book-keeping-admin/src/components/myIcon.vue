<template>
    <i :class="'iconfont icon-' + className"></i>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: String,
        default() {
            return '';
        },
    },
});

const className = props.icon;
</script>
