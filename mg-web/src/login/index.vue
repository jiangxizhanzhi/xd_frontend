<template>
  <div class="mg-web-login" v-loading="loading">
    <product-active
      class="product-active"
      v-show="!isActived"
      @activate="activeHandler"
    ></product-active>
    <cb-login
      ref="cbloginRef"
      url="/auth/login"
      register-url="/unauth/register"
      :show-register="showRegister"
      :show-back-img="false"
      :encrypt-key="true"
      :langSwitch="langSwitch"
      :class="{ 'blur-effect': loading || !isActived }"
      @success="loginSuccess"
      json
      baseURL="/api/mp"
      :isNeedVerificationCode="true"
      baseVerificationCodeUrl="/api/mp"
      verificationCodeUrl="/unauth/kaptcha"
      :system-name="system_name"
    >
<!--      <template v-slot:browser>-->
<!--        {{ $t('login.browserBefore') }}-->
<!--        <a class="browser-a" href="/cpms/explorer/chrome_installer_100.exe">-->
<!--          {{ $t('login.browser100') }}-->
<!--        </a>-->
<!--        {{ $t('login.browserAfter') }}-->
<!--      </template>-->
      <template v-slot:copyright>{{ copyright }}</template>
    </cb-login>
<!--    <template v-if="loginPageBackgroundDisplayType === 'video'">-->
<!--      &lt;!&ndash;      <div&ndash;&gt;-->
<!--      &lt;!&ndash;        class="bg-static-box"&ndash;&gt;-->
<!--      &lt;!&ndash;        :style="{ backgroundImage: 'url(' + bgStatic + ')' }"&ndash;&gt;-->
<!--      &lt;!&ndash;      ></div>&ndash;&gt;-->
<!--      <video-->
<!--        src="/page/mg/public/bg.mp4"-->
<!--        :class="{ 'blur-effect': loading || !isActived }"-->
<!--        autoplay="autoplay"-->
<!--        muted-->
<!--        loop-->
<!--        preload="auto"-->
<!--        @loadedmetadata="videoLoaded"-->
<!--      ></video>-->
<!--    </template>-->
    <img
      src="/page/mg/public/bg.png"
      alt=""
      class="login-background"
    />
  </div>
</template>
<script>
import _ from 'lodash';
import ProductActive from '../pages/product-active';
// import bgStatic from './bg_static.png';
import {
  getToken,
  setToken,
  removeToken,
  setUserInfo,
  getSysSettings,
  getResponse,
} from '@cyber/helper';
import utils from '@/utils/utils';
export default {
  components: {
    ProductActive,
  },
  data() {
    return {
      loading: false,
      isActived: true,
      settingObj: {},
      // bgStatic: bgStatic,
      isVideoLoaded: false,
    };
  },
  computed: {
    showRegister() {
      return _.get(this.settingObj, 'public_register') === '1';
    },
    // 登录页背景视频或图片替换
    loginPageBackgroundDisplayType() {
      return (
        _.get(
          this.$store,
          'state.config.configData.loginPageBackgroundDisplayType',
        ) || 'video'
      );
    },
    system_name() {
      return _.get(this.settingObj, 'system_name');
    },
    langSwitch() {
      return _.get(this.settingObj, 'system_lang') === '1' &&
        !_.get(this.$store.state.config.configData, 'language')
        ? true
        : false;
    },
    // 版权信息
    copyright() {
      return _.get(this.settingObj, 'copyright');
    },
  },
  watch: {
    system_name(val) {
      if (val) {
        document.title = val;
      }
    },
  },
  created() {
    this.getPublicSettings();
    this.checkIsActived()
      .then(() => {
        this.isActived = true;

        if (getToken()) {
          this.$router.push({
            path: '/',
          });
        }
      })
      .catch(() => {
        this.isActived = false;
        removeToken();
      });
  },
  mounted() {
    // 加载配置化主题样式文件
    // utils.loadCss('dark');
    utils.loadCss('light');
    // 移除修改密码弹窗状态
    sessionStorage.removeItem('show_change_pwd_default');
  },
  destroyed() {},
  methods: {
    videoLoaded(event) {
      this.isVideoLoaded = true;
    },
    getPublicSettings() {
      this.$request
        .get('/sys/config/public', null, { baseURL: '/api/mp' })
        .then((res) => {
          const data = _.get(res, 'data.data', '');
          const settingObj = {};
          data.map((i) => {
            settingObj[i.key_name] = i.value;
          });
          this.settingObj = settingObj;
        });
    },
    checkIsActived() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        this.$request
          .get('/sys/activation/license_status', null, { baseURL: '/api/mp' })
          .then((res) => {
            const status = _.get(res, 'status', '');
            if (status === 200) {
              const data = _.get(res, 'data.data', {});
              const isActived = data.is_actived === 1;
              if (isActived) {
                resolve(data);
              } else {
                reject(data);
              }
              this.loading = false;
            }
          })
          .catch(() => {
            // 接口报错的情况：如：404等
            this.isActived = true;
            removeToken();
            this.loading = false;
          });
      });
    },
    activeHandler(bool) {
      this.isActived = bool;
    },
    loginSuccess(res) {
      const response = getResponse(res);
      const data = response.data;
      const code = response.code;
      const jwtToken = data.token;
      const userInfo = data.user;

      if (jwtToken && userInfo) {
        setToken(jwtToken);
        setUserInfo(userInfo);
        // 若默认密码的时候 跳转到修改密码页面
        if (code === 'MP-110005') {
          this.$router.push({
            path: '/',
            query: {
              changePwd: true,
              type: 'default',
            },
          });
        } else {
          this.$router.push({
            path: '/',
          });
        }
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
::v-deep .cb-login {
  flex-direction: initial !important;
  .login-main {
    min-height: initial !important;
  }
  .login-title {
    position: absolute;
    top: -60%;
    color: var(--white-color);
    font-size: 40px;
    width: 100%;
  }
  .el-form {
    padding: 0 !important;
  }
}
.mg-web-login {
  min-width: 1283px;
  min-height: 720px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #021934;
  .browser-a {
    text-decoration: none;
    color: var(--primary-color) !important;
  }
  .blur-effect {
    filter: blur(10px);
  }
  .product-active {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 21;
  }
  .cb-login {
    z-index: 20;
  }
  video,
  .bg-static-box {
    position: absolute;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    object-fit: contain;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .login-background {
    position: absolute;
    height: 100%;
    top: 0px;
    max-width: 110%;
    min-width: 1280px;
    min-height: 720px;
    width: 100%;
  }
}
</style>
