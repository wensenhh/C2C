<template>
    <div class='container'>
        <div class="flex-col flex-auto group_3">
            <div class="flex-col group_4 space-y-12">
                <span class="self-start font_2">添加{{payName}}</span>
                <div class="flex-row section space-x-16">
                    <van-field v-model="payinfo.name" label="姓名" label-width="30" :border="false" placeholder="请输入您的姓名" />
                </div>
            </div>
            <div class="flex-row section space-x-14">
                <van-field v-model="payinfo.zhanghao" label="账号" label-width="30" :border="false"
                    :placeholder="`请输入您的${payName}账号`" />
            </div>
            <div class="flex-row section space-x-14" v-if="payinfo.type === 'card'">
                <van-field v-model="payinfo.card_bank" label="开户银行" label-width="60" :border="false" placeholder="请输入开户行" />
            </div>
            <div class="flex-row section space-x-14" v-if="payinfo.type === 'card'">
                <van-field v-model="payinfo.card_zhibank" label="开户支行" label-width="60" :border="false"
                    placeholder="请输入开户支行" />
            </div>
            <div class="flex-col items-start section_2 space-y-20" v-if="payinfo.type !== 'card'">
                <span class="font_3">添加支付二维码：</span>
                <van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" :max-size="500 * 1024"
                    @oversize="onOversize" />
            </div>
            <div class="flex-col justify-start items-center button" @click="savepay"><span class="font_1 text_3">保存</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { uploadimg, addpayfun, mypayinfo, editpayfun } from '../../api/app'
import { showToast } from 'vant';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const fileList = ref([])
const payName = ref('')
const payid = ref(0)
const payinfo = ref({
    type: '',
    name: '',
    zhanghao: '',
    card_bank: '',
    card_zhibank: ''
})

onActivated(() => {
    payid.value = 0
    fileList.value = []
    payinfo.value = {
        type: '',
        name: '',
        zhanghao: '',
        card_bank: '',
        card_zhibank: ''
    }

    payinfo.value.type = route.query.type ? route.query.type : 'wx'
    payName.value = route.query.type == 'wx' ? '微信' : route.query.type == 'zfb' ? '支付宝' : '银行卡'

    if (route.query.id && route.query.id > 0) {
        payid.value = route.query.id
        getmypayinfo(route.query.id)
    }
})

const getmypayinfo = (id) => {
    mypayinfo({
        id: id
    }).then(({ data }) => {
        fileList.value = [{
            url: data.card_bank
        }]
        payinfo.value = data
    })
}

const savepay = () => {
    if (payinfo.value.type == '' || payinfo.value.name == '' || payinfo.value.zhanghao == '' || payinfo.value.card_bank == '') {
        return showToast('请认真填写收款信息~')
    }
    if (payinfo.value.type == 'card' && payinfo.value.card_zhibank == '') {
        return showToast('请认真填写收款信息~')
    }
    if (payid.value > 0) {
        payinfo.value.id = payid.value
        editpayfun(payinfo.value).then(({ data }) => {
            showToast('保存成功~')
        })
    } else {
        addpayfun(payinfo.value).then(({ data }) => {
            showToast('添加成功~')
            fileList.value = []
            payinfo.value = {
                type: '',
                name: '',
                zhanghao: '',
                card_bank: '',
                card_zhibank: ''
            }
        })
    }

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
            file.status = "done";
            showToast('上传成功~')
            payinfo.value.card_bank = res.data.fullurl
            console.log(payinfo.value.card_bank)
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
</script>

<style lang='scss' scoped>
:deep(.van-field__label) {
    color: #ffffff !important;
}

:deep(.van-field__control) {
    color: #ffffff !important;
}

.group_3 {
    .group_4 {
        padding: 16px 0 0px;

        .space-x-16 {
            &>*:not(:first-child) {
                margin-left: 16px;
            }
        }
    }

    .space-y-12 {
        &>*:not(:first-child) {
            margin-top: 12px;
        }
    }

    .section {
        background-color: #1f2237;
        border-radius: 8px;
        margin-top: 16px;
        .text_2 {
            line-height: 13.5px;
        }
    }

    .space-x-14 {
        &>*:not(:first-child) {
            margin-left: 14px;
        }
    }

    .font_2 {
        font-size: 15px;
        font-family: MiSans;
        line-height: 14px;
        color: #6d7092;
    }

    .section_2 {
        margin-top: 24px;
        padding: 16px 12px 24px;
        background-color: #1f2237;
        border-radius: 8px;

        .image_5 {
            width: 72px;
            height: 72px;
        }
    }

    .space-y-20 {
        &>*:not(:first-child) {
            margin-top: 20px;
        }
    }

    .font_3 {
        font-size: 15px;
        font-family: MiSans;
        line-height: 14px;
        color: #f9f9f9;
    }

    .button {
        padding: 16px 0;
        background-color: #00d383;
        border-radius: 4px;
        width: 92%;
        position: fixed;
        bottom: 100px;
        .font_1 {
            font-size: 17px;
            font-family: MiSans;
            line-height: 16px;
            color: #f9f9f9;
        }

        .text_3 {
            line-height: 15.5px;
        }
    }
}
</style>
