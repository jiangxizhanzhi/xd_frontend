<template>
  <div
    class="elc-form-multi-line-input"
    :class="{ empty: renderedData.length === 0 }"
  >
    <template v-for="(line, i) in data">
      <div v-if="showLine(line)" :key="i" class="input-item">
        <div class="input-item-content">
          <slot :i="i" :data="data" :line="line">
            <cb-input v-model="data[i]" />
          </slot>
          <span
            v-if="canAddRemove && i > fixedCount - 1"
            class="multi-remove-span"
          >
            <slot name="remove">
              <span @click="removeLine(i, $event)">
                <cb-iconfont type="icon-jianshao" />
              </span>
            </slot>
          </span>
        </div>
      </div>
    </template>
    <div v-if="canAddRemove" class="input-item-action">
      <span @click="addLine">
        <slot name="add">
          <cb-button icon="icon-xinzeng">
            {{ $t('common.add') }}
          </cb-button>
        </slot>
      </span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'ElcFormMultiLineInput',
  props: {
    context: {
      type: Object,
      default() {
        return {};
      },
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    empty: {
      type: Function,
      default() {
        return '';
      },
    },
    canAddRemove: {
      type: Boolean,
      default: true,
    },
    fixedCount: {
      type: Number,
      default: 0,
    },
    deepWatch: {
      type: Boolean,
      default: false,
    },
    showLine: {
      type: Function,
      default(line) {
        return true;
      },
    },
    removeIconClass: {
      type: String,
      default: 'fa fa-minus',
    },
    addIconClass: {
      type: String,
      default: 'fa fa-plus',
    },
  },
  data() {
    return {
      data: this.value,
    };
  },
  computed: {
    renderedData() {
      return _.filter(this.data, (line) => this.showLine(line));
    },
  },
  watch: {
    value() {
      this.data = this.value;
    },
  },
  created() {
    this.$watch(
      'data',
      () => {
        this.dataUpdated();
      },
      {
        deep: this.deepWatch,
      },
    );
    this.completeData();
  },
  methods: {
    addLine() {
      const line = this.empty();
      this.data.push(line);
      this.$emit('add-line', line, this.data.length - 1, this.data);
    },
    removeLine(lineIndex, done) {
      const line = this.data[lineIndex];
      this.data.splice(lineIndex, 1);
      this.$emit('remove-line', line, lineIndex, this.data);
      done(false);
    },
    dataUpdated() {
      this.$emit('update:value', this.data);
    },
    init(data) {
      this.data = data;
      this.completeData();
    },
    completeData() {
      if (this.data.length < this.fixedCount) {
        const remain = this.fixedCount - this.data.length;
        for (let i = 0; i < remain; i++) {
          this.data.push(this.empty());
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.multi-remove-span {
  cursor: pointer;
  display: inline-block;
  margin: 5px 0;
}
.minus {
  display: inline-block;
  width: 12px;
  height: 12px;
  position: absolute;
  top: 50%;
  transform: translateY(-81%);
  .hori {
    position: absolute;
    top: 4px;
    left: 0;
    right: 0;
    height: 4px;
    background-color: #f56c6c;
  }
}
.plus {
  display: inline-block;
  width: 12px;
  height: 12px;
  position: relative;
  .hori {
    top: 0;
    bottom: 0;
    width: 4px;
    left: 4px;
    position: absolute;
  }
  .vert {
    position: absolute;
    top: 4px;
    left: 0;
    right: 0;
    height: 4px;
  }
}
.elc-form-multi-line-input {
  &.empty {
    .input-item-action {
      width: auto;
    }
  }
  .input-item {
    position: relative;
    line-height: initial;
    margin-bottom: 5px;
    .input-item-content {
      width: 100%;
      display: flex;
      align-items: center;

      & > * {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }

      &.with-add-remove {
        width: calc(100% - 24px);
      }
    }
    .input-item-remove {
      color: #f56c6c;
      cursor: pointer;
      font-size: 14px;
      margin-left: 6px;
      width: 12px;
      display: inline-block;
      position: relative;
    }
  }
  .input-item-action {
    width: calc(100% - 24px);
    display: inline-block;
    .input-item-add {
      color: #909399;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss" scoped>
.input-item-content {
  color: var(--font-color-regular);
}
.plus {
  .hori {
    background-color: var(--primary-color);
  }
  .vert {
    background-color: var(--primary-color);
  }
}
</style>
