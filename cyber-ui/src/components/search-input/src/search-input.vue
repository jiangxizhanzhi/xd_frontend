<template>
  <div class="cb-search-input" :style="width ? { width } : ''">
    <cb-input
      v-bind="$attrs"
      class="cb-search-input__input"
      v-model="inputValue"
      @keyup.enter.native="handleEnter"
      :placeholder="placeholderComputed"
      @clear="clearFunc"
      @blur="doSearch"
    >
      <!--      <i-->
      <!--        class="el-input__icon el-icon-search"-->
      <!--        slot="prefix"-->
      <!--        @click="doSearch"-->
      <!--      ></i>-->
    </cb-input>
  </div>
</template>

<script>
import _ from 'lodash';
/**
 * @displayName cb-search-input 搜索框
 * @classify Form/表单
 */
export default {
  name: 'CbSearchInput',
  props: {
    clazz: {
      type: Object,
      default() {
        return {};
      },
    },
    /**
     * 绑定值
     */
    value: '',
    /**
     * 输入框占位符
     */
    placeholder: {
      type: String,
      default: '',
    },
    /**
     * 输入框内容变化时配置搜索方式，实时（input）、防抖（lazy）
     * @values input,lazy
     */
    trigger: {
      type: String,
      default() {
        return '';
      },
    },
    /**
     * 搜索框宽度
     * @values px,百分比
     */
    width: {
      type: String,
      default: '300px',
    },
  },
  data() {
    return {
      inputValue: this.value,
    };
  },

  computed: {
    placeholderComputed() {
      return this.placeholder || this.$t('g.pleaseEnterKeyWords');
    },
  },
  watch: {
    inputValue() {
      if (this.trigger === 'input') {
        this.doSearch();
      } else if (this.trigger === 'lazy') {
        _.debounce(this.doSearch, 500)();
      }
    },
    value(val) {
      this.inputValue = val;
    },
  },
  methods: {
    clearFunc() {
      /**
       * 清空触发
       * @event clear
       */
      this.inputValue = '';
      this.$emit('input', this.inputValue);
      this.$emit('clear');
    },
    doSearch() {
      this.$emit('input', this.inputValue);
      /**
       * 触发搜索时的回调
       * @event change
       * @property {String} inputValue 输入值
       */
      this.$emit('change', this.inputValue);
    },
    handleEnter() {
      this.$emit('input', this.inputValue);
      this.$nextTick(() => {
        this.$emit('enter', this.inputValue);
      })
    },
  },
};
</script>
