<template>
  <div class="sign-container">
    <h1 class="title">前端日志收集后台管理系统</h1>
    <el-form :ref="setRefs('SignForm')" :model="SignData" :rules="SignRules">
      <el-form-item prop="username" label="账号">
        <el-input type="text" v-model="SignData.username" auto-complete="off" placeholder="请输入用户账号"
                  tabindex="1"/>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="SignData.password" auto-complete="off" placeholder="请输入账号密码"
                  tabindex="2"/>
      </el-form-item>

      <el-form-item prop="verifyCode" label="验证码" class="captcha">
        <el-input type="text" v-model="SignData.verifyCode" auto-complete="off" placeholder="请输入验证码"
                  tabindex="3" maxlength="4" @keypress="enterKeyUp"/>
        <captcha class="value" :ref="setRefs('captcha')" v-model="SignData.captchaId"
                 @change="()=>{SignData.verifyCode = ''}"/>
      </el-form-item>
    </el-form>

    <el-button round size="mini" class="submit-btn" :loading="saving" @click="handleLogin">登录</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import Captcha from './captcha.vue';
import { useRefs } from '@/core';
import { useStore } from 'vuex';


export default defineComponent({
  name: 'LoginSignIn',
  components: { Captcha },
  setup: () => {
    const { refs, setRefs }: any = useRefs();
    const store = useStore();

    const SignData = reactive({
      username: '',
      password: '',
      verifyCode: '',
      captchaId: ''
    });

    let saving = ref<boolean>(false);


    const SignRules: any = {
      username: [ { required: true, trigger: 'blur', message: '请输入用户账号' } ],
      password: [ { required: true, trigger: 'blur', message: '请输入账号密码' } ],
      verifyCode: [ { required: true, trigger: 'blur', message: '请输入验证码' } ]
    };

    const enterKeyUp = (e: any) => {
      if (e.keyCode === 13) {
        handleLogin();
      }
    };

    const handleLogin = () => {
      refs.value.SignForm.validate(async (valid: boolean) => {
        if (valid) {
          saving.value = true;
          // 登录
          await store.dispatch('userSignIn', SignData);

          // 用户信息
          await store.dispatch('userInfo');
        }
      });

    };

    return { refs, setRefs, SignData, SignRules, saving, handleLogin, enterKeyUp };
  }
});
</script>
