<template>
  <div class="active-form-container">
    <!-- 表格 -->
    <div class="active-form">
      <cb-form
        ref="delayFormRef"
        url="/sys/activation/delay"
        baseURL="/api/mp"
        :model.sync="model"
        :rules="rules"
        label-width="170px"
        json
      >
        <!-- 磁盘序列号 -->
        <cb-form-item :label="$t('activation.machineCode')">
          <div class="machine-code">{{ model.machine_code }}</div>
        </cb-form-item>
        <!-- 授权期限 -->
        <cb-form-item
          :label="$t('systemManagement.system.activation.authorizationDelay')"
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
          <!-- <div class="expired-date">{{ model.expired_date }}</div> -->
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
                  <cb-radio :label="0" :disabled="model.edition !== 0">{{
                    $t('activation.standardEdition')
                  }}</cb-radio>
                </cb-col>
                <cb-col :span="6">
                  <cb-radio :label="1" :disabled="model.edition !== 1">{{
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
              <!-- <div class="modules-mask"></div> -->
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
        <cb-button class="active-button" loading @click="submit">{{
          $t('activation.active')
        }}</cb-button>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import { getUserPermissions } from '@/api/system-management.ts';
export default {
  name: 'ActiveDialog',
  props: {
    activeData: {
      type: Object,
      default: () => {},
    },
    functionData: {
      type: Array,
      default: () => [],
    },
    resourceData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      model: {
        deadline: 1,
        edition: 0, //激活版本 0:标准版 1:专业版
        machine_code: '',
        verify_code: '',
        items: [],
      },
      rules: {
        verify_code: [
          {
            required: true,
            message: this.$t('activation.checkCodeText'),
            trigger: ['blur', 'change'],
          },
        ],
      },
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
      functionList: [],
      resourceItems: [],
    };
  },
  computed: {},
  watch: {
    activeData: {
      handler(val) {
        this.model = _.cloneDeep(val);
        this.model.verify_code = '';
        delete this.model.delay_verify_code_list;
        delete this.model.expired_date;
        delete this.model.is_actived;
      },
      immediate: true,
      deep: true,
    },
    functionData: {
      handler(val) {
        this.functionList = _.cloneDeep(val);
        _.forEach(this.functionList, (item) => {
          if (item.value === '1') {
            this.$set(item, 'checked', true);
          } else {
            this.$set(item, 'checked', false);
          }
        });
      },
      immediate: true,
      deep: true,
    },
    resourceData: {
      handler(val) {
        this.resourceItems = _.cloneDeep(val);
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},

  methods: {
    submit(done) {
      this.model.items = this.functionList.map((item) => {
        const { key, type } = item;
        return {
          key,
          type,
          value:
            item.checked && item.exclude !== this.model.edition ? '1' : '0',
        };
      });
      this.model.items = this.model.items.concat(this.resourceItems);
      this.$refs.delayFormRef
        .submit(this.model)
        .then(() => {
          this.$success(this.$t('activation.activeSuccess'));
          this.$emit('updateData');
          // 延期授权后刷新权限接口
          this.getUserPermissions();
        })
        .finally(() => {
          done();
        });
    },
    getUserPermissions() {
      getUserPermissions().then((res) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.modules-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
.active-form-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .active-form {
    position: relative;
    box-sizing: content-box;
    .machine-code {
      color: white;
      font-size: 16px;
    }
    .deadline-month {
      margin-left: 16px;
    }
    .application-module {
      height: 128px;
      .el-row {
        position: relative;
      }
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
</style>
