<template>
  <div
    class="cb-login"
    :style="showBackImg ? { 'background-image': 'url(' + backImg + ') ' } : ''"
  >
    <div v-if="langSwitch" class="lang-switch">
      <span class="lang-switch__text" @click="languageSwitch('zh-CN')"
        >中文</span
      ><span class="lang-switch__line">|</span
      ><span class="lang-switch__text" @click="languageSwitch('en-US')"
        >English</span
      >
    </div>
    <!-- 登录 -->
    <login-form
      :system-name="systemName"
      :url="url"
      :show-register="showRegister"
      :baseURL="baseURL"
      :encrypt-key="encryptKey"
      :fetch-promise="fetchPromise"
      v-bind="$attrs"
      v-if="changeForm"
      @changeForm="handleChange"
      @success="loginSuc"
      @error="loginErr"
      :isNeedVerificationCode="isNeedVerificationCode"
      :verificationCodeUrl="verificationCodeUrl"
      :baseVerificationCodeUrl="baseVerificationCodeUrl"
    >
      <template v-slot:browser>
        <slot name="browser"></slot>
      </template>
    </login-form>
    <!-- 注册 -->
    <register-form
      :url="registerUrl"
      :baseURL="baseURL"
      :encrypt-key="encryptKey"
      :fetch-promise="fetchPromise"
      v-bind="$attrs"
      v-if="!changeForm"
      @changeForm="handleChange"
      @success="RegisterSuc"
      @error="RegisterErr"
      :isNeedVerificationCode="isNeedVerificationCode"
      :verificationCodeUrl="verificationCodeUrl"
      :baseVerificationCodeUrl="baseVerificationCodeUrl"
    >
      <template v-slot:browser>
        <slot name="browser"></slot>
      </template>
    </register-form>
    <div class="copyright">
      <slot name="copyright"></slot>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import loginBgImage from '../../../assets/img/login.png';
import LoginForm from './components/login-form.vue';
import RegisterForm from './components/register-form.vue';
import { setLanguage } from '@cyber/helper';
/**
 * @displayName cb-login 登录
 * @classify Business/业务
 */
export default {
  name: 'CbLogin',
  props: {
    /**
     * 获取验证码url
     */

    verificationCodeUrl: {
      type: String,
      default: '',
    },
    /**
     * 获取验证码baseUrl
     */

    baseVerificationCodeUrl: {
      type: String,
      default: '/api/mp',
    },
    /**
     * 是否需要验证码
     */
    isNeedVerificationCode: {
      type: Boolean,
      default: false,
    },
    /**
     * 登录url
     */
    url: {
      type: String,
      default: '',
    },
    /**
     * 注册url
     */
    registerUrl: {
      type: String,
      default: '',
    },
    /**
     * 请求体的baseURL
     */
    baseURL: {
      type: String,
      default: '/api/mp',
    },
    /**
     * 是否显示语言切换
     */
    langSwitch: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示注册按钮
     */
    showRegister: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示背景图片
     */
    showBackImg: {
      type: Boolean,
      default: true,
    },
    /**
     * 自定义背景图片: 1、请使用import引入背景图片，如果报错 method "****" is not defined，使用计算属性传递即可
     *                2、showBackImg需要为true，才会显示背景图片
     */
    customBackImg: {
      type: String,
      default: '',
    },
    /**
     * 密码加密密匙，默认空不加密,true为默认密匙
     *
     */
    encryptKey: {
      type: [String, Boolean],
      default: '',
    },
    /**
     * 自定义异步请求
     * promise (请求类型, url, 请求体, 自定义请求头)
     *
     */
    fetchPromise: {
      type: null,
      default: null,
    },
    /**
     * 系统名称
     *
     */
    systemName: {
      type: [String],
      default: '',
    },
  },
  components: {
    LoginForm,
    RegisterForm,
  },
  computed: {
    // 背景图片
    backImg() {
      return _.get(this, 'customBackImg') || loginBgImage;
    },
  },
  data() {
    return {
      changeForm: true, // 改变表格
    };
  },
  created() {},
  methods: {
    // 切换登录、注册表格
    handleChange(form) {
      _.eq(form, 'login')
        ? (this.changeForm = false)
        : (this.changeForm = true);
    },
    loginSuc(res) {
      /**
       * 登录成功抛出
       *
       * @property {Object} res 登录成功的resource_id
       */
      this.$emit('success', res);
    },
    loginErr(res) {
      /**
       * 登录失败抛出
       * @property {Object} res 登录失败信息
       */
      this.$emit('error', res);
    },
    RegisterSuc(res) {
      /**
       * 注册成功抛出
       *
       * @property {Object} res 注册成功的resource_id
       */
      this.$emit('registerSuc', res);
    },
    RegisterErr(res) {
      /**
       * 注册失败抛出
       * @property {Object} res 注册失败信息
       */
      this.$emit('registerErr', res);
    },
    showErrorMsg(msg) {
      const message = msg || this.$t('g.loginFailed');
      this.$error(message);
    },
    languageSwitch(lang) {
      setLanguage(lang, true);
      /**
       * 切换语言
       *
       * @type {string}
       * @property {String} lang  zh-CN || en-US
       */
      this.$emit('lang-switch', lang);
    },
  },
};
</script>
