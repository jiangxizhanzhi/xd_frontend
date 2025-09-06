<template>
  <div class="subassembly">
    <cb-form-item :label="$t('missions.options')" prop="option">
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
                  <span>{{ line.optionLabel }}</span>
                </div>
                <div style="width: 90%; margin-left: 2%">
                  <cb-input v-model="line.optionValue" />
                </div>
              </div>
            </template>
          </div>
          <cb-iconfont
            class="input-item-remove"
            type="icon-jianshao"
            v-if="canAddRemove && i > fixedCount - 1"
            @click="removeLine(i)"
          />
        </div>
        <div v-if="data.length < 7" class="input-item-action">
          <cb-iconfont
            type="icon-xinzeng"
            @click="addLine"
            class="input-item-add"
          />
        </div>
      </div>
    </cb-form-item>

    <cb-form-item :label="$t('missions.answer')" prop="answer">
      <cb-checkbox-group v-model="answer">
        <cb-checkbox
          v-for="(line, i) in data"
          :key="i"
          class="input-item radio-div"
          :label="line.optionLabel"
        >
          {{ line.optionLabel }}
        </cb-checkbox>
      </cb-checkbox-group>
    </cb-form-item>
  </div>
</template>

<script>
export default {
  name: 'ComponentMultipleMission',
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
      answer:
        this.correctAnswer.length === 0 ? [] : JSON.parse(this.correctAnswer),
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
      this.answer = JSON.parse(val);
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
      val = JSON.stringify(val);
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
      this.answer = [];
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
        margin-bottom: 5px;
      }
    }
    .input-item-remove {
      cursor: pointer;
      font-size: 14px;
      margin-left: -6%;
      color: var(--danger-color);
    }
  }
  .input-item-action {
    width: calc(94% - 20px);
    display: inline-block;
    text-align: center;
    .input-item-add {
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
</style>
