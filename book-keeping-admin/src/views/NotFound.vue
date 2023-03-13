<template>
    <div class="NotFound">
        <el-empty description="404! The page is not found" />
    </div>
</template>

<script>
export default {
    name: 'NotFound',
};
</script>

<style lang="scss" scoped>
.NotFound{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
