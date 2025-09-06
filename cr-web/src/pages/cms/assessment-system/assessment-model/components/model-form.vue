<template>
  <cb-inner-page :background="false">
    <div class="box-card">
      <!-- 指标项新增编辑页 -->
      <cb-form
        ref="addFromRef"
        :model.sync="model"
        :rules="rules"
        :url="url"
        baseURL="/api/ojj"
        class="base-form"
        :label-width="getI18Nn().locale == 'en-US' ? '150px' : '110px'"
        json
        :method="method"
        :resourceId="resourceId && { resource_id: resourceId }"
      >
        <div class="info-area">
          <div class="title">{{ $t('assessment.basicInformation') }}</div>
          <!-- 指标项名称 -->
          <cb-form-item :label="$t('assessment.thirdName') + ':'" prop="name">
            <cb-input
              ref="getValue"
              @blur="handleChangeTitle"
              v-model="model.name"
              :placeholder="$t('assessment.inputName')"
            />
          </cb-form-item>
          <!-- 描述 -->
          <cb-form-item
            :label="$t('assessment.description') + ':'"
            prop="description"
          >
            <cb-input
              v-model="model.description"
              type="textarea"
              :placeholder="$t('assessment.searchDesc')"
            />
          </cb-form-item>
          <!-- 指标属性 -->
          <!-- 指标属性 {{ this.model.attribute }} -->
          <cb-form-item
            :label="$t('assessment.attribute') + ':'"
            prop="attribute"
            class="radio-style"
          >
            <cb-radio-group v-model="model.attribute">
              <!-- 成本型2,效益型1,固定型3,偏理型4 -->
              <cb-radio
                v-for="option in options"
                :key="option.code"
                :label="option.code"
                :disabled="option.disabled"
                >{{ option.name }}</cb-radio
              >
            </cb-radio-group>
          </cb-form-item>
          <!-- 新增中心值,只有偏理型和固定型才有中心值(正整数)-->
          <cb-form-item
            :label="$t('assessment.attributeValue') + ':'"
            prop="attribute_value"
            v-if="this.model.attribute === 4 || this.model.attribute === 3"
          >
            <cb-input
              v-model="model.attribute_value"
              :placeholder="$t('assessment.positiveInteger')"
            />
          </cb-form-item>
          <!-- 数据类型 -->
          <cb-form-item
            :label="$t('assessment.dataType') + ':'"
            prop="datatype"
            style="position: relative; left: 0px"
            class="radio-style"
          >
            <cb-radio-group v-model="model.datatype">
              <!-- 百分比1,周期2,整数值3 -->
              <cb-radio
                v-for="option in typeOptions"
                :key="option.code"
                :label="option.code"
                :disabled="option.disabled"
                >{{ option.name }}</cb-radio
              >
            </cb-radio-group>
          </cb-form-item>
        </div>

        <!-- 方案 -->
        <div class="plan-area">
          <div class="title">
            <span>{{ $t('assessment.plan') }}</span>

            <!-- 指标方案 -->
            <model-plan
              :title="model.title"
              style="margin-left: 20px; margin-top: 20px"
              ref="diagramFormRef"
            ></model-plan>
          </div>
        </div>
        <div slot="fixedBottom">
          <!-- 底部按钮 -->
          <cb-button-group space="middle">
            <cb-button button-type="confirm" @click="save"></cb-button>
            <cb-button button-type="cancel" @click="cancel"> </cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </div>
  </cb-inner-page>
</template>

<script>
import ModelPlan from './model-plan';
import _ from 'lodash';
import '@/lang/all-lang/index';
import U from '@/utils/utils';
import { getI18N } from '@cyber/helper';
import { validateAssessName, validateDescription } from '@/utils/rules-cms';

export default {
  name: 'IndicatorsDetail',
  props: {
    resourceId: {
      type: String,
      default: '',
    },
  },
  components: {
    ModelPlan,
  },
  data() {
    return {
      method: 'post',
      title: '',
      url: '/cr/eval/indicator',
      delFlag: false,
      options: [],
      typeOptions: [],
      schemeId: this.resourceId,
      // resourceId: this.resourceId,
      connlist: [],
      estimateVariables: [],
      estimateIndexes: [],
      eval_indicators: [],
      model: {
        name: '', //名称
        description: '', //描述
        datatype: '', //数据类型
        attribute: '', //指标属性
        attribute_value: '', //中心值
      },
      rules: {
        // 指标项名称
        name: [
          {
            required: true,
            message: this.$t('assessment.inputName'),
            trigger: 'blur',
          },
          // 1-255
          { validator: validateAssessName, trigger: 'blur' },
        ],
        // 描述1-2048
        description: [{ validator: validateDescription, trigger: 'blur' }],
        //中心值
        attribute_value: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (/^(?:[1-9]\d*)$/.test(value) == false) {
                callback(new Error(this.$t('assessment.positiveInteger')));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
      },
    };
  },
  watch: {
    'model.attribute': {
      handler(newData, old) {
        switch (Number(newData)) {
          case 1: {
            this.model.datatype = 1;
            this.typeOptions = this.typeOptions.map((item) => {
              return {
                ...item,
                disabled: Number(item.code) === 3 ? true : false,
              };
            });
            return;
          }
          case 2: {
            this.model.datatype = 2;
            this.typeOptions = this.typeOptions.map((item) => {
              return {
                ...item,
                disabled:
                  Number(item.code) === 3 || Number(item.code) === 1
                    ? true
                    : false,
              };
            });
            return;
          }
          case 3: {
            this.model.datatype = 3;
            this.typeOptions = this.typeOptions.map((item) => {
              return {
                ...item,
                disabled:
                  Number(item.code) === 1 || Number(item.code) === 2
                    ? true
                    : false,
              };
            });
            return;
          }
          case 4: {
            this.model.datatype = 3;
            this.typeOptions = this.typeOptions.map((item) => {
              return {
                ...item,
                disabled:
                  Number(item.code) === 1 || Number(item.code) === 2
                    ? true
                    : false,
              };
            });
            return;
          }

          default:
            break;
        }
      },
      deep: true,
    },
  },
  computed: {},
  created() {
    // 指标属性type为6
    this.$request
      .get('/cr/common/constants_config', { type: 6 }, { baseURL: '/api/ojj' })
      .then((res) => {
        const data = _.get(res, 'data.data');
        this.options = data.map((item) => {
          return {
            ...item,
            disabled: false,
          };
        });
        this.model = { ...this.model, attribute: data[0].code };
      });
    // 数据类型type为7
    this.$request
      .get('/cr/common/constants_config', { type: 7 }, { baseURL: '/api/ojj' })
      .then((res) => {
        const data = _.get(res, 'data.data');
        this.typeOptions = data.map((item) => {
          return {
            ...item,
            disabled: false,
          };
        });
        this.model = { ...this.model, datatype: data[0].code };
      });
    //resourceId判断是不是编辑
    if (this.resourceId) {
      // 聚合算法 type=4
      this.$request
        .get('/cr/eval/algorithm/type', { type: 4 }, { baseURL: '/api/ojj' })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.$nextTick(() => {
            this.$refs.diagramFormRef.aggAlgorithmOption = data;
            // this.aggAlgorithmOption = data;
            this.editGetFormData();
          });
        })
        .catch(() => {});

      this.delFlag = true;
    } else {
      this.schemeId = U.guid();
      this.delFlag = false;
    }
  },
  mounted() {
    if (this.resourceId) {
      this.method = 'put';
    } else {
      this.method = 'post';
    }
  },
  methods: {
    getI18Nn() {
      return getI18N();
    },
    // 指标项名称失焦获取
    handleChangeTitle() {
      this.title = this.$refs.getValue.value;
      if (this.resourceId) {
        //编辑
        const eval_indicators = this.$refs.diagramFormRef.eval_indicators;
        //因为指标项只有一个,所以此处遍历没有问题
        this.$refs.diagramFormRef.eval_indicators = eval_indicators.map(
          (item) => {
            return {
              ...item,
              name: this.title,
            };
          },
        );
      } else {
        //新增
        this.$refs.diagramFormRef.eval_indicators.edit = false;
        const fetchRedHostReqId = U.guid();

        if (this.$refs.diagramFormRef.eval_indicators.length > 0) {
          this.$refs.diagramFormRef.eval_indicators = [
            {
              ...this.$refs.diagramFormRef.eval_indicators[0],
              name: this.title,
            },
          ];
        } else {
          this.$refs.diagramFormRef.eval_indicators = [
            {
              eval_indicator_id: fetchRedHostReqId,
              name: this.title,
              aggregating_algorithm_id: '',
              aggregating_algorithm_params: '',
              aggregation_ids: [],
            },
          ];
        }
      }
    },
    editGetFormData() {
      // 编辑获取单个接口数据,
      this.$request
        .get(
          '/cr/eval/indicator',
          { resource_id: this.resourceId },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', '');
          this.model.name = _.get(data, 'name', '');
          this.model.description = _.get(data, 'description', '');
          this.model.datatype = _.get(data, 'datatype', '');
          this.model.attribute = _.get(data, 'attribute', '');
          this.model.attribute_value = _.get(data, 'attribute_value', ''); //中心值
          const list = [];
          const eval_indicators = _.get(data, 'eval_indicators');
          const eval_aggregations = _.get(data, 'eval_aggregations');
          eval_indicators.forEach((element) => {
            list.push({
              sourceNodeId: element.eval_indicator_id,
              targetNodeId:
                element.aggregating_algorithm_id + '-' + element.name,
            });
            element.aggregation_ids.forEach((item) => {
              list.push({
                sourceNodeId:
                  element.aggregating_algorithm_id + '-' + element.name,
                targetNodeId: item,
              });
            });
          });
          eval_aggregations.forEach((element, index) => {
            list.push({
              sourceNodeId: element.eval_aggregation_id,
              targetNodeId:
                element.aggregating_algorithm_id + '-' + element.name + '-2',
            });
            element.aggregation_ids.forEach((item) => {
              list.push({
                sourceNodeId:
                  element.aggregating_algorithm_id + '-' + element.name + '-2',
                targetNodeId: item,
              });
            });
          });
          this.$refs.diagramFormRef.connlist = list;

          this.$refs.diagramFormRef.estimateVariables = _.get(
            data,
            'eval_collections',
          );

          this.$refs.diagramFormRef.estimateIndexes = _.get(
            data,
            'eval_aggregations',
          );
          this.$refs.diagramFormRef.eval_indicators = _.get(
            data,
            'eval_indicators',
          );
          this.$refs.diagramFormRef.reloadData();
        });
    },
    variabledsValid(data, connlist) {
      const that = this;
      return new Promise(function (resolve, reject) {
        let index = 0;
        _.each(data, (item) => {
          const variablesNode = _.find(connlist, (ele) => {
            return item.eval_collection_id === ele.targetNodeId;
          });
          if (variablesNode) {
            index = index + 1;
          }
        });
        if (index === data.length) {
          resolve();
        } else {
          that.$message.error(that.$t('assessment.variableMsg'));
        }
      });
    },
    indexValid(data, connlist) {
      const that = this;
      return new Promise(function (resolve, reject) {
        let indexSource = 0;
        let indexTarget = 0;
        _.each(data, (item) => {
          const indexSourceNode = _.find(connlist, (ele) => {
            return item.eval_aggregation_id === ele.sourceNodeId;
          });
          const indexTargetNode = _.find(connlist, (ele) => {
            return item.eval_aggregation_id === ele.targetNodeId;
          });
          if (indexSourceNode) {
            indexSource = indexSource + 1;
          }
          if (indexTargetNode) {
            indexTarget = indexTarget + 1;
          }
        });
        if (indexSource === data.length && indexTarget === data.length) {
          resolve();
        } else {
          that.$message.error(that.$t('assessment.indicatorsMsg'));
        }
      });
    },
    itemsValid(data, connlist) {
      const that = this;
      return new Promise(function (resolve, reject) {
        let index = 0;
        _.each(data, (item) => {
          const itemsNode = _.find(connlist, (ele) => {
            return item.eval_indicator_id === ele.sourceNodeId;
          });
          if (itemsNode) {
            index = index + 1;
          }
        });
        if (index === data.length) {
          resolve();
        } else {
          that.$message.error(that.$t('assessment.evaluationMsg'));
        }
      });
    },
    // 新增指标项确定
    save() {
      const connlist = this.$refs.diagramFormRef.connlist;
      const estimateVariables = this.$refs.diagramFormRef.estimateVariables;
      const estimateIndexes = this.$refs.diagramFormRef.estimateIndexes;
      const eval_indicators = this.$refs.diagramFormRef.eval_indicators;
      // if (estimateVariables.length === 0) {
      //   this.$message.error(this.$t('assessment.variableCreate'));
      //   return false;
      // } else if (estimateIndexes.length === 0) {
      //   this.$message.error(this.$t('assessment.aggregationCreate'));
      //   return false;
      // } else if (eval_indicators.length === 0) {
      //   this.$message.error(this.$t('assessment.indicatorsCreate'));
      //   return false;
      // }
      this.$refs['addFromRef'].validate((valid) => {
        if (valid) {
          if (estimateIndexes.length === 0) {
            this.$message.error(this.$t('assessment.aggregationCreate'));
            return false;
          } else if (estimateVariables.length === 0) {
            this.$message.error(this.$t('assessment.variableCreate'));
            return false;
          }
          this.itemsValid(eval_indicators, connlist).then(() => {
            // 指标项连线校验
            this.indexValid(estimateIndexes, connlist).then(() => {
              // 聚合项连线校验
              this.variabledsValid(estimateVariables, connlist).then(() => {
                // 变量项连线校验

                this.model.eval_indicator_id =
                  eval_indicators[0].eval_indicator_id;
                //二级三级,服务端让加eval_indicator_id
                this.model.eval_collections = estimateVariables.map((item) => {
                  return {
                    ...item,
                    eval_indicator_id: eval_indicators[0].eval_indicator_id,
                    // collection_ids:item.aggregation_ids
                  };
                });
                this.model.eval_aggregations = estimateIndexes.map((item) => {
                  return {
                    ...item,
                    eval_indicator_id: eval_indicators[0].eval_indicator_id,
                  };
                });
                this.model.eval_indicators = eval_indicators;
                this.model.connlist = JSON.stringify(connlist);
                this.$refs.addFromRef.submit().then(() => {
                  this.$router.push({ path: '/admin/assessment-model' });
                });
              });
            });
          });
        } else {
          return;
        }
      });
    },
    // 取消
    cancel() {
      this.$router.push({ path: '/admin/assessment-model' });
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  line-height: 24px;
  color: var(--neutral8);
  margin-bottom: 20px;
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 8px;
    vertical-align: middle;
    background: var(--primary-color);
    margin: -2px 8px 0 16px;
  }
}
.radio-style {
  ::v-deep .el-form-item__label {
    position: relative;
    top: -2px;
  }
}
.cb-inner-page {
  padding-top: 0px;
}
.box-card {
  padding-right: 16px;
  ::v-deep .el-form {
    padding: 0px 0px 20px 0px;
  }
}
.info-area {
  background: var(--bg-color-2);
  padding: 20px 20px 1px 0px;
  margin-bottom: 20px;
}
.plan-area {
  background: var(--bg-color-2);
  padding: 20px 20px 1px 0px;
}
</style>
