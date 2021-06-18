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
           @click="onTap(item, Number(index))"
           @contextmenu.stop.prevent="openCM($event, item)"
      >
        <span>{{ item.label }}</span>
        <i class="el-icon-close" v-if="index >0" @mousedown="onDel(Number(index))"></i>
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
import { last } from '#/utils';
import { ContextMenu } from 'cl-admin-crud-vue3';

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
    const list = computed(() => store.getters.tagViewList);

    // 跳转
    const toPath = () => {
      const active = list.value.find((e: any) => e.active);

      if (!active) {
        const next = last(list.value);
        router.push(next ? next.value : '/');
      }
    };

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
      scrollTo(refs.value.scroller.scrollLeft + (flag ? -100 : 100));
    };

    // 选择
    const onTap = (item: any, index: number) => {
      adScroll(index);
      router.push(item.value);
    };

    // 删除
    const onDel = (index: number) => {
      store.commit('DEL_PROCESS', index);
      toPath();
    };

    // 右键菜单
    const openCM = (e: any, item: any) => {
      ContextMenu.open(e, {
        list: [
          {
            label: '关闭当前',
            hidden: item.value !== route.path,
            callback: (_: any, done: Function) => {
              onDel(list.value.findIndex((e: any) => e.value == item.value));
              done();
              toPath();
            }
          },
          {
            label: '关闭其他',
            callback: (_: any, done: Function) => {
              store.commit(
                  'SET_PROCESS',
                  list.value.filter(
                      (e: any) => e.value == item.value || e.value == '/'
                  )
              );
              done();
              toPath();
            }
          },
          {
            label: '关闭所有',
            callback: (_: any, done: Function) => {
              store.commit(
                  'SET_PROCESS',
                  list.value.filter((e: any) => e.value == '/')
              );
              done();
              toPath();
            }
          }
        ]
      });
    };

    // 监听路由变化
    watch(
        () => route.path,
        function (val) {
          adScroll(list.value.findIndex((e: any) => e.value === val) || 0);
        }
    );

    return { refs, setRefs, list, menu, toScroll, scrollTo, adScroll, onTap, toPath, onDel, openCM };
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
