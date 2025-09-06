<template>
  <cb-dialog
    :title="$t('components.searchInputBar.advancedSearch')"
    :visible.sync="isShowDialog"
    append-to-body
    width="960px"
    @close="cancel"
  >
    <cb-form
      ref="formRef"
      :model.sync="formData"
      :rules="rules"
      url=""
      :json="true"
      width="100%"
      label-width="auto"
    >
      <div class="form-item-box">
        <!-- 利用类型 -->
        <cb-form-item
          :label="$t('components.searchInputBar.useType') + $t('common.colon')"
        >
          <cb-select
            style="width: 240px"
            v-model="formData.utilize_category"
            :options="attackTypeList"
            :first="{ label: $t('common.allAttackTypes'), value: '' }"
          ></cb-select>
        </cb-form-item>
        <!-- 平台 -->
        <cb-form-item :label="$t('common.platform') + $t('common.colon')">
          <cb-select
            style="width: 240px"
            v-model="formData.platform"
            :options="searchPlatFormList"
            :first="{ label: $t('common.allPlatForm'), value: '' }"
          ></cb-select>
        </cb-form-item>
      </div>
      <div class="form-item-box">
        <!-- 是否修复 -->
        <cb-form-item
          :label="$t('components.searchInputBar.isRepair') + $t('common.colon')"
        >
          <cb-select
            style="width: 240px"
            v-model="formData.is_repaired"
            :options="repairStatusList"
            :first="{
              label: $t('components.searchInputBar.allRepairStatus'),
              value: '',
            }"
          ></cb-select>
        </cb-form-item>
        <!-- 严重等级 -->
        <cb-form-item
          :label="
            $t('components.searchInputBar.severityLevel') + $t('common.colon')
          "
        >
          <cb-select
            style="width: 240px"
            v-model="formData.level"
            :options="dangerLevelList"
            :first="{ label: $t('common.allDangerLevels'), value: '' }"
          ></cb-select>
        </cb-form-item>
      </div>
      <!-- CVSS3分值 -->
      <cb-form-item
        :label="$t('common.CVSS3') + $t('common.colon')"
        prop="cvss3Score"
      >
        <div class="cvss3-box">
          <cb-input-number
            v-model="formData.cvss_start"
            controls-position="right"
            :min="0"
            :max="10"
            :precision="1"
            :step="0.1"
            style="width: 162px"
          ></cb-input-number>
          <span class="tip">~</span>
          <cb-input-number
            v-model="formData.cvss_end"
            controls-position="right"
            :min="0"
            :max="10"
            :precision="1"
            :step="0.1"
            style="width: 162px"
          ></cb-input-number>
          <span class="tip">{{
            $t('components.searchInputBar.pleaseEnterRangeNum')
          }}</span>
        </div>
      </cb-form-item>
      <!-- 发布时间 -->
      <cb-form-item :label="$t('common.issueTime') + $t('common.colon')">
        <cb-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          :range-separator="$t('common.datePickerSeparator')"
          :start-placeholder="$t('common.selectStartTime')"
          :end-placeholder="$t('common.selectEndTime')"
        ></cb-date-picker>
      </cb-form-item>
      <!-- 所属行业 -->
      <cb-form-item :label="$t('common.industry') + $t('common.colon')">
        <div class="checkbox-box">
          <cb-checkbox-group v-model="formData.industry">
            <cb-checkbox
              v-for="(item, idx) in businessList"
              :key="idx"
              :label="item.value"
            >
              {{ item.label }}
            </cb-checkbox>
          </cb-checkbox-group>
        </div>
      </cb-form-item>
      <!-- 信息属性 -->
      <cb-form-item
        :label="
          $t('components.searchInputBar.infoAttribute') + $t('common.colon')
        "
      >
        <div class="checkbox-box">
          <cb-checkbox-group v-model="formData.infoAttribute">
            <cb-checkbox
              v-for="(item, idx) in infoAttributeListComputed"
              :key="idx"
              :label="item.key"
            >
              {{ item.label }}
            </cb-checkbox>
          </cb-checkbox-group>
        </div>
      </cb-form-item>
      <!-- 漏洞描述 -->
      <cb-form-item
        :label="$t('common.vulDescription') + $t('common.colon')"
        prop="desc"
      >
        <cb-input
          v-input-trim
          v-model="formData.desc"
          :placeholder="
            $t('components.searchInputBar.pleaseEnterVulnDescKeywords')
          "
          type="textarea"
        >
        </cb-input>
      </cb-form-item>
      <!-- 漏洞软件附件 -->
      <cb-form-item
        class="attachment-item"
        :label="
          $t('components.searchInputBar.vulnSoftwareAccessory') +
          $t('common.colon')
        "
      >
        <div class="checkbox-box">
          <cb-radio-group v-model="formData.attachment">
            <cb-radio
              v-for="item in attachmentList"
              :key="item.key"
              :label="item.key"
              >{{ item.label }}</cb-radio
            >
          </cb-radio-group>
        </div>
      </cb-form-item>
    </cb-form>
    <template slot="footer">
      <cb-button button-type="confirm" mr @click="validate">{{
        $t('components.searchInputBar.search')
      }}</cb-button>
      <cb-button button-type="cancel" @click="cancel"></cb-button>
    </template>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import { getVulnPlatform } from '@/api/vuln';

import {
  attackTypeOptions,
  dangerLevelOptions,
  businessOptions,
} from '@/constants/index.js';
export default {
  props: {
    // 高级搜索参数
    advancedSearchParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    liveSearch: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShowDialog: false,
      formData: {
        utilize_category: '',
        platform: '',
        is_repaired: '',
        level: '',
        cvss_start: undefined,
        cvss_end: undefined,
        pub_date_start: '',
        pub_date_end: '',
        industry: [],
        infoAttribute: [],
        desc: '',
        attachment: 0,
      },
      postFormData: {},
      rules: {
        // cvss3
        cvss3Score: [
          {
            validator: (rule, value, callback) => {
              let { cvss_start, cvss_end } = this.formData;
              if (
                typeof cvss_start === 'undefined' &&
                typeof cvss_end === 'undefined'
              ) {
                // 全为空
                callback();
              } else if (
                typeof cvss_start === 'undefined' ||
                typeof cvss_end === 'undefined'
              ) {
                // 单个为空
                callback(
                  new Error(
                    this.$t('components.searchInputBar.pleaseEnterAllNum'),
                  ),
                );
              } else if (
                typeof cvss_start !== 'undefined' &&
                typeof cvss_end !== 'undefined'
              ) {
                // 不为空
                if (cvss_start > cvss_end) {
                  callback(
                    new Error(
                      this.$t('components.searchInputBar.pleaseEnterAllNum'),
                    ),
                  );
                } else {
                  callback();
                }
              }
            },
            trigger: ['change', 'blur'],
          },
        ],
        // 漏洞描述
        desc: [
          {
            required: false,
            max: 15,
            message: this.$t('common.lengthLimit15'),
            trigger: 'blur',
          },
        ],
      },
      // 利用类型
      attackTypeOptions,
      attackTypeList: attackTypeOptions.list,
      // 平台
      searchPlatFormList: [],
      // 是否修复
      repairStatusList: [
        {
          label: this.$t('components.searchInputBar.repaired'),
          value: true,
        },
        {
          label: this.$t('components.searchInputBar.unRepaired'),
          value: false,
        },
      ],
      // 严重等级
      dangerLevelOptions,
      dangerLevelList: dangerLevelOptions.list,
      // 行业
      businessOptions,
      businessList: businessOptions.list,
      // 信息属性
      infoAttributeList: [
        {
          label: this.$t('components.searchInputBar.vulnAnalysis'),
          key: 'analysis',
        },
        {
          label: this.$t('common.POC'),
          key: 'poc',
        },
        {
          label: this.$t('common.EXP'),
          key: 'exp',
        },
      ],
      // 附件
      attachmentList: [
        {
          label: this.$t('components.searchInputBar.all'),
          key: 0,
        },
        {
          label: this.$t('components.searchInputBar.have'),
          key: 1,
        },
        {
          label: this.$t('components.searchInputBar.none'),
          key: 2,
        },
      ],
    };
  },
  computed: {
    dateRange: {
      get() {
        const { pub_date_start, pub_date_end } = this.formData;
        return [pub_date_start, pub_date_end];
      },
      set(arr) {
        this.formData.pub_date_start = _.get(arr, '[0]', '')
          ? _.get(arr, '[0]', '') + ' ' + '00:00:00'
          : '';
        this.formData.pub_date_end = _.get(arr, '[1]', '')
          ? _.get(arr, '[1]', '') + ' ' + '23:59:59'
          : '';
      },
    },
    infoAttributeListComputed() {
      return this.liveSearch
        ? this.infoAttributeList
        : [
            // {
            //   label: this.$t('common.reproduceEnvironment'),
            //   key: 'env',
            // },
            ...this.infoAttributeList,
          ];
    },
  },
  watch: {
    advancedSearchParams: {
      handler: function (data) {
        if (data && !_.isEmpty(data)) {
          this.formatSearchParams(data);
        } else {
          this.formData = {
            utilize_category: '',
            platform: '',
            is_repaired: '',
            level: '',
            cvss_start: undefined,
            cvss_end: undefined,
            pub_date_start: '',
            pub_date_end: '',
            industry: [],
            infoAttribute: [],
            desc: '',
            attachment: 0,
          };
        }
      },
      deep: true,
    },
  },
  created() {
    this.getPlatformData();
  },
  methods: {
    // 获取平台
    getPlatformData() {
      getVulnPlatform().then((res) => {
        this.searchPlatFormList = _.get(res, 'data.data', []);
      });
    },
    cancel() {
      this.$emit('close');
      if (_.isEmpty(this.advancedSearchParams)) {
        this.resetFields();
      } else {
        this.resetFields();
        this.formatSearchParams(this.advancedSearchParams);
      }
    },
    validate() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return;
        this.search();
      });
    },
    search(params) {
      if (params && !_.isEmpty(params)) {
        this.formatSearchParams(params);
      }
      this.postFormData = _.cloneDeep(this.formData);

      let { cvss_start, cvss_end, infoAttribute, industry } = this.postFormData;
      // CVSS3 默认undefined，展示为空，提交空
      if (
        typeof cvss_start === 'undefined' &&
        typeof cvss_end === 'undefined'
      ) {
        this.postFormData.cvss_start = '';
        this.postFormData.cvss_end = '';
      }
      // 信息属性
      // 删除上次提交的信息属性筛选 结构：{env: true},{poc: true}
      this.infoAttributeListComputed.map((item) => {
        for (let key in this.postFormData) {
          if (item.key === key) {
            delete this.postFormData[key];
          }
        }
      });
      // 信息属性当前选中项，提交结构：{env: true},{poc: true}
      if (infoAttribute && infoAttribute.length > 0) {
        infoAttribute.map((item) => {
          let tempObj = {};
          tempObj[item] = true;
          this.postFormData = { ...this.postFormData, ...tempObj };
        });
      }
      // 删除不符合数据结构的infoAttribute，以免提交报错
      delete this.postFormData.infoAttribute;
      // 行业
      if (industry && industry.length > 0) {
        this.postFormData.industry = industry.join(',');
      }
      this.$emit('submitAdvancedSearch', this.postFormData);
      this.resetFields();
    },
    show(bool = true) {
      this.isShowDialog = bool;
    },
    // 数据回填
    formatSearchParams(params) {
      let data = _.cloneDeep(params);
      //初始值
      data = _.merge(this.formData, data);
      let {
        utilize_category,
        is_repaired,
        level,
        cvss_start,
        cvss_end,
        industry,
        env,
        analysis,
        poc,
        exp,
      } = data;
      // 类型
      data.utilize_category =
        utilize_category === '' ? '' : Number(utilize_category);
      // 修复
      data.is_repaired = is_repaired === '' ? '' : JSON.parse(is_repaired);
      // 等级
      data.level = level === '' ? '' : Number(level);
      // CVSS3 默认undefined，展示为空
      data.cvss_start =
        cvss_start === '' || cvss_start === undefined
          ? undefined
          : Number(cvss_start);
      data.cvss_end =
        cvss_end === '' || cvss_end === undefined
          ? undefined
          : Number(cvss_end);
      // 信息属性
      data.infoAttribute = [];
      env && data.infoAttribute.push('env');
      analysis && data.infoAttribute.push('analysis');
      poc && data.infoAttribute.push('poc');
      exp && data.infoAttribute.push('exp');
      // 行业
      if (industry && industry.length > 0) {
        industry = industry.split(',');
        data.industry =
          industry.length > 0 &&
          industry.map((item) => {
            return Number(item);
          });
      } else {
        data.industry = [];
      }
      this.formData = _.cloneDeep(data);
    },
    resetFields() {
      this.formData = {
        utilize_category: '',
        platform: '',
        is_repaired: '',
        level: '',
        cvss_start: undefined,
        cvss_end: undefined,
        pub_date_start: '',
        pub_date_end: '',
        industry: [],
        infoAttribute: [],
        desc: '',
        attachment: 0,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cvss3-box {
  display: flex;
  align-items: center;
  .tip {
    margin: 0 8px;
    font-size: 12px;
    color: var(--neutral8);
  }
}
.checkbox-box {
  display: flex;
  align-items: center;
  height: var(--form-item-height);
}
.attachment-item {
  margin-bottom: 0;
}
</style>
