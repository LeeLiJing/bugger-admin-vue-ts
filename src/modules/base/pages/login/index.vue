<template>
  <div id="login-container">
    <canvas id="canvas-background"/>
    <video :ref="setRefs('video')" autoplay loop muted class="video">
      <source src="@/assets/medias/login-cover.mp4" type="video/mp4">
      浏览器不支持 video 标签，建议升级浏览器。
      <source src="@/assets/medias/login-cover.webm" type="video/webm">
      浏览器不支持 video 标签，建议升级浏览器。
    </video>
    <sign-in/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useRefs } from '@/core';
import SignIn from './components/signIn.vue';

export default defineComponent({
  name: 'Login',
  components: { SignIn },
  setup: () => {
    const $route = useRoute();
    const { refs, setRefs }: any = useRefs();

    onMounted(() => {
      drawCanvas();
      window.addEventListener('resize', listenResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', listenResize);
    });

    const listenResize = () => {
      if ($route.name === 'Login') {
        drawCanvas();
      }
    };

    const drawCanvas = () => {
      let canvas: any = document.getElementById('canvas-background');
      let ctx = canvas.getContext('2d');
      let devicePixelRatio = window.devicePixelRatio || 1;
      let backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

      let ratio = devicePixelRatio / backingStoreRatio;
      const $video = refs.value.video;
      const $wrapper = document.getElementById('login-container') as HTMLElement;

      let canvasWidth = $wrapper.offsetWidth;
      let canvasHeight = $wrapper.offsetHeight;

      canvas.width = canvasWidth * ratio;
      canvas.height = canvasHeight * ratio;

      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      ctx.scale(ratio, ratio);
      $video.play();
      setInterval(() => {
        ctx.drawImage($video, 0, 0, $wrapper.offsetWidth, $wrapper.offsetHeight);
      }, 1);
    };

    return { refs, setRefs };
  }
});
</script>
