<template>
    <Header :title="pageName" :showleft="true"></Header>
    <div class='container'>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <div class="flex-col flex-auto group_3">
                <div class="flex-col">
                    <div class="flex-col list">
                        <div class="flex-row items-center list-item space-x-30">
                            <span class="font_2 text_2">链类型</span>
                            <div class="flex-row justify-between items-center flex-auto section"
                                @click="showLinePicker = true">
                                <span class="font_3">UBC</span>
                                <img class="image_4"
                                    src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432188370113058.png" />
                            </div>
                        </div>
                        <div class="flex-row items-center list-item space-x-14">
                            <span class="font_2 text_2">{{ pageName }}代币</span>
                            <div class="flex-row justify-between items-center flex-auto section"
                                @click="showCoinPicker = true">
                                <span class="font_3">IPC</span>
                                <img class="image_4"
                                    src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432188370113058.png" />
                            </div>
                        </div>
                    </div>
                    <div class="flex-col justify-start items-start text-wrapper">
                        <van-field v-model="rechageval" :border="false" :placeholder="'请输入' + pageName + '数量'" />
                    </div>
                    <div class="flex-col justify-start items-start" style="color:azure;margin-top: 10px;">{{ pageName }}手续费: {{ pageType == 1 ? userrules.rechange_sxf : userrules.tixian_sxf }}%</div>
                    <div class="flex-col justify-start items-center button" v-if="!approveFlagUSDT" @click="Approvefun(1)">
                        <span class="font_1">授权</span>
                    </div>
                    <div class="flex-col justify-start items-center button" v-else @click="myrechage"><span
                            class="font_1">{{ pageName
                            }}</span>
                    </div>
                </div>
                <div class="group_4">
                    <span class="font_5 text_4">
                        温馨提示：
                        <br />
                    </span>
                    <span class="font_5">
                        1.当前仅支持UBC链的IPC代币{{ pageName }}，{{ pageName }}前请确认链类型和对应代币是否余额充足
                        <br />
                    </span>
                    <span class="font_5">
                        2.{{ pageName }}会有时间延迟，30s-5min之内展于正常情況
                        <br />
                    </span>
                    <span class="font_5">3.如{{ pageName }}长时间末到账，请及时联系在线客服，提供{{ pageName }}hash方便客服进行查询<br /></span>
                    <span class="font_5" v-if="pageType == 2">
                        4.每个用户每天限制只能提现 {{ userrules.tixian_daynum }} 次
                        <br />
                    </span>
                    <span class="font_5" v-if="pageType == 2">
                        5.已获得的IPC需要等待48h才可以发起提现
                        <br />
                    </span>
                </div>
                <div class="flex-col group_5 space-y-22">
                    <div class="flex-col space-y-4">
                        <span class="self-start font_1">我的{{ pageName }}记录</span>
                        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getmoneylog">
                            <div class="flex-col">
                                <div class="flex-row justify-between items-center list-item_2" :key="i"
                                    v-for="(item, i) in myrechageList">
                                    <div class="flex-row items-baseline space-x-32">
                                        <span class="font_4 text_5">{{ item.status == 0 ? '待确认' : item.status == 1 ? '有效' :
                                            '无效' }}</span>
                                        <span class="font_3">{{ item.num }}</span>
                                    </div>
                                    <span class="font_3 text_6">{{ item.createtime }}</span>
                                </div>
                            </div>
                        </van-list>
                    </div>
                </div>
            </div>
        </van-pull-refresh>
    </div>
    <van-popup v-model:show="showLinePicker" round position="bottom">
        <van-picker title="链类型" :columns="lineList" @cancel="lineonConfirm" @confirm="lineonConfirm" />
    </van-popup>
    <van-popup v-model:show="showCoinPicker" round position="bottom">
        <van-picker :title="pageName + '代币'" :columns="coinList" @cancel="coinonConfirm" @confirm="coinonConfirm" />
    </van-popup>
</template>

<script setup>
import { showToast, showLoadingToast, closeToast } from 'vant';
import { ref, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { allowance, ApproveCoin, createRechargeContract, expcoinaddr, toAmount, sign } from '../../connectWallet/index'
import { moneylog, userrechage, usertixian } from '../../api/app'
import { storeToRefs } from "pinia"
import { useAddrStore } from '../../store/user'

const store = useAddrStore();
let { address, userrules } = storeToRefs(store)
const route = useRoute();
const pageType = ref(1)
const pageName = ref('充值')
const showLinePicker = ref(false)
const showCoinPicker = ref(false)
const lineList = ref([{
    text: 'UBC',
    value: 1
}])
const coinList = ref([{
    text: 'IPC',
    value: 1
}])
const approveFlagUSDT = ref(false)
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const orderpage = ref(1)
const coinnow = ref(1)
const myrechageList = ref([])
const rechageval = ref(null)

onActivated(async () => {
    pageType.value = route.query.type ? route.query.type : 1
    pageName.value = pageType.value == 1 ? '充值' : '提现'
    await allallowance()
})

const myrechage = async () => {
    if (!(/(^[1-9]\d*$)/.test(rechageval.value))) {
        return showToast('数量必须为正整数~')
    }
    showLoadingToast({
        message: '上链中...',
        forbidClick: true,
        duration: 0
    });
    if (pageType.value == 1) {
        const coinaddr = await expcoinaddr()
        let MyContract = await createRechargeContract()
        try {
            let rechagenum = toAmount(rechageval.value)
            console.log(coinaddr)
            MyContract.recharge(coinaddr, rechagenum, {
                gasLimit: 300000
            }).then(res => {
                console.log(res)
                if (res?.hash) {
                    userrechage({
                        hash: res.hash,
                        amount: rechageval.value,
                        fromaddress: address.value
                    }).then(({ data }) => {
                        closeToast()
                        showToast('充值成功~')
                        rechageval.value = null
                        onRefresh()
                    })
                }
            })
        } catch (error) {
            console.log(error)
            closeToast();
            showToast('充值失败~')
        }

    } else {
        let signres = await sign()
        if (!signres) {
            closeToast()
            return false
        }
        await usertixian({
            num: rechageval.value,
            balance_name: coinnow.value == 1 ? 'ipc_money' : ''
        }).then(({ data }) => {
            closeToast()
            showToast('提现成功~')
            rechageval.value = null
            onRefresh()
        })

    }
}

const getmoneylog = async () => {
    if (refreshing.value) {
        myrechageList.value = [];
        orderpage.value = 1
        refreshing.value = false;
    }
    moneylog({
        action: pageType.value,
        page: orderpage.value,
        balance_name: coinnow.value == 1 ? 'ipc_money' : '',
    }).then(({ data }) => {
        myrechageList.value = [...myrechageList.value, ...data.data]
        loading.value = false;
        if (myrechageList.value.length >= data.total) {
            finished.value = true;
        } else {
            orderpage.value += 1
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
    getmoneylog();
};

const Approvefun = async (type) => {
    showLoadingToast({
        message: '授权中...',
        forbidClick: true,
        duration: 0
    });
    await ApproveCoin(type, (res) => {
        console.log(res.hash)
        if (res?.hash) {
            approveFlagUSDT.value = true
            allallowance()
            closeToast();
            showToast('Authorize succeeded')
        } else {
            closeToast();
            showToast('授权失败~')
        }
    })
}

const allallowance = async () => {
    let usdtallowance = await allowance(1)
    approveFlagUSDT.value = usdtallowance
}

const lineonConfirm = ({ selectedValues }) => {
    // showToast(`当前值: ${selectedValues.join(',')}`);
    showLinePicker.value = false
};
const coinonConfirm = ({ selectedValues }) => {
    coinnow.value = selectedValues[0]
    onRefresh()
    showCoinPicker.value = false
    // showToast(`当前值: ${selectedValues.join(',')}`);
};

</script>

<style lang='scss' scoped>
:deep(.van-field__control) {
    color: #ffffff !important;
}

.group_3 {
    .list {
        padding-bottom: 20px;

        .list-item {
            margin-right: 6px;
            padding: 12px 0;
            border-bottom: solid 1px #2e3144;

            .font_2 {
                font-size: 15px;
                font-family: MiSans;
                line-height: 13.5px;
                color: #e2e3ee;
            }

            .text_2 {
                line-height: 14px;
            }

            .section {
                padding: 12px;
                background-color: #1f2237;
                border-radius: 4px;
                height: 48px;

                .image_4 {
                    width: 24px;
                    height: 24px;
                }
            }
        }

        .space-x-14 {
            &>*:not(:first-child) {
                margin-left: 14px;
            }
        }
    }

    .text-wrapper {
        margin-right: 6px;
        background-color: #1f2237;
        border-radius: 4px;

        .text_3 {
            margin-left: 12px;
            line-height: 14px;
        }
    }

    .button {
        margin-right: 6px;
        margin-top: 12px;
        padding: 16px 0;
        background-color: #00d383;
        border-radius: 4px;
    }

    .group_4 {
        margin-top: 24px;

        .font_5 {
            font-size: 15px;
            font-family: MiSans;
            line-height: 24px;
            color: #e2e3ee;
        }

        .text_4 {
            color: #f84f56;
        }
    }

    .group_5 {
        margin-top: 30px;

        .space-y-4 {
            &>*:not(:first-child) {
                margin-top: 4px;
            }

            .list-item_2 {
                margin-right: 6px;
                padding: 20px 0;
                border-bottom: solid 1px #2e3144;

                .space-x-32 {
                    &>*:not(:first-child) {
                        margin-left: 32px;
                    }

                    .text_5 {
                        color: #f84f56;
                        line-height: 14px;
                    }
                }

                .text_6 {
                    margin-right: -6px;
                }
            }
        }
    }

    .space-y-22 {
        &>*:not(:first-child) {
            margin-top: 22px;
        }
    }

    .font_1 {
        font-size: 17px;
        font-family: MiSans;
        line-height: 16px;
        color: #f9f9f9;
    }

    .font_4 {
        font-size: 15px;
        font-family: MiSans;
        line-height: 13.5px;
        color: #6d7092;
    }

    .font_3 {
        font-size: 15px;
        font-family: MiSans;
        line-height: 12px;
        color: #e2e3ee;
    }

    .space-x-30 {
        &>*:not(:first-child) {
            margin-left: 30px;
        }
    }
}
</style>
