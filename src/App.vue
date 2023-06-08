<script setup>
import Footer from './components/Footer.vue'
import { ref } from "vue";

</script>

<template>
  <Suspense>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <div>
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </div>
      </transition>
    </router-view>
  </Suspense>
  <Footer></Footer>
</template>

<style lang="scss">
.container {
  width: 100vw;
  min-height: 100vh;
  padding: 4px 16px;
  background-color: #1A1B2A;
  position: relative;
}
.van-list{
  min-height: 500px;
}
:deep(.van-field__control) {
    color: #ffffff !important;
}

.van-popup {
  background: rgba(31, 34, 55, 1);
}

.van-action-sheet__item {
  background: fixed !important;
}

.van-action-sheet {
  color: #fff !important;
}

.van-cell {
  background: fixed !important;
  color: #ffffff !important;
}

.van-dialog__header {
  color: #fff;
}

.van-dialog__message--has-title {
  color: #d8d8d8;
}

.van-button--default {
  background: fixed;
}

.van-checkbox__label {
  color: #ffffff !important;
}

</style>
