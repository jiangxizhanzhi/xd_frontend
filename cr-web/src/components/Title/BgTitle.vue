<template>
  <div class="elc-bg-title">
    <div class="cb-block-left-border"></div>
    <div class="title-boxs">
      <slot>{{ title }}</slot>
    </div>
    <cb-checkbox
      v-if="showCheckAll"
      v-model="checkAll"
      :indeterminate="indeterminate"
      @change="handleCheckAllChange"
      >{{ $t('fishBone.all') }}</cb-checkbox
    >
  </div>
</template>

<script>
export default {
  name: 'ElcBgTitle',
  props: {
    title: {
      type: String,
      default() {
        return '';
      },
    },
    showCheckAll: {
      type: Boolean,
      default: false,
    },
    checkAllValue: {
      type: Boolean,
      default: undefined,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      checkAll: false,
    };
  },

  watch: {
    checkAllValue(nv) {
      if (typeof nv === 'boolean') this.setChenckAllValue();
    },
  },

  created() {
    this.setChenckAllValue();
  },

  methods: {
    handleCheckAllChange(value) {
      this.$emit('checkAllChange', value);
    },
    setChenckAllValue() {
      if (this.showCheckAll && this.checkAllValue !== undefined) {
        this.checkAll = this.checkAllValue;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.elc-bg-title {
  // line-height: 36px;
  // background-color: #F6F7FB;
  padding: 9px 10px;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  line-height: initial;
  .cb-block-left-border {
    width: 6px;
    height: 8px;
    background: var(--primary-color);
  }
  .title-boxs {
    padding-left: 14px;
  }
}
</style>
<style lang="scss">
.elc-bg-title {
  .el-checkbox {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    &__input {
      line-height: 18px;
      .el-checkbox__inner {
        vertical-align: middle;
      }
    }
    &__label {
      margin-right: 8px;
    }
  }
}
</style>
