<template>
  <div>
    <cb-form
      class="static-flag-form"
      ref="formRef"
      json
      :model.sync="model"
      :rules="rules"
      :label-width="language === 'zh-CN' ? '100px' : '140px'"
    >
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
import {
  reactive,
  toRefs,
  watch,
  computed,
  onMounted,
} from '@vue/composition-api';
import { gettext } from '@/utils/rules.js';
import Utils from '@/utils/util.js';
import { getI18N } from '@cyber/helper';
import { getSystemSettingAllConfig } from '@/api/common.js';
export default {
  props: {
    flags: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    var validValue = (rule, value, callback) => {
      const len = Utils.getByteLen(value);
      if (len < 1 || len > 255) {
        callback(new Error(getI18N().t('flags.flagLen255')));
      } else {
        // var regRule = /^[0-9a-zA-Z-\_{}]{1,}$/g;
        // var re = new RegExp(regRule);
        // if (re.test(value)) {
        // 校验是否有重复的
        const filterData = _.filter(refData.model.value.flags, (item) => {
          return item.value === value;
        });
        if (filterData.length >= 2) {
          callback(new Error(gettext('m.entryCannotBeRepeated')));
        } else {
          callback();
        }
        // } else {
        //   callback(new Error(gettext('views.exercise.form.flag.regexMsg')));
        // }
      }
    };
    const data = reactive({
      model: {
        flags: [{ value: '' }],
      },
      flagLen: 8,
      rules: {
        value: [
          {
            required: true,
            message: gettext('flags.plzInputFlagValue'),
            trigger: 'blur',
          },
          {
            required: true,
            validator: validValue,
            trigger: 'blur',
          },
        ],
      },
    });
    const refData = toRefs(data);
    const language = computed(() => {
      return getI18N().locale;
    });
    watch(
      props,
      (nv, ov) => {
        if (nv.flags.length !== 0) {
          const newFlag = [];
          _.forEach(nv.flags, (item) => {
            newFlag.push({
              value: item,
            });
          });
          refData.model.value.flags = newFlag;
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );
    const addItem = () => {
      refData.model.value.flags.push({
        value: '',
      });
    };
    const deleteItem = (index) => {
      refData.model.value.flags.splice(index, 1);
    };
    const showAdd = (index) => {
      const flagLen = refData.model.value.flags.length;
      if (flagLen === 1) {
        return true;
      } else if (flagLen === 5) {
        return false;
      } else if (flagLen > 1) {
        if (flagLen === index + 1) {
          return true;
        }
        return false;
      }
    };
    const getArr = () => {
      return _.map(refData.model.value.flags, (item) => {
        return item.value;
      });
    };

    const getFlagLen = () => {
      getSystemSettingAllConfig().then((res) => {
        const resultData = _.get(res, 'data.data', []);
        const filterData = _.filter(resultData, (item) => {
          return item.key_name === 'flag_length';
        });
        refData.flagLen.value = filterData ? filterData[0].value : 8;
      });
    };
    onMounted(() => {
      getFlagLen();
    });
    return {
      ...refData,
      addItem,
      deleteItem,
      showAdd,
      getArr,
      language,
    };
  },
};
</script>
<style lang="scss" scoped>
.input-boxs {
  display: flex;
  justify-content: space-around;
  .input-item {
    width: calc(100% - 100px);
  }
  .icon-box {
    padding-left: 15px;
    width: 100px;
    .xinzeng-icon {
      margin-left: 19px;
    }
  }
}
</style>
<style lang="scss">
.static-flag-form {
  .el-form {
    padding-right: 0 !important;
  }
}
</style>
