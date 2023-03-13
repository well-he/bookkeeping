<script setup>
const props = defineProps({
    cardProps: {
        type: Object,
        default: {
            title: '工作台',
            content: [],
        },
    },
    msg: {
        type: String,
        default() {
            return '';
        },
    },
});
</script>

<template>
    <el-card class="box-card" shadow="hover">
        <template #header>
            <div class="card-header">
                <span>{{ cardProps.title }}</span>
            </div>
        </template>

        <slot name="content">
            <div v-for="(c, i) in cardProps.content" key="i">
                {{ c }}
            </div>
        </slot>
        <p v-if="props.cardProps">{{ props.msg }}</p>
    </el-card>
</template>
