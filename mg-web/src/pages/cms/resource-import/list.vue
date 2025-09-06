<template>
  <cb-inner-page :background="false">
    <div class="resource-page">
      <div class="button-group">
        <cb-upload-file
          v-model="file"
          action=""
          :limit="1"
          :multiple="false"
          type="file"
          accept=".xls,.xlsx"
          showFileList
          :fetchPromise="importFile"
        >
        </cb-upload-file>
        <cb-button
          class="resource-import-button"
          :disabled="disabled"
          @click="resourceImport()"
          type="primary"
        >
          {{ $t('resource.resourceImport') }}
        </cb-button>
      </div>
      <cb-tabs class="resource-tabs" type="card" v-model="activeName">
        <cb-tab-pane :label="$t('resource.course')" name="课程">
          <cb-search-table
            v-if="activeName == '课程'"
            :cols="courseCols"
            :url="courseUrl"
            :baseURL="baseURL"
            ref="table"
          >
            <template v-slot:progress="scope">
              <cb-progress
                :stroke-width="12"
                :percentage="scope.data.progress"
              ></cb-progress>
            </template>
          </cb-search-table>
        </cb-tab-pane>
        <cb-tab-pane :label="$t('resource.problem')" name="赛题">
          <cb-search-table
            v-if="activeName == '赛题'"
            :cols="problemCols"
            :url="problemUrl"
            :baseURL="baseURL"
            ref="table"
          >
            <template v-slot:progress="scope">
              <cb-progress
                :stroke-width="12"
                :percentage="scope.data.progress"
              ></cb-progress>
            </template>
          </cb-search-table>
        </cb-tab-pane>
        <cb-tab-pane :label="$t('resource.scene')" name="场景">
          <cb-search-table
            v-if="activeName == '场景'"
            :cols="sceneCols"
            :url="sceneUrl"
            :baseURL="baseURL"
            ref="table"
          >
            <template v-slot:progress="scope">
              <cb-progress
                :stroke-width="12"
                :percentage="scope.data.progress"
              ></cb-progress>
            </template>
          </cb-search-table>
        </cb-tab-pane>
        <cb-tab-pane :label="$t('resource.tool')" name="工具">
          <cb-search-table
            v-if="activeName == '工具'"
            :cols="toolCols"
            :url="toolUrl"
            :baseURL="baseURL"
            ref="table"
          >
            <template v-slot:progress="scope">
              <cb-progress
                :stroke-width="12"
                :percentage="scope.data.progress"
              ></cb-progress>
            </template>
          </cb-search-table>
        </cb-tab-pane>
        <cb-tab-pane :label="$t('resource.target')" name="靶标">
          <cb-search-table
            v-if="activeName == '靶标'"
            :cols="targetCols"
            :url="targetUrl"
            :baseURL="baseURL"
            ref="table"
          >
            <template v-slot:progress="scope">
              <cb-progress
                :stroke-width="12"
                :percentage="scope.data.progress"
              ></cb-progress>
            </template>
          </cb-search-table>
        </cb-tab-pane>
        <cb-tab-pane :label="$t('resource.leak')" name="漏洞">
          <cb-search-table
            v-if="activeName == '漏洞'"
            :cols="leakCols"
            :url="leakUrl"
            :baseURL="baseURL"
            ref="table"
          >
            <template v-slot:progress="scope">
              <cb-progress
                :stroke-width="12"
                :percentage="scope.data.progress"
              ></cb-progress>
            </template>
          </cb-search-table>
        </cb-tab-pane>
        <cb-tab-pane :label="$t('resource.flow')" name="流量">
          <cb-search-table
            v-if="activeName == '流量'"
            :cols="flowCols"
            :url="flowUrl"
            :baseURL="baseURL"
            ref="table"
          >
            <template v-slot:progress="scope">
              <cb-progress
                :stroke-width="12"
                :percentage="scope.data.progress"
              ></cb-progress>
            </template>
          </cb-search-table>
        </cb-tab-pane>
        <cb-tab-pane :label="$t('resource.comClass')" name="组合课">
          <cb-search-table
            v-if="activeName == '组合课'"
            :cols="classCols"
            :url="classUrl"
            :baseURL="baseURL"
            ref="table"
          >
            <template v-slot:progress="scope">
              <cb-progress
                :stroke-width="12"
                :percentage="scope.data.progress"
              ></cb-progress>
            </template>
          </cb-search-table>
        </cb-tab-pane>
      </cb-tabs>
    </div>
  </cb-inner-page>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      file: [],
      activeName: '课程',
      baseURL: '/api/drm',
      interval: null,
      disabled: false,
      courseUrl: '/import/history/excel/?type=0',
      classUrl: '/import/history/excel/?type=1',
      problemUrl: '/import/history/excel/?type=2',
      sceneUrl: '/import/history/excel/?type=3',
      toolUrl: '/import/history/excel/?type=4',
      targetUrl: '/import/history/excel/?type=5',
      leakUrl: '/import/history/excel/?type=6',
      flowUrl: '/import/history/excel/?type=7',
      courseCols: [
        {
          label: this.$t('resource.courseName'),
          prop: 'first_name',
        },
        {
          label: this.$t('resource.courseNum'),
          prop: 'first_num',
        },
        {
          label: this.$t('resource.classHourNum'),
          prop: 'second_name',
        },
        {
          label: this.$t('resource.progress'),
          width: 250,
          slot: 'progress',
        },
      ],
      problemCols: [
        {
          label: this.$t('resource.problemName'),
          prop: 'first_name',
        },
        {
          label: this.$t('resource.problemNum'),
          prop: 'first_num',
        },
        {
          label: this.$t('resource.problemType'),
          prop: 'first_type',
        },
        {
          label: this.$t('resource.titleName'),
          prop: 'second_name',
        },
        {
          label: this.$t('resource.progress'),
          width: 250,
          slot: 'progress',
        },
      ],
      sceneCols: [
        {
          label: this.$t('resource.sceneLibName'),
          prop: 'first_name',
        },
        {
          label: this.$t('resource.sceneLibNum'),
          prop: 'first_num',
        },
        {
          label: this.$t('resource.sceneName'),
          prop: 'second_name',
        },
        {
          label: this.$t('resource.progress'),
          width: 250,
          slot: 'progress',
        },
      ],
      toolCols: [
        {
          label: this.$t('resource.toolLibName'),
          prop: 'first_name',
        },
        {
          label: this.$t('resource.toolLibNum'),
          prop: 'first_num',
        },
        {
          label: this.$t('resource.toolName'),
          prop: 'second_name',
        },
        {
          label: this.$t('resource.progress'),
          width: 250,
          slot: 'progress',
        },
      ],
      targetCols: [
        {
          label: this.$t('resource.targetLibName'),
          prop: 'first_name',
        },
        {
          label: this.$t('resource.targetNum'),
          prop: 'first_num',
        },
        {
          label: this.$t('resource.targetName'),
          prop: 'second_name',
        },
        {
          label: this.$t('resource.progress'),
          width: 250,
          slot: 'progress',
        },
      ],
      leakCols: [
        {
          label: this.$t('resource.leakLibName'),
          prop: 'first_name',
        },
        {
          label: this.$t('resource.leakLibNum'),
          prop: 'first_num',
        },
        {
          label: this.$t('resource.leakName'),
          prop: 'second_name',
        },
        {
          label: this.$t('resource.leakNum'),
          prop: 'second_num',
        },
        {
          label: this.$t('resource.progress'),
          width: 250,
          slot: 'progress',
        },
      ],
      flowCols: [
        {
          label: this.$t('resource.flowLibName'),
          prop: 'first_name',
        },
        {
          label: this.$t('resource.flowPackageName'),
          prop: 'second_name',
        },
        {
          label: this.$t('resource.progress'),
          width: 250,
          slot: 'progress',
        },
      ],
      classCols: [
        {
          label: this.$t('resource.courseName'),
          prop: 'first_name',
        },
        {
          label: this.$t('resource.courseNum'),
          prop: 'first_num',
        },
        {
          label: this.$t('resource.classHourNum'),
          prop: 'second_name',
        },
        {
          label: this.$t('resource.progress'),
          width: 250,
          slot: 'progress',
        },
      ],
    };
  },
  mounted() {
    this.refreshTable();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    refreshTable() {
      this.interval = setInterval(() => {
        this.$refs.table.reload({ loading: false });
      }, 3000);
    },
    importFile(file) {
      const formData = new FormData();
      formData.append('excel', file);
      formData.append('type', 0);
      this.$request
        .post('/import/upload/excel', formData, {
          baseURL: '/api/drm/',
          intercept: true,
        })
        .then((res) => {
          this.$refs.table.reload();
          this.$message.success(this.$t('resource.success'));
        })
        .catch((error) => {
          let code = error.data.code,
            message = error.data.message;
          if (code === 'DRM-110018') {
            this.$confirm(
              this.$t('resource.coverTip'),
              this.$t('resource.tip'),
              {
                confirmButtonText: this.$t('resource.confirm'),
                cancelButtonText: this.$t('resource.cancel'),
                type: 'warning',
              },
            )
              .then(() => {
                //确认
                formData.set('type', 1);
                this.$request
                  .post('/import/upload/excel', formData, {
                    baseURL: '/api/drm/',
                  })
                  .then((res) => {
                    this.$message.success(this.$t('resource.success'));
                  });
              })
              .catch(() => {
                //取消
                formData.set('type', 2);
                this.$request
                  .post('/import/upload/excel', formData, {
                    baseURL: '/api/drm/',
                  })
                  .then((res) => {
                    this.$message.success(this.$t('resource.success'));
                  });
              });
          } else {
            this.$message.error(message);
          }
        });
    },
    resourceImport() {
      this.disabled = true;
      this.$request
        .post('/import/exec/excel', null, { baseURL: '/api/drm/' })
        .then((res) => {
          this.disabled = false;
          this.file = [];
        })
        .catch(() => {
          this.disabled = false;
          this.file = [];
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.resource-page {
  .button-group {
    display: flex;
    justify-content: space-between;
  }
  ::v-deep .el-tab-pane {
    padding: 16px;
  }
  .resource-tabs {
    margin-top: 16px;
  }
  .resource-import-button {
    float: right;
  }
}
</style>
