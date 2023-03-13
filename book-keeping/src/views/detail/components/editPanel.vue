<template>
    <div class="edit">
        <van-nav-bar title="详情" />
        <van-cell-group class="edit-panel">
            <van-cell title="分类" center>
                <template #value>
                    <div class="cell-value">
                        {{ props.bill.category_name }}
                        <van-icon
                            :name="props.bill.category_icon"
                            class="iconfont edit-icon"
                            class-prefix="icon"
                        />
                    </div>
                </template>
            </van-cell>
            <van-field
                v-model="props.bill.amount"
                type="number"
                label="价格"
                placeholder="请输入价格"
                input-align="right"
            />
            <van-field
                v-model="props.bill.note"
                label="备注"
                placeholder="请输入备注"
                input-align="right"
            />
            <van-field v-model="props.bill.date" label="记录时间" readonly input-align="right" />
        </van-cell-group>

        <van-button block type="success" plain @click="modify">修改</van-button>
    </div>
</template>

<script setup>
import { showSuccessToast, showFailToast } from 'vant';
import apiBill from '@/api/bill';
const emits = defineEmits(['close']);

const props = defineProps({
    bill: {
        type: Object,
        default: {},
    },
});

const modify = async () => {
    const { bill_id, user_id, category_id, amount, date, note } = props.bill;
    const res = await apiBill.modify({
        bill_id,
        user_id,
        category_id,
        amount,
        date,
        note,
    });
    emits('close');
    if (res == 'ok') {
        toastSuccess('修改成功');
    } else {
        toastFail('修改失败');
    }
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
</script>

<style lang="scss" scoped>
.edit {
    .edit-panel {
        .cell-value {
            display: flex;
            flex-direction: row-reverse;
        }
        .edit-icon {
            font-size: 1.5rem;
        }
    }
}
</style>
