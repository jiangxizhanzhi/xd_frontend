<template>
  <div
    class="cb-select"
    :class="readonly ? 'readOnly' : ''"
    :style="width ? { width } : ''"
  >
    <label v-if="label">{{ label }}</label>
    <cb-input v-if="readonly" readonly v-bind="$attrs" :value="currentLabel" />
    <Select
      v-else-if="options.length > 0"
      v-bind="$attrs"
      :value="inputValue"
      @change="selectorChange"
      ref="selectRef"
    >
      <cb-option
        v-if="(first || {})[titleField]"
        :key="first.key || first[valueField] + '_first' || '__cb_first'"
        :label="first[titleField]"
        :value="first[valueField]"
        :disabled="first.disabled"
      ></cb-option>
      <cb-option
        v-for="(item, index) in optionsComputed"
        :key="item.key || item[valueField] + `_op${index}`"
        :label="item[titleField]"
        :value="item[valueField]"
        :disabled="item.disabled"
      >
      </cb-option>
    </Select>
    <Select
      v-else
      v-bind="$attrs"
      :value="inputValue"
      @change="selectorChange"
      ref="selectRef"
    >
      <cb-option
        v-if="(first || {})[titleField]"
        :key="first.key || first[valueField] + '_first' || '__cb_first'"
        :label="first[titleField]"
        :value="first[valueField]"
        :disabled="first.disabled"
      ></cb-option>
      <slot></slot>
    </Select>
  </div>
</template>

<script>
import { Select, Input } from 'element-ui';
import _ from 'lodash';
/**
 * @displayName cb-select 下拉选框
 * @classify Form/表单
 */
export default {
  name: 'CbSelect',
  inheritAttrs: false,
  model: {
    event: 'change',
  },
  components: {
    Select,
    Input,
  },
  props: {
    /**
     * 绑定值 value / v-model
     *
     */
    value: {
      type: null,
      default: () => {
        return '';
      },
    },
    /**
     * 选项列表
     *
     */
    options: {
      type: Array,
      default: () => [],
    },
    /**
     * 选项标签
     *
     */
    label: {
      type: String,
      default: '',
    },
    titleField: {
      type: String,
      default: 'label',
    },
    valueField: {
      type: String,
      default: 'value',
    },
    defaultIndex: {
      type: Number,
      default: null,
    },
    /**
     * 额外插入第一条选项
     *
     */
    first: {
      type: Object,
      default: () => {},
    },
    /**
     * 宽度
     *
     */
    width: {
      type: String,
      default: '200px',
    },
    /**
     *完全只读
     *
     */
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: '',
    };
  },
  watch: {
    value() {
      this.inputValue = this.value;
    },
  },
  mounted() {
    this.inputValue = this.value;
  },
  beforeDestroy() {
    const popperElm = this.$refs.selectRef.popperElm;
    if (
      popperElm &&
      popperElm.parentNode === document.querySelector('micro-app-body')
    ) {
      popperElm.parentNode.removeChild(popperElm);
    }
  },
  computed: {
    optionsComputed() {
      return this.options.map((i) => {
        return _.isPlainObject(i)
          ? i
          : {
              key: i,
              label: i,
              value: i,
            };
      });
    },
    currentLabel() {
      const { titleField, valueField, inputValue, optionsComputed } = this;
      if (optionsComputed.length === 0) {
        return inputValue;
      } else {
        const obj = _.find(optionsComputed, {
          [valueField]: inputValue,
        });
        return _.get(obj, `${titleField}`, '');
      }
    },
  },
  methods: {
    selectorChange(val) {
      this.inputValue = val;
      /**
       * 选中值的回调
       * @event close
       * @property {object}
       */
      this.$emit('change', val);
    },
  },
};
</script>
