<script>
import _ from 'lodash';

export default {
  props: {
    context: {
      type: Object,
      default() {
        return {};
      },
    },
    model: {
      type: Object,
      default() {
        return {};
      },
    },
    item: {
      type: [String, Object, Function],
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      val: this.getVal(),
      targetName: 'target',
      emptyFunc: () => {},
    };
  },
  computed: {
    $itemTarget() {
      return this.$refs.target;
    },
    itemOptions() {
      return this.getItemOptions();
    },
    // element options
    elOptions() {
      return this.itemOptions.options || {};
    },
    watchOptions() {
      let options = this.itemOptions.watch || {};
      if (options instanceof Function) {
        options = { func: options };
      }
      return options;
    },
    exists() {
      return _.result(this.itemOptions, 'exists', true);
    },
    defaultValue() {
      return _.result(this.itemOptions, 'default');
    },
    forceDefault() {
      return _.result(this.itemOptions, 'forceDefault');
    },

    change() {
      return this.itemOptions.change || this.emptyFunc;
    },
    blur() {
      return this.itemOptions.blur || this.emptyFunc;
    },
    focus() {
      return this.itemOptions.focus || this.emptyFunc;
    },

    fromVal() {
      return this.getFromVal();
    },
  },
  watch: {
    fromVal() {
      this.val = this.getVal();
    },
  },
  created() {
    this.watchSync();
  },
  methods: {
    getItemOptions() {
      let item = _.result(this, 'item', '');
      if (item instanceof String) {
        item = { name: item };
      }
      return item;
    },
    theItemOptions() {
      return this.itemOptions || this.getItemOptions();
    },

    convert(value) {
      return (this.theItemOptions().convert || ((v) => v))(value);
    },
    reconvert(value) {
      return (this.theItemOptions().reconvert || ((v) => v))(value);
    },
    getFromVal() {
      return (
        this.theItemOptions().passval ||
        ((v) => {
          return _.get(this.model, this.theItemOptions().name);
        })
      )();
    },
    theFromVal() {
      if (this.fromVal !== undefined) {
        return this.fromVal;
      } else {
        return this.getFromVal();
      }
    },
    getVal() {
      return this.convert(this.theFromVal());
    },
    passback() {
      return (
        this.theItemOptions().passback ||
        ((v) => {
          _.set(this.model, this.theItemOptions().name, v);
        })
      )(this.reconvert(this.val));
    },

    watchSync() {
      const watchFunc =
        this.watchOptions.func ||
        (() => {
          this.$watch('val', () => this.passback(), {
            deep: this.watchOptions.deep,
            immediate: this.watchOptions.immediate,
          });
        });
      watchFunc();
    },
  },
};
</script>
