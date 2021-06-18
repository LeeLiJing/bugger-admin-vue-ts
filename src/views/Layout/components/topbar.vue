<template>
  <div class="app-topbar">
    <div class="app-topbar__collapse" @click="collapse">
      <i :class="[menuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
    </div>

    <!-- 路由导航 -->
    <div v-if="app.conf.showRouteNav" class="app-topbar__route-nav">
      <cl-router-nav/>
    </div>

    <div class="flex1"></div>

    <!-- 用户信息 -->
    <div class="app-topbar__user">
      <el-dropdown trigger="click" :hide-on-click="false" @command="onCommand">
				<span v-if="userInfo" class="el-dropdown-link">
					<span class="name">{{ userInfo.nickName }}</span>
					<img class="avatar" :src="userInfo.avatar"/>
				</span>

        <template #dropdown>
          <el-dropdown-menu class="dropdown-menu__user">
            <el-dropdown-item command="my">个人中心</el-dropdown-item>
            <el-dropdown-item command="exit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { href } from '#/utils';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();

    //菜单是否展开
    const menuCollapse = computed<any>(() => store.getters.menuCollapse);

    // 用户信息
    const userInfo = computed<any>(() => store.getters.userInfo);

    // 应用信息
    const app = computed<any>(() => store.getters.app);

    //跳转官网
    const onCommand = async (name: string) => {
      switch (name) {
        case 'my':
          await router.push('/my/info');
          break;
        case 'exit':
          await store.dispatch('userLogout');
          href('/login');
          break;
      }
    };

    // 模块列表
    const modules = computed<any>(() => store.getters.modules);

    // 展开
    const collapse = () => {
      store.commit('COLLAPSE_MENU', !menuCollapse.value);
    };

    return { menuCollapse, userInfo, app, collapse, onCommand, modules };
  }
});
</script>
<style lang="scss">
.dropdown-menu__user {
  width: 120px;
}

.app-topbar {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  background-color: #fff;

  &__collapse {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    cursor: pointer;
    margin-right: 10px;

    i {
      font-size: 22px;
      color: #666;
    }
  }

  .flex1 {
    flex: 1;
  }

  &__tools {
    display: flex;
    margin-right: 20px;

    & > li {
      display: flex;
      justify-content: center;
      align-items: center;
      list-style: none;
      height: 45px;
      padding: 0 10px;
      margin-right: 10px;
      cursor: pointer;

      i {
        font-size: 18px;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  &__user {
    margin-right: 10px;
    cursor: pointer;

    .el-dropdown-link {
      display: flex;
      align-items: center;
    }

    .avatar {
      height: 32px;
      width: 32px;
      border-radius: 32px;
    }

    .name {
      white-space: nowrap;
      margin-right: 15px;
    }

    .el-icon-arrow-down {
      margin-left: 10px;
    }
  }
}
</style>
