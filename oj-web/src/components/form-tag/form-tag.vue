<template>
  <div class="cy-form-tags">
    <div class="tag-item mr10" :key="tag" v-for="(tag, index) in valueComputed">
      <div class="tag-label">
        <fixed-length-label :str="tag" :selectable="true"></fixed-length-label>
      </div>
      <div class="close iconshanchu iconfont" @click="remove(index)"></div>
    </div>
    <template v-if="!tagsLimited">
      <div class="input-erea" v-show="inputVisible">
        <cb-input
          class="input-new-tag"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></cb-input>
        <div class="error" v-show="inputError">{{ inputError }}</div>
      </div>
      <div class="trigger" v-show="!inputVisible" @click="showInput">
        <slot name="trigger"></slot>
      </div>
    </template>
  </div>
</template>

<script>
import Utils from '@/utils/util';
import { getI18N } from '@cyber/helper';
export default {
  props: {
    max: {
      type: Number,
      default() {
        return 0;
      },
    },
    ctg: {
      type: String,
      default() {
        return '标签';
      },
    },
    value: {
      type: Array,
      default() {
        return null;
      },
    },
    minSize: {
      type: Number,
      default() {
        return 4;
      },
    },
    maxSize: {
      type: Number,
      default() {
        return 40;
      },
    },
    validate: {
      type: null,
      default() {
        return undefined;
      },
    },
    regex: {
      type: RegExp,
      default() {
        return undefined;
      },
    },
    regexMsg: {
      type: String,
      default() {
        return undefined;
      },
    },
  },
  data() {
    return {
      inputError: '',
      inputValue: '',
      inputVisible: false,
    };
  },
  computed: {
    valueComputed() {
      const { value } = this;
      if (value && value instanceof Array) {
        return value;
      }
      return [];
    },
    inputValueTrimmed() {
      const { inputValue = '' } = this;
      // 过滤全部空格
      if (inputValue.replace(/\s*/g, '').length) {
        return inputValue;
      } else {
        return inputValue.replace(/\s*/g, '');
      }
    },
    tagsLimited() {
      const { max = 0 } = this;
      if (max > 0) {
        return this.valueComputed.length >= max;
      }
      return false;
    },
  },
  methods: {
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    remove(removeByIdx) {
      const arr = [];
      const { value } = this;
      for (let idx = 0; idx < value.length; idx++) {
        if (idx !== removeByIdx) {
          arr.push(value[idx]);
        }
      }
      this.$emit('input', arr);
    },

    handleInputConfirm() {
      const that = this;
      const { inputValueTrimmed } = that;
      let { validate } = that;
      const { minSize = 4 } = that;
      const { maxSize = 40 } = that;
      const {
        regex,
        regexMsg = `content inputted (${inputValueTrimmed}) and regex pattern not match.    ${that.regex}`,
      } = that;
      if (!validate) {
        validate = (val) => {
          const { ctg } = this;
          return new Promise((res, rej) => {
            if (
              Utils.getByteLen(val) >= minSize &&
              Utils.getByteLen(val) <= maxSize
            ) {
              // var patrn = regex
              if (regex) {
                let aa = regex.test(val);
                if (aa) {
                  aa = regex.test(val);
                  res();
                } else {
                  rej(regexMsg);
                }
              }
              res();
            } else {
              if (getI18N().locale == 'en-US') {
                rej(`${ctg} ` + this.$t('m.validataNameTip'));
              } else {
                rej(`${ctg}` + this.$t('m.validataNameTip'));
              }
            }
          });
        };
      }
      const reset = () => {
        that.inputError = '';
        that.inputValue = '';
        that.inputVisible = false;
      };
      if (inputValueTrimmed) {
        validate(inputValueTrimmed)
          .then(() => {
            if (this.valueComputed.includes(inputValueTrimmed)) {
              return new Promise((res, rej) => {
                rej(this.$t('m.entryCannotBeRepeated')); // 输入项不能重复
              });
            } else {
              that.$emit('input', [...this.valueComputed, inputValueTrimmed]);
            }
            reset();
          })
          .catch((ex) => {
            that.inputError = ex;
          });
      } else {
        reset();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cy-form-tags {
  display: flex;
  line-height: 30px;
  & > .tag-item {
    display: flex;
    position: relative;
    & > .tag-label {
      background: var(--neutral0);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 36px;
      border-radius: 2px;
      font-size: 12px;
      font-weight: 400;
      color: var(--neutral8);
      user-select: none;
    }
    & > .close:hover {
      color: var(--primary-color);
    }
    & > .close {
      cursor: pointer;
      top: 4px;
      font-size: 12px !important;
      right: 6px;
      position: absolute;
      align-items: center;
      justify-content: center;
      display: flex;
      overflow: hidden;
      color: var(--neutral8);
    }
  }
  & > .input-erea {
    & > .error {
      color: var(--red-color);
    }
  }
  .input-new-tag {
    width: 140px;
    height: 36px;
  }
}
</style>
<style lang="scss">
.input-erea {
  .el-input--small .el-input__inner {
    height: 36px !important;
    line-height: 36px !important;
  }
}
</style>
