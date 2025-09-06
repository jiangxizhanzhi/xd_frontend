<template>
  <!-- 编辑一级指标名称页面-->
  <cb-dialog
    :title="edit ? $t('assessment.edit') : $t('assessment.add')"
    :visible.sync="dialogVisible"
    width="600px"
    height="300px"
  >
    <cb-form
      ref="ref"
      :model="model"
      :rules="rules"
      :label-width="getI18Nn().locale == 'en-US' ? '165px' : '110px'"
    >
      <!-- 名称 -->
      <cb-form-item
        :label="$t('assessment.firstName') + ':'"
        prop="name"
        class="mgb20"
      >
        <div class="one-overflow" style="width: 100%" :title="model.name">
          {{ model.name }}
        </div>
      </cb-form-item>
      <!-- 聚合算法 -->
      <cb-row :gutter="28">
        <cb-col :span="12">
          <cb-form-item
            :label="$t('assessment.aggregationAlgorithm') + ':'"
            prop="algorithm_id"
            class="mgb20"
          >
            <cb-select
              v-model="model.algorithm_id"
              :placeholder="$t('assessment.inputSelect')"
              :class="
                getI18Nn().locale == 'en-US'
                  ? 'select-style-en'
                  : 'select-style'
              "
            >
              <cb-option
                :class="
                  getI18Nn().locale == 'en-US'
                    ? 'select-style-en'
                    : 'select-style'
                "
                :title="item.name"
                v-for="item in aggAlgorithmOption"
                :key="item.eval_algorithm_id"
                :label="item.name"
                :value="item.eval_algorithm_id"
                :hidden="!!item.hidden"
              />
            </cb-select>
          </cb-form-item>
        </cb-col>
      </cb-row>
      <!-- 聚合算法关联的参数数据 -->
      <cb-row :gutter="5">
        <cb-col
          v-for="(item, index) in model.indexParamForm"
          :key="item.param_name"
          :gutter="24"
        >
          <cb-form-item
            :prop="'indexParamForm.' + index + '.default_value'"
            :label="item.param_name"
            :title="item.desc"
            class="mgb20 elc-form-item-dialog"
            :rules="requireRules(item)"
          >
            <cb-col :span="24">
              <cb-input
                v-if="item.param_type !== '2'"
                v-model="item.default_value"
                :placeholder="$t('assessment.inputRequire')"
                class="elc-input"
              />
            </cb-col>
            <cb-col :span="24">
              <cb-radio-group
                v-model="item.default_value"
                v-if="item.param_type === '2'"
              >
                <cb-radio :label="true.toString()">true</cb-radio>
                <cb-radio :label="false.toString()">false</cb-radio>
              </cb-radio-group>
            </cb-col>
          </cb-form-item>
        </cb-col>
      </cb-row>
      <!-- 关联二级指标 -->
      <cb-form-item
        :label="$t('assessment.associatedSecondary') + ':'"
        prop="children_ids"
        class="mgb20"
      >
        <cb-select
          v-model="model.children_ids"
          multiple
          class="elc-input elc-input-select-multiple"
          style="width: 100%"
          :placeholder="$t('assessment.inputSelect')"
        >
          <cb-option
            v-for="item in assVariableOption"
            :class="
              getI18Nn().locale == 'en-US' ? 'select-style-en' : 'select-style'
            "
            :title="item.label"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </cb-select>
      </cb-form-item>
    </cb-form>

    <!-- 底部按钮 -->
    <span slot="footer" class="dialog-footer">
      <div class="form-button-bar">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" @click="submit"></cb-button>
          <cb-button button-type="cancel" @click="cancel"></cb-button>
        </cb-button-group>
      </div>
    </span>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import { getI18N } from '@cyber/helper';
export default {
  name: 'AssessmentDialog',
  props: {
    schemeId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      originalAggregation: [],
      allAlgorithmOption: [],
      edit: false,
      dialogVisible: false,
      assVariableOption: [],
      aggAlgorithmOption: [],
      model: {
        indexParamForm: [],
        index_id: '',
        name: '',
        algorithm_id: '',
        params: '',
        children_ids: [],
      },
      rules: {
        algorithm_id: [
          {
            required: true,
            message: this.$t('assessment.inputSelect'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  watch: {
    'model.algorithm_id': {
      handler(val, oldval) {
        if (val) {
          let newData = _.find(this.aggAlgorithmOption, (ele) => {
            return ele.eval_algorithm_id === val;
          });
          if (!newData) {
            newData = _.find(this.allAlgorithmOption, (ele) => {
              return ele.eval_algorithm_id === val;
            });
            newData.hidden = true;
            this.aggAlgorithmOption.push(newData);
          }
          const param = newData.params;
          this.model.indexParamForm = [];
          if (param) {
            const data = param;
            _.each(data, (ele, index) => {
              if (!this.edit) {
                ele.default_value = ele.default_value || '';
              } else {
                if (this.model.params) {
                  try {
                    const valueArray = JSON.parse(this.model.params);
                    ele.default_value = valueArray[index].default_value;
                  } catch (error) {
                    // console.log(error);
                  }
                } else {
                  ele.default_value = ele.default_value || '';
                }
              }
              this.model.indexParamForm.push(ele);
            });
            this.model.params = '';
          }
        } else {
          this.model.indexParamForm = [];
          this.model.params = '';
        }
      },
      deep: true,
    },
  },
  mounted() {},
  created() {},
  methods: {
    //参数数据校验
    requireRules(ele) {
      switch (Number(ele.param_type)) {
        case 0:
          return {
            required: true,
            trigger: 'blur',
            validator: this.checkNumber,
          };
        case 1:
          return {
            required: true,
            trigger: 'blur',
            validator: this.checkString,
          };
        case 2:
          return {
            required: true,
            trigger: 'blur',
            validator: this.checkBoolean,
          };
        case 3:
          return {
            required: true,
            trigger: 'blur',
            validator: this.checkIp,
          };

        default:
          break;
      }
    },
    // 数字校验
    checkNumber(rule, value, callback) {
      if (!value || isNaN(value)) {
        return callback(new Error(this.$t('assessment.paramDefaultError')));
      } else {
        callback();
      }
    },
    // bool校验
    checkBoolean(rule, value, callback) {
      if (!value) {
        return callback(new Error(this.$t('assessment.paramDefaultError')));
      } else {
        callback();
      }
    },
    // string校验
    checkString(rule, value, callback) {
      if (!value) {
        return callback(new Error(this.$t('assessment.paramDefaultError')));
      } else {
        callback();
      }
    },
    // ip校验
    checkIp(rule, value, callback) {
      const ipRexp = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
      if (!ipRexp.test(value)) {
        value.match(ipRexp);
        if (
          !(
            RegExp.$1 <= 255 &&
            RegExp.$1 > 0 &&
            RegExp.$2 <= 255 &&
            RegExp.$2 >= 0 &&
            RegExp.$3 <= 255 &&
            RegExp.$3 >= 0 &&
            RegExp.$4 <= 255 &&
            RegExp.$4 >= 0
          )
        ) {
          callback(new Error(this.$t('assessment.paramDefaultError')));
        }
      } else {
        callback();
      }
    },
    getI18Nn() {
      return getI18N();
    },
    cancel() {
      this.dialogVisible = false;
      this.model.children_ids = this.originalAggregation;
    },
    submit() {
      const that = this;
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          // const option = _.find(
          //   that.aggAlgorithmOption,
          //   (item) => item.eval_algorithm_id === that.model.algorithm_id,
          // );
          // const indexData = _.map(this.model.indexParamForm, (ele) => {
          //   return ele.default_value;
          // });
          // this.model.params = indexData.join(',');
          this.model.params = JSON.stringify(this.model.indexParamForm);
          that.$emit('assessment-change', this.edit, this.model);
          that.dialogVisible = false;
        } else {
          return;
        }
      });
    },
  },
};
</script>
<style lang="scss"></style>
<style lang="scss" scoped>
.mgb20 {
  margin-bottom: 20px;
}
.one-overflow {
  cursor: pointer;
}
.select-style-en {
  width: 354px !important;
}
.select-style {
  width: 412px !important;
}
</style>
