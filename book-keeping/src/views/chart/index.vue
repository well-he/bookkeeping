<template>
    <div class="charts" v-cloak>
        <van-dropdown-menu>
            <van-dropdown-item v-model="select" :options="selectOptions" @change="selectChange" />
        </van-dropdown-menu>
        <van-row :gutter="10">
            <van-col :span="8">
                <van-button @click="changeWeek" block size="small">周</van-button>
            </van-col>
            <van-col :span="8">
                <van-button @click="changeMonth" block size="small">月</van-button>
            </van-col>
            <van-col :span="8">
                <van-button @click="changeYear" block size="small">年</van-button>
            </van-col>
        </van-row>
        <line-chart :title="title" :data="chartData" :x-axis="chartXAxis" />
        <Rank :select="select" :ranksData="ranksData" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import LineChart from './components/LineChart.vue';
import Rank from './components/Rank.vue';
import $api from '@/api/bill';
import useStorage from '@/utils/storage';
const { getItem } = useStorage();

const user = getItem('userInfo');
const select = ref(0);
const selectOptions = [
    { text: '支出', value: 0 },
    { text: '收入', value: 1 },
];

const title = ref('总支出');

const income_state = reactive({
    weeksData: {
        incomeDays: [],
        incomeTotals: [],
    },
    monthData: { data: [] },
    yearData: { data: [] },
});
const expense_state = reactive({
    weeksData: {
        expenseDays: [],
        expenseTotals: [],
    },
    monthData: {
        data: [],
    },
    yearData: {
        data: [],
    },
});
const ranks = reactive({
    weekRanks: [],
    monthRanks: [],
    yearRanks: [],
    Detail: {
        weekRanks: { expensesRanks: [], incomeRanks: [] },
        monthRanks: { expensesRanks: [], incomeRanks: [] },
        yearRanks: { expensesRanks: [], incomeRanks: [] },
    },
});

const chartData = ref([]);
const chartXAxis = ref([]);
const ranksData = ref([]);
const selectChange = v => {
    if (v == 0) {
        //支出
        title.value = '总支出';
        changeWeek();
    } else {
        //收入
        title.value = '总收入';
        changeWeek();
    }
    setRanks('w');
};

const getWeekData = async () => {
    const res = await $api.getWeekTotal({ user_id: user.user_id });
    income_state.weeksData.incomeDays = res.incomeDays;
    income_state.weeksData.incomeTotals = res.incomeTotals;
    expense_state.weeksData.expenseDays = res.expenseDays;
    expense_state.weeksData.expenseTotals = res.expenseTotals;
};
const getMonthData = async () => {
    const res = await $api.getMonthTotal({ user_id: user.user_id });
    income_state.monthData.data = res.monthIncomes;
    expense_state.monthData.data = res.monthExpenses;
};
const getYearData = async () => {
    const res = await $api.getYearTotal({ user_id: user.user_id });
    income_state.yearData.data = res.yearIncomes;
    expense_state.yearData.data = res.yearExpenses;
};

const getRanks = async () => {
    const weekRanks = await $api.getWeekRank(user.username);
    const monthRanks = await $api.getMonthRank(user.username);
    const yearRanks = await $api.getYearRank(user.username);
    ranks.weekRanks = weekRanks;
    ranks.monthRanks = monthRanks;
    ranks.yearRanks = yearRanks;
    ranks.Detail = calcRanks();
    setRanks();
};

const calcRanks = () => {
    return {
        weekRanks: calcBill(ranks.weekRanks),
        monthRanks: calcBill(ranks.monthRanks),
        yearRanks: calcBill(ranks.yearRanks),
    };
};

const setRanks = flag => {
    const dataMap = {
        w: {
            expenses: ranks.Detail.weekRanks.expensesRanks,
            income: ranks.Detail.weekRanks.incomeRanks,
        },
        m: {
            expenses: ranks.Detail.monthRanks.expensesRanks,
            income: ranks.Detail.monthRanks.incomeRanks,
        },
        y: {
            expenses: ranks.Detail.yearRanks.expensesRanks,
            income: ranks.Detail.yearRanks.incomeRanks,
        },
        default: {
            expenses: ranks.Detail.weekRanks.expensesRanks,
            income: ranks.Detail.weekRanks.incomeRanks,
        },
    };

    const selectedData =
        select.value === 0
            ? dataMap[flag]?.expenses
            : dataMap[flag]?.income || dataMap['default'].income;
    ranksData.value = selectedData;
};

const fetchData = async () => {
    await getWeekData();
    await getMonthData();
    await getYearData();
    await getRanks();
};

const changeWeek = () => {
    if (select.value === 0) {
        chartXAxis.value = expense_state.weeksData.expenseDays;
        chartData.value = expense_state.weeksData.expenseTotals;
    } else {
        chartXAxis.value = income_state.weeksData.incomeDays;
        chartData.value = income_state.weeksData.incomeTotals;
    }
    setRanks('w');
};

const changeMonth = () => {
    if (select.value === 0) {
        chartXAxis.value = new Array(expense_state.monthData.data.length)
            .fill(0)
            .map((_, i) => i + 1);
        chartData.value = expense_state.monthData.data;
    } else {
        chartXAxis.value = new Array(income_state.monthData.data.length)
            .fill(0)
            .map((_, i) => i + 1);
        chartData.value = income_state.monthData.data;
    }
    setRanks('m');
};

const changeYear = () => {
    if (select.value === 0) {
        chartXAxis.value = new Array(expense_state.yearData.data.length)
            .fill(0)
            .map((_, i) => i + 1 + '月');

        chartData.value = expense_state.yearData.data;
    } else {
        chartXAxis.value = new Array(income_state.yearData.data.length)
            .fill(0)
            .map((_, i) => i + 1 + '月');
        chartData.value = income_state.yearData.data;
    }
    setRanks('y');
};

// 计算用户的收入和支出，并对其进行分类和排名
const calcBill = data => {
    let _expenses = [];
    let _incomes = [];
    let _expensesTotal = 0;
    let _incomesTotal = 0;

    data.forEach(b => {
        if (b.bill_type == 0) {
            let obj = {};
            obj['title'] = b.category_name;
            obj['amount'] = b.amount;
            obj['icon'] = b.category_icon;
            _expensesTotal += b.amount;
            _expenses.push(obj);
        } else {
            let obj = {};
            obj['title'] = b.category_name;
            obj['amount'] = b.amount;
            obj['icon'] = b.category_icon;
            _incomesTotal += b.amount;
            _incomes.push(obj);
        }
    });

    const _expensesData = handleData(_expenses);
    const _incomesData = handleData(_incomes);

    const expensesRanks = CalcRanks(_expensesData, _expensesTotal);
    const incomeRanks = CalcRanks(_incomesData, _incomesTotal);

    expensesRanks.sort((a, b) => b.value - a.value);
    incomeRanks.sort((a, b) => b.value - a.value);

    return { expensesRanks, incomeRanks };
};

//计算排名
const CalcRanks = (data, total) => {
    const ranks = [];
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            ranks.push({
                title: key,
                value: element,
                percentage: ((element / total) * 100).toFixed(2),
            });
        }
    }
    return ranks;
};

const handleData = arr => {
    // 定义一个空对象
    let result = {};
    // 遍历数组
    for (let i = 0; i < arr.length; i++) {
        let title = arr[i].title;
        let amount = arr[i].amount; // 判断result对象是否有title属性
        if (result[title]) {
            // 如果有，则amount相加
            result[title] += amount;
        } else {
            // 如果没有，则创建title属性
            result[title] = amount;
        }
    }
    return result;
};

onMounted(async () => {
    await fetchData();
    await changeWeek();
});
</script>

<style lang="scss" scoped></style>
