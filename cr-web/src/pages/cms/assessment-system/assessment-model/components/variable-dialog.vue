<template>
  <!-- 新增采集变量项/编辑采集变量项页面 -->
  <cb-dialog
    v-if="dialogVisible"
    :title="edit ? $t('assessment.edit') : $t('assessment.add')"
    :visible.sync="dialogVisible"
    width="600px"
    height="300px"
  >
    <cb-form
      ref="ref"
      :model="model"
      :rules="rules"
      :label-width="getI18Nn().locale == 'en-US' ? '150px' : '110px'"
      json
    >
      <!-- 变量名称 -->
      <cb-form-item
        :label="$t('assessment.variableName') + ':'"
        prop="name"
        :class="getI18Nn().locale == 'en-US' ? 'name-en' : 'mgb20'"
      >
        <cb-input
          v-model="model.name"
          class="cyber-input elc-input show-limit-input"
          :placeholder="$t('assessment.inputName')"
        />
      </cb-form-item>
      <cb-row :gutter="24">
        <cb-col :span="12">
          <!-- 格式化算法 -->
          <cb-form-item
            :label="$t('assessment.formatAlgorithm') + ':'"
            prop="format_algorithm_id"
            class="mgb20"
          >
            <cb-select
              v-model="model.format_algorithm_id"
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
                v-for="item in dataFormatOption"
                :key="item.eval_algorithm_id"
                :label="item.name"
                :value="item.eval_algorithm_id"
                :hidden="!!item.hidden"
              />
            </cb-select>
          </cb-form-item>
        </cb-col>
      </cb-row>
      <cb-row :gutter="5">
        <cb-col
          v-for="(item, index) in model.formatParamForm"
          :key="item.param_name"
          :gutter="24"
        >
          <cb-form-item
            :label="item.param_name"
            :prop="'formatParamForm.' + index + '.default_value'"
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
      <cb-row :gutter="24">
        <cb-col :span="12">
          <!-- 检测算法 -->
          <cb-form-item
            prop="detection_algorithm_id"
            :label="$t('assessment.detectionAlgorithm') + ':'"
            class="mgb20"
          >
            <cb-select
              v-model="model.detection_algorithm_id"
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
                v-for="item in detectionModelOption"
                :key="item.eval_algorithm_id"
                :label="item.name"
                :value="item.eval_algorithm_id"
                :hidden="!!item.hidden"
              />
            </cb-select>
          </cb-form-item>
        </cb-col>
      </cb-row>
      <cb-row :gutter="5">
        <cb-col
          v-for="(item, index) in model.detectionParamForm"
          :key="item.param_name"
          :gutter="24"
        >
          <cb-form-item
            :label="item.param_name"
            :prop="'detectionParamForm.' + index + '.default_value'"
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
      <cb-row :gutter="24">
        <cb-col :span="12">
          <!-- 评分算法 -->
          <cb-form-item
            prop="score_algorithm_id"
            :label="$t('assessment.scoreAlgorithm') + ':'"
            class="mgb20"
          >
            <cb-select
              v-model="model.score_algorithm_id"
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
                v-for="item in scoringModelOption"
                :key="item.eval_algorithm_id"
                :label="item.name"
                :value="item.eval_algorithm_id"
                :hidden="!!item.hidden"
              />
            </cb-select>
          </cb-form-item>
        </cb-col>
      </cb-row>
      <cb-row :gutter="5">
        <cb-col
          v-for="(item, index) in model.markParamFrom"
          :key="item.param_name"
          :gutter="24"
        >
          <cb-form-item
            :prop="'markParamFrom.' + index + '.default_value'"
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
import { validateStageName } from '@/utils/rules-cms';
import { getI18N } from '@cyber/helper';

export default {
  name: 'VariableDialog',
  props: {
    schemeId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      edit: false,
      dataFormatOption: [],
      detectionModelOption: [],
      scoringModelOption: [],
      allAlgorithmOption: [],
      dialogVisible: false,
      model: {
        formatParamForm: [],
        detectionParamForm: [],
        markParamFrom: [],
        eval_collection_id: '',
        name: '',
        format_algorithm_id: '', //格式化算法
        detection_algorithm_id: '', //检测算法
        score_algorithm_id: '', //评分算法
        format_algorithm_params: '', //格式化算法参数
        detection_algorithm_params: '', //检测算法参数
        score_algorithm_params: '', //评分算法参数
      },
      // rules
      rules: {
        // 变量名称1-255
        name: [
          {
            required: true,
            message: this.$t('assessment.inputName'),
            trigger: 'blur',
          },
          // 1-255
          { validator: validateStageName, trigger: 'blur' },
        ],
        // 格式化算法
        format_algorithm_id: [
          {
            required: true,
            message: this.$t('assessment.inputSelect'),
            trigger: 'blur',
          },
        ],
        // 检测算法 3
        detection_algorithm_id: [
          {
            required: true,
            message: this.$t('assessment.inputSelect'),
            trigger: 'blur',
          },
        ],
        // 评分算法
        score_algorithm_id: [
          {
            required: true,
            message: this.$t('assessment.inputSelect'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {},
  watch: {
    // 格式化算法
    'model.format_algorithm_id': {
      handler(val, oldval) {
        if (val) {
          let newData = _.find(this.dataFormatOption, (ele) => {
            return ele.eval_algorithm_id === val;
          });
          if (!newData) {
            newData = _.find(this.allAlgorithmOption, (ele) => {
              return ele.eval_algorithm_id === val;
            });
            //push进去找到原数据
            newData.hidden = true;
            this.dataFormatOption.push(newData);
          }
          const param = newData.params;

          this.model.formatParamForm = [];
          if (param) {
            const data = param;
            _.each(data, (ele, index) => {
              if (!this.edit) {
                ele.default_value = ele.default_value || '';
              } else {
                if (this.model.format_algorithm_params) {
                  try {
                    const valueArray = JSON.parse(
                      this.model.format_algorithm_params,
                    );
                    ele.default_value = valueArray[index].default_value;
                  } catch (error) {}
                } else {
                  ele.default_value = ele.default_value || '';
                }
              }
              this.model.formatParamForm.push(ele);
            });
            this.model.format_algorithm_params = '';
          }
        } else {
          this.model.formatParamForm = [];
          this.model.format_algorithm_params = '';
        }
      },
      deep: true,
    },
    // 检测算法
    'model.detection_algorithm_id': {
      handler(val, oldval) {
        if (val) {
          let newData = _.find(this.detectionModelOption, (ele) => {
            return ele.eval_algorithm_id === val;
          });
          if (!newData) {
            newData = _.find(this.allAlgorithmOption, (ele) => {
              return ele.eval_algorithm_id === val;
            });
            //push进去找到原数据
            newData.hidden = true;
            this.detectionModelOption.push(newData);
          }
          const param = newData.params;
          this.model.detectionParamForm = [];
          if (param) {
            const data = param;
            _.each(data, (ele, index) => {
              if (!this.edit) {
                ele.default_value = ele.default_value || '';
              } else {
                if (this.model.detection_algorithm_params) {
                  try {
                    const valueArray = JSON.parse(
                      this.model.detection_algorithm_params,
                    );
                    ele.default_value = valueArray[index].default_value;
                  } catch (error) {}
                } else {
                  ele.default_value = ele.default_value || '';
                }
              }
              this.model.detectionParamForm.push(ele);
            });
            this.model.detection_algorithm_params = '';
          }
        } else {
          this.model.detectionParamForm = [];
          this.model.detection_algorithm_params = '';
        }
      },
      deep: true,
    },
    // 评分算法
    'model.score_algorithm_id': {
      handler(val, oldval) {
        if (val) {
          let newData = _.find(this.scoringModelOption, (ele) => {
            return ele.eval_algorithm_id === val;
          });
          if (!newData) {
            newData = _.find(this.allAlgorithmOption, (ele) => {
              return ele.eval_algorithm_id === val;
            });
            //push进去找到原数据
            newData.hidden = true;
            this.scoringModelOption.push(newData);
          }
          const param = newData.params;
          this.model.markParamFrom = [];
          if (param) {
            const data = param;
            _.each(data, (ele, index) => {
              this.rules[ele.param_name] = [
                {
                  required: true,
                  validator: this.markValidator,
                  trigger: 'blur',
                },
              ];
              if (!this.edit) {
                ele.default_value = ele.default_value || '';
              } else {
                if (this.model.score_algorithm_params) {
                  try {
                    const valueArray = JSON.parse(
                      this.model.score_algorithm_params,
                    );
                    ele.default_value = valueArray[index].default_value;
                  } catch (error) {}
                } else {
                  ele.default_value = ele.default_value || '';
                }
              }
              this.model.markParamFrom.push(ele);
            });
            this.model.score_algorithm_params = '';
          }
        } else {
          this.model.markParamFrom = [];
          this.model.score_algorithm_params = '';
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
    },
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.model.detection_algorithm_params = JSON.stringify(
            this.model.detectionParamForm,
          );
          this.model.score_algorithm_params = JSON.stringify(
            this.model.markParamFrom,
          );
          this.model.format_algorithm_params = JSON.stringify(
            this.model.formatParamForm,
          );
          this.$emit('variable-change', this.edit, this.model);
          this.dialogVisible = false;
        } else {
          return;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.mgb20 {
  margin-bottom: 20px;
}
.select-style-en {
  width: 365px !important;
}
.select-style {
  width: 412px !important;
}
.name-en {
  margin-bottom: 30px;
}
</style>
