<template>
    <van-nav-bar :title="title" :left-arrow="showleft" :right-text="showdeal ? dealText : ''" :border="false" @click-left="onClickLeft" @click-right="onClickRight" fixed="fixed" placeholder safe-area-inset-top/>
</template>

<script setup>
import { ref, reactive } from 'vue'
defineProps({
    title: {
        type: String,
        default: 'C2C'
    },
    showleft: {
        type: Boolean,
        default: false
    },
    fixed: {
        type: Boolean,
        default: true
    },
    showdeal: {
        type: Boolean,
        default: false
    },
    dealText: {
        type: String,
        default: '发布交易'
    }
})
const emit = defineEmits(['clickRight'])
const onClickLeft = () => history.back();
const onClickRight = () => {
    emit('clickRight')
};
</script>

<style lang='scss'>
.van-nav-bar__title{
    color: #fff;
}
.van-nav-bar{
    background: #151823;
}
.van-nav-bar__text{
    color: #00d383;
}
.van-nav-bar .van-icon{
    color: #fff;
}
</style>
