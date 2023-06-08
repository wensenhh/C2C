<template>
    <Header title="选择收款方式" :showleft="true"></Header>
    <div class='container'>
        <div class="flex-col flex-auto group_3 space-y-236">
            <div class="flex-col space-y-8">
                <span class="self-start font_2 text_2">已添加的支付方式</span>
                <div class="flex-col space-y-12">
                    <div class="flex-col list-item space-y-30" v-for="(item, i) in payList"
                        @click="navigatorUrl(`/addpayinfo?type=${item.type}&id=${item.id}`)">
                        <van-swipe-cell>
                            <div class="flex-row items-center space-x-12">
                                <img class="image_4" v-if="item.type == 'card'"
                                    src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432193054897939.png" />
                                <img class="image_4" v-if="item.type == 'zfb'"
                                    src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432192535557321.png" />
                                <img class="image_4" v-if="item.type == 'wx'"
                                    src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432191730611957.png" />
                                <span class="font_3">{{ item.type == 'card' ? '银行卡' : item.type == 'zfb' ? '支付宝' : '微信'
                                }}</span>
                            </div>
                            <div class="flex-col space-y-6">
                                <span class="self-start font_3 text_3">{{ item.name }}</span>
                                <div class="flex-row justify-between items-center">
                                    <span class="font_2">{{ item.zhanghao }}</span>
                                    <img class="image_4" @click.prevent.stop="showpayimg(item.card_bank)"
                                        v-if="item.type !== 'card'"
                                        src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432191628934010.png" />
                                </div>
                            </div>
                            <template #right>
                                <van-button square type="danger" text="删除" @click="delpay(item.id)" />
                            </template>
                        </van-swipe-cell>
                    </div>
                    <van-empty description="暂无支付方式" v-if="payList.length == 0" />
                </div>
            </div>
            <div class="flex-col justify-start items-center button paybtn" @click="navigatorUrl('/addpay')"><span
                    class="font_1">添加收款方式</span></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import { useRouter } from "vue-router";
import { myPayList, delmypay } from '../../api/app'
import { showToast, showImagePreview } from 'vant'

const payList = ref([])
onActivated(() => {
    getmypayList()
})

const getmypayList = () => {
    myPayList().then(({ data }) => {
        payList.value = data
    })
}

const delpay = (id) => {
    delmypay({ id: id }).then(res => {
        showToast('删除成功~')
        getmypayList()
    })
}

const showpayimg = (img) => {
    showImagePreview([
        img
    ]);
}

const router = useRouter();
const navigatorUrl = (url, param) => {
    router.push(url);
}
</script>

<style lang='scss' scoped>
.paybtn {
    position: fixed;
    bottom: 20px;
    width: 90%
}

.group_3 {
    .space-y-8 {
        &>*:not(:first-child) {
            margin-top: 8px;
        }

        .font_2 {
            font-size: 13px;
            font-family: MiSans;
            line-height: 10px;
            color: #6d7092;
        }

        .text_2 {
            line-height: 12px;
        }

        .space-y-12 {
            &>*:not(:first-child) {
                margin-top: 12px;
            }

            .list-item {
                padding: 16px 12px;
                background-color: #1f2237;
                border-radius: 8px;

                .space-y-6 {
                    &>*:not(:first-child) {
                        margin-top: 6px;
                    }

                    .text_3 {
                        line-height: 13px;
                    }
                }
            }

            .space-y-30 {
                &>*:not(:first-child) {
                    margin-top: 30px;
                }
            }

            .list-item_2 {
                padding: 16px 12px 22px;
                background-color: #1f2237;
                border-radius: 8px;

                .text_4 {
                    line-height: 12px;
                }
            }

            .space-x-12 {
                &>*:not(:first-child) {
                    margin-left: 12px;
                }
            }

            .image_4 {
                width: 24px;
                height: 24px;
            }

            .font_3 {
                font-size: 15px;
                font-family: MiSans;
                line-height: 14px;
                color: #e2e3ee;
            }
        }
    }

    .button {
        padding: 16px 0;
        background-color: #00d383;
        border-radius: 4px;

        .font_1 {
            font-size: 17px;
            font-family: MiSans;
            line-height: 16px;
            color: #f9f9f9;
        }
    }
}

.space-y-236 {
    &>*:not(:first-child) {
        margin-top: 236px;
    }
}
</style>
