<template>
  <div class="page-layout" :class="{ collapse : menuCollapse }">
    <div class="page-layout__mask" @click="collapseMenu(true)"></div>
    <div class="page-layout__left">
      <side-bar/>
    </div>
    <div class="page-layout__right">
      <div class="page-layout__topbar">
        <top-bar/>
      </div>
      <div v-if="app.conf.showProcess" class="page-layout__tagView">
        <tag-view/>
      </div>
      <div class="page-layout__container">
        <div class="page-layout__view">
          <router-view v-slot="{ Component }">
            <keep-alive :include="caches">
              <component :is="Component"/>
            </keep-alive>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { TopBar, SideBar } from './components';
import TagView from '@/modules/base/components/tagView/index.vue';

export default defineComponent({
  components: { TagView, TopBar, SideBar },
  setup() {
    const store = useStore();

    //菜单是否折叠
    const menuCollapse = computed<boolean>(() => store.getters.menuCollapse);

    // 应用信息
    const app = computed<any>(() => store.getters.app);

    // 折叠菜单
    function collapseMenu(val: boolean) {
      store.commit('COLLAPSE_MENU', val);
    }

    // 缓存列表
    const caches = computed(() => {
      return store.getters.tagViewList
          .filter((e: any) => e.keepAlive)
          .map((e: any) => {
            return e.value.substring(1, e.value.length).replace(/\//g, '-');
          });
    });

    return { menuCollapse, collapseMenu, app, caches };
  }
});
</script>
<style lang="scss" scoped>
.page-layout {
  display: flex;
  background-color: #f7f7f7;
  height: 100%;
  width: 100%;
  overflow: hidden;

  &__left {
    overflow: hidden;
    height: 100%;
    width: 255px;
    transition: left 0.2s;
  }

  &__right {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: calc(100% - 255px);
  }

  &__topbar {
    margin-bottom: 10px;
  }

  &__tagView {
    margin-bottom: 10px;
    padding: 0 10px;
  }

  &__container {
    width: 100%;
    box-sizing: border-box;
    flex: 1;
    overflow: hidden;
    margin-bottom: 10px;
  }

  &__mask {
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    width: 100%;
    z-index: 999;
  }

  &__view {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    border-radius: 3px;

    & > div {
      height: 100%;
    }
  }

  @media only screen and (max-width: 768px) {
    .page-layout__left {
      position: absolute;
      left: 0;
      z-index: 9999;
      transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
      box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    }

    .page-layout__right {
      width: 100%;
    }

    &.collapse {
      .page-layout__left {
        transform: translateX(-100%);
      }

      .page-layout__mask {
        display: none;
      }
    }
  }

  @media only screen and (min-width: 768px) {
    .page-layout__left,
    .page-layout__right {
      transition: width 0.2s ease-in-out;
    }

    .page-layout__mask {
      display: none;
    }

    &.collapse {
      .page-layout__left {
        width: 64px;
      }

      .page-layout__right {
        width: calc(100% - 64px);
      }
    }
  }
}
</style>
