<template>
  <cb-inner-page :background="false">
    <div class="box-card">
      <!-- 指标体系新增编辑页 -->
      <cb-form
        ref="addFromRef"
        :model.sync="model"
        :rules="rules"
        :url="url"
        :resourceId="resourceId && { resource_id: resourceId }"
        baseURL="/api/ojj"
        class="base-form"
        :label-width="getI18Nn().locale == 'en-US' ? '150px' : '120px'"
        :method="method"
        json
      >
        <div class="info-area">
          <div class="title">{{ $t('assessment.basicInformation') }}</div>
          <!-- 指标体系名称 -->
          <cb-form-item
            :label="$t('assessment.indicatorsName') + ':'"
            prop="name"
          >
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
        </div>

        <!-- 方案 -->
        <div class="plan-area">
          <div class="title">
            <span>{{ $t('assessment.plan') }}</span>

            <!-- 指标体系方案 -->
            <indicators-plan
              :title="model.title"
              style="margin-left: 20px; margin-top: 20px"
              ref="diagramFormRef"
              :resourceId="resourceId"
            ></indicators-plan>
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
import IndicatorsPlan from './indicators-plan';
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
    IndicatorsPlan,
  },
  data() {
    return {
      method: 'post',
      title: '',
      url: '/cr/eval/system',
      delFlag: false,
      schemeId: this.resourceId,
      // id: this.resourceId,
      connlist: [],
      third_indexes: [],
      second_indexes: [],
      first_indexes: [],
      model: {
        name: '',
        description: '',
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
      },
    };
  },
  watch: {},
  computed: {},
  created() {
    //resourceId判断是不是编辑
    //  if (this.resourceId) {
    if (this.resourceId) {
      this.$request
        .get('/cr/eval/algorithm/type', { type: 4 }, { baseURL: '/api/ojj' })
        .then((res) => {
          const data = _.get(res, 'data.data');
          this.$nextTick(() => {
            this.$refs.diagramFormRef.aggAlgorithmOption = data;
            this.editGetFormData();
          });
        })
        .catch(() => {});
      // this.editGetFormData();
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
        const first_indexes = this.$refs.diagramFormRef.first_indexes;
        //因为指标项只有一个,所以此处遍历没有问题
        this.$refs.diagramFormRef.first_indexes = first_indexes.map((item) => {
          return {
            ...item,
            name: this.title,
          };
        });
      } else {
        this.$refs.diagramFormRef.first_indexes.edit = false;
        const fetchRedHostReqId = U.guid();
        if (this.$refs.diagramFormRef.first_indexes.length > 0) {
          this.$refs.diagramFormRef.first_indexes = [
            {
              ...this.$refs.diagramFormRef.first_indexes[0],
              name: this.title,
            },
          ];
        } else {
          this.$refs.diagramFormRef.first_indexes = [
            {
              index_id: fetchRedHostReqId,
              name: this.title,
              algorithm_id: '',
              params: '',
              children_ids: [],
            },
          ];
        }
      }
    },
    editGetFormData() {
      // 编辑获取接口数据
      this.$request
        .get(
          '/cr/eval/system',
          { resource_id: this.resourceId },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', '');
          this.model.name = _.get(data, 'name', '');
          this.model.description = _.get(data, 'description', '');
          const list = [];
          const first_indexes = _.get(data, 'first_indexes');
          let second_indexes = _.get(data, 'second_indexes');
          let third_indexes = _.get(data, 'third_indexes');
          let third_indexesObj = {};
          third_indexes.forEach((item) => {
            third_indexesObj[item.index_id] = item.eval_indicator_id;
          });

          second_indexes = second_indexes.map((item) => {
            return {
              ...item,
              children_ids: item.children_ids.map((ele) => {
                return third_indexesObj[ele];
              }),
            };
          });
          third_indexes = third_indexes.map((item) => {
            return {
              ...item,
              index_id: item.eval_indicator_id,
            };
          });
          // 一级指标连线

          first_indexes.forEach((element, index) => {
            list.push({
              sourceNodeId: element.index_id,
              targetNodeId: element.algorithm_id + '-' + element.name,
            });
            element.children_ids.forEach((item) => {
              list.push({
                sourceNodeId: element.algorithm_id + '-' + element.name,
                targetNodeId: item,
              });
            });
          });
          // 二级指标连线
          second_indexes.forEach((element, index) => {
            list.push({
              sourceNodeId: element.index_id,
              targetNodeId: element.algorithm_id + '-' + element.name + '-2',
            });
            element.children_ids.forEach((item) => {
              list.push({
                sourceNodeId: element.algorithm_id + '-' + element.name + '-2',
                targetNodeId: item,
              });
            });
          });
          this.$refs.diagramFormRef.connlist = list;
          // this.$refs.diagramFormRef.connlist = JSON.parse(_.get(data,'connlist'));
          this.$refs.diagramFormRef.third_indexes = third_indexes;
          this.$refs.diagramFormRef.second_indexes = second_indexes;
          this.$refs.diagramFormRef.first_indexes = _.get(
            data,
            'first_indexes',
          );
          this.$refs.diagramFormRef.reloadData();
        });

      setTimeout(() => {}, 100);
    },
    variabledsValid(data, connlist) {
      const that = this;
      return new Promise(function (resolve, reject) {
        let index = 0;
        _.each(data, (item) => {
          const variablesNode = _.find(connlist, (ele) => {
            return item.index_id === ele.targetNodeId;
          });
          if (variablesNode) {
            index = index + 1;
          }
        });
        if (index === data.length) {
          resolve();
        } else {
          that.$message.error(that.$t('assessment.thirdIndicatorsMsg'));
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
            return item.index_id === ele.sourceNodeId;
          });
          const indexTargetNode = _.find(connlist, (ele) => {
            return item.index_id === ele.targetNodeId;
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
          that.$message.error(that.$t('assessment.secondIndicatorsMsg'));
        }
      });
    },
    itemsValid(data, connlist) {
      const that = this;
      return new Promise(function (resolve, reject) {
        let index = 0;
        _.each(data, (item) => {
          const itemsNode = _.find(connlist, (ele) => {
            return item.index_id === ele.sourceNodeId;
          });
          if (itemsNode) {
            index = index + 1;
          }
        });
        if (index === data.length) {
          resolve();
        } else {
          that.$message.error(that.$t('assessment.firstIndicatorsMsg'));
        }
      });
    },
    // 点击确定新增
    save() {
      const connlist = this.$refs.diagramFormRef.connlist;
      const third_indexes = this.$refs.diagramFormRef.third_indexes;
      const second_indexes = this.$refs.diagramFormRef.second_indexes;
      const first_indexes = this.$refs.diagramFormRef.first_indexes;
      // if (third_indexes.length === 0) {
      //   this.$message.error(this.$t('assessment.newThird'));
      //   return false;
      // } else if (second_indexes.length === 0) {
      //   this.$message.error(this.$t('assessment.newSecond'));
      //   return false;
      // } else if (first_indexes.length === 0) {
      //   this.$message.error(this.$t('assessment.newFirst'));
      //   return false;
      // }
      this.$refs['addFromRef'].validate((valid) => {
        if (valid) {
          if (second_indexes.length === 0) {
            this.$message.error(this.$t('assessment.newSecond'));
            return false;
          } else if (third_indexes.length === 0) {
            this.$message.error(this.$t('assessment.newThird'));
            return false;
          }
          this.itemsValid(first_indexes, connlist).then(() => {
            //一级
            this.indexValid(second_indexes, connlist).then(() => {
              //二级校验
              this.variabledsValid(third_indexes, connlist).then(() => {
                // 三级指标
                this.model.eval_system_id = first_indexes[0].index_id;
                this.model.third_indexes = third_indexes.map((item) => {
                  return {
                    ...item,
                    children_ids: [],
                    algorithm_id: '',
                    eval_system_id: first_indexes[0].index_id,
                    params: '',
                  };
                });
                // 二级指标
                this.model.second_indexes = second_indexes.map((item) => {
                  return {
                    ...item,
                    eval_system_id: first_indexes[0].index_id, //取一级的id ?(是不是固定的一级id)
                  };
                });
                // 一级指标
                this.model.first_indexes = first_indexes.map((item) => {
                  return {
                    ...item,
                    eval_system_id: first_indexes[0].index_id, //取一级的id ?(是不是固定的一级id)
                  };
                });
                this.model.connlist = JSON.stringify(connlist);
                this.$refs.addFromRef.submit().then(() => {
                  this.$router.push({ path: '/admin/assessment-indicators' });
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
      this.$router.push({ path: '/admin/assessment-indicators' });
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
.form-button-bar {
  margin-bottom: 20px;
}
</style>
