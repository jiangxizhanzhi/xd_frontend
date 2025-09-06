<template>
  <cb-inner-page :background="false">
    <div class="form-content">
      <cb-form
        class="base-form"
        ref="formRef"
        :label-width="getI18Nn().locale == 'en-US' ? '150px' : '100px'"
        :model.sync="model"
        :rules="rules"
        :url="url"
        :id="id && { resource_id: id }"
        baseURL="/api/ojj"
        json
      >
        <div class="info-area">
          <div class="title">{{ $t('test.basicInfo') }}</div>
          <!-- 记录名称-->
          <cb-form-item :label="$t('test.recordName') + ':'" prop="name">
            <cb-input v-model="model.name" />
          </cb-form-item>
          <!-- 记录描述 -->
          <cb-form-item :label="$t('test.recordDesc') + ':'" prop="description">
            <cb-input v-model="model.description" type="textarea" />
          </cb-form-item>
          <!-- 指标体系 -->
          <cb-form-item
            :label="$t('test.indicatorSystem') + ':'"
            prop="system_id"
            class="setSelect"
          >
            <cb-select
              v-model="model.system_id"
              @change="changeInput"
              style="width: 100%"
              :popper-append-to-body="false"
            >
              <cb-option
                v-for="item in dataArr"
                :key="item.resource_id"
                :label="item.name"
                :value="item.resource_id"
                :title="item.name"
              >
              </cb-option>
            </cb-select>
          </cb-form-item>

          <!-- 评估阶段 -->
          <div style="display: flex; width: 100%">
            <!-- 开始时间 -->
            <div style="width: 75%">
              <cb-form-item
                :label="$t('test.evaluationPhase') + ':'"
                prop="start_time"
              >
                <cb-select
                  v-model="model.start_time"
                  style="width: 100%"
                  :placeholder="$t('assessment.startAction')"
                  :popper-append-to-body="false"
                >
                  <cb-option
                    v-for="item in timeData"
                    :key="item.end_time"
                    :label="
                      item.title +
                      '\xa0' +
                      '\xa0' +
                      '\xa0' +
                      '\xa0' +
                      item.end_time
                    "
                    :value="item.end_time"
                  />
                </cb-select>
              </cb-form-item>
            </div>
            <div
              :class="
                getI18Nn().locale === 'en-US' ? 'to_title_en' : 'to_title'
              "
            >
              {{ $t('assessment.to') }}
            </div>
            <!-- 结束时间 -->
            <div style="width: 75%">
              <cb-form-item
                prop="end_time"
                :class="
                  getI18Nn().locale === 'en-US' ? 'end_input_en' : 'end_input'
                "
              >
                <cb-select
                  v-model="model.end_time"
                  style="width: 100%"
                  :placeholder="$t('assessment.endAction')"
                  :popper-append-to-body="false"
                >
                  <cb-option
                    v-for="item in timeData"
                    :key="item.end_time"
                    :label="
                      item.title +
                      '\xa0' +
                      '\xa0' +
                      '\xa0' +
                      '\xa0' +
                      item.end_time
                    "
                    :value="item.end_time"
                  />
                </cb-select>
              </cb-form-item>
            </div>
          </div>
        </div>
        <!-- 设置数据源 -->
        <div class="plan-area">
          <div class="title">{{ $t('assessment.sourceData') }}</div>
          <EvaluationDataSource
            :treeData="treeData"
            ref="dataSourceRef"
            :id="this.id"
            :task_id="task_id"
          />
        </div>
        <!-- 底部按钮 -->
        <template slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button button-type="confirm" @click="submitForm"></cb-button>
            <cb-button button-type="cancel" @click="resetForm"></cb-button>
          </cb-button-group>
        </template>
      </cb-form>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import { getI18N } from '@cyber/helper';
import EvaluationDataSource from './evaluation-data-source.vue';
import Validate from '@/utils/validate.js';
export default {
  name: 'AlgorithmDetail',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {
    EvaluationDataSource,
  },
  data() {
    return {
      url: '/cr/eval/record',
      task_id: '',
      disable: false,
      dataArr: [],
      treeData: [],
      timeData: [],
      resSystem_id: '',
      resTreeData: [],
      model: {
        name: null,
        description: null,
        system_id: '', //指标体系
        start_time: '', //开始时间
        end_time: '', //结束时间',
      },
      error: '',
      rules: {
        // 名称1-255
        name: [
          {
            required: true,
            message: this.$t('assessment.requireName'),
            trigger: 'blur',
          },
          // 1-255
          { validator: Validate.name255, trigger: 'blur' },
        ],
        // 描述1-2048
        description: [{ validator: Validate.desc2048, trigger: 'blur' }],

        system_id: [
          {
            required: true,
            message: this.$t('assessment.requireSelect'),
            trigger: 'blur',
          },
        ],
        start_time: [
          {
            required: true,
            trigger: ['change', 'blur'],
            validator: this.checkStartTime,
          },
        ],
        end_time: [
          {
            required: true,
            trigger: ['change', 'blur'],
            validator: this.checkEndTime,
          },
        ],
      },
    };
  },
  watch: {},
  computed: {},
  created() {
    //靶场测评列表详情
    this.detail_id = this.$route.params.templateId; //detail_id
    this.task_id = this.$route.query.task_id; //task_id

    //获取评估阶段数据
    this.$request
      .get(
        '/cr/eval/task/time_nodes',
        {
          template_id: this.detail_id,
          task_id: this.task_id,
        },
        { baseURL: '/api/ojj' },
      )
      .then((res) => {
        this.timeData = res.data.data.data;
      });
    // 获取指标体系数据
    this.$request
      .get('/cr/eval/system/list', { per_page: 5000 }, { baseURL: '/api/ojj' })
      .then((res) => {
        this.dataArr = res.data.data.list; //[]
      });
    if (this.id) {
      //编辑
      this.$request
        .get(
          '/cr/eval/record',
          { resource_id: this.id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.model = res.data.data;
          this.resSystem_id = res.data.data.system_id;
          this.resTreeData = JSON.parse(JSON.stringify(res.data.data.indexes));
          //给树结构传值
          this.treeData = JSON.parse(JSON.stringify(res.data.data.indexes));
        });
    }
  },
  mounted() {},
  methods: {
    checkStartTime(rule, value, callback) {
      if (!value) {
        return callback(new Error(this.$t('assessment.selectStartTime')));
      }

      if (this.model.end_time) {
        if (Date.parse(value) >= Date.parse(this.model.end_time)) {
          callback(new Error(this.$t('assessment.requireStart')));
        } else {
          this.$refs['formRef'].clearValidate(['end_time']);
          callback();
        }
      } else {
        this.$refs['formRef'].clearValidate(['end_time']);
        callback();
      }
    },
    checkEndTime(rule, value, callback) {
      if (!value) {
        return callback(new Error(this.$t('assessment.selectEndTime')));
      }

      if (this.model.start_time) {
        if (Date.parse(value) <= Date.parse(this.model.start_time)) {
          callback(new Error(this.$t('assessment.requireEnd')));
        } else {
          this.$refs['formRef'].clearValidate(['start_time']);
          callback();
        }
      } else {
        this.$refs['formRef'].clearValidate(['start_time']);
        callback();
      }
    },
    getI18Nn() {
      return getI18N();
    },
    // 选择指标体系下拉框数据
    changeInput(val) {
      this.resource_id = val;
      // 获取树结构数据1级2级3级接口
      this.$request
        .get(
          '/cr/eval/system_tree',
          { resource_id: this.resource_id },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.treeData = [{ ...res.data.data }];

          if (val !== this.resSystem_id) {
            this.$refs.dataSourceRef.changeSystemId = true;
          } else {
            this.$refs.dataSourceRef.changeSystemId = false;
            this.treeData = JSON.parse(JSON.stringify(this.resTreeData));
          }
        });
    },

    submitForm() {
      let indexes = JSON.parse(
        JSON.stringify(this.$refs.dataSourceRef.evaluationDataArr),
      );
      indexes.forEach((item) => {
        delete item.indexes;
        delete item.level;
        delete item.third_level_type;
        delete item.name;
      });
      this.model.indexes = indexes;
      this.model.task_id = this.task_id;

      //判断数据源是不是全部都填写了
      let judgeResult = false;
      indexes.forEach((item) => {
        if (this.judgeEvaluation(item.resource_id)) {
          judgeResult = true;
        }
      });
      if (judgeResult) {
        this.$message.error(this.$t('assessment.dataSource'));

        return;
      }

      // 点击确定跳转
      this.$refs.formRef
        .submit()
        .then(() => {
          // this.$router.push({ path: `/range-test/detail/${this.detail_id}` });
          this.$router.push({
            path: `/range-test/detail/${this.detail_id}?task_id=${this.task_id}`,
            query: { activeName: '评估' },
          });
        })
        .catch((err) => {});
    },
    judgeEvaluation(resource_id) {
      //选择系统评分检测数据是否都填了
      let judgeResult = false;
      const findEvaluationData = this.model.indexes.find((item) => {
        return item.resource_id === resource_id;
      });
      if (findEvaluationData && Object.keys(findEvaluationData).length > 0) {
        if (findEvaluationData.type === 1) {
          findEvaluationData.variables.forEach((item) => {
            if (item.device_id === '' || item.probe_id === '') {
              judgeResult = true;
            }
          });
        } else {
          //选择专家评分检测数据是否都填了
          if (findEvaluationData.specialist.value === '') {
            judgeResult = true;
          }
        }
      }
      return judgeResult;
    },
    // 取消
    resetForm() {
      //  this.$router.push({ path: `/range-test/detail/${this.detail_id}` });
      this.$router.push({
        path: `/range-test/detail/${this.detail_id}?task_id=${this.task_id}`,
        query: { activeName: '评估' },
      });
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
.base-form {
  ::v-deep.el-form,
  .el-form--label-right {
    padding: 0 0;
  }
}

.to_title {
  position: relative;
  top: 10px;
  left: 50px;
}
.to_title_en {
  position: relative;
  top: 10px;
  left: 70px;
}
::v-deep.setSelect {
  .el-select-dropdown {
    transform: translateX(-5px);
  }
  .el-scrollbar {
    .el-select-dropdown__wrap {
      .el-scrollbar__view {
        width: 1684px;
      }
    }
  }
}
.info-area {
  background: var(--bg-color-2);
  padding: 20px 20px 0 0;
  margin-bottom: 20px;
}
.plan-area {
  background: var(--bg-color-2);
  padding: 20px 20px 60px 0;
}
</style>
