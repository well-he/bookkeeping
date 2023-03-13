<template>
    <h3 v-if="select == 0">支出排行榜</h3>
    <h3 v-else>收入排行榜</h3>
    <div class="ranks" v-if="ranksData">
        <div class="process" v-for="r in ranksData">
            <div class="text">
                <span class="cet">{{ r.title }} {{ r.percentage + '%' }}</span>
                <span class="value">
                    {{ r.value.toFixed(1) }}
                </span>
            </div>
            <van-progress
                :percentage="r.percentage"
                :show-pivot="false"
                stroke-width="15"
                track-color="#fff"
            />
        </div>
    </div>
    <div v-else>
        <van-empty description="还没有数据哦" />
    </div>
</template>

<script setup>
const props = defineProps({
    ranksData: {
        type: Array,
    },
    select: {
        type: Number,
    },
});
</script>

<style lang="scss" scoped>
.ranks {
    margin: 20px 0;
    padding: 10px;

    .process {
        font-size: 13px;
        margin: 15px 0;
        .text {
            .value {
                float: right;
            }
        }
    }
}
</style>
