<template>
  <div class="mg-web-login">
    <cb-login
      ref="cbloginRef"
      url="/auth/login"
      register-url="/unauth/register/"
      :show-register="showRegister"
      :encrypt-key="true"
      @success="loginSuccess"
      json
      baseURL="/api/mp"
    ></cb-login>
  </div>
</template>
<script>
import _ from 'lodash';
import {
  getToken,
  setToken,
  setUserInfo,
  getSysSettings,
  getResponse,
} from '@cyber/helper';

export default {
  data() {
    return {};
  },
  computed: {
    showRegister() {
      return (
        _.get(this.$store, 'state.user.system_setting.public_register') === '1'
      );
    },
  },
  created() {
    if (getToken()) {
      this.$router.push({
        path: '/',
      });
    }
  },
  mounted() {
    getSysSettings();
  },
  destroyed() {},
  methods: {
    loginSuccess(res) {
      const response = getResponse(res);
      const data = response.data;
      const jwtToken = data.token;
      const userInfo = data.user;
      if (jwtToken && userInfo) {
        setToken(jwtToken);
        setUserInfo(userInfo);
        this.$router.push({ path: '/red_vs_blue' });
      } else {
        this.$refs.cbloginRef.showErrorMsg();
      }
    },
    // 修改密码取消按钮状态
    changePassCancel() {
      this.$router.push({
        path: '/red_vs_blue',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mg-web-login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}
</style>
