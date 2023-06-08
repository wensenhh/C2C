<template>
    <Header title="订单详情" :showleft="true" :showdeal="orderinfo?.returnedinfo?.length > 0"
        @clickRight="navigatorUrl(`/appealinfo?orderid=${orderinfo.id}`)" dealText="申诉详情"></Header>
    <div class='container'>
        <div class="flex-col flex-auto group_3 space-y-24">
            <div class="flex-col space-y-12">
                <div class="flex-col section space-y-18">
                    <div class="flex-col">
                        <div class="flex-row items-center justify-between group_4 space-x-6">
                            <div>
                                <span class="font_2">订单编号</span>
                                <span class="font_3">{{ orderinfo.ordersn }}</span>
                            </div>
                            <div style="color: aquamarine;">{{ getorderstatus(orderinfo.status) }}</div>
                        </div>
                        <div class="flex-col group_5">
                            <div class="flex-row justify-between">
                                <div class="flex-col equal-division-item space-y-14">
                                    <span class="font_4">单价</span>
                                    <span class="font_3 text_2">￥{{ orderinfo.ipcdanj }}</span>
                                </div>
                                <div class="flex-col items-center shrink-0 equal-division-item space-y-14">
                                    <span class="font_4">数量</span>
                                    <span class="font_3">{{ orderinfo.ipcnum }}IPC</span>
                                </div>
                                <div class="flex-col items-center shrink-0 equal-division-item space-y-14">
                                    <span class="font_4">总金额</span>
                                    <span class="font_3">￥{{ orderinfo.rmbnum }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-row space-x-8"
                        v-if="orderinfo.type == 1 && (orderinfo.status != 1 && orderinfo.status != 7) && orderinfo.buy_uid == userinfo.id">
                        <span class="font_5">卖家姓名</span>
                        <span class="font_2">{{ orderinfo.shoukuaninfo.name }}</span>
                    </div>
                    <div class="flex-row items-baseline justify-between space-x-6"
                        v-if="orderinfo.type == 1 && (orderinfo.status != 1 && orderinfo.status != 7) && orderinfo.buy_uid == userinfo.id && orderinfo.shoukuaninfo.type == 'card'">
                        <span class="font_5">银行卡</span>
                        <span class="font_3" style="color:aquamarine;">{{ orderinfo.shoukuaninfo.card_zhibank }}</span>
                    </div>
                    <div class="flex-row items-baseline space-x-6"
                        v-if="orderinfo.type == 1 && (orderinfo.status != 1 && orderinfo.status != 7) && orderinfo.buy_uid == userinfo.id">
                        <span class="font_5">卖家账号</span>
                        <span class="font_3">{{ orderinfo.shoukuaninfo.zhanghao }}</span>
                    </div>
                    <div class="flex-row items-baseline space-x-6"
                        v-if="orderinfo.type == 1 && (orderinfo.status != 1 && orderinfo.status != 7) && orderinfo.buy_uid == userinfo.id">
                        <span class="font_5">卖家手机号</span>
                        <span class="font_3">{{ orderinfo.sell_mobile }}</span>
                    </div>
                    <div class="flex-row items-baseline justify-between space-x-6"
                        v-if="orderinfo.type == 1 && (orderinfo.status != 1 && orderinfo.status != 7) && orderinfo.buy_uid == userinfo.id && (orderinfo.shoukuaninfo.type == 'wx' || orderinfo.shoukuaninfo.type == 'zfb')">
                        <span class="font_5">{{ orderinfo.shoukuaninfo.type == 'wx' ? '微信' : '支付宝' }}</span>
                        <span class="font_3" @click="showbigimg([orderinfo.shoukuaninfo.card_bank], 0)"
                            style="color:aquamarine;">查看二维码</span>
                    </div>
                    <div class="flex-row items-baseline space-x-6">
                        <span class="font_5">创建时间</span>
                        <span class="font_3">{{ filters.formatTime(orderinfo.createtime, 'YMDHMS') }}</span>
                    </div>
                    <div class="flex-row items-baseline space-x-6" v-if="orderinfo.status != 1 && orderinfo.status != 7">
                        <span class="font_5">匹配时间</span>
                        <span class="font_3">{{ filters.formatTime(orderinfo.pipeitime, 'YMDHMS') }}</span>
                    </div>
                    <div class="flex-row items-baseline space-x-6" v-if="orderinfo.status == 1 && orderinfo.status == 5">
                        <span class="font_5">付款时间</span>
                        <span class="font_3">{{ filters.formatTime(orderinfo.buytime, 'YMDHMS') }}</span>
                    </div>
                </div>
                <div class="flex-col items-start section_2 space-y-20" v-if="orderinfo.status > 1 && orderinfo.status != 7">
                    <span class="font_5 text_3">付款凭证</span>
                    <div class="justify-start items-center image-wrapper"
                        v-if="orderinfo.status > 1 && orderinfo.sell_uid == userinfo.id">
                        <div v-if="orderinfo.fukuanimages.length == 0">等待买家上传凭证</div>
                        <img v-else class="image_5" :src="item" alt="" v-for="(item, i) in orderinfo.fukuanimages"
                            @click="showbigimg(orderinfo.fukuanimages, i)" />
                    </div>
                    <div class="justify-start items-center image-wrapper"
                        v-if="(orderinfo.status == 3 && orderinfo.buy_uid == userinfo.id)">
                        <img class="image_5" :src="item" alt="" v-for="(item, i) in orderinfo.fukuanimages"
                            @click="showbigimg(orderinfo.fukuanimages, i)" />
                    </div>
                    <div class="flex-col justify-start items-center image-wrapper"
                        v-if="(orderinfo.status == 2 || orderinfo.status == 4) && orderinfo.buy_uid == userinfo.id">
                        <van-uploader v-model="fileList" :deletable="false" :after-read="afterRead" :max-count="3"
                            :max-size="500 * 1024" @oversize="onOversize" />
                    </div>
                </div>
            </div>
            <div class="flex-col space-y-12">
                <div class="flex-col justify-start items-center button" @click="userfukuan"
                    v-if="(orderinfo.status == 2 || orderinfo.status == 4) && orderinfo.buy_uid == userinfo.id">
                    <span class="font_1">确认付款</span>
                </div>
                <div class="flex-col justify-start items-center button" @click="usershoukuan"
                    v-if="orderinfo.status == 3 && orderinfo.sell_uid == userinfo.id">
                    <span class="font_1">确认收款</span>
                </div>
                <div class="flex-col justify-start items-center button_2" @click="revocationorder"
                    v-if="(orderinfo.type == 1 && (orderinfo.status == 1 || orderinfo.status == 2)) || (orderinfo.type == 2 && orderinfo.status == 1)">
                    <span class="font_1 text_4">撤销</span>
                </div>
                <div class="flex-col justify-start items-center button_2"
                    @click="navigatorUrl(`/subappeal?orderid=${orderinfo.id}`)"
                    v-if="orderinfo.status == 2 || orderinfo.status == 3 || orderinfo.status == 4"><span
                        class="font_1 text_4">申诉</span></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { showImagePreview, showToast } from 'vant';
import { ref, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { myorderinfo, fukuanup, uploadimg, sellshoukuan, chexiaoorder } from '../../api/app'
import { storeToRefs } from "pinia"
import { useAddrStore } from '../../store/user'
import { connetWallet, sign } from '../../connectWallet/index'
import filters from '../../../utils/filters';

const router = useRouter();
const route = useRoute();
const store = useAddrStore();
let { address, userinfo } = storeToRefs(store)
const orderid = ref(null)
const orderinfo = ref({})
const fileList = ref([])
const buyupimg = ref([])

onActivated(() => {
    buyupimg.value = []
    if (route.query.id) {
        orderid.value = route.query.id
        getmyorderinfo()
    } else {
        showToast('参数异常~')
    }
})

const revocationorder = async () => {
    let signres = await sign()
    if (!signres) {
        return false
    }
    chexiaoorder({ id: orderinfo.value.id }).then(res => {
        showToast('撤销订单成功~')
        getmyorderinfo()
    })
}

const usershoukuan = async () => {
    let signres = await sign()
    if (!signres) {
        return false
    }
    sellshoukuan({ id: orderinfo.value.id }).then(res => {
        showToast('确认收款成功~')
        getmyorderinfo()
    })
}

const userfukuan = async () => {
    console.log(buyupimg.value)
    if (buyupimg.value.length == 0) {
        return showToast('请上传付款凭证~')
    }
    let signres = await sign()
    if (!signres) {
        return false
    }
    fukuanup({
        id: orderinfo.value.id,
        fukuanimages: buyupimg.value.join(',')
    }).then(res => {
        showToast('付款成功~')
        getmyorderinfo()
    })
}

const showbigimg = (imgs, i) => {
    showImagePreview({
        images: imgs,
        startPosition: i,
        closeable: true,
    })
}

const afterRead = (file) => {
    file.status = 'uploading';
    file.message = '上传中...';
    // 创建一个空对象实例
    let formData = new FormData();
    // 调用append()方法添加数据
    formData.append("file", file.file);
    uploadimg(formData).then(res => {
        // 上传状态提示关闭
        if (res.code == 1) {
            buyupimg.value.push(res.data.url)
            file.status = "done";
            showToast('上传成功~')
            // orderparam.value.fukuanimages.push(res.data.fullurl)
        } else {
            file.status = 'failed';
            file.message = '上传失败';
        }
    })
};

const onOversize = (file) => {
    console.log(file);
    showToast('文件大小不能超过 500kb');
};

const getmyorderinfo = () => {
    myorderinfo({
        id: orderid.value
    }).then(({ data }) => {
        orderinfo.value = data
        fileList.value = data.fukuanimages
    })
}

const getorderstatus = (status) => {
    switch (Number(status)) {
        case 1:
            return '待匹配'
            break;
        case 2:
            return '待买家付款'
            break;
        case 3:
            return '待卖家确认'
            break;
        case 4:
            return '申诉中'
            break;
        case 5:
            return '交易成功'
            break;
        case 6:
            return '交易失败'
            break;
        case 7:
            return '取消挂单'
        default:
            break;
    }
}

const navigatorUrl = (url) => {
    router.push(url);
}

</script>

<style lang='scss' scoped>
.group_3 {
    .space-y-12 {
        &>*:not(:first-child) {
            margin-top: 12px;
        }

        .section {
            padding: 0 12px 20px;
            background-color: #1f2237;
            border-radius: 8px;

            .group_4 {
                padding: 16px 0;
                border-bottom: solid 1px #2e3144;
            }

            .space-x-6 {
                &>*:not(:first-child) {
                    margin-left: 6px;
                }
            }

            .group_5 {
                padding: 10px 0;
                border-bottom: solid 1px #2e3144;

                .equal-division-item {
                    padding: 6px 0;

                    .font_4 {
                        font-size: 13px;
                        font-family: MiSans;
                        line-height: 12px;
                        color: #6d7092;
                    }

                    .text_2 {
                        margin-left: 2px;
                    }
                }

                .space-y-14 {
                    &>*:not(:first-child) {
                        margin-top: 14px;
                    }
                }
            }

            .font_3 {
                font-size: 15px;
                font-family: MiSans;
                line-height: 12px;
                color: #e2e3ee;
            }

            .space-x-8 {
                &>*:not(:first-child) {
                    margin-left: 8px;
                }
            }

            .font_2 {
                font-size: 15px;
                font-family: MiSans;
                line-height: 14px;
                color: #e2e3ee;
            }
        }

        .space-y-18 {
            &>*:not(:first-child) {
                margin-top: 18px;
            }
        }

        .section_2 {
            padding: 16px 12px 12px;
            background-color: #1f2237;
            border-radius: 8px;

            .text_3 {
                color: #f9f9f9;
            }

            .image-wrapper {
                .image_5 {
                    width: 72px;
                    height: 72px;
                    margin-right: 10px;
                }
            }
        }

        .space-y-20 {
            &>*:not(:first-child) {
                margin-top: 20px;
            }
        }

        .font_5 {
            font-size: 15px;
            font-family: MiSans;
            line-height: 14px;
            color: #6d7092;
        }

        .button {
            padding: 16px 0;
            background-color: #00d383;
            border-radius: 4px;
        }

        .button_2 {
            padding: 16px 0;
            background-color: #1f2237;
            border-radius: 4px;

            .text_4 {
                color: #e2e3ee;
                line-height: 15.5px;
            }
        }

        .font_1 {
            font-size: 17px;
            font-family: MiSans;
            line-height: 16px;
            color: #f9f9f9;
        }
    }
}

.space-y-24 {
    &>*:not(:first-child) {
        margin-top: 24px;
    }
}</style>
