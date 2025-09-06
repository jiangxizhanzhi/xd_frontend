<template>
  <!-- 新增二级指标,编辑二级指标页面 -->
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
      :label-width="getI18Nn().locale == 'en-US' ? '185px' : '110px'"
    >
      <!-- 指标名称 -->
      <cb-form-item
        :label="$t('assessment.secondName') + ':'"
        prop="name"
        :class="getI18Nn().locale == 'en-US' ? 'name-en' : 'mgb20'"
      >
        <cb-input
          v-model="model.name"
          class="cyber-input elc-input show-limit-input"
          :placeholder="$t('assessment.inputRequireName')"
        />
      </cb-form-item>
      <cb-row :gutter="24">
        <cb-col :span="12">
          <!-- 聚合算法 -->
          <cb-form-item
            :label="$t('assessment.aggregationAlgorithm') + ':'"
            prop="algorithm_id"
            class="mgb20"
          >
            <cb-select
              v-model="model.algorithm_id"
              :class="
                getI18Nn().locale == 'en-US'
                  ? 'select-style-en'
                  : 'select-style'
              "
              :placeholder="$t('assessment.inputSelect')"
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
      <!-- 聚合算法后的参数数据 -->
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
      <!-- 关联三级指标项 -->
      <cb-form-item
        :label="$t('assessment.associatedThird') + ':'"
        prop="children_ids"
        class="mgb20"
      >
        <cb-select
          v-model="model.children_ids"
          multiple
          class="elc-input elc-input-select-multiple"
          :placeholder="$t('assessment.inputSelect')"
          style="width: 100%"
        >
          <cb-option
            :class="
              getI18Nn().locale == 'en-US' ? 'select-style-en' : 'select-style'
            "
            :title="item.label"
            v-for="item in assVariableOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </cb-select>
      </cb-form-item>
    </cb-form>
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
import { validateStageName } from '@/utils/rules-cms';
export default {
  name: 'VariableDialog',
  props: {},
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
        // 聚合项名称1-255
        name: [
          {
            required: true,
            message: this.$t('assessment.inputName'),
            trigger: 'blur',
          },
          { validator: validateStageName, trigger: 'blur' },
        ],
        // 聚合算法校验
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
              this.rules[ele.param_name] = [
                {
                  required: true,
                  validator: this.commonValidator,
                  trigger: 'blur',
                },
              ];
              if (!this.edit) {
                ele.default_value = ele.default_value || '';
              } else {
                if (this.model.params) {
                  try {
                    const valueArray = JSON.parse(this.model.params);
                    ele.default_value = valueArray[index].default_value;
                  } catch (error) {}
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

    checkNumber(rule, value, callback) {
      if (!value || isNaN(value)) {
        return callback(new Error(this.$t('assessment.paramDefaultError')));
      } else {
        callback();
      }
    },
    checkBoolean(rule, value, callback) {
      if (!value) {
        return callback(new Error(this.$t('assessment.paramDefaultError')));
      } else {
        callback();
      }
    },
    checkString(rule, value, callback) {
      if (!value) {
        return callback(new Error(this.$t('assessment.paramDefaultError')));
      } else {
        callback();
      }
    },
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
          this.model.params = JSON.stringify(this.model.indexParamForm);
          that.$emit('indicators-change', this.edit, { ...this.model });
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
.select-style-en {
  width: 334px !important;
}
.select-style {
  width: 412px !important;
}
.name-en {
  margin-bottom: 30px;
}
</style>
