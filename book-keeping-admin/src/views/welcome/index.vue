<script setup>
import { ref, computed, onMounted } from 'vue';
import timeUtil from '@/utils/time';
import Card from './components/Card.vue';

const dynamicTime = ref(timeUtil.currentTime());

onMounted(() => {
    setInterval(() => {
        dynamicTime.value = timeUtil.currentTime();
    }, 1000);
});
</script>

<template>
    <div class="welcome">
        <div class="title">
            <p class="time">{{ dynamicTime }}</p>
            <div class="center">
                <span>后台管理系统</span>
            </div>
        </div>
        <el-row>
            <el-col :span="8">
                <card msg="welcome" />
            </el-col>
        </el-row>
    </div>
</template>

<style scoped lang="scss">
.welcome {
    width: 100%;
    height: 100%;
    padding: 15px;
    .title {
        height: 55px;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 15px;
        color: var(--el-color-primary);
        overflow: hidden;
        position: relative;
        .time {
            position: absolute;
        }
        .center {
            font-size: 1.5rem;
            width: 100%;
            display: flex;
            justify-content: center;
            font-size: 18px;
            letter-spacing: 5px;
            background-clip: text;
            background-size: 200% 100%;
            -webkit-box-reflect: below -2px -webkit-gradient(
                    linear,
                    left top,
                    left bottom,
                    from(transparent),
                    to(hsla(0, 0%, 100%, 0.1))
                );
            position: relative;
            .span {
                cursor: pointer;
            }
        }
    }
}
</style>
