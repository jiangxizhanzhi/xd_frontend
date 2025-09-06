<template>
  <div class="login-main">
    <div class="login-title">{{ systemName }}</div>
    <div class="login_info">
      <cb-form
        ref="loginFromRef"
        v-bind="$attrs"
        :model="model"
        :rules="rules"
        :fetch-promise="fetchPromise || fetchHandler"
        label-width="0px"
        json
        :url="url"
        :baseURL="baseURL"
        :verificationCodeUrl="verificationCodeUrl"
        :baseVerificationCodeUrl="baseVerificationCodeUrl"
      >
        <!-- 用户名 -->
        <cb-form-item prop="username">
          <cb-input
            class="login-input-box"
            v-model.trim="model.username"
            :placeholder="$t('g.plsEnterUsername')"
            @keyup.enter.native="submitForm"
            @blur="handleBlurUsername"
            ><i slot="prefix"
              ><cb-iconfont
                type="icon-yonghu"
                class="prefix-icon"
                size="18"
              ></cb-iconfont></i
          ></cb-input>
        </cb-form-item>
        <!-- 密码 -->
        <cb-form-item prop="password">
          <cb-input
            class="login-input-box"
            v-model.trim="model.password"
            :placeholder="$t('g.plsEnterPassword')"
            show-password
            type="password"
            @keyup.enter.native="submitForm"
            ><i slot="prefix">
              <cb-iconfont
                type="icon-mima"
                class="prefix-icon"
                size="18"
              ></cb-iconfont></i
          ></cb-input>
        </cb-form-item>
        <!-- 登录输入验证码 -->
        <div style="display: flex" v-if="showCodeImg && isNeedVerificationCode">
          <cb-form-item prop="verify_code" style="width: 60%">
            <cb-input
              class="login-input-box code-box"
              v-model.trim="model.verify_code"
              :placeholder="$t('g.plsCode')"
              @keyup.enter.native="submitForm"
            >
            </cb-input>
          </cb-form-item>
          <div class="img-box">
            <div v-if="verificationCodeImg">
              <img
                :src="verificationCodeImg"
                @click="handleChangeCodeImg"
                class="img-style"
              />
            </div>
          </div>
        </div>
        <!-- 登录注册按钮 -->
        <div class="login-btn">
          <cb-button :loading="enterLoading" @click="submitForm">{{
            $t('g.login')
          }}</cb-button>
        </div>
        <div class="register-btn" v-if="showRegister">
          <cb-button @click="changeForm" hollow>{{
            $t('g.register')
          }}</cb-button>
        </div>
      </cb-form>
    </div>
    <div class="login-bottom">
      <div class="warningInfo">
        <slot name="browser"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { request, encryptPsw } from '@cyber/helper';
/**
 * @displayName login-form 登录表单
 */
export default {
  name: 'LoginForm',
  props: {
    //验证码url
    verificationCodeUrl: {
      type: String,
      default: '',
    },
    //验证码baseUrl
    baseVerificationCodeUrl: {
      type: String,
      default: '',
    },
    //是否需要验证码
    isNeedVerificationCode: {
      type: Boolean,
      default: false,
    },
    // 登录url
    url: {
      type: String,
      default: '',
    },
    // 是否显示注册按钮
    showRegister: {
      type: Boolean,
      default: false,
    },
    // 请求体的baseURL
    baseURL: {
      type: String,
      default: '',
    },
    encryptKey: {
      type: [String, Boolean],
      default: '',
    },
    fetchPromise: {
      type: null,
      default: null,
    },
    // 系统名称
    systemName: {
      type: [String],
      default: '',
    },
  },
  data() {
    return {
      showCodeImg: false,
      verificationCodeImg: '',
      enterLoading: false,
      model: {
        username: '',
        password: '',
        verify_code: '',
      },
      password: '',
      rules: {
        username: [
          {
            required: true,
            message: this.$t('g.plsEnterUsername'),
            trigger: ['blur', 'change'],
          },
        ],
        password: [
          {
            required: true,
            message: this.$t('g.plsEnterPassword'),
            trigger: ['blur', 'change'],
          },
        ],
        // 验证码 verify_code
        verify_code: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: this.$t('g.plsCode'),
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return 'data:image/jpeg;base64,' + window.btoa(binary);
    },
    //获取验证码图片
    requireVerificationCodeImg() {
      request
        .get(this.verificationCodeUrl, null, {
          baseURL: this.baseVerificationCodeUrl,
          responseType: 'arraybuffer',
        })
        .then((res) => {
          const data = _.get(res, 'data', '');
          this.verificationCodeImg = this.arrayBufferToBase64(data);
          // this.verificationCodeImg =
          //   'data:image/jpeg;base64,' +
          //   Buffer.from(data, 'binary').toString('base64');
        });
    },
    //点击切换验证码
    handleChangeCodeImg() {
      this.requireVerificationCodeImg();
    },
    //用户名失去焦点吧验证码验证消失
    handleBlurUsername() {
      this.showCodeImg = false;
    },
    submitForm(done) {
      this.enterLoading = true;
      this.$refs.loginFromRef
        .submit()
        .then((res) => {
          this.$emit('success', res);
          this.enterLoading = false;
          done || done();
        })
        .catch((err) => {
          this.$emit('error', err);
          this.enterLoading = false;
          //判断是否展示验证码
          if (err && err.data && err.data.code) {
            const code = err.data.code;
            if (
              (code === 'MP-110004' ||
                code === 'MP-110162' ||
                code === 'MP-110160' ||
                code === 'MP-110161') &&
              this.isNeedVerificationCode
            ) {
              this.showCodeImg = true;
              this.requireVerificationCodeImg();
            }
          }
          done || done();
        });
    },
    fetchHandler(action, fetchUrl, formData, config) {
      const postData = _.cloneDeep(formData);

      this.encryptKey &&
        (postData.password = encryptPsw(postData.password, this.encryptKey));

      return request[action](fetchUrl, postData, config);
    },
    // 注册按钮抛出事件
    changeForm() {
      this.$refs.loginFromRef.resetFields();
      this.$emit('changeForm', 'login');
    },
    showErrorMsg(msg) {
      const message = msg || this.$t('g.loginFailed', [this.model.username]);
      this.$error(message);
    },
  },
};
</script>
