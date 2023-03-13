<template>
    <div :id="id" class="chart"></div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, watchEffect } from 'vue';
import * as echarts from 'echarts';
import { getUuid } from '@/utils';
const props = defineProps({
    title: {
        type: String,
    },
    data: {
        type: Array,
        default() {
            return [];
        },
    },
    xAxis: {
        type: Array,
        default() {
            return [];
        },
    },
});

let id = ref(getUuid());
let chart = ref();
let total = ref(0);
const state = reactive({
    chartOptions: {
        title: {
            text: props.title + total.value, //parameter.title
            left: 'left',
            textStyle: {
                fontSize: 14, //字体大小
                fontWeight: 500, //加粗
            },
        },
        tooltip: {
            trigger: 'axis',
        },
        toolbox: {
            show: true,
            itemSize: 20,
            feature: {
                dataView: { readOnly: true },
                magicType: { type: ['line', 'bar'] },
            },
        },
        xAxis: {
            data: props.xAxis,
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
        },
        series: [
            {
                name: '金额',
                type: 'line',
                data: props.data,
                smooth: true,
                markLine: {
                    data: [
                        {
                            name: '水平线1',
                            type: 'max', // Y 值为给定值的标记线，用户自定义水平标线的值
                            lineStyle: {},
                            label: {
                                position: 'middle', //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                            },
                        },
                    ],
                    symbol: 'none', //去掉箭头
                },
            },
        ],
        grid: {
            x: 10,
            y: 50,
            x2: 10,
            y2: 50,
        },
    },
});

const setOption = () => {
    chart.setOption(state.chartOptions);
};

watch(props, value => {
    let sum = value.data.reduce((p, c) => p + c, 0);
    total.value = sum.toFixed(1);

    state.chartOptions.title.text = value.title + total.value;
    state.chartOptions.series[0].data = value.data.map(i => i.toFixed(1));
    state.chartOptions.xAxis.data = value.xAxis;

    setOption();
});
onMounted(() => {
    chart = echarts.init(document.getElementById(id.value), null, {
        width: document.body.clientWidth,
        height: 250,
    });

    // 把配置和数据放这里
    setOption();
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
});
</script>

<style lang="scss" scoped>
.chart {
    padding: 10px 0;
}
</style>
