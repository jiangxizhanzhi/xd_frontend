<template>
  <div class="mg-web-login">
    <cb-login
      ref="cbloginRef"
      url="/auth/login"
      register-url="/unauth/register/"
      :show-register="showRegister"
      :encrypt-key="true"
      baseURL="/api/mp"
      json
      @success="loginSuccess"
      system-name="用户登录"
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
    } else {
      getSysSettings();
    }
  },
  mounted() {},
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
        this.$router.push({
          path: '/',
        });
      } else {
        this.$refs.cbloginRef.showErrorMsg();
      }
    },
    // 修改密码取消按钮状态
    changePassCancel() {
      this.$router.push({
        path: '/',
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
