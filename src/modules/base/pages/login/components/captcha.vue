<template>
  <div class="login-captcha" @click="refresh">
    <img :src="base64" class="base64">
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'Captcha',
  emits: [ 'change', 'update:modelValue' ],
  setup: (_, { emit }) => {
    const base64 = ref('');
    const service = inject<any>('service');

    const refresh = () => {
      service.authInterface.captcha({ height: 36, width: 110 })
          .then(res => {
            const { code, data } = res;
            if (code === 200 && data) {
              const { id, img } = data;
              base64.value = img;
              emit('update:modelValue', id);
              emit('change', {
                base64,
                id
              });
            }
          }).catch(err => {
        ElMessage.error(err);
      });
    };
    refresh();

    return { base64, refresh };
  }
});
</script>
<style lang="scss" scoped>
.login-captcha {
  height: 36px;
  cursor: pointer;

  .base64 {
    height: 100%;
  }
}
</style>
