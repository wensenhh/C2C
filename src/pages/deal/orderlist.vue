<template>
  <div class='container'>
    <div class="flex-col flex-auto group_2">
      <div class="flex-row self-center section">
        <div :class="['flex-col', 'justify-start', 'items-center', 'text-wrapper_2', nowtab == 1 ? 'tabactive' : '']"
          @click="changetab(1)"><span class="font_1">购买订单</span></div>
        <div :class="['flex-col', 'justify-start', 'items-center', 'text-wrapper_2', nowtab == 2 ? 'tabactive' : '']"
          @click="changetab(2)"><span class="font_1">出售挂单</span></div>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了">
          <van-tabs v-model:active="nowordertab" animated swipeable background="fixed" color="#00D383"
            title-inactive-color="#6D7092" title-active-color="#fff" @change="beforeChange">
            <van-tab :title="item.name" v-for="(item, i) in tabList">
              <div class="line-tabs">
                <div class="group_3">
                  <div class="flex-col space-y-12">
                    <div class="flex-col list-item space-y-22" :key="i" v-for="(item, i) in myOrderList" @click="navigatorUrl(`/orderinfo?id=${item.id}`)">
                      <div class="flex-row justify-between items-center group_5">
                        <div class="flex-row items-center">
                          <span class="font_3">BTC</span>
                          <span class="font_3 text_4">/</span>
                          <span class="font_3 text_5">IPC</span>
                          <div class="flex-col justify-start items-center shrink-0 text-wrapper_3" v-show="nowtab == 1">
                            <span class="font_4 text_6" >买</span>
                          </div>
                          <div class="flex-col justify-start items-center shrink-0 text-wrapper_3" v-show="nowtab == 2" style="background-color: #f84f56;">
                            <span class="font_4 text_6" >卖</span>
                          </div>
                          <img class="shrink-0 image_5"
                            src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/641bf7ba5a7e3f031045ebb8/6455c713b98f5d0011674c44/16833432204912189124.png" />
                        </div>
                        <span class="font_2">{{ getorderstatus(item.status) }}</span>
                      </div>
                      <div class="flex-col space-y-20">
                        <div class="flex-row justify-between">
                          <div class="flex-col equal-division-item space-y-18">
                            <div class="flex-row">
                              <span class="font_5">委托量</span>
                              <span class="font_5 text_7">(IPC)</span>
                            </div>
                            <span class="self-end font_3">{{item.ipcnum}}</span>
                          </div>
                          <div class="flex-col equal-division-item space-y-18">
                            <div class="flex-row">
                              <span class="font_5">委托价格</span>
                              <span class="font_5 text_8">(IPC)</span>
                            </div>
                            <span class="self-end font_3">{{item.ipcdanj}}</span>
                          </div>
                          <div class="flex-col equal-division-item space-y-18">
                            <div class="flex-row">
                              <span class="font_5">应收人民币</span>
                              <span class="font_5 text_9">(IPC)</span>
                            </div>
                            <span class="self-end font_3">{{item.rmbnum}}</span>
                          </div>
                        </div>
                        <div class="flex-row justify-between items-center group_6">
                          <span class="font_5">委托时间</span>
                          <div class="flex-row">
                            <span class="font_6">{{item.createtime}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </van-list>
      </van-pull-refresh>
      <!-- <div class="flex-col line-tabs space-y-14">
        <div class="flex-col group_3">
          <div class="flex-row justify-between group_4">
            <span class="font_2">未完成</span>
            <span class="font_2">交易中</span>
            <span class="font_3 text_2">已完成</span>
            <span class="font_2 text_3">已取消</span>
          </div>
          <div class="self-end section_2"></div>
        </div>

      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { orderList } from '../../api/app'
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const orderpage = ref(1)
const nowtab = ref(1)
const tabList = ref([{
  name: '全部',
  id: 'all'
}, {
  name: '待匹配',
  id: 1
}, {
  name: '进行中',
  id: 8
}, {
  name: '已完成',
  id: 9
}])
const nowordertab = ref(0)
const myOrderList = ref([])

onActivated(() => {
  onRefresh()
})

const getmyOrderList = () => {
  if (refreshing.value) {
    myOrderList.value = [];
    orderpage.value = 1
    refreshing.value = false;
  }
  orderList({
    page: orderpage.value,
    sellbuy: nowtab.value == 1 ? 'buy' : 'sell',
    status: tabList.value[nowordertab.value].id
  }).then(({ data }) => {
    myOrderList.value = [...myOrderList.value, ...data.data]
    loading.value = false;
    if (myOrderList.value.length >= data.total) {
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
  getmyOrderList();
};

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

const beforeChange = (e) => {
  onRefresh()
}

const changetab = (value) => {
  nowtab.value = value
  onRefresh()
}
</script>

<style lang='scss' scoped>
.group_2 {
  .section {
    padding: 4px;
    background-color: #1f2237;
    border-radius: 4px;

    .tabactive {
      background-color: #00d383;
    }

    .text-wrapper {
      padding: 8px 0;
      flex: 1 1 96px;
      background-color: #00d383;
      border-radius: 4px;
      width: 96px;
      height: 32px;
    }

    .text-wrapper_2 {
      padding: 8px 0;
      flex: 1 1 96px;
      border-radius: 4px;
      width: 96px;
      height: 32px;
    }

    .font_1 {
      font-size: 15px;
      font-family: MiSans;
      line-height: 14px;
      color: #ffffff;
    }
  }

  .line-tabs {
    margin-top: 20px;

    .group_3 {
      .group_4 {
        padding-bottom: 8px;

        .text_2 {
          line-height: 14px;
        }

        .text_3 {
          line-height: 13.5px;
        }
      }

      .section_2 {
        margin-right: 98px;
        background-color: #00d383;
        border-radius: 271px 271px 0px 0px;
        width: 32px;
        height: 2px;
      }
    }

    .space-y-12 {
      &>*:not(:first-child) {
        margin-top: 12px;
      }

      .list-item {
        padding: 24px 0 20px;
        background-color: #1f2237;
        border-radius: 8px;
        overflow: hidden;

        .group_5 {
          padding-left: 14px;
          padding-right: 10px;

          .text_4 {
            margin-left: 4px;
          }

          .text_5 {
            margin-left: 6px;
          }

          .text-wrapper_3 {
            margin-left: 12px;
            padding: 6px 0;
            background-color: #13af72;
            border-radius: 4px;
            width: 24px;
            height: 24px;

            .font_4 {
              font-size: 13px;
              font-family: MiSans;
              line-height: 12px;
              color: #ffffff;
            }

            .text_6 {
              line-height: 11.5px;
            }
          }

          .image_5 {
            margin-left: 12px;
            width: 20px;
            height: 20px;
          }
        }

        .space-y-20 {
          &>*:not(:first-child) {
            margin-top: 20px;
          }

          .equal-division-item {
            padding: 6px 8px;

            .text_7 {
              line-height: 11.5px;
            }

            .text_8 {
              line-height: 11.5px;
            }

            .text_9 {
              line-height: 11.5px;
            }
          }

          .space-y-18 {
            &>*:not(:first-child) {
              margin-top: 18px;
            }
          }

          .group_6 {
            padding-left: 12px;
            padding-right: 10px;

            .font_6 {
              font-size: 13px;
              font-family: MiSans;
              line-height: 10px;
              color: #e2e3ee;
            }
          }

          .font_5 {
            font-size: 13px;
            font-family: MiSans;
            line-height: 12px;
            color: #6d7092;
          }
        }
      }

      .space-y-22 {
        &>*:not(:first-child) {
          margin-top: 22px;
        }
      }
    }

    .font_3 {
      font-size: 15px;
      font-family: MiSans;
      line-height: 12px;
      color: #f9f9f9;
    }

    .font_2 {
      font-size: 15px;
      font-family: MiSans;
      line-height: 14px;
      color: #6d7092;
    }
  }

  .space-y-14 {
    &>*:not(:first-child) {
      margin-top: 14px;
    }
  }
}
</style>
