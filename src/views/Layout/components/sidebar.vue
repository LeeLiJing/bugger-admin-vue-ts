<template>
  <div class="app-sidebar">
    <div class="app-sidebar__logo" @click="toHome">
      <img :src="Logo"/>
      <span v-if="!menuCollapse">{{ app.name }}</span>
    </div>
    <div class="app-sidebar__menu">
      <menu-slider/>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/assets/images/silder-simple.png';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'SideBar',
  setup() {
    const router = useRouter();
    const store = useStore();

    // 应用信息
    const app = computed<any>(() => store.getters.app);

    // 菜单是否展开
    const menuCollapse = computed<any>(() => store.getters.menuCollapse);
    // 返回首页
    const toHome = () => {
      router.push('/');
    };

    return { Logo, app, menuCollapse, toHome };
  }
});
</script>
<style lang="scss" scoped>
.app-sidebar {
  height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background-color: #2f3447;

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    cursor: pointer;

    img {
      height: 30px;
      width: 30px;
    }

    span {
      color: #fff;
      font-weight: bold;
      font-size: 15px;
      margin-left: 10px;
      font-family: inherit;
      white-space: nowrap;
    }
  }

  &__menu {
    height: calc(100% - 80px);
  }
}
</style>
