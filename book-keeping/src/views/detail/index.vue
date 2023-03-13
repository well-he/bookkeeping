<template>
    <div class="detail">
        <detail-top
            @show-date-pick="showDatePick"
            :currentDate="currentDate"
            :income="detail.mouthIncome"
            :expenses="detail.mouthExpenses"
        />
        <van-cell-group inset>
            <template #title>
                <div class="total">
                    <div class="time">{{ shortTime }}</div>
                    <div class="income">支出:- {{ detail.todayExpenses }}￥</div>
                    <div class="expenses">收入:+ {{ detail.todayIncome }}￥</div>
                </div>
            </template>
            <van-empty v-if="isEmpty" image="search" description="暂无数据" />
            <detail-list v-else :records="detail.records" @reflash="fetchData" @update="update" />
        </van-cell-group>

        <van-button class="add" @click="addPageShow = true">
            <van-icon name="plus" />
        </van-button>

        <van-popup
            v-model:show="datePickShow"
            round
            position="bottom"
            :close-on-click-overlay="false"
            :style="{ height: '40%' }"
        >
            <van-date-picker
                v-model="currentDate"
                title="选择日期"
                :min-date="minDate"
                @cancel="selectCancel"
                @confirm="selectTime"
                @change="selectChange"
            />
        </van-popup>

        <van-popup
            v-model:show="addPageShow"
            position="bottom"
            :close-on-click-overlay="false"
            :style="{ height: '100%' }"
        >
            <add-page @cancel-show="addPageHide" :allCategray="detail.categories" />
        </van-popup>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import detailTop from './components/detailTop.vue';
import detailList from './components/detailList.vue';
import addPage from './components/AddPage.vue';
import timeUtil from '@/utils/time';
import apiBill from '@/api/bill';
import apiCategray from '@/api/categray';
import useStorage from '@/utils/storage';

const { getItem } = useStorage();
const datePickShow = ref(false);
const addPageShow = ref(false);
const currentDate = ref(timeUtil.time2array());

let detail = reactive({
    income: '',
    expenses: '',
    todayIncome: 0,
    todayExpenses: 0,
    mouthIncome: 0,
    mouthExpenses: 0,
    records: {},
    categories: {},
});

const minDate = new Date(2023, 0, 1);

const isEmpty = ref(true);

const shortTime = computed(() => {
    return currentDate.value.join('-');
});

let newDate = {};
const showDatePick = () => {
    datePickShow.value = true;
    newDate = JSON.parse(JSON.stringify({ date: currentDate.value }));
};

const selectCancel = () => {
    currentDate.value = newDate.date;
    datePickShow.value = false;
};

const selectChange = e => {
    // 取消后回显
};
const selectTime = async t => {
    datePickShow.value = false;

    let day = timeUtil.array2time(t.selectedValues);

    currentDate.value = t.selectedValues;

    query(day);
};

const query = async d => {
    const user_id = getItem('userInfo').user_id;
    const dayRecord = await apiBill.getByTime({
        date: d,
        user_id: user_id,
    });

    isEmpty.value = dayRecord.length === 0;

    detail.records = dayRecord;
    calcPrice(dayRecord);
    getIncomeAndExpensesInMouth(d);
};

const calcPrice = data => {
    detail.todayExpenses = 0;
    detail.todayIncome = 0;
    data.forEach(i => {
        if (i.bill_type == 0) {
            detail.todayExpenses += i.amount;
        } else {
            detail.todayIncome += i.amount;
        }
    });
};

const addPageHide = async (e, f) => {
    addPageShow.value = e;
    if (f == 1) {
        await fetchData();
    }
};

const getIncomeAndExpensesInMouth = async (time = timeUtil.currentDay()) => {
    const user_id = getItem('userInfo').user_id;
    const res = await apiBill.getIncomeAndExpensesInMouth(user_id, time);
    detail.mouthExpenses = res.expense || 0;
    detail.mouthIncome = res.income || 0;
};

const update = v => {
    console.log(v);
};

const fetchData = async () => {
    const user_id = getItem('userInfo').user_id;
    let day = timeUtil.array2time(currentDate.value);
    let data = await apiBill.getByTime({
        date: day,
        user_id: user_id,
    });
    detail.records = data;
    calcPrice(data);

    if (detail.records.length) isEmpty.value = false;

    let cates = await apiCategray.all();
    detail.categories = cates;

    await getIncomeAndExpensesInMouth();
};
onMounted(async () => fetchData());
</script>

<style lang="scss" scoped>
.detail {
    display: flex;
    flex-direction: column;
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
    .add {
        background-color: var(--van-nav-bar-background);
        color: var(--van-text-color);
        border-radius: 50%;
        width: 3.5rem;
        height: 3.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        bottom: 80px;
        right: 30px;
        user-select: none;
        cursor: pointer;
    }
    .total {
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 0 10px;
    }
}
</style>
