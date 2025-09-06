<template>
  <div class="cb-form-tags" id="enviroment-tag">
    <cb-tag
      :title="getTitle(tag)"
      v-for="(tag, index) in dynamicTags"
      :key="index"
      closable
      :class="{ 'active-style': activeVal1 === getTitle(tag) }"
      @click="tagClick(tag)"
      @close="handleClose(tag)"
    >
      {{ getTitle(tag) }}
    </cb-tag>
    <Input
      class="cb-form-tags__input-new"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      @keyup.enter.native="enterFunc"
      @blur="handleInputConfirm"
    >
    </Input>
    <slot name="button" v-else>
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
import { Input } from 'element-ui';
import _ from 'lodash';

/**
 * @displayName cb-form-tags
 * @classify Form/表单
 */
export default {
  name: 'CbFormTags',
  components: { Input },
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
     * tags 最大长度
     */
    listMaxLen: {
      type: Number,
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
     * 是否需要点击状态展示
     */
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dynamicTags: this.value,
      inputVisible: false,
      inputValue: '',
      activeVal: '',
      activeVal1: '',
    };
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
      this.isActive ? (this.activeVal1 = this.getTitle(item)) : '';
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
      // list长度校验
      if (this.listMaxLen !== 0 && this.dynamicTags.length >= this.listMaxLen) {
        if (this.customError) {
          /**
           * 长度校验自定义提示事件
           *
           * @event error
           */
          this.$emit('error');
        } else {
          this.$message.warning(`最多可以添加${this.listMaxLen}个tag`);
        }
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
      if (isExit) {
        this.$message.error('已经存在此项了');
      }
      if (inputValue && !isExit) {
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

<style lang="scss">
#enviroment-tag.cb-form-tags {
  display: flex;
  align-items: center;

  .active-style {
    outline: 1px solid var(--primary-color);
  }

  .cb-tag {
    margin-right: 10px;
    margin-bottom: 5px;
  }

  .el-tag {
    margin-right: 10px;
    height: 36px;
    line-height: 34px;
    background: var(--bg-color-sixth);
    opacity: 0.2;
    border-radius: 2px;
    font-size: 14px;
    color: var(--font-color-primary);
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    border: none;

    .el-tag__close {
      color: var(--primary-color);

      &:hover {
        color: var(--primary-color);
        background: none;
      }
    }
  }

  &__input-new {
    width: 90px;
  }
}
</style>
