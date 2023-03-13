<template>
    <div class="detail-list">
        <van-swipe-cell v-for="i in records" :key="i.bill_id">
            <van-cell :title="i.category_name" center class="detail-cell" @click="cellCLick(i)">
                <template #icon>
                    <van-icon
                        :name="i.category_icon"
                        class="iconfont"
                        class-prefix="icon"
                        style="margin-right: 10px"
                    />
                </template>
                <template #label>
                    <van-text-ellipsis :content="i.note" />
                </template>
                <template #value>
                    <h3>{{ price(i) }} ￥</h3>
                </template>
            </van-cell>
            <template #right>
                <van-button
                    square
                    type="danger"
                    text="删除"
                    class="h50"
                    @click="confirmDel(i.bill_id)"
                />
            </template>
        </van-swipe-cell>

        <van-popup
            v-model:show="editShow"
            position="bottom"
            :close-on-click-overlay="false"
            :style="{ height: '100%' }"
            closeable
        >
            <edit-panel :bill="detail.bill" @close="close" />
        </van-popup>
    </div>
</template>

<script setup>
import { showConfirmDialog, showSuccessToast, showFailToast } from 'vant';
import { ref, computed, reactive } from 'vue';
import EditPanel from './editPanel.vue';
import apiBill from '@/api/bill';

const props = defineProps({
    records: {
        type: Array,
        default: [],
    },
});
const detail = reactive({
    bill: {},
});
const editShow = ref(false);
const emits = defineEmits(['reflash']);

const close = () => {
    editShow.value = false;
    emits('reflash');
};

const records = computed(() => props.records);

const price = computed(() => {
    return function (i) {
        return i.bill_type == 1 ? '+' + i.amount : '-' + i.amount;
    };
});

const confirmDel = id => {
    showConfirmDialog({
        title: '提示',
        message: '确认删除吗?',
        cancelButtonColor: '#f00',
        width: 320,
    })
        .then(async () => {
            const res = await apiBill.delete(id);
            if (res) {
                toastSuccess('删除成功');
                emits('reflash');
            } else {
                toastFail('删除失败');
            }
        })
        .catch();
};

const cellCLick = bill => {
    editShow.value = true;
    detail.bill = bill;
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
.detail-list {
    height: 50vh;
    overflow: scroll;
    .detail-cell {
        height: 50px;
        // border-bottom: 1px solid #6aaae6;
    }
    .h50 {
        height: 50px;
    }
    .total {
        display: flex;
        justify-content: space-between;
    }
}
</style>
