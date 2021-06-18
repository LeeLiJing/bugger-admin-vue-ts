<template>
  <div class="app-tagView">
    <div class="app-tagView__left" @click="toScroll(true)">
      <i class="el-icon-arrow-left"></i>
    </div>

    <div class="app-tagView__scroller" :ref="setRefs('scroller')">
      <div class="app_tagView__item"
           v-for="(item,index) in list"
           :key="index"
           :ref="setRefs(`item-${index}`)"
           :class="{active :item.active}"
           :data-index="index"
      >
        <span>{{ item.label }}</span>
        <i class="el-icon-close" v-if="index >0"></i>
      </div>
    </div>

    <div class="app-tagView__right" @click="toScroll(false)">
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue';
import { useRefs } from '@/core';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'TagView',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const { refs, setRefs }: any = useRefs();

    // 参数配置
    const menu = reactive<any>({
      current: {}
    });

    // 数据列表
    const list = computed(() => store.getters.processList);

    // 监听路由变化
    watch(() => route.path, (val: any) => {
      let $index = list.value.findIndex((e: any) => e.value === val) || 0;
      adScroll($index);
    });

    // 调整滚动位置
    const adScroll = (index: number) => {
      const el = refs.value[`item-${index}`];

      if (el) {
        scrollTo(el.offsetLeft + el.clientWidth - refs.value.scroller.clientWidth);
      }
    };

    // 移动到
    const scrollTo = (d: number) => {
      refs.value.scroller.scrollTo({ d, behavior: 'smooth' });
    };

    // 左右移动
    const toScroll = (flag: boolean) => {

    };

    return { refs, setRefs, list, menu, toScroll, scrollTo, adScroll };
  }
});
</script>
<style lang="scss" scoped>
.app-tagView {
  display: flex;
  align-items: center;
  height: 30px;
  position: relative;

  &__left,
  &__right {
    background-color: #fff;
    height: 30px;
    line-height: 30px;
    padding: 0 2px;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: #eee;
    }
  }

  &__left {
    margin-right: 10px;
  }

  &__right {
    margin-left: 10px;
  }

  &__scroller {
    width: 100%;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    display: inline-flex;
    align-items: center;
    border-radius: 3px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    background-color: #fff;
    font-size: 12px;
    margin-right: 10px;
    color: #909399;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    i {
      font-size: 14px;
      width: 0;
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        color: #fff;
        background-color: $color-primary;
      }
    }

    &:hover {
      .el-icon-close {
        width: 14px;
        margin-left: 5px;
      }
    }

    &.active {
      span {
        color: $color-primary;
      }

      i {
        width: auto;
        margin-left: 5px;
      }

      &:before {
        background-color: $color-primary;
      }
    }
  }
}
</style>
