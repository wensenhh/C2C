<template>
    <van-tabbar route active-color="#00d383" inactive-color="rgba(255, 255, 255, 0.60)" placeholder safe-area-inset-bottom :border="false" v-if="showtabbar">
        <van-tabbar-item v-for="(item, i) in tabList" :key="i" :to="item.path">
            <template #icon="props">
                <img :src="props.active ? item.icon_act : item.icon" style="width: 20px;height: 20px;" />
            </template>
            {{ item.name }}
        </van-tabbar-item>
    </van-tabbar>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant';
import { storeToRefs } from "pinia"
import { useAddrStore } from '../store/user'

import dealIcon from '@/assets/deal.png'
import dealIconActive from '@/assets/deal_active.png'
import assetIcon from '@/assets/asset.png'
import assetIconAcitve from '@/assets/asset_active.png'
import myIcon from '@/assets/my.png'
import myIconActive from '@/assets/my_active.png'

const tabList = ref([{
    icon: dealIcon,
    icon_act: dealIconActive,
    name: '交易',
    path: '/deal',
}, {
    icon: myIcon,
    icon_act: myIconActive,
    name: '我的',
    path: '/my',
}])

const store = useAddrStore();
let { showtabbar } = storeToRefs(store)

</script>

<style lang='scss'>
.van-tabbar {
    background: #151823;
}

.van-tabbar-item--active {
    background-color: rgba($color: #000000, $alpha: 0)
}
</style>
