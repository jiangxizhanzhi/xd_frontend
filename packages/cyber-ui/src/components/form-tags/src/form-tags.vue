<template>
  <div class="cb-form-tags">
    <cb-tag
      :title="getTitle(tag)"
      v-for="(tag, index) in dynamicTags"
      :key="index"
      closable
      @click="tagClick(tag)"
      @close="handleClose(tag)"
    >
      {{ getTitle(tag) }}
    </cb-tag>
    <cb-input
      class="cb-form-tags__input-new"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      :maxlength="inputMaxlength"
      :style="inputStyle"
      @keyup.enter.native="enterFunc"
      @blur="handleInputConfirm"
    >
    </cb-input>
    <slot
      name="button"
      v-else-if="listMaxLen === 0 || dynamicTags.length < listMaxLen"
    >
      <cb-button
        icon="icon-xinzeng"
        :hollow="hollow"
        :button-type="buttonType"
        @click="showInput"
      ></cb-button>
    </slot>
  </div>
</template>

<script>
import CbInput from '../../input';
import _ from 'lodash';

/**
 * @displayName cb-form-tags
 * @classify Form/表单
 */
export default {
  name: 'CbFormTags',
  components: { CbInput },
  props: {
    /**
     * 按钮镂空
     */
    hollow: {
      type: Boolean,
      default: true,
    },
    /**
     * 自定义input输入框校验
     */
    customInputReg: {
      type: Function,
      default: null,
    },
    /**
     * tags 最大个数
     */
    listMaxLen: {
      type: Number,
      default: 0,
    },
    /**
     * input最大可输入内容长度
     */
    maxlength: {
      type: [Number, String],
      default: 0,
    },
    /**
     * 自定义列表过长错误信息提示
     */
    customError: {
      type: Boolean,
      default: false,
    },
    /**
     * 按钮类型
     */
    buttonType: {
      type: String,
      default: '',
    },
    /**
     * 绑定值 value / v-model
     */
    value: {
      type: Array,
      default: () => [],
    },
    titleField: {
      type: String,
      default: 'title',
    },
    /**
     * 重复性校验
     */
    checkRepeat: {
      type: Boolean,
      default: true,
    },
    /**
     * 输入框样式
     */
    inputStyle: {
      type: null,
      default: '',
    },
  },
  data() {
    return {
      dynamicTags: this.value,
      inputVisible: false,
      inputValue: '',
      activeVal: '',
    };
  },
  computed: {
    inputMaxlength() {
      return Number(this.maxlength) === 0 ? undefined : this.maxlength;
    },
  },
  watch: {
    value: {
      handler(nv, ov) {
        this.dynamicTags = nv;
      },
    },
  },
  methods: {
    tagClick(item) {
      /**
       * tag点击事件
       *
       * @event click
       * @property {object|string}  tag 获取的tag
       */
      this.$emit('click', item);
    },
    getTitle(tag) {
      return _.isPlainObject(tag) ? tag[this.titleField] : tag;
    },

    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      /**
       * 获取tage集合值事件
       *
       * @event input
       * @property {string}  tag 获取的tag
       */
      this.$emit('input', this.dynamicTags);
      /**
       * 删除tag事件
       *
       * @event deleteTag
       * @property {string} tag 删除的tag
       */
      this.$emit('deleteTag', tag);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    enterFunc() {
      this.$refs.saveTagInput.blur();
    },
    handleInputConfirm() {
      // 当全部是空格时,inputValue = '',不让其新增成功
      if (this.inputValue.match(/^[ ]*$/)) {
         this.inputValue = '';
      }
      // list长度校验
      if (this.listMaxLen !== 0 && this.dynamicTags.length >= this.listMaxLen) {
        if (!this.customError) {
          this.$message.warning(
            this.$t('g.maxTag', { count: this.listMaxLen }),
          );
        }
        /**
         * 长度校验自定义提示事件
         *
         * @event error
         */
        this.$emit('error', this.dynamicTags);

        this.inputVisible = false;
        return;
      }
      // input校验
      if (this.customInputReg && !this.customInputReg(this.inputValue)) {
        return;
      }
      let inputValue = this.inputValue;
      let isObject = false;
      //校验重复性
      let isExit = this.dynamicTags.some((element) => {
        isObject = _.isPlainObject(element);
        let item = isObject ? element[this.titleField] : element;
        return item === this.inputValue;
      });
      if (isExit && this.checkRepeat) {
        this.$message.error(this.$t('g.existTag'));
        return;
      }
      if (inputValue) {
        if (isObject) {
          let obj = {};
          obj[this.titleField] = this.inputValue;
          this.dynamicTags.push(obj);
        } else {
          this.dynamicTags.push(inputValue);
        }
        this.$emit('input', this.dynamicTags);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
  },
};
</script>
