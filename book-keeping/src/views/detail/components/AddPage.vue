<template>
    <div class="add-page">
        <div class="generate">
            <van-cell-group inset>
                <van-cell title="分类" :value="newCategory.category_name" />
                <van-field
                    v-model="newCategory.amount"
                    type="number"
                    label="价格"
                    placeholder="请输入"
                />
                <van-field v-model="newCategory.note" label="备注" placeholder="请输入备注" />
            </van-cell-group>
        </div>
        <van-cell-group inset>
            <van-tabs v-model:active="active" animated swipeable background="#e0f0e9">
                <van-tab title="支出" class="tab">
                    <van-grid :gutter="10" column-num="4" class="grid-warpper">
                        <van-grid-item
                            v-for="c in addPage.cExpense"
                            :key="c.category_id"
                            :text="c.category_name"
                            @click="setCategory(c, 0)"
                        >
                            <template #icon>
                                <van-icon
                                    class-prefix="icon"
                                    :name="c.category_icon"
                                    class="iconfont"
                                />
                            </template>
                        </van-grid-item>
                    </van-grid>
                </van-tab>
                <van-tab title="收入" class="tab">
                    <van-grid :gutter="10" column-num="4" class="grid-warpper">
                        <van-grid-item
                            v-for="c in addPage.cIncome"
                            :key="c.category_id"
                            :text="c.category_name"
                            @click="setCategory(c, 1)"
                        >
                            <template #icon>
                                <van-icon
                                    class-prefix="icon"
                                    :name="c.category_icon"
                                    class="iconfont"
                                />
                            </template>
                        </van-grid-item>
                    </van-grid>
                </van-tab>
            </van-tabs>

            <div class="generate">
                <van-space :size="20" direction="vertical" fill>
                    <van-button type="primary" block plain @click="addNewBill">确认</van-button>
                    <van-button type="primary" block plain @click="hide">取消</van-button>
                </van-space>
            </div>
        </van-cell-group>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps } from 'vue';
import apiBill from '@/api/bill';
import useStorage from '@/utils/storage';
import timeUtil from '@/utils/time';
import { showFailToast, showSuccessToast } from 'vant';
const { getItem } = useStorage();
const props = defineProps({
    allCategray: {
        type: Array,
    },
});

const emits = defineEmits(['cancelShow']);
let addPage = reactive({
    cIncome: [],
    cExpense: [],
});
const active = ref(0);
const newCategory = reactive({
    category_id: '',
    category_name: '请选择分类',
    amount: '',
    date: '',
    note: '',
    bill_type: '',
});

const setCategory = (c, t) => {
    newCategory.category_id = c.category_id;
    newCategory.category_name = c.category_name;
    newCategory.bill_type = t;
};

const addNewBill = async () => {
    if (newCategory.category_name == '请选择分类') {
        toastFail('请选择分类');
        return;
    }
    if (newCategory.amount == '') {
        toastFail('价格不能为空');
        return;
    }
    let params = {
        user_id: getItem('userInfo').user_id,
        category_id: newCategory.category_id,
        amount: newCategory.amount,
        date: timeUtil.currentTime(),
        note: newCategory.note,
        bill_type: newCategory.bill_type,
    };
    await apiBill.add(params);

    toastSuccess('添加成功');

    emits('cancelShow', false, 1);
};

const hide = () => {
    newCategory.category_id = '';
    newCategory.category_name = '请选择分类';
    newCategory.amount = '';
    newCategory.date = '';
    newCategory.note = '';
    newCategory.bill_type = '';
    emits('cancelShow', false);
};

const toastSuccess = msg => {
    showSuccessToast({
        message: msg,
        className: 'toast',
        iconSize: 36,
    });
};
const toastFail = msg => {
    showFailToast({
        message: msg,
        className: 'toast',
        iconSize: 36,
    });
};
onMounted(() => {
    addPage.cIncome = props.allCategray.filter(item => item.category_type == 'income');
    addPage.cExpense = props.allCategray.filter(item => item.category_type == 'expenses');
});
</script>

<style lang="scss" scoped>
.add-page {
    .cancel {
        padding-right: 15px;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
    }
    .tab {
        padding: 20px 5px;
        .grid-warpper {
            height: 350px;
            overflow-y: scroll;
        }
    }
    .generate {
        padding: 20px 0;
    }
    .btn-group {
        padding: 20px;
    }
}
</style>
