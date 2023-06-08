<template>
  <Header title="绑定联系方式" :showleft="true"></Header>
  <div class='container'>
    <div class="flex-col flex-auto group_3 space-y-16">
      <div class="flex-col justify-start items-start text-wrapper">
        <van-field v-model="nowtab.realname" :border="false" placeholder="请输入姓名" />
      </div>
      <div class="flex-col justify-start items-start text-wrapper">
        <van-field v-model="nowtab.mobile" type="phone" :border="false" placeholder="请输入手机号码" />
      </div>
      <div class="flex-row justify-between section">
        <van-field v-model="nowtab.captcha" type="number" maxlength="6" center clearable placeholder="请输入验证码">
          <template #button>
            <van-button v-show="!countstatue" size="small" type="primary" @click="getcode">{{ codename }}</van-button>
            <van-count-down v-show="countstatue" :time="codetime" ref="countDown" :auto-start="false" @finish="onFinish"
              format="ss 秒" />
          </template>
        </van-field>
      </div>
      <div class="flex-col justify-start items-center button" @click="bindphone"><span class="font_1">确定</span></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import { sendsmscode, changemobile } from '../../api/app'
import { showToast } from 'vant'

import { useAddrStore } from '../../store/user'
import { storeToRefs } from "pinia"

const store = useAddrStore();
const { userinfo } = storeToRefs(store)
const codename = ref('获取验证码')
const codetime = ref(60 * 1000);
const countDown = ref(null);
const countstatue = ref(false)
const nowtab = ref({
  realname: '',
  mobile: '',
  captcha: ''
})

onActivated(() => {
  nowtab.value.realname = userinfo.value.realname
  nowtab.value.mobile = userinfo.value.mobile
})

const bindphone = () => {
  if (nowtab.value.realname == '' || nowtab.value.mobile == '' || nowtab.value.captcha == '') {
    return showToast('请认真填写每一项~')
  }
  if (nowtab.value.mobile.length !== 11) {
    return showToast('请输入正确的手机号~')
  }
  changemobile(nowtab.value).then(res => {
    showToast('绑定成功~')
  })
}

const getcode = () => {
  countDown.value.start();
  countstatue.value = true
  if (nowtab.value.mobile.length !== 11) {
    return showToast('请输入正确的手机号~')
  }
  sendsmscode({
    mobile: nowtab.value.mobile,
    event: 'changemobile'
  }).then(res => {
    showToast('发送成功~')
  })
}

const onFinish = () => {
  countstatue.value = false
}
</script>

<style lang='scss' scoped>
:deep(.van-cell__value) {
  flex: none !important;
  width: 70%;
}

:deep(.van-field__control) {
  color: #ffffff !important;
}

.van-count-down {
  color: #ffffff;
}

.group_3 {
  .text-wrapper {
    background-color: #1f2237;
    border-radius: 4px;

    .text_2 {
      margin-left: 12px;
    }
  }

  .section {
    background-color: #1f2237;
    border-radius: 4px;

    .text_3 {
      color: #00d383;
    }
  }

  .font_2 {
    font-size: 15px;
    font-family: MiSans;
    line-height: 14px;
    color: #6d7092;
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

.space-y-16 {
  &>*:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
