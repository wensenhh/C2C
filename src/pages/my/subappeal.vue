<template>
    <Header title="提交申诉" :showleft="true"></Header>
    <div class='container'>
        <div class="flex-col flex-auto">
            <div class="flex-col group_4 space-y-24">
                <div class="appealtextbox">
                    <van-cell-group inset>
                        <van-field v-model="appealmsg" required autofocus rows="2" autosize type="textarea" maxlength="100"
                            placeholder="请输入申诉内容" show-word-limit />
                    </van-cell-group>
                </div>
                <div class="flex-col section space-y-20">
                    <span class="self-start text_2">上传图片</span>
                    <div class="flex-row space-x-16">
                        <van-uploader v-model="fileList" :deletable="false" :after-read="afterRead" :max-count="3"
                            :max-size="500 * 1024" @oversize="onOversize" />
                    </div>
                </div>
            </div>
            <div class="flex-col justify-start items-center button" @click="subappealfun"><span class="font_1">提交</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { subappeal, uploadimg } from '../../api/app'
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const appealmsg = ref('')
const fileList = ref([])
const orderid = ref(null)
const buyupimg = ref([])

onActivated(() => {
    buyupimg.value = []
    if (route.query.orderid) {
        orderid.value = route.query.orderid
    } else {
        showToast('参数异常~')
    }
})

const subappealfun = () => {
    if (appealmsg.value == '' && appealmsg.value.length < 10) {
        return showToast('请输入最低10字以上的申诉内容')
    }
    if (buyupimg.value.length == 0) {
        return showToast('请上传申诉证据~')
    }
    subappeal({
        id: orderid.value,
        images: buyupimg.value.join(','),
        wenzi: appealmsg.value
    }).then(res => {
        showToast('申诉成功~')
        appealmsg.value = '';
        buyupimg.value = []
        fileList.value = []
        router.push(`/appealinfo?orderid=${orderid.value}`);
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

</script>

<style lang='scss' scoped>
.van-cell-group--inset {
    background-color: #1f2237;
    width: 100%;
    color: #ffffff;

    :deep(.van-field__control) {
        color: #ffffff;
    }
}

.group_4 {
    padding: 10px 0 24px;

    .appealtextbox {
        @include flexCenter;
        background-color: #1f2237;
        padding: 10px 0;
        border-radius: 10px;
    }

    .image_5 {
        border-radius: 4px;
        width: 358px;
        height: 160px;
    }

    .section {
        padding: 16px 12px 12px;
        background-color: #1f2237;
        border-radius: 8px;

        .text_2 {
            color: #f9f9f9;
            font-size: 15px;
            font-family: MiSans;
            line-height: 14px;
        }

        .space-x-16 {
            &>*:not(:first-child) {
                margin-left: 16px;
            }

            .image-wrapper {
                background-color: #151823;
                border-radius: 4px;
                background-image: url(https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432218012343668.png);
                background-size: 100% 100%;
                background-repeat: no-repeat;
                width: 72px;
                height: 72px;

                .image_6 {
                    width: 72px;
                    height: 72px;
                }
            }

            .image_7 {
                border-radius: 4px;
                width: 72px;
                height: 72px;
            }
        }
    }

    .space-y-20 {
        &>*:not(:first-child) {
            margin-top: 20px;
        }
    }
}

.space-y-24 {
    &>*:not(:first-child) {
        margin-top: 24px;
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
</style>
