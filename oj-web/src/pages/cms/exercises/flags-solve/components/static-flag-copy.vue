<template>
  <div>
    <cb-form ref="formRef" json :model.sync="model" label-width="140px">
      <div v-for="(item, index) in model.flags" :key="index">
        <cb-form-item
          :label="$t('flags.flagValue')"
          :prop="'flags.' + index + '.value'"
          :rules="rules.value"
        >
          <div class="input-boxs">
            <div class="input-item">
              <cb-input v-model="item.value" />
            </div>
            <div class="icon-box">
              <cb-iconfont
                v-if="model.flags.length > 1"
                type="icon-jianshao"
                :size="16"
                class="cursor"
                @click="deleteItem(index)"
              />
              <cb-iconfont
                v-if="showAdd(index)"
                type="icon-xinzeng"
                :size="16"
                class="xinzeng-icon cursor"
                @click="addItem()"
              />
            </div>
          </div>
        </cb-form-item>
      </div>
    </cb-form>
  </div>
</template>
<script>
import Utils from '@/utils/util';
export default {
  props: {
    flags: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    var validValue = (rule, value, callback) => {
      const len = Utils.getByteLen(value);
      if (len < 4 || len > 40) {
        callback(new Error(this.$t('flags.flagLen')));
      } else {
        var regRule = /^[0-9a-zA-Z-\_{}]{1,}$/g;
        var re = new RegExp(regRule);
        if (re.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t('views.exercise.form.flag.regexMsg')));
        }
      }
    };
    return {
      model: {
        flags: [{ value: '' }],
      },
      rules: {
        value: [
          {
            required: true,
            message: this.$t('flags.plzInputFlagValue'),
            trigger: 'blur',
          },
          {
            required: true,
            validator: validValue,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  watch: {
    flags: {
      handler(nv, ov) {
        const newFlag = [];
        _.forEach(nv, (item) => {
          newFlag.push({
            value: item,
          });
        });
        this.model.flags = newFlag;
      },
      deep: true,
    },
  },
  computed: {},
  methods: {
    showAdd(index) {
      const flagLen = this.model.flags.length;
      if (flagLen === 1) {
        return true;
      } else if (flagLen > 1) {
        if (flagLen === index + 1) {
          return true;
        }
        return false;
      }
    },
    addItem() {
      this.model.flags.push({
        value: '',
      });
    },
    getArr() {
      return _.map(this.model.flags, (item) => {
        return item.value;
      });
    },
    deleteItem(index) {
      this.model.flags.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.input-boxs {
  display: flex;
  justify-content: space-around;
  .input-item {
    width: calc(100% - 64px);
  }
  .icon-box {
    padding-left: 16px;
    width: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
