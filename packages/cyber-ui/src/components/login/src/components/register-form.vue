<template>
  <div class="login-main">
    <div class="login-title">{{ $t('g.userRegister') }}</div>
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
        :verificationCodeUrl='verificationCodeUrl'
        :baseVerificationCodeUrl='baseVerificationCodeUrl'
      >
        <!-- 用户名 -->
        <cb-form-item prop="username">
          <cb-input
            class="login-input-box"
            v-model.trim="model.username"
            :placeholder="$t('g.plsEnterUsername')"
            @keyup.enter.native="submitForm"
            ><i slot="prefix"
              ><cb-iconfont
                type="icon-yonghu"
                class="prefix-icon"
                size="18"
              ></cb-iconfont></i
          ></cb-input>
        </cb-form-item>
        <!-- 姓名 -->
        <cb-form-item prop="name">
          <cb-input
            class="login-input-box"
            v-model.trim="model.name"
            :placeholder="$t('g.plsEnterName')"
            @keyup.enter.native="submitForm"
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
        <!-- 再次输入密码 -->
        <cb-form-item prop="confirm_password">
          <cb-input
            class="login-input-box"
            v-model.trim="model.confirm_password"
            :placeholder="$t('g.plsEnterPasswordAgin')"
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

        <!-- 注册输入验证码 -->
       <div style="display:flex" v-if="isNeedVerificationCode">
         <cb-form-item prop="verify_code" style="width: 60%">
          <cb-input
            class="login-input-box code-box"
            v-model.trim="model.verify_code"
            :placeholder="$t('g.plsCode')"
            @keyup.enter.native="submitForm"
          >
          </cb-input>
        </cb-form-item>
        <div  class="img-box">
          <div v-if="verificationCodeImg"><img  :src="verificationCodeImg" @click="handleChangeCodeImg" class="img-style"></img> </div>
        </div>
       </div>

        <!-- 验证码 （暂未放开，后续）-->
        <!-- <cb-form-item prop="verificationCode">
          <cb-input
            class="login-input-box"
            v-model.trim="model.verificationCode"
            :placeholder="$t('g.plsEnterVerificationCode')"
            @keyup.enter.native="submitForm"
            ><i slot="prefix"
              ><cb-iconfont
                type="iconuser"
                class="prefix-icon"
                size="19"
              ></cb-iconfont></i
          ></cb-input>
          <cb-button loading @click="getVerificationCode">{{
            $t('g.getVerificationCode')
          }}</cb-button>
        </cb-form-item> -->
        <div class="login-btn">
          <cb-button :loading="enterLoading" @click="submitForm($event)">{{
            $t('g.register')
          }}</cb-button>
        </div>
        <div class="register-btn login-reback">
          <cb-button @click="changeForm">{{ $t('g.backLogin') }}</cb-button>
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
 * @displayName register-form 登录表单
 */
export default {
  name: 'RegisterForm',
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

    url: {
      type: String,
      default: '',
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
  },
  data() {
    // 获取name长度
    const validate_length = (str) => {
      let sum = 0;
      const value = str.trim();
      const cn_re = /[\u4e00-\u9fa5]/;
      for (let s = 0; s < value.length; s++) {
        if (cn_re.test(value[s])) {
          sum = sum + 2;
        } else {
          sum = sum + 1;
        }
      }
      return sum;
    };
    // 再次输入密码规则：同密码
    const validator_passwordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('g.plsEnterPasswordAgin')));
      } else if (value !== _.get(this, 'model.password')) {
        callback(new Error(this.$t('g.enterPasswordSame')));
      } else {
        callback();
      }
    };
    // 用户名称校验规则：4-20个字符, 仅可由英文字母、数字、以及下划线组成, 需包含英文字母或数字
    const validator_username = (rule, value, callback) => {
      const nameLength = validate_length(value);
      if (value === '') {
        // 未填写用户名称
        callback(new Error(this.$t('g.plsEnterUsername')));
      } else if (value && (nameLength < 2 || nameLength > 20)) {
        callback(new Error(this.$t('g.userNameRule')));
      } else {
        callback();
      }
    };
    // 姓名校验规则：4-40个字符
    const validator_name = (rule, value, callback) => {
      const nameLength = validate_length(value);
      if (value === '') {
        // 未填写用户名称
        callback(new Error(this.$t('g.plsEnterName')));
      } else if (value && (nameLength < 4 || nameLength > 40)) {
        callback(new Error(this.$t('g.nameRule')));
      } else {
        callback();
      }
    };
    // 电话号码校验规则：是电话号码
    const validator_mobile = (rule, value, callback) => {
      const valid = /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/;
      if (value === '') {
        // 未填写手机号码
        callback(new Error(this.$t('g.plsEnterPhone')));
      } else if (value && !value.match(valid)) {
        callback(new Error(this.$t('g.mobileRule')));
      } else {
        callback();
      }
    };
    // 密码校验规则：密码长度8-20,至少包含大写字母,小写字母,数字,符号(_ @ ! #)两种类型
    const validator_password = (rule, value, callback) => {
      const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/g;
      if (value === '') {
        // 未填写密码
        callback(new Error(this.$t('g.plsEnterPassword')));
      } else if (value && !value.match(valid)) {
        callback(new Error(this.$t('g.shortPasswordRule')));
      } else {
        callback();
      }
    };
    return {
      enterLoading: false,
      verificationCodeImg: '',
      model: {
        username: '',
        name: '',
        password: '',
        confirm_password: '',
        verify_code: '',
      },
      rules: {
        username: [
          {
            validator: validator_username,
            required: true,
            trigger: ['blur', 'change'],
          },
        ],
        name: [
          {
            validator: validator_name,
            required: true,
            trigger: ['blur', 'change'],
          },
        ],
        // mobile: [
        //   {
        //     validator: validator_mobile,
        //     required: true,
        //     trigger: ['blur', 'change'],
        //   },
        // ],
        password: [
          {
            validator: validator_password,
            required: true,
            trigger: ['blur', 'change'],
          },
        ],
        confirm_password: [
          {
            validator: validator_passwordAgain,
            required: true,
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
  created() {
    //获取验证码
    if (this.isNeedVerificationCode) {
      this.requireVerificationCodeImg();
    }
  },
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
    // 点击更换验证码
    handleChangeCodeImg() {
      this.requireVerificationCodeImg();
    },
    submitForm(done) {
      this.enterLoading = true;
      this.$refs.loginFromRef
        .submit()
        .then((res) => {
          this.$message.success(this.$t('g.registerSuc'));
          this.$emit('success', res);
          this.enterLoading = false;
          done || done();
        })
        .catch((err) => {
          this.$emit('error', err);
          this.enterLoading = false;
          if (err && err.data && err.data.code) {
            const code = err.data.code;
            if (code !== 'MP-000000') {
              this.requireVerificationCodeImg();
            }
          }
          done || done();
        });
    },
    fetchHandler(action, fetchUrl, formData, config) {
      const postData = _.cloneDeep(formData);
      delete postData.confirm_password;
      this.encryptKey &&
        (postData.password = encryptPsw(postData.password, this.encryptKey));

      return request[action](fetchUrl, postData, config);
    },
    // 返回按钮抛出事件
    changeForm() {
      this.$refs.loginFromRef.resetFields();
      this.$emit('changeForm', 'register');
    },
    showErrorMsg(msg) {
      const message = msg || this.$t('g.loginFailed', [this.model.username]);
      this.$error(message);
    },
  },
};
</script>
