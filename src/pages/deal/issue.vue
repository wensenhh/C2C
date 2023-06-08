<template>
    <div class="container">
        <div class="flex-col flex-auto group space-y-24">
            <div class="flex-row self-center section">
                <div :class="['flex-col', 'justify-start', 'items-center', 'text-wrapper', nowtab == 1 ? 'tabactive' : '']"
                    @click="changetab(1)"><span class="font_1">出售</span></div>
                <div :class="['flex-col', 'justify-start', 'items-center', 'text-wrapper', nowtab == 2 ? 'tabactive' : '']"
                    @click="changetab(2)"><span class="font_1">购买</span></div>
            </div>
            <div class="flex-col space-y-28">
                <div class="flex-row justify-between items-center section_2">
                    <div class="flex-row items-center space-x-10">
                        <img class="shrink-0 image_5"
                            src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432188329570048.png" />
                        <span class="font_3 text_3">IPC</span>
                    </div>
                    <span class="font_4 text_4">参考单价：￥{{ userrules?.ipcrmb_min || 0 }} ~ ￥{{ userrules?.ipcrmb_max || 0
                    }}</span>
                </div>
                <div class="flex-col section_3 space-y-26">
                    <div class="flex-col space-y-16">
                        <div class="flex-row justify-between">
                            <span class="text_5">{{ nowtab == 2 ? '购买' : '出售' }}</span>
                            <div class="flex-row items-baseline">
                                <span class="font_4">可用余额：</span>
                                <span class="font_3">{{ userinfo.ipc_money }} IPC</span>
                            </div>
                        </div>
                        <div class="flex-col space-y-12">
                            <div class="flex-row justify-between section_4">
                                <van-field v-model="coinnumber" type="number" :border="false" placeholder="请输入数量" />
                                <span class="font_4 iptitem" v-show="nowtab == 1"
                                    @click="coinnumber = userinfo.ipc_money">全部</span>
                            </div>
                            <div class="flex-col justify-start items-start text-wrapper_3">
                                <van-field v-model="coinprice" type="number" :border="false" placeholder="请输入单价" />
                            </div>
                        </div>
                    </div>
                    <div class="flex-row justify-between items-center" @click="choosepay" v-show="nowtab == 1">
                        <span class="font_4">选择收款方式</span>
                        <span class="font_7" v-show="!nowpay.name">
                            <img class="image_4"
                                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432188370113058.png" />
                        </span>
                        <span class="font_7" v-show="nowpay.name">{{ nowpay?.name }}</span>
                    </div>
                    <div class="flex-col space-y-16">
                        <span class="self-start font_4">您将{{ nowtab == 2 ? '支付' : '获得' }} ¥{{ coinnumber * coinprice }}</span>
                        <div class="flex-col justify-start items-center button" v-show="nowtab == 2"
                            @click="issuebuysellreq()"><span class="font_2 text_7">购买 IPC</span>
                        </div>
                        <div class="flex-col justify-start items-center button" v-show="nowtab == 1"
                            @click="issuebuysellreq()"><span class="font_2 text_7">出售 IPC</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <van-action-sheet v-model:show="mypayshow" :actions="payList" @select="selnowpay" description="选择收款方式"
        close-on-click-action />
</template>

<script setup>
import { showToast } from 'vant';
import { ref, onMounted, onActivated } from 'vue'
import { useAddrStore } from '../../store/user'
import { storeToRefs } from "pinia"
import { connetWallet, sign } from '../../connectWallet/index'
import { issuebuysell, myPayList } from '../../api/app.js'

const store = useAddrStore();
const { userinfo, userrules } = storeToRefs(store)
const nowtab = ref(1)
const mypayshow = ref(false)
const payList = ref([])
const nowpay = ref({})
const coinnumber = ref(null)
const coinprice = ref(null)

onActivated(() => {
    getmypayList()
})

const issuebuysellreq = async () => {
    if (!coinnumber.value || !coinprice.value) {
        return showToast('请填写必填项')
    }
    if (nowtab.value == 1 && !nowpay.value.id) {
        return showToast('请选择收款方式')
    }
    if (!(/(^[1-9]\d*$)/.test(coinnumber.value))) {
        return showToast('数量必须为正整数~')
    }
    if (Number(coinprice.value) <= 0) {
        return showToast('单价必须大于0~')
    }
    let signres = await sign()
    if (!signres) {
        return false
    }
    issuebuysell({
        type: nowtab.value == 1 ? 2 : 1,
        ipcnum: coinnumber.value,
        ipcdanj: coinprice.value,
        shoukuanid: nowpay?.value.id || ''
    }).then(res => {
        showToast('发布成功~')
        coinnumber.value = null
        coinprice.value = null
        nowpay.value = {}
    })
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

const choosepay = () => {
    if (payList.value.length == 0) {
        return showToast('请先绑定一种收款方式~')
    }
    mypayshow.value = true
}

const selnowpay = (e) => {
    nowpay.value = e
}

const changetab = (value) => {
    nowtab.value = value
}
</script>

<style lang='scss' scoped>
:deep(.van-field__control) {
    color: #ffffff !important;
}

.group {
    .section {
        padding: 4px;
        background-color: #1f2237;
        border-radius: 4px;

        .tabactive {
            background-color: #00d383;
        }

        .text-wrapper {
            padding: 14px 0;
            flex: 1 1 96px;
            border-radius: 4px;
            width: 96px;
            height: 43px;
        }

        .text-wrapper_2 {
            padding: 14px 0;
            flex: 1 1 96px;
            background-color: #00d383;
            border-radius: 4px;
            width: 96px;
            height: 43px;
        }

        .font_1 {
            font-size: 15.5px;
            font-family: SF Pro Text;
            line-height: 15px;
            font-weight: 600;
            color: #ffffff;
        }
    }

    .space-y-28 {
        &>*:not(:first-child) {
            margin-top: 28px;
        }

        .section_2 {
            padding: 9px 6px 9px 12px;
            background-color: #00d3831a;
            border-radius: 8px;
            overflow: hidden;

            .space-x-10 {
                &>*:not(:first-child) {
                    margin-left: 10px;
                }

                .image_5 {
                    width: 18px;
                    height: 18px;
                }

                .text_3 {
                    line-height: 10.5px;
                }
            }

            .text_4 {
                color: #00d383;
            }
        }

        .section_3 {
            padding: 24px 12px 20px;
            background-color: #1f2237;
            border-radius: 8px;

            .space-y-16 {
                &>*:not(:first-child) {
                    margin-top: 16px;
                }

                .text_5 {
                    color: #e2e3ee;
                    font-size: 15px;
                    font-family: MiSans;
                    line-height: 14px;
                }

                .space-y-12 {
                    &>*:not(:first-child) {
                        margin-top: 12px;
                    }

                    .section_4 {
                        background-color: #151823;
                        border-radius: 4px;
                        position: relative;

                        .iptitem {
                            position: absolute;
                            top: 15px;
                            right: 10px;
                        }
                    }

                    .text-wrapper_3 {
                        background-color: #151823;
                        border-radius: 4px;

                        .text_6 {
                            margin-left: 12px;
                        }
                    }

                    .font_5 {
                        font-size: 13px;
                        font-family: MiSans;
                        line-height: 12px;
                        color: #6d7092;
                    }
                }

                .button {
                    padding: 16px 0;
                    background-color: #f84f56;
                    border-radius: 4px;

                    .font_2 {
                        font-size: 17px;
                        font-family: MiSans;
                        line-height: 15px;
                        color: #f9f9f9;
                    }

                    .text_7 {
                        line-height: 16px;
                    }
                }
            }

            .image_4 {
                width: 24px;
                height: 24px;
            }
        }

        .space-y-26 {
            &>*:not(:first-child) {
                margin-top: 26px;
            }
        }

        .font_4 {
            font-size: 13px;
            font-family: MiSans;
            line-height: 12px;
            color: #e2e3ee;
        }

        .font_3 {
            font-size: 13px;
            font-family: MiSans;
            line-height: 10px;
            color: #e2e3ee;
        }
    }
}

.space-y-24 {
    &>*:not(:first-child) {
        margin-top: 24px;
    }
}</style>
