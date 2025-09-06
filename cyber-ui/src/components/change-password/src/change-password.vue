<template>
  <div class="cb-change-password" :style="{ width }">
    <cb-form
      v-bind="$attrs"
      class="change-password-form"
      ref="changePasswordFromRef"
      :model="model"
      :rules="rules"
      :label-width="labelWidth"
      :url="url"
      json
      :fetch-promise="fetchPromise || fetchHandler"
      :baseURL="baseURL"
    >
      <!-- 原密码 -->
      <cb-form-item :label="$t('g.originPassword')" prop="old_pwd">
        <cb-input
          class="login-input-box"
          v-model.trim="model.old_pwd"
          :placeholder="$t('g.plsEnterOrgPassword')"
          type="password"
          show-password
          @keyup.enter.native="submitForm"
        ></cb-input>
      </cb-form-item>
      <!-- 新密码 -->
      <cb-form-item :label="$t('g.newPassword')" prop="new_pwd">
        <cb-input
          class="login-input-box"
          v-model.trim="model.new_pwd"
          :placeholder="$t('g.plsEnterPassword')"
          type="password"
          show-password
          @keyup.enter.native="submitForm"
        ></cb-input>
      </cb-form-item>
      <!-- 确认密码 -->
      <cb-form-item :label="$t('g.confirmPassword')" prop="confirm_pwd">
        <cb-input
          class="login-input-box"
          v-model.trim="confirm_pwd"
          :placeholder="$t('g.plsEnterPasswordAgin')"
          type="password"
          show-password
          @keyup.enter.native="submitForm"
        ></cb-input>
      </cb-form-item>
    </cb-form>
    <div class="change-password-buttons">
      <cb-button-group space="middle">
        <cb-button
          :loading="enterLoading"
          button-type="confirm"
          @click="submitForm($event)"
        ></cb-button>
        <cb-button
          class="confirm-cancel"
          button-type="cancel"
          @click="handleCancel"
        ></cb-button>
      </cb-button-group>
    </div>
  </div>
</template>
<script>
import CbDialog from '../../dialog';
import CbForm from '../../form';
import { logout, request, encryptPsw, getLanguage } from '@cyber/helper';

/**
 * @displayName cb-change-password 修改密码
 * @classify Business/业务
 *
 */
export default {
  name: 'cb-change-password',
  components: {
    CbDialog,
    CbForm,
  },
  props: {
    /**
     * 修改链接
     * (注：其他属性contentType、json、fetchPromise跟随cb-form属性)
     */
    url: {
      type: String,
      default: '',
    },
    /**
     * 宽度
     */
    width: {
      type: String,
      default: 'auto',
    },
    /**
     * 请求体的baseURL
     */
    baseURL: {
      type: String,
      default: '/api/mp',
    },
    fetchPromise: {
      type: null,
      default: null,
    },
    /**
     * 加密key
     */
    encryptKey: {
      type: [String, Boolean],
      default: '',
    },
  },
  data() {
    // 密码校验规则：密码长度不低于6位，且至少包含大小写字母、数字
    const validatorPassword = (rule, value, callback) => {
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
    // 再次输入密码规则：同密码
    const validatorPasswordAgain = (rule, value, callback) => {
      if (this.confirm_pwd === '') {
        callback(new Error(this.$t('g.plsEnterPassword')));
      } else if (this.confirm_pwd !== _.get(this, 'model.new_pwd')) {
        callback(new Error(this.$t('g.enterPasswordSame')));
      } else {
        callback();
      }
    };
    return {
      model: {
        old_pwd: '',
        new_pwd: '',
      },
      enterLoading: false,
      confirm_pwd: '',
      rules: {
        old_pwd: [
          {
            required: true,
            message: this.$t('g.plsEnterPassword'),
            trigger: ['blur', 'change'],
          },
        ],
        new_pwd: [
          {
            validator: validatorPassword,
            required: true,
            trigger: ['blur', 'change'],
          },
        ],
        confirm_pwd: [
          {
            validator: validatorPasswordAgain,
            required: true,
            trigger: ['blur', 'change'],
          },
        ],
      },
      labelWidth: getLanguage() === 'zh-CN' ? '80px' : '160px',
    };
  },
  methods: {
    submitForm(done) {
      this.enterLoading = true;
      this.$refs.changePasswordFromRef
        .submit()
        .then((res) => {
          /**
           * 修改成功
           */
          this.$message.success(this.$t('g.changePassSucRelogin'));
          logout();
          this.$emit('changePasswordRes', { success: true, response: res });
          this.enterLoading = false;
          done || done();
        })
        .catch((err) => {
          /**
           * 修改失败
           */
          this.$emit('changePasswordRes', { success: false, response: err });
          this.enterLoading = false;
          done || done();
        });
    },
    fetchHandler(action, fetchUrl, formData, config) {
      const postData = _.cloneDeep(formData);

      this.encryptKey &&
        (postData.old_pwd = encryptPsw(postData.old_pwd, this.encryptKey)) &&
        (postData.new_pwd = encryptPsw(postData.new_pwd, this.encryptKey));

      return request[action](fetchUrl, postData, config);
    },
    handleCancel() {
      this.$refs.changePasswordFromRef.resetFields();
      // this.$router.push({ path: '/' });
      /**
       * 抛出取消按钮状态
       */
      this.$emit('cancel');
    },
    /**
     * 重置表格（包括验证状态）
     */
    resetForm() {
      this.$refs.changePasswordFromRef.resetFields();
    },
  },
};
</script>
