<template>
    <div class="bills">
        <el-row>
            <el-col>
                <el-form :inline="true" :model="query" class="demo-form-inline">
                    <el-form-item label="查询用户">
                        <el-input v-model="query.username" placeholder="请输入用户名" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="findUserBills">查询</el-button>
                    </el-form-item>
                    <el-form-item label="查询某一天">
                        <el-date-picker v-model="query.date" type="date" placeholder="请选择日期" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="findBillsByDate">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table :data="tableData" border class="table">
            <el-table-column fixed prop="bill_id" label="账单ID" />
            <el-table-column prop="username" label="用户名">
                <template #default="scope">
                    <router-link to="">{{ scope.row.username }}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="category_name" label="账单分类" />
            <el-table-column prop="amount" label="账单价格" />
            <el-table-column label="账单类型">
                <template #default="scope">
                    <span v-if="scope.row.bill_type == 0">
                        <el-tag class="mx-1" size="large">支出</el-tag>
                    </span>
                    <span v-else>
                        <el-tag type="success" size="large">收入</el-tag>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="note" label="账单备注" />
            <el-table-column prop="date" label="日期" />
            <el-table-column label="操作" width="120">
                <template #default="scope">
                    <el-button type="danger" @click="deleteBill(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pager"
            background
            layout="prev, pager, next,total,->"
            :total="state.bills.length"
            v-model:current-page="state.currentPage"
            @update:current-page="sizeChange"
        />
    </div>
</template>

<script setup>
import api from '@/api';
import { onMounted, ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import time from '@/utils/time';
//
const state = reactive({
    bills: [],
    currentPage: 1,
});
const query = reactive({
    username: '',
    date: '',
});
const tableData = ref([]);
//
const getBills = async () => {
    const res = await api.bills.findAll();

    if (res) {
        displayData(res);
    }
};
const sizeChange = v => {
    let start = 10 * (v - 1);
    let end = state.currentPage * 10;
    tableData.value = state.bills.slice(start, end);
};
const findUserBills = async () => {
    if (query.username == '') {
        ElMessage.error('用户名不能为空!');
        return;
    }
    const res = await api.bills.findUserBills(query.username);
    if (res) {
        displayData(res);
    }
};
const findBillsByDate = async () => {
    if (!query.date) {
        ElMessage.error('日期不能为空!');
        return;
    }
    const date = time.format(query.date);
    const res = await api.bills.findByDate({ date });
    if (res) {
        displayData(res);
    }
};
const deleteBill = async b => {
    ElMessageBox.confirm('确定要删除吗?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
    })
        .then(async () => {
            const delRes = await api.bills.delete(b.bill_id);
            console.log(delRes);
            if (delRes) {
                ElMessage.success('删除成功!');
                getBills();
            }
        })
        .catch(err => {});
};
const displayData = data => {
    state.bills = data;
    let start = 10 * (state.currentPage - 1);
    let end = state.currentPage * 10;
    tableData.value = state.bills.slice(start, end);
};

onMounted(() => {
    getBills();
});
</script>

<style lang="scss" scoped>
.bills {
    padding: 20px;
    position: relative;
    .table {
        margin: auto;
    }
    .pager {
        margin-top: 20px;
        position: absolute;

        right: 40px;
        bottom: -50px;
    }
}
</style>
