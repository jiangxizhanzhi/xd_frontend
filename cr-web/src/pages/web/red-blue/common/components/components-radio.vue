<template>
  <div class="subassembly">
    <cb-form-item :label="$t('m.options')" prop="option" class="mgb10">
      <div
        class="elc-form-multi-line-input"
        :class="{ empty: data.length === 0 }"
      >
        <div v-for="(line, i) in data" :key="i" class="input-item input-inline">
          <div
            class="input-item-content"
            :class="{ 'with-add-remove': canAddRemove }"
            style="margin-bottom: 10px"
          >
            <template>
              <div class="static-routing-item" style="display: flex">
                <div>
                  <span class="option-label">{{ line.optionLabel }}</span>
                </div>
                <div style="width: 90%; margin-left: 2%">
                  <cb-input v-model="line.optionValue" class="elc-input" />
                </div>
              </div>
            </template>
          </div>
          <!-- 删除选项 -->
          <span @click="removeLine(i)">
            <cb-iconfont
              v-if="canAddRemove && i > fixedCount - 1"
              size="18"
              class="icon"
              type="icon-jianshao"
            ></cb-iconfont>
          </span>
        </div>
        <!-- 增加选项 -->
        <div v-if="data.length < 7" class="input-item-action">
          <span @click="addLine">
            <cb-iconfont
              size="18"
              class="icon"
              type="icon-xinzeng"
            ></cb-iconfont>
          </span>
        </div>
      </div>
    </cb-form-item>
    <!-- <div class="hr-line-dashed" /> -->

    <cb-form-item :label="$t('m.practiceAnswer')" prop="answer">
      <cb-radio-group v-model="answer">
        <cb-radio
          v-for="(line, i) in data"
          :key="i"
          class="input-item radio-div"
          :label="line.optionLabel"
        >
          {{ line.optionLabel }}
        </cb-radio>
      </cb-radio-group>
    </cb-form-item>
  </div>
</template>

<script>
export default {
  name: 'ComponentRadioMission',
  props: {
    option: {
      type: Array,
      default() {
        return [];
      },
    },
    correctAnswer: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      data: this.option,
      showAdd: true,
      answer: this.correctAnswer,
      deepWatch: false,
      fixedCount: 0,
      canAddRemove: true,
      empty: '',
    };
  },
  watch: {
    option(val) {
      this.data = val;
    },
    correctAnswer(val) {
      this.answer = val;
    },
    data: {
      deep: true,
      handler(val) {
        val.forEach((item, index) => {
          item.optionLabel = 'ABCDEFG'[index];
        });
        this.data = val;
        this.$emit('option', this.data);
      },
      immediate: true,
    },
    answer(val) {
      this.$emit('answer', val);
    },
  },
  created() {
    // this.$watch('data', () => {
    //   this.dataUpdated()
    // }, {
    //   deep: this.deepWatch,
    // })
    this.completeData();
  },
  methods: {
    addLine() {
      const new_options = {
        optionLabel: 'ABCDEFG'[this.data.length],
        optionValue: this.empty,
      };
      if (this.data.length <= 7) {
        this.data.push(new_options);
        this.showAdd = true;
        if (this.data.length === 7) {
          this.showAdd = false;
        }
      } else {
        this.showAdd = false;
      }
    },
    removeLine(lineIndex) {
      if (this.data.length <= 7) {
        this.showAdd = true;
      }
      this.answer = '';
      // const line = this.data[lineIndex]
      this.data.splice(lineIndex, 1);
    },
    dataUpdated() {
      this.$emit('option', this.data);
    },
    init(data) {
      this.data = data;
      this.completeData();
    },
    completeData() {
      if (this.data.length) {
        if (this.data.length < this.fixedCount) {
          const remain = this.fixedCount - this.data.length;
          for (let i = 0; i < remain; i++) {
            this.data.push(this.empty);
          }
        }
      } else {
        for (let i = 0; i < 4; i++) {
          this.addLine();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mgb10 {
  margin-bottom: 10px;
}
.elc-form-multi-line-input {
  &.empty {
    .input-item-action {
      width: auto;
    }
  }
  .input-item {
    .input-item-content {
      width: 97%;
      display: inline-block;
      &.with-add-remove {
        width: calc(100% - 20px);
      }
    }
    .input-item-remove {
      color: #f56c6c;
      cursor: pointer;
      font-size: 14px;
      margin-left: -6%;
    }
  }
  .input-item-action {
    width: calc(94% - 20px);
    display: inline-block;
    text-align: center;
    .input-item-add {
      color: #909399;
      cursor: pointer;
    }
  }
}
.input-inline {
  width: 94%;
}
.radio-div {
  float: left;
  margin-right: 20px;
}
.option-label {
  color: #c0cce7;
}
::v-deep .el-radio__label,
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #c0cce7;
}
::v-deep.el-radio__input.is-checked .el-radio__inner {
  background: linear-gradient(
    0deg,
    rgba(63, 228, 238, 1) 0%,
    rgba(44, 163, 238, 1) 99.21875%
  );
}
</style>
