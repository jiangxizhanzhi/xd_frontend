<template>
  <div class="cb-filter-condition">
    <div
      class="cb-filter-condition-title"
      v-if="condition"
      :style="{ 'line-height': height + 'px' }"
    >
      {{ condition }}：
    </div>
    <div class="cb-filter-condition-list">
      <div
        v-for="(item, index) in dataList"
        :key="index"
        v-show="index <= count || showMore || count == 0"
        class="cb-filter-condition-list-item"
        :class="{ selected: item.selected }"
        :title="item[props.label]"
        :style="{ height: height + 'px', 'line-height': height + 'px' }"
        @click="itemClick(item)"
      >
        {{ item[props.label] }}
      </div>
      <span
        class="el-button--text"
        type="text"
        @click="toggleShowStatus"
        v-if="dataList.length > count && count != 0"
        :style="{ 'line-height': height + 'px' }"
      >
        {{ showMore ? $t('g.retract') : $t('g.unfold') }}
      </span>
    </div>
  </div>
</template>

<script>
/**
 * @displayName cb-filter-condition 筛选条件
 * @classify Form/表单
 */
export default {
  name: 'CbFilterCondition',
  props: {
    /**
     * 单选/多选
     * @values  radio,checkbox
     */
    type: {
      type: String,
      default: 'radio',
    },
    /**
     * 筛选条件list
     */
    filterList: {
      type: Array,
      default: () => [],
    },
    /**
     * 筛选条件
     */
    condition: {
      type: String,
      default: '',
    },
    /**
     * 选中后的值
     */
    value: {
      type: String | Array,
      default: '',
    },
    /**
     * 显示展开按钮的长度, 默认20 展开,
     * 传0关闭展开功能
     */
    showCount: {
      type: Number | String,
      default: 20,
    },
    /**
     * 自定义标签高度，默认24
     *
     */
    height: {
      type: Number | String,
      default: 24,
    },
    /**
     * props
     */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'value',
          label: 'label',
        };
      },
    },
  },
  data() {
    return {
      selectData: '',
      dataList: [],
      showMore: false,
      count: this.showCount,
    };
  },
  watch: {
    filterList() {
      this.dealWithData();
    },
  },
  mounted() {
    this.dealWithData();
    this.allCheckFunc();
  },
  methods: {
    dealWithData() {
      this.dataList = [];
      this.filterList.forEach((element) => {
        const obj = { selected: false };
        if (this.type === 'radio' && element[this.props.value] === this.value) {
          obj.selected = true;
        }
        if (this.type === 'checkbox') {
          const status = this.value.some((item) => {
            return item == element[this.props.value];
          });
          status ? (obj.selected = true) : '';
        }
        Object.assign(obj, element);
        this.dataList.push(obj);
      });
    },
    // 点击子选项
    itemClick(item) {
      /**
       * 点击筛选事件
       * @event change
       * @property {object}
       */
      this.$emit('change', item);
      if (this.type === 'radio') {
        this.filterSelected(this.dataList, false);
        item.selected = !item.selected;
        item.selected ? (this.selectData = item[this.props.value]) : '';
        this.$emit('input', this.selectData);
      }
      if (this.type === 'checkbox') {
        item.selected = !item.selected;
        // 点击全选
        item.all
          ? this.filterSelected(this.dataList, item.selected)
          : this.allCheckFunc();
      }
    },
    // 全选/反全选处理
    allCheckFunc() {
      // 处理边界问题
      if (
        !this.filterAllItem().some((element) => {
          return element.selected;
        })
      ) {
        this.changeAll(false);
      }
      if (
        this.filterAllItem().every((element) => {
          return element.selected;
        })
      ) {
        this.changeAll(true);
      }
    },
    filterSelected(data, status) {
      data.filter((element) => {
        element.selected = status;
      });
    },
    filterAllItem() {
      return this.dataList.filter((item) => {
        return !item.all;
      });
    },
    changeAll(status) {
      this.dataList.filter((item) => {
        item.all ? (item.selected = status) : '';
      });
    },
    toggleShowStatus() {
      this.showMore = !this.showMore;
    },
  },
};
</script>
