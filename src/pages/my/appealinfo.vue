<template>
  <Header title="申诉详情" :showleft="true"></Header>
  <div class='container'>
    <div class="flex-col justify-start flex-auto">
      <div class="flex-col list space-y-12">
        <div class="flex-col list-item space-y-6" :key="i" v-for="(item, i) in orderinfo.returnedinfo">
          <div class="flex-row justify-between items-baseline">
            <span :class="['font_1', item.shenfen == '买家' ? 'text_3' : 'text_4']">{{ item.shenfen }}</span>
            <span class="font_2">{{ item.shensutime }}</span>
          </div>
          <span class="font_3">
            {{ item.wenzi }}
          </span>
          <div class="flex-row self-start space-x-12">
            <div class="flex-col justify-start items-center equal-division-item" v-for="(zitem, i) in item.images">
              <img class="image_5" :src="zitem" @click="showbigimg(item.images, i)" />
            </div>
          </div>
        </div>
        <div class="flex-col justify-start items-center button appealbtn" v-if="orderinfo.status < 5"
          @click="navigatorUrl(`/subappeal?orderid=${orderinfo.id}`)"><span class="font_1">回复</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { showImagePreview, showToast } from 'vant';
import { ref, onActivated } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia"
import { useAddrStore } from '../../store/user'
import { myorderinfo } from '../../api/app'

const route = useRoute();
const router = useRouter();
const store = useAddrStore();
let { userinfo } = storeToRefs(store)
const orderid = ref(null)
const orderinfo = ref({})


onActivated(() => {
  if (route.query.orderid) {
    orderid.value = route.query.orderid
    getmyorderinfo()
  } else {
    showToast('参数异常~')
  }
})

const getmyorderinfo = () => {
  myorderinfo({
    id: orderid.value
  }).then(({ data }) => {
    orderinfo.value = data
  })
}

const showbigimg = (item, i) => {
  showImagePreview({
    images: item,
    startPosition: i,
    closeable: true,
  })
}

const navigatorUrl = (url) => {
  router.push(url);
}
</script>

<style lang='scss' scoped>
.list {
  .appealbtn {
    @include flexCenter;
    width: 100%;
    height: 50px;
    border-radius: 8px;
    background-color: #00d383;
    margin-top: 30px;
    color: #ffffff;
    font-weight: bold;
  }

  .list-item {
    padding: 16px 8px 12px 12px;
    background-color: #1f2237;
    border-radius: 8px;

    .font_1 {
      font-size: 13px;
      font-family: MiSans;
      line-height: 12px;
    }

    .text_3 {
      color: #f84f56;
    }

    .text_4 {
      color: #13af72;
    }

    .font_2 {
      font-size: 13px;
      font-family: MiSans;
      line-height: 10px;
      color: #6d7092;
    }

    .font_3 {
      font-size: 15px;
      font-family: MiSans;
      line-height: 22px;
      color: #e2e3ee;
    }

    .space-x-12 {
      &>*:not(:first-child) {
        margin-left: 12px;
      }

      .equal-division-item {
        flex: 1 1 72px;
        border-radius: 4px;
        width: 72px;
        height: 72px;

        .image_5 {
          width: 72px;
          height: 72px;
        }
      }
    }
  }

  .space-y-6 {
    &>*:not(:first-child) {
      margin-top: 6px;
    }
  }
}

.space-y-12 {
  &>*:not(:first-child) {
    margin-top: 12px;
  }
}</style>
