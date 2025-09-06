<script>
import _ from 'lodash';

export default {
  data() {
    return {
      prevOptionVal: undefined,
    };
  },
  computed: {
    options() {
      return _.result(this.elOptions, 'options', []);
    },
    optionValues() {
      return _.map(this.options, (option) => option.value);
    },
  },
  created() {
    this.$watch(
      'options',
      () => {
        if (_.isArray(this.val)) {
          // 恢复上次删除的值
          if (!_.isEmpty(this.prevOptionVal)) {
            const validVal = _.pull(
              _.intersection(this.optionValues, this.prevOptionVal),
              ...this.val,
            );
            if (!_.isEmpty(validVal)) {
              this.val.push(...validVal);
            }
          }
          // 多选剔除
          this.prevOptionVal = _.remove(
            this.val,
            (ival) => !_.includes(this.optionValues, ival),
          );
        } else {
          // 单选剔除
          if (!_.includes(this.optionValues, this.val)) {
            const defaultValue =
              this.prevOptionVal === undefined ||
              !_.includes(this.optionValues, this.prevOptionVal)
                ? this.defaultValue
                : this.prevOptionVal;
            this.prevOptionVal = this.val;
            if (
              _.includes(this.optionValues, defaultValue) ||
              this.forceDefault
            ) {
              this.val = defaultValue;
            } else {
              this.val = undefined;
            }
          }
        }
      },
      {
        immediate: true,
      },
    );
  },
};
</script>
