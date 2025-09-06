<template>
  <div class="change-password-container">
    <div v-if="defaultPsw" class="default-psw-warn">
      <span>
        <cb-iconfont type="icon-jingshi" themedColor="orange-color" size="16">
        </cb-iconfont>
      </span>
      {{ $t('changePwd.changePwdInfo') }}
    </div>
    <cb-change-password
      class="chang-password-module"
      :url="'/auth/users/resetpwd/self/'"
      :width="language === 'en-US' ? '760px' : '380px'"
      :encrypt-key="true"
      @cancel="cancelPwd"
    ></cb-change-password>
    <div class="btn-top-line"></div>
  </div>
</template>
<script>
import { getLanguage } from '@cyber/helper';
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: 'normal',
    },
  },
  data() {
    return {
      defaultPsw: '',
      language: getLanguage(),
    };
  },
  created() {
    this.defaultPsw = this.type === 'default';
  },
  computed: {},
  mounted() {},
  methods: {
    cancelPwd() {
      this.$emit('cancel');
    },
  },
};
</script>
<style lang="scss" scoped>
.change-password-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  .default-psw-warn {
    color: var(--orange-color);
    background: var(--neutral0);
    font-size: 14px;
    width: 100%;
    text-align: center;
    padding: 6px 0 7px;
    span {
      margin-right: 8px;
    }
  }
  .chang-password-module {
    margin-top: 4px;
  }
  .btn-top-line {
    position: absolute;
    height: 1px;
    width: 100%;
    background: var(--neutral0);
    bottom: 47px;
  }
}
</style>
