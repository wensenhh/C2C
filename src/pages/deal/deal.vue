<template>
    <Header title="交易" :showdeal="true" @clickRight="issueDeal"></Header>
    <div class="container">
        <div class="flex-col flex-auto group_2">
            <div class="flex-row self-center section">
                <div :class="['flex-col', 'justify-start', 'items-center', 'text-wrapper_2', orderparam.type == 1 ? 'tabactive' : '']"
                    @click="changetab(1)"><span class="font_1 text_2">出售</span></div>
                <div :class="['flex-col', 'justify-start', 'items-center', 'text-wrapper_2', orderparam.type == 2 ? 'tabactive' : '']"
                    @click="changetab(2)"><span class="font_1 text_3">购买</span></div>
            </div>
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <div class="flex-col justify-start items-center text-wrapper_3">
                    <span class="font_3 text_4">今日价格：￥{{ allrules?.ipcrmb_min || 0 }} ~ ￥{{ allrules?.ipcrmb_max || 0
                    }}</span>
                </div>
                <!-- <van-search v-model="value" shape="round" background="fixed" placeholder="请输入搜索关键词" /> -->
                <van-dropdown-menu>
                    <van-dropdown-item v-model="value1" :options="option1" @change="filteror" />
                </van-dropdown-menu>
                <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getbuysellList">
                    <div class="flex-col group_3">
                        <div class="flex-col list space-y-16">
                            <div class="flex-col list-item space-y-26" :key="i" v-for="(item, i) in allbuysellList">
                                <div class="flex-col space-y-14">
                                    <!-- <div class="flex-row items-center space-x-12">
                                        <img class="image_6"
                                            src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432198482872167.png" />
                                        <span class="font_4">Sam</span>
                                        <img class="image_7"
                                            src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432200052016552.png" />
                                        <div class="flex-col justify-start items-center text-wrapper_4"><span
                                                class="font_5">HOT</span>
                                        </div>
                                    </div> -->
                                    <div class="flex-row justify-between">
                                        <span class="font_3">单价</span>
                                        <span class="font_3">数量</span>
                                    </div>
                                    <div class="flex-row justify-between">
                                        <div class="flex-row space-x-4">
                                            <span class="font_6">{{ item.ipcdanj }}</span>
                                            <span class="font_6">CNY</span>
                                        </div>
                                        <div class="flex-row space-x-6">
                                            <span class="font_6">{{ item.ipcnum }}</span>
                                            <span class="font_6">IPC</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex-col space-y-21">
                                    <div class="flex-row space-x-10">
                                        <span class="font_3">订单号</span>
                                        <div class="flex-row items-center">
                                            <span class="font_6">{{ item.ordersn }}</span>
                                            <img class="shrink-0 image_8" @click="tools.copy(item.ordersn)"
                                                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432199831156844.png" />
                                        </div>
                                    </div>
                                    <div class="flex-row space-x-10">
                                        <div class="flex-col justify-start items-center text-wrapper_5"
                                            v-if="(orderparam.type == 1 && item.buy_uid == userinfo.user_id && (item.status == 1 || item.status == 2)) || (orderparam.type == 2 && item.sell_uid == userinfo.user_id && item.status == 1)"
                                            @click="revocation(item.id)"><span class="font_7">撤销</span>
                                        </div>
                                        <div class="flex-col justify-start items-center text-wrapper_6"
                                            v-show="orderparam.type == 2" @click="buysell(item)"
                                            style="background-color: #00D383;">
                                            <span class="font_2">购买</span>
                                        </div>
                                        <div class="flex-col justify-start items-center text-wrapper_6"
                                            v-show="orderparam.type == 1" @click="buysell(item)">
                                            <span class="font_2">出售</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
    <van-action-sheet v-model:show="paysheet" :title="`${orderparam.type == 2 ? '购买' : '出售'}IPC`">
        <div class="flex-col section_6 space-y-24">
            <span class="self-start font_6">建议单价：￥{{ allrules?.ipcrmb_min || 0 }} ~ ￥{{ allrules?.ipcrmb_max || 0 }}</span>
            <div class="flex-col space-y-20">
                <div class="flex-col space-y-16">
                    <div class="flex-row justify-between section_7 iptmain">
                        <van-field v-model="buysellitem.ipcnum" disabled :border="false" placeholder="起1IPC" />
                        <span class="font_7 iptbox">IPC</span>
                    </div>
                    <div class="flex-col justify-start items-start text-wrapper_5">
                        <van-field v-model="buysellitem.ipcdanj" disabled :border="false" placeholder="IPC单价" />
                    </div>
                </div>
            </div>
            <div class="self-start group_5" v-show="orderparam.type == 1">
                <span class="font_6">账户可出售：</span>
                <span class="font_8">{{ userinfo.ipc_money }} IPC</span>
            </div>
            <div class="flex-col">
                <div class="flex-row justify-between items-center group_6" v-show="orderparam.type == 2">
                    <span class="font_6">您将支付</span>
                    <span class="font_7">{{ buysellitem?.ipcnum * buysellitem?.ipcdanj }} CNY</span>
                </div>
                <div class="flex-row justify-between items-center group_6" v-show="orderparam.type == 1">
                    <span class="font_6">您将获得</span>
                    <span class="font_7">{{ buysellitem?.ipcnum * buysellitem?.ipcdanj }} CNY</span>
                </div>
                <div class="flex-row justify-between items-center group_6" v-show="orderparam.type == 1"
                    @click="choosepay()">
                    <span class="font_6">选择收款方式</span>
                    <span class="font_7" v-show="!buysellitem.nowpay">
                        <img class="image_4"
                            src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432188370113058.png" />
                    </span>
                    <span class="font_7" v-show="buysellitem.nowpay">{{ buysellitem?.nowpay?.name }}</span>
                </div>
                <div class="flex-col justify-start items-center button" @click="buysellcon()" v-show="orderparam.type == 2"
                    style="background-color: #00D383;"><span class="font_2">购买</span></div>
                <div class="flex-col justify-start items-center button" @click="buysellcon()" v-show="orderparam.type == 1">
                    <span class="font_2">出售</span>
                </div>
            </div>
        </div>
    </van-action-sheet>
    <van-action-sheet v-model:show="mypayshow" :actions="payList" @select="selnowpay" description="选择收款方式"
        close-on-click-action />
</template>
  
<script setup>
import { ref, onActivated } from 'vue'
import Header from '../../components/Header.vue'
import { connetWallet, sign } from '../../connectWallet/index'
import { storeToRefs } from "pinia"
import { useRoute, useRouter } from "vue-router";
import { useAddrStore } from '../../store/user'
import { showConfirmDialog } from 'vant';
import tools from '../../../utils/tools';
import { buyselllist, mainrules, matesellorder, matebuyorder, myPayList, chexiaoorder } from '../../api/app.js'
import { showToast } from 'vant'

const store = useAddrStore();
const route = useRoute();
const router = useRouter();
const paysheet = ref(false)
let { address, userinfo, changerules } = storeToRefs(store)
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const orderparam = ref({
    type: 1,
    page: 1,
})
const allbuysellList = ref([])
const allrules = ref(null)
const buysellitem = ref({})
const mypayshow = ref(false)
const payList = ref([])
const value1 = ref(0);
const option1 = ref([
    { text: '默认排序', value: 0, },
    { text: '数量1~50', value: 1, min: 1, max: 50 },
    { text: '数量50~100', value: 2, min: 50, max: 100 },
    { text: '数量100~500', value: 3, min: 100, max: 500 },
    { text: '数量500~1000', value: 4, min: 500, max: 1000 },
    { text: '数量1000+', value: 5, min: 1000 },
]);

onActivated(async () => {
    console.log(route.query)
    const res = await connetWallet()
    if (!res || res == '') {
        showToast('钱包地址获取失败~')
    } else {
        address.value = res
        if (route.query.inviteCode) {
            await store.changeParent(route.query.inviteCode)
        }
        await store.loginaddr(res, () => {
            // getbuysellList()
            getrules()
            getmypayList()
        })

    }
})

const buysellcon = async () => {
    // if(orderparam.value.type == 2)
    let signres = await sign()
    if (!signres) {
        return false
    }
    if (orderparam.value.type == 1) {
        matebuyorder({
            id: buysellitem.value.id,
            shoukuanid: buysellitem.value.nowpay.id
        }).then(res => {
            showToast('匹配成功~')
            paysheet.value = false
            buysellitem.value = {}
            onRefresh()
        })
    } else {
        matesellorder({
            id: buysellitem.value.id
        }).then(res => {
            showToast('匹配成功~')
            paysheet.value = false
            buysellitem.value = {}
            onRefresh()
        })
    }
}

const filteror = (e) => {
    if (value1.value == 0) {
        orderparam.value.ipcnum_min = null
        orderparam.value.ipcnum_max = null
    } else {
        orderparam.value.ipcnum_min = option1.value[value1.value].min || null
        orderparam.value.ipcnum_max = option1.value[value1.value].max || null
    }
    onRefresh()
}

const selnowpay = (e) => {
    buysellitem.value.nowpay = e
}

const choosepay = async () => {
    if (payList.value.length == 0) {
        return showToast('请先绑定一种收款方式~')
    }
    mypayshow.value = true
}

const getmypayList = () => {
    payList.value = []
    myPayList().then(({ data }) => {
        data.forEach(element => {
            payList.value.push({
                name: element.type == 'wx' ? '微信' : element.type == 'zfb' ? '支付宝' : '银行卡',
                subname: element.zhanghao,
                id: element.id
            })
        });
    })
}

const buysell = (item) => {
    paysheet.value = true
    buysellitem.value = {}
    buysellitem.value = item
}

const getrules = () => {
    mainrules().then(({ data }) => {
        store.changerules(data)
        allrules.value = data
    })
}

const getbuysellList = async () => {
    if (refreshing.value) {
        allbuysellList.value = [];
        orderparam.value.page = 1
        refreshing.value = false;
    }
    await buyselllist(orderparam.value).then(({ data }) => {
        allbuysellList.value = [...allbuysellList.value, ...data.data]
        loading.value = false;
        if (allbuysellList.value.length >= data.total) {
            finished.value = true;
        } else {
            orderparam.value.page += 1
        }
    })
}

const onRefresh = () => {
    // 清空列表数据
    finished.value = false;
    refreshing.value = true
    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true;
    getbuysellList();
};

const revocation = async (id) => {
    let signres = await sign()
    if (!signres) {
        return false
    }
    showConfirmDialog({
        title: '提示',
        message:
            '您确定要撤销该订单吗？',
        confirmButtonColor: '#00D383',
        cancelButtonColor: '#6D7092'
    })
        .then(() => {
            // on confirm
            chexiaoorder({
                id: id
            }).then(res => {
                showToast('撤销成功~')
                onRefresh()
            })
        })
}

const changetab = (value) => {
    orderparam.value.type = value
    onRefresh()
}

const issueDeal = () => {
    navigatorUrl('/issue')
}

const navigatorUrl = (url, param) => {
    router.push({
        path: url,
        query: param
    });
}
</script>
  
<style lang='scss' scoped>
:deep(.van-field__control) {
    color: #ffffff !important;
}

:deep(.van-dropdown-menu__bar) {
    background-color: #1f2237 !important;
}

:deep(.van-dropdown-menu__title) {
    color: #ffffff !important;
}

.van-search__content {
    background: rgba(31, 34, 55, 1) !important;
}

.group_2 {
    .section {
        padding: 4px;
        background-color: #1f2237;
        border-radius: 4px;

        .tabactive {
            background-color: #00d383;
        }

        .text-wrapper_2 {
            padding: 14px 0;
            flex: 1 1 96px;
            border-radius: 4px;
            width: 96px;
            height: 43px;

            .text_3 {
                font-size: 15.5px;
                line-height: 15px;
            }
        }

        .font_1 {
            font-size: 15px;
            font-family: SF Pro Text;
            line-height: 14px;
            font-weight: 600;
            color: #ffffff;
        }
    }

    .text-wrapper_3 {
        margin-top: 24px;
        padding: 12px 0;
        background-color: #00d3831a;
        border-radius: 4px;
        overflow: hidden;

        .text_4 {
            color: #00d383;
            line-height: 14.5px;
        }
    }

    .search {
        margin-top: 24px;
        padding: 11px 12px;
        background-color: #1f2237;
        border-radius: 26px;

        .image_5 {
            width: 18px;
            height: 18px;
        }
    }

    .space-x-8 {
        &>*:not(:first-child) {
            margin-left: 8px;
        }
    }

    .font_3 {
        font-size: 15px;
        font-family: MiSans;
        line-height: 14px;
        color: #6d7092;
    }

    .group_3 {
        .list {
            padding-bottom: 16px;

            .list-item {
                padding: 16px 12px;
                background-color: #151823;
                border-radius: 8px;

                .space-y-14 {
                    &>*:not(:first-child) {
                        margin-top: 14px;
                    }

                    .space-x-12 {
                        &>*:not(:first-child) {
                            margin-left: 12px;
                        }

                        .image_6 {
                            border-radius: 25px;
                            width: 20px;
                            height: 20px;
                        }

                        .font_4 {
                            font-size: 15px;
                            font-family: MiSans;
                            line-height: 12px;
                            color: #ffffff;
                        }

                        .image_7 {
                            width: 20px;
                            height: 20px;
                        }

                        .text-wrapper_4 {
                            padding: 6px 0;
                            background-color: #f84f56;
                            border-radius: 2px;
                            width: 36px;
                            height: 20px;

                            .font_5 {
                                font-size: 11px;
                                font-family: MiSans;
                                line-height: 9px;
                                color: #ffffff;
                            }
                        }
                    }

                    .space-x-4 {
                        &>*:not(:first-child) {
                            margin-left: 4px;
                        }
                    }

                    .space-x-6 {
                        &>*:not(:first-child) {
                            margin-left: 6px;
                        }
                    }
                }

                .space-y-21 {
                    &>*:not(:first-child) {
                        margin-top: 21px;
                    }

                    .space-x-10 {
                        &>*:not(:first-child) {
                            margin-left: 10px;
                        }

                        .image_8 {
                            width: 16px;
                            height: 16px;
                        }

                        .text-wrapper_5 {
                            flex: 1 1 162px;
                            padding: 16px 0;
                            background-color: #1f2237;
                            border-radius: 4px;
                            height: 48px;

                            .font_7 {
                                font-size: 17px;
                                font-family: MiSans;
                                line-height: 16px;
                                color: #6d7092;
                            }
                        }

                        .text-wrapper_6 {
                            flex: 1 1 162px;
                            padding: 16px 0;
                            background-color: #f84f56;
                            border-radius: 4px;
                            height: 48px;

                            .font_2 {
                                font-size: 17px;
                                font-family: MiSans;
                                line-height: 16px;
                                color: #f9f9f9;
                            }
                        }
                    }
                }

                .font_6 {
                    font-size: 15px;
                    font-family: MiSans;
                    line-height: 12px;
                    color: #f9f9f9;
                }
            }

            .space-y-26 {
                &>*:not(:first-child) {
                    margin-top: 26px;
                }
            }
        }

        .space-y-16 {
            &>*:not(:first-child) {
                margin-top: 16px;
            }
        }
    }
}

.section_6 {
    padding: 16px;

    .group_3 {
        padding: 4px 2px;

        .text_7 {
            color: #00d383;
        }

        .image_7 {
            width: 24px;
            height: 24px;
        }

        .pos_2 {
            position: absolute;
            right: 2px;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    .font_6 {
        font-size: 15px;
        font-family: MiSans;
        line-height: 14px;
        color: #e2e3ee;
    }

    .space-y-20 {
        &>*:not(:first-child) {
            margin-top: 20px;
        }

        .space-y-16 {
            &>*:not(:first-child) {
                margin-top: 16px;
            }

            .section_7 {
                background-color: #151823;
                border-radius: 4px;

                .text_8 {
                    line-height: 13.5px;
                }
            }

            .iptmain {
                position: relative;
            }

            .text-wrapper_5 {
                background-color: #151823;
                border-radius: 4px;

                .text_9 {
                    margin-left: 14px;
                }
            }
        }

        .group_4 {
            line-height: 14px;
        }
    }

    .group_5 {
        line-height: 14px;
    }

    .font_8 {
        font-size: 15px;
        font-family: MiSans;
        line-height: 12px;
        color: #00d383;
    }

    .group_6 {
        padding-bottom: 30px;
    }

    .font_7 {
        font-size: 15px;
        font-family: MiSans;
        line-height: 12px;
        color: #e2e3ee;

    }

    .iptbox {
        position: absolute;
        right: 10px;
        top: 15px;
    }

    .button {
        padding: 16px 0;
        background-color: #f84f56;
        border-radius: 4px;
    }

    .font_2 {
        font-size: 17px;
        font-family: MiSans;
        line-height: 16px;
        color: #f9f9f9;
    }
}

.space-y-24 {
    &>*:not(:first-child) {
        margin-top: 24px;
    }
}
</style>
  