<template>
    <div class="top">
        <div class="time" @click="showDatePick">
            <span class="year">{{ year }}</span>
            <div class="mouth">
                <span>{{ mouth }}</span>
                <van-icon name="arrow-down" />
            </div>
        </div>

        <div class="money">
            <div class="item">
                <span class="item-top">收入</span>
                <div class="item-content">{{ income.toFixed(1) }}￥</div>
            </div>
            <div class="item">
                <span class="item-top">支出</span>
                <div class="item-content">{{ expenses.toFixed(1) }}￥</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, computed } from 'vue';

const emits = defineEmits(['showDatePick']);

const props = defineProps({
    currentDate: {
        type: Array,
    },
    income: {
        type: Number,
        default: 0,
    },
    expenses: {
        type: Number,
        default: 0,
    },
});

const year = computed(() => {
    return props.currentDate[0] + '年';
});

const mouth = computed(() => {
    return props.currentDate[1] + '月';
});

const showDatePick = () => {
    emits('showDatePick');
};
</script>

<style lang="scss" scoped>
.top {
    display: flex;
    padding: 15px;
    margin: 5px 15px;
    flex-wrap: wrap;
    background: var(--van-theme-color);
    color: var(--van-text-color);
    border-radius: 20px;
    position: relative;
    top: 10px;
    .time {
        display: flex;
        flex-direction: column;

        .year {
            font-size: 0.7rem;
        }
        .mouth {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .money {
        flex: 1;
        display: flex;
        justify-content: space-around;
    }
}
</style>
