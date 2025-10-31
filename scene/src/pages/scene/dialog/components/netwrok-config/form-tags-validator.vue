<template>
  <div class="cb-form-tags">
    <div v-for="(tag, index) in dynamicTags" :key="index">
      <cb-form-item
        v-if="(index < dynamicTags.length - 1 && inputVisible) || !inputVisible"
        ref="formItemRef"
        :prop="`DNS.${index}.dns`"
        :rules="FORM_RULES.networkConfig.DNS"
        label-width="0px"
      >
        <cb-tag
          :prop="`DNS.${index}.dns`"
          :title="getTitle(tag)"
          :key="index"
          closable
          @click="tagClick(tag)"
          @close="handleClose(tag)"
        >
          {{ getTitle(tag) }}
        </cb-tag>
      </cb-form-item>
    </div>
    <template v-if="inputVisible">
      <cb-form-item
        ref="formItemRef"
        :prop="`DNS.${dynamicTags.length - 1}.dns`"
        :rules="FORM_RULES.networkConfig.DNS"
        label-width="0px"
      >
        <cb-input
          class="cb-form-tags__input-new"
          v-model="dynamicTags[dynamicTags.length-1].dns"
          ref="saveTagInput"
          @keyup.enter.native="enterFunc"
          @blur="handleInputConfirm"
        >
        </cb-input>
      </cb-form-item>
    </template>
    <slot
      name="button"
    >
      <cb-button
        class="custom-add-btn"
        v-show="!inputVisible"
        icon="icon-xinzeng"
        hollow
        @click="showInput"
      ></cb-button>
    </slot>
  </div>
</template>

<script>
import _ from 'lodash';
import {FORM_RULES} from "../constant/form-rules";
import {ipRexp} from "../../../../../utils/form/rules";

export default {
  name: 'formTagsValidator',
  props: {

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
  },
  data() {
    return {
      dynamicTags: this.value,
      inputVisible: false,
      inputValue: '',
      FORM_RULES,
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
      this.inputVisible = false;
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
      this.$nextTick(() => {
        this.$emit('deleteTag', tag);
      })
    },
    showInput() {
      this.inputVisible = true;
      this.dynamicTags.push({dns: ''})
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    enterFunc() {
      this.$refs.saveTagInput.blur();
    },
    handleInputConfirm() {
      let value = this.dynamicTags[this.dynamicTags.length - 1]?.dns;
      if (!value) {
        this.$refs.saveTagInput.blur();
        this.inputVisible = false;
        this.$nextTick(() => {
          this.dynamicTags.pop();
        })
      }
      if (ipRexp.test(value.toString())) {
        this.inputVisible = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.cb-form-tags {
  margin-left: 10px;
  height: 48px;
  .el-form-item {
    margin: 8px 0 8px 0 !important;
  }
  ::v-deep .el-form-item__error {
    padding-top: 0 !important;
  }
}
</style>
