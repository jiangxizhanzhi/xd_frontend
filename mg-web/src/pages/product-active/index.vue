<template>
  <div class="product-active">
    <div class="background-effect"></div>
    <!-- 主体 -->
    <div class="active-form-container">
      <!-- 表格 -->
      <div class="active-form">
        <div class="active-form__head">
          {{ $t('activation.productActive') }}
        </div>
        <cb-form
          ref="activeFormRef"
          url="/sys/activation"
          baseURL="/api/mp"
          :model.sync="model"
          :rules="rules"
          label-width="130px"
          json
          class="active-from__cb-form"
        >
          <!-- 磁盘序列号 -->
          <cb-form-item :label="$t('activation.machineCode')">
            <div class="machine-code">{{ this.model.machine_code }}</div>
          </cb-form-item>
          <!-- 授权期限 -->
          <cb-form-item
            :label="$t('activation.authorizationTerm')"
            prop="deadline"
          >
            <cb-input-number
              v-model="model.deadline"
              controls-position="right"
              :min="1"
              :max="240"
            ></cb-input-number
            ><span class="deadline-month underly-txt">{{
              $t('activation.month')
            }}</span>
          </cb-form-item>
          <!-- 授权版本 -->
          <cb-form-item :label="$t('activation.authorizedVersion')">
            <div class="underly-txt">
              {{ $t('activation.underlyingPlatform') }}
            </div>
            <div>
              <cb-row>
                <cb-radio-group v-model="model.edition" style="width: 100%">
                  <cb-col :span="6">
                    <cb-radio :label="0">{{
                      $t('activation.standardEdition')
                    }}</cb-radio>
                  </cb-col>
                  <cb-col :span="6">
                    <cb-radio :label="1">{{
                      $t('activation.professionalEdition')
                    }}</cb-radio>
                  </cb-col>
                </cb-radio-group>
              </cb-row>
            </div>
          </cb-form-item>
          <!-- 授权功能 -->
          <cb-form-item :label="$t('activation.authorizationFunction')">
            <div class="underly-txt">
              {{ $t('activation.applicationModule') }}
            </div>
            <div class="application-module">
              <cb-row>
                <template v-for="item in functionList">
                  <cb-col class="modules-group" :span="6" :key="item.key">
                    <cb-checkbox
                      :key="item.key + '_enable'"
                      v-if="item.exclude !== model.edition"
                      :label="item.name"
                      v-model="item.checked"
                    ></cb-checkbox>
                    <cb-checkbox
                      v-else
                      :key="item.key + '_disable'"
                      :label="item.name"
                      disabled
                      :checked="false"
                    ></cb-checkbox>
                  </cb-col>
                </template>
              </cb-row>
            </div>
          </cb-form-item>
          <!-- 授权资源 -->
          <cb-form-item :label="$t('activation.authorizedResources')">
            <cb-search-table
              ref="controlTabel"
              row-key="key"
              hidePaginOnDemand
              :cols="controlColumns"
              :data-source="resourceItems"
              style="float: left"
              :searchBarBg="false"
            >
              <template v-slot:maxVal="scope">
                <cb-input-number
                  v-model="scope.data.value"
                  controls-position="right"
                  :placeholder="$t('activation.inputNumber')"
                  :min="1"
                ></cb-input-number>
              </template>
            </cb-search-table>
          </cb-form-item>
          <!-- 校验码 -->
          <cb-form-item :label="$t('activation.checkCode')" prop="verify_code">
            <cb-input
              v-model.trim="model.verify_code"
              :placeholder="$t('activation.checkCodeText')"
            ></cb-input>
          </cb-form-item>
        </cb-form>
        <!-- 激活按钮 -->
        <div class="active-btn">
          <cb-button class="active-button" loading @click="active">{{
            $t('activation.active')
          }}</cb-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
export default {
  name: 'ProductActive',
  data() {
    return {
      model: {
        deadline: 240,
        edition: 0,
        machine_code: '',
        verify_code: '',
        items: [],
      },
      resourceItems: [
        {
          key: 'LCS-RES-CR-ACTIVENODES',
          name: this.$t('activation.maxNumberConcurrentStartupNodes'),
          value: '100',
          module: this.$t('activation.seningCloudPlatform'),
          type: 2,
        },
        {
          key: 'LCS-RES-CR-EDITNODES',
          name: this.$t('activation.maxNumberStandardNodes'),
          value: '5',
          module: this.$t('activation.seningCloudPlatform'),
          type: 2,
        },
      ],
      resourceKeys: ['LCS-RES-CR-ACTIVENODES', 'LCS-RES-CR-EDITNODES'],
      rules: {
        verify_code: [
          {
            required: true,
            message: this.$t('activation.checkCodeText'),
            trigger: ['blur', 'change'],
          },
        ],
      },

      // 授权功能
      functionList: [
        {
          key: 'LCS-FUNC-CR-SHIXUN',
          name: this.$t('activation.trainingModule'),
          checked: false,
          type: 1,
        },
        {
          key: 'LCS-FUNC-CR-JINGSAI',
          name: this.$t('activation.contestModule'),
          checked: false,
          type: 1,
        },
        {
          key: 'LCS-FUNC-CR-HUOTILOUDONG',
          name: this.$t('activation.livingVulnerabilityModule'),
          checked: false,
          type: 1,
        },
        {
          key: 'LCS-FUNC-CR-ZHISHIKU',
          name: this.$t('activation.fieldKnowledgeBase'),
          checked: false,
          type: 1,
        },
        {
          key: 'LCS-FUNC-CR-SHENTOUSAI',
          name: this.$t('activation.penetrationCompetitionModule'),
          checked: false,
          type: 1,
        },
        {
          key: 'LCS-FUNC-CR-YUNWEISAI',
          name: this.$t('activation.operationVisaModule'),
          checked: false,
          type: 1,
        },
        {
          key: 'LCS-FUNC-CR-ZONGHEXUNLIAN',
          name: this.$t('activation.integratedTrainingModule'),
          checked: false,
          exclude: 0,
          type: 1,
        },
        {
          key: 'LCS-FUNC-CR-HONGLANDUIKANG',
          name: this.$t('activation.redBlueCounterModule'),
          checked: false,
          exclude: 0,
          type: 1,
        },

        {
          key: 'LCS-FUNC-CR-CEPING',
          name: this.$t('activation.evaluationModule'),
          checked: false,
          exclude: 0,
          type: 1,
        },
      ],
      // 授权资源
      controlColumns: [
        {
          title: this.$t('activation.productModule'),
          prop: 'module',
          width: '130px',
        },
        {
          title: this.$t('activation.controlItems'),
          prop: 'name',
        },
        {
          title: this.$t('activation.maximum'),
          prop: 'value',
          slot: 'maxVal',
          width: '200px',
        },
      ],
    };
  },
  computed: {},
  created() {
    this.getActivationInfo();
  },

  methods: {
    getActivationInfo() {
      this.$request
        .get('/sys/activation/status', null, { baseURL: '/api/mp' })
        .then((res) => {
          const activeData = _.get(res, 'data.data', {});
          // 如果有数据返回说明此前有激活记录 回显上次的勾选选项 如果没有有效数据 说明未被激活过 展示初始数据
          if (
            !_.isEmpty(activeData) &&
            activeData.items &&
            activeData.items.length
          ) {
            this.model = _.get(res, 'data.data', {});
            this.model.machine_code = '';
            this.model.verify_code = '';
            const { resourceItems, functionList } = this;
            // 处理回显数据
            (this.model.items || []).map((i) => {
              if (this.resourceKeys.includes(i.key)) {
                _.forEach(resourceItems, (resource) => {
                  if (i.key === resource.key) {
                    resource.value = i.value;
                  }
                });
              } else {
                _.forEach(functionList, (func) => {
                  if (i.value === '1') {
                    func.checked = true;
                  } else {
                    func.checked = false;
                  }
                });
              }
            });
          }
        })
        .finally(() => {
          this.getMachineCode();
        });
    },
    getMachineCode() {
      this.$request
        .get('/sys/activation/machinecode', null, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          this.model.machine_code = _.get(res, 'data.data');
        });
    },

    active(done) {
      this.model.items = this.functionList.map((item) => {
        const { key, name, type } = item;
        return {
          key,
          name,
          type,
          value:
            item.checked && item.exclude !== this.model.edition ? '1' : '0',
        };
      });
      this.model.items = this.model.items.concat(this.resourceItems);
      this.$refs.activeFormRef
        .submit(this.model)
        .then(() => {
          this.$success(this.$t('activation.activeSuccess'));
          this.$emit('activate', true);
        })
        .finally(() => {
          done();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.product-active {
  width: 100%;
  min-width: 1366px;
  .background-effect {
    background: black;
    opacity: 0.5;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
  }
  .active-form-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .active-form {
      position: relative;
      width: 736px;
      box-sizing: content-box;
      padding: 40px;
      .machine-code {
        color: white;
        font-size: 16px;
      }
      .deadline-month {
        margin-left: 16px;
      }
      .application-module {
        height: 128px;
      }
      .modules-group {
        height: 42px;
        display: flex;
        align-items: center;
      }
      .underly-txt {
        color: #d1dbf1;
        font-size: 14px;
      }
      .active-form__head {
        text-align: center;
        letter-spacing: 2px;
        font-size: 16px;
        word-spacing: 5px;
        font-weight: 700;
        color: white;
        line-height: 36px;
        padding-bottom: 32px;
      }
      .active-form__cb-form {
        ::v-deep .el-form-item__label {
          color: #d1dbf1;
          font-size: 14px;
        }
        ::v-deep .ant-table .ant-table-tbody > tr > td {
          height: 40px;
        }
      }
      .active-btn {
        text-align: center;
      }
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: #3b4966;
        opacity: 0.3;
        z-index: -1;
      }
    }
  }
}
</style>
