<template>
  <Header title="添加收款方式" :showleft="true"></Header>
  <div class='container'>
    <div class="flex-col flex-auto group_3 space-y-426">
      <div class="flex-col space-y-12">
        <span class="self-start font_2 text_2">添加您的收款方式</span>
        <div class="flex-col space-y-16">
          <div class="flex-row justify-between items-center list-item" v-for="(item, i) in payList" :key="item.type" @click="changepay(item.type)">
            <div class="flex-row items-center space-x-14">
              <img class="shrink-0 image_5" :src="item.icon" />
              <span class="font_2">{{ item.name }}</span>
            </div>
            <img class="image_4" v-show="item.type == nowpay"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432195054901464.png" />
            <img class="image_4" v-show="item.type != nowpay"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432195267123441.png" />
          </div>
        </div>
      </div>
      <div class="flex-col justify-start items-center button" @click="navigatorUrl(`/addpayinfo?type=${nowpay}`)"><span
          class="font_1">確定選擇</span></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router";

const payList = ref([{
  name: '微信',
  type: 'wx',
  icon: 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432193265559091.png',
}, {
  name: '支付宝',
  type: 'zfb',
  icon: 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432193616790682.png',
}, {
  name: '银行卡',
  type: 'card',
  icon: 'https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432194202056494.png',
}])
const nowpay = ref('wx')


const changepay = (id) => {
  nowpay.value = id
}

const router = useRouter();
const navigatorUrl = (url, param) => {
  router.push(url);
}
</script>

<style lang='scss' scoped>
.group_3 {
  .space-y-12 {
    &>*:not(:first-child) {
      margin-top: 12px;
    }

    .font_2 {
      font-size: 15px;
      font-family: MiSans;
      line-height: 14px;
      color: #e2e3ee;
    }

    .text_2 {
      color: #6d7092;
    }

    .space-y-16 {
      &>*:not(:first-child) {
        margin-top: 16px;
      }

      .list-item {
        padding: 16px 12px;
        background-color: #1f2237;
        border-radius: 8px;

        .space-x-14 {
          &>*:not(:first-child) {
            margin-left: 14px;
          }

          .image_5 {
            width: 20px;
            height: 18px;
          }

          .image_6 {
            width: 20px;
            height: 20px;
          }
        }

        .image_4 {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .button {
    padding: 16px 0;
    background-color: #00d383;
    border-radius: 4px;
    position: fixed;
    bottom: 100px;
    width: 90%;
    .font_1 {
      font-size: 17px;
      font-family: MiSans;
      line-height: 16px;
      color: #f9f9f9;
    }
  }
}

</style>
