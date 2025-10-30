<template>
  <cb-inner-page class="vuln-mgr-list" :background="false">
    <cb-search-table
      ref="searchTable"
      :cols.sync="columns"
      row-key="resource_id"
      selector="checkbox"
      url="/admin/vuln/list/"
      baseURL="/api/vuln"
      :data.sync="query"
      :selection.sync="multipleSelection"
      :row-selection="rowSelection"
      @data-loaded="dataLoaded"
    >
      <template slot="search">
        <!-- 新增 -->
        <cb-button button-type="add" @click="linkAdd"></cb-button>
        <!-- 删除 -->
        <cb-button
          :disabled="multipleSelection.length === 0"
          button-type="delete"
          @click="deleteSelected"
          hollow
        >
        </cb-button>
        <!-- 导入 -->
        <import-button
          ref="importBtn"
          hollow
          :text="$t('vulnList.import')"
          accept=".xls,.xlsx"
          fileSize="20MB"
          :autoPost="false"
          @change="toImport"
        ></import-button>
        <!-- 导出 -->
        <cb-button
          :disabled="multipleSelection.length === 0"
          button-type="export"
          loading
          hollow
          @click="toExport"
        ></cb-button>
        <!-- 下载 -->
        <cb-button
          button-type="import"
          hollow
          loading
          @click="downloadTemplate"
        >
          {{ $t('vulnList.downloadTemplate') }}
        </cb-button>
      </template>
      <template v-slot:filter>
        <!-- 等级 -->
        <cb-select
          v-model="query.level"
          :options="dangerLevelList"
          :first="{ label: $t('common.allDangerLevels'), value: '' }"
        ></cb-select>
        <!-- 类型 -->
        <cb-select
          v-model="query.utilize_category"
          :options="attackTypeList"
          :first="{ label: $t('common.allAttackTypes'), value: '' }"
        ></cb-select>
        <!-- 平台 -->
        <cb-select
          v-loading="platformLoading"
          v-model="query.platform"
          :options="platformTypeList"
          :first="{ label: $t('common.allPlatForm'), value: '' }"
        ></cb-select>
        <!-- 行业 -->
        <cb-select
          v-model="query.industry"
          :options="businessList"
          :first="{ label: $t('common.allBusiness'), value: '' }"
        ></cb-select>
        <!-- 日期选择 -->
        <cb-date-picker
          v-model="dateRange"
          value-format="yyyy-MM-dd"
          type="daterange"
          :range-separator="$t('common.datePickerSeparator')"
          :start-placeholder="$t('common.selectStartTime')"
          :end-placeholder="$t('common.selectEndTime')"
        ></cb-date-picker>
        <!-- 搜索 -->
        <cb-search-input
          v-model="query.search"
          :placeholder="$t('vulnList.pleaseEnterVulnName')"
          maxlength="30"
          style="width: 310px"
        ></cb-search-input>
      </template>
      <!-- 漏洞编号 -->
      <template v-slot:vulnNum="scope">
        <div class="vuln-num" :title="scope.data.code">
          {{ scope.data.code }}
        </div>
      </template>
      <!-- 等级 -->
      <template v-slot:dangerLevel="scope">
        <danger-level
          :dangerLevelOptions="dangerLevelOptions"
          :level="scope.data.level"
        ></danger-level>
      </template>
      <!-- 操作 -->
      <template v-slot:operate="scope">
        <!-- 编辑 -->
        <cb-button
          type="text"
          button-type="edit"
          :disabled="scope.data.import_flag === 1"
          mr
          @click="toPage(scope.data, 'vuln-mgr-edit')"
        ></cb-button>
        <!-- 高阶信息 -->
        <cb-button
          type="text"
          mr
          :disabled="scope.data.import_flag === 1"
          @click="toPage(scope.data, 'vuln-higher-info')"
        >
          {{ $t('vulnList.higherOrderInfo') }}
        </cb-button>
        <!-- Paper管理 -->
        <cb-button
          type="text"
          :disabled="scope.data.import_flag === 1"
          @click="toPage(scope.data, 'vuln-paper-mgr')"
        >
          {{ $t('vulnList.paperMgr') }}
        </cb-button>
      </template>
    </cb-search-table>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import {
  dangerLevelOptions,
  attackTypeOptions,
  businessOptions,
} from '@/constants/index.js';
import DangerLevel from '@/components/danger-level';
import ImportButton from '@/components/upload-button';
import {
  getVulnPlatformData,
  downloadVulnTemplate,
  importVuln,
  batchDeleteVuln,
  getVulnSceneConfig,
  exportVuln,
} from '@/api/vuln-cms';

export default {
  components: {
    DangerLevel,
    ImportButton,
  },
  data() {
    return {
      columns: [
        // 名称
        {
          label: this.$t('common.vulName'),
          prop: 'name',
          width: 220,
          resizable: true,
        },
        // 编号
        {
          label: this.$t('common.number'),
          slot: 'vulnNum',
          width: 250,
          prop: '',
          resizable: true,
        },
        // 等级
        {
          label: this.$t('common.dangerLevel'),
          width: 130,
          slot: 'dangerLevel',
        },
        // 类型
        {
          label: this.$t('common.type'),
          width: 80,
          getData(row) {
            return attackTypeOptions[row.utilize_category];
          },
        },
        // 平台
        {
          label: this.$t('common.platform'),
          width: 80,
          prop: 'platform',
        },
        // 行业
        {
          label: this.$t('vulnList.business'),
          width: 100,
          getData(row) {
            return businessOptions[row.industry];
          },
        },
        // 发布时间
        {
          label: this.$t('common.issueTime'),
          prop: 'publish_date',
          width: 160,
        },
        // 操作
        {
          label: this.$t('common.operation'),
          slot: 'operate',
          width: 260,
        },
      ],
      query: {
        search: '',
        level: '',
        utilize_category: '',
        platform: '',
        industry: '',
        start_time: '',
        end_time: '',
      },
      multipleSelection: [],
      // 危险等级
      dangerLevelOptions,
      dangerLevelList: dangerLevelOptions.list,
      // 攻击类型
      attackTypeOptions,
      attackTypeList: attackTypeOptions.list,
      // 平台
      platformLoading: true,
      platformTypeList: [],
      // 行业
      businessOptions,
      businessList: businessOptions.list,
      sceneIds: [],
    };
  },
  computed: {
    dateRange: {
      get() {
        const { start_time, end_time } = this.query;
        return [start_time, end_time];
      },
      set(arr) {
        this.query.start_time = _.get(arr, '[0]', '')
          ? _.get(arr, '[0]', '') + ' ' + '00:00:00'
          : '';
        this.query.end_time = _.get(arr, '[1]', '')
          ? _.get(arr, '[1]', '') + ' ' + '23:59:59'
          : '';
      },
    },
    // 勾选禁用状态
    rowSelection() {
      return {
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.import_flag === 1,
          },
        }),
      };
    },
  },
  created() {
    this.getPlatformData();
  },
  methods: {
    dataLoaded(data) {
      data.tableData.map((item) => {
        if (item.code && item.code.length > 0) {
          item.code = item.code.join(`${this.$t('common.delimiter')}`);
        }
      });
    },
    // 获取平台
    getPlatformData() {
      getVulnPlatformData()
        .then((res) => {
          this.platformTypeList = _.get(res, 'data.data', []);
        })
        .finally((res) => {
          this.platformLoading = false;
        });
    },
    // 删除
    deleteSelected(done) {
      this.getAllScene(() => {
        if (this.sceneIds.length > 0) {
          this.$request
            .delete('/cscene/cscenes/bulk_delete', this.sceneIds, {
              baseURL: '/api/mp',
            })
            .then(() => {
              batchDeleteVuln({
                resource_ids: this.multipleSelection.map(
                  (item) => item.resource_id,
                ),
              })
                .then(() => {
                  this.multipleSelection = [];
                  this.$refs.searchTable.reload();
                  done(true);
                })
                .catch(() => {
                  done(false);
                });
            })
            .catch(() => {});
        } else {
          batchDeleteVuln({
            resource_ids: this.multipleSelection.map(
              (item) => item.resource_id,
            ),
          })
            .then(() => {
              this.multipleSelection = [];
              this.$refs.searchTable.reload();
              done(true);
            })
            .catch(() => {
              done(false);
            });
        }
      });
    },

    getAllScene(callback) {
      const promises = this.multipleSelection.map((value, index) =>
        this.getSceneIds(value, index),
      );
      Promise.all(promises)
        .then(() => {
          callback();
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getSceneIds(value) {
      return new Promise((resolve) => {
        setTimeout(() => {
          getVulnSceneConfig(value.resource_id).then((res) => {
            let data = _.get(res, 'data.data.scene_config', {});
            if (data !== null && data?.id) {
              this.sceneIds.push(data.id);
            }
            resolve(this.sceneIds);
          });
        });
      });
    },
    // 导入
    toImport(file, resetInputValue) {
      const formData = new FormData();
      formData.append('file', file);
      importVuln(formData)
        .then(() => {
          this.$message.success({
            message: this.$t('vulnList.operateSuccessMsg'),
          });
          this.$refs.searchTable.reload();
        })
        .finally((res) => {
          // 未使用组件上传统一接口，需手动清空组件input绑定值
          resetInputValue();
        });
    },
    // 导出
    toExport(done) {
      let ids = '';
      if (this.multipleSelection.length > 0) {
        ids = this.multipleSelection
          .map((item) => {
            return item.resource_id;
          })
          .join(',');
      }
      exportVuln(ids).finally((res) => {
        done();
      });
    },
    // 下载模板
    downloadTemplate(done) {
      downloadVulnTemplate()
        .then((res) => {
          const url = _.get(res, 'data.data.url', '');
          if (url) {
            this.$request.filePathDownload(url);
          }
        })
        .finally((res) => {
          done();
        });
    },
    // 跳转
    toPage(item, routeName) {
      this.$router.push({
        name: routeName,
        params: {
          resource_id: item.resource_id,
        },
      });
    },
    linkAdd() {
      // console.log('8888');

      this.$router.push({
        name: 'vuln-mgr-add',
      });
    },
  },
};
</script>

<style scoped lang="scss">
.vuln-mgr-list {
  // 漏洞编号
  .vuln-num {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-word;
    line-height: 28px;
    white-space: normal;
  }
}
</style>
