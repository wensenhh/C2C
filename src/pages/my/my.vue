<template>
  <div class='container'>
    <div class="flex-col flex-auto group space-y-24">
      <div class="flex-col section">
        <div class="flex-row items-center group_2 space-x-12">
          <img class="shrink-0 image_4"
            :src="userinfo.avatar" />
          <div class="flex-col shrink-0 group_3 space-y-4">
            <span class="text_2">{{filters.hideaddress(address)}}</span>
            <span class="self-start font_1 text_3">IPC：{{userinfo.ipc_money}}</span>
          </div>
        </div>
        <div class="flex-row group_4 space-x-12">
          <div class="flex-col justify-start items-center text-wrapper" @click="navigatorUrl('/rechage', {'type': 1})"><span class="font_2">充值</span></div>
          <div class="flex-col justify-start items-center text-wrapper" @click="navigatorUrl('/rechage', {'type': 2})"><span class="font_2 text_4">提现</span></div>
        </div>
      </div>
      <div class="flex-col justify-start section_2">
        <div class="flex-col list">
          <div class="flex-row justify-between items-center group_1" @click="navigatorUrl('/orderlist')">
            <div class="flex-row items-center space-x-12">
              <img class="shrink-0 image_5"
                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432211497944955.png" />
              <span class="font_1">订单记录</span>
            </div>
            <img class="image_6"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432209661530745.png" />
          </div>
          <div class="flex-row justify-between items-center group_1" @click="navigatorUrl('/payway')">
            <div class="flex-row items-center space-x-12">
              <img class="shrink-0 image_5"
                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833565162096938801.png" />
              <span class="font_1">收款设置</span>
            </div>
            <img class="image_6"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432209661530745.png" />
          </div>
          <div class="flex-row justify-between items-center list-item_2" @click="navigatorUrl('/contactway')">
            <div class="flex-row items-center space-x-12">
              <img class="shrink-0 image_5"
                src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432212286776036.png" />
              <span class="font_1">绑定联系方式</span>
            </div>
            <img class="image_6"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432209661530745.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router";
import { useAddrStore } from '../../store/user'
import { storeToRefs } from "pinia"
import filters from '../../../utils/filters';

const router = useRouter();
const store = useAddrStore();
let { address,userinfo } = storeToRefs(store)

const navigatorUrl = (url, param) => {
  router.push({
    path: url,
    query: param
  });
}

</script>

<style lang='scss' scoped>
.group {
  .section {
    padding: 0 12px;
    background-color: #151823;

    .group_2 {
      padding: 24px 0;
      border-bottom: solid 1px #2e3144;

      .image_4 {
        border-radius: 50%;
        width: 48px;
        height: 48px;
      }

      .group_3 {
        margin-right: 110px;
        width: 163px;

        .text_2 {
          color: #f9f9f9;
          font-size: 17px;
          font-family: MiSans;
          line-height: 24px;
        }

        .text_3 {
          color: #f84f56;
          line-height: 12px;
        }
      }

      .space-y-4 {
        &>*:not(:first-child) {
          margin-top: 4px;
        }
      }
    }

    .group_4 {
      padding: 24px 0;

      .text-wrapper {
        flex: 1 1 161px;
        padding: 12px 0;
        background-color: #00d383;
        border-radius: 4px;
        height: 40px;

        .font_2 {
          font-size: 15px;
          font-family: MiSans;
          line-height: 14px;
          color: #ffffff;
        }

        .text_4 {
          line-height: 13.5px;
        }
      }
    }
  }

  .section_2 {
    padding-bottom: 18px;
    background-color: #151823;
    border-radius: 8px;

    .list {
      margin: 0 12px;

      .group_1 {
        padding: 16px 0;
        border-bottom: solid 1px #2e3144;
      }

      .list-item_2 {
        padding-top: 16px;
      }

      .image_6 {
        width: 18px;
        height: 18px;
      }
    }
  }

  .space-x-12 {
    &>*:not(:first-child) {
      margin-left: 12px;
    }

    .image_5 {
      border-radius: 12px;
      width: 48px;
      height: 48px;
    }
  }

  .font_1 {
    font-size: 15px;
    font-family: MiSans;
    line-height: 14px;
    color: #f9f9f9;
  }
}

.space-y-24 {
  &>*:not(:first-child) {
    margin-top: 24px;
  }
}</style>
