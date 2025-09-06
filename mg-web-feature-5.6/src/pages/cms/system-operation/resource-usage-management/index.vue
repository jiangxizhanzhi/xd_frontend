<template>
  <cb-inner-page :background="false">
    <div class="template-all">
      <div class="storage-area mb20">
        <div class="storage-content">
          <div class="storage-content-line">
            <div class="storage-title">
              <span></span>
              <span>{{
                $t('systemOperation.resourceUsage.storageSpace')
              }}</span>
            </div>
            <div style="padding: 0 90px">
              <div class="lengend-line-list">
                <div class="used-total-lengend">
                  <div class="screen-lengend">
                    <span></span>
                    <span></span>
                  </div>
                  <div class="used-total-size">
                    <span>{{
                      $t('systemOperation.resourceUsage.resourceTotalUsedSpace')
                    }}</span>
                    <span>{{ usedTotalSize }}G</span>
                  </div>
                  <div class="used-total-percent">
                    <span>{{
                      $t('systemOperation.resourceUsage.proportion')
                    }}</span>
                    <span>{{ usedTotalPercent }}%</span>
                  </div>
                </div>
                <div class="each-lengend">
                  <div
                    class="lengend-line-item"
                    v-for="(item, i) in lengendLine"
                    :key="item.name"
                  >
                    <span :class="['item-circle', 'item-circle' + i]"></span>
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </div>
              <div class="line-content">
                <div
                  v-for="(item, i) in lengendLine"
                  :key="item.value"
                  :class="['percent', 'percent' + (i + 1)]"
                  :style="{
                    width:
                      i === 0
                        ? `${percent1}%`
                        : i === 1
                        ? `${percent2}%`
                        : i === 2
                        ? `${percent3}%`
                        : `${percent4}%`,
                  }"
                  @mouseover="showTooltip(i + 1, $event)"
                  @mouseleave="hideTooltip()"
                ></div>
              </div>
            </div>
            <div id="tooltip" class="tooltip" v-show="tooltipShow">
              <div>
                <span>{{ tooltipTitle }}</span
                ><span>{{ gbNumber }} G</span>
              </div>
              <div>
                <span>{{ $t('systemOperation.resourceUsage.proportion') }}</span
                ><span>{{ proportion }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-table-area">
        <cb-tabs type="border-card" v-model="isActive">
          <cb-tab-pane :label="tabList[0].name" name="0">
            <cb-search-table
              v-show="isActive === '0'"
              ref="recordTableRef"
              class="table-area-table"
              :cols="colsLp"
              :selector="selector"
              :selection.sync="selection"
              :url="recordUrl"
              :data="model"
              row-key="file_name"
              baseURL="/api/mp"
              :searchBarBg="false"
            >
              <template v-slot:search>
                <cb-button
                  hollow
                  button-type="delete"
                  @click="multipleDelete"
                  :disabled="selection.length === 0"
                  mr
                ></cb-button>
                <cb-button
                  button-type="delete"
                  hollow
                  @click="deleteSelectedRow(selection, $event, 1)"
                  mr
                >
                  {{
                    $t('systemOperation.resourceUsage.deleteSixMonthsAgoFile')
                  }}
                </cb-button>
                <cb-button
                  button-type="delete"
                  hollow
                  @click="deleteSelectedRow(selection, $event, 2)"
                >
                  {{
                    $t('systemOperation.resourceUsage.deleteThreeMonthsAgoFile')
                  }}
                </cb-button>
                <cb-button color-type="red hollow" @click="showClearDialog">
                  {{
                    $t('systemOperation.resourceUsage.autoClearConfiguration')
                  }}
                </cb-button>
              </template>
              <template v-slot:filter>
                <div class="search-form-item">
                  <div class="left-area">
                    <cb-date-picker
                      v-model="model.start_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :placeholder="
                        $t('systemOperation.resourceUsage.startTime')
                      "
                    >
                    </cb-date-picker>
                    <span class="to"
                      ><span>{{
                        $t('systemOperation.resourceUsage.to')
                      }}</span></span
                    >
                    <cb-date-picker
                      v-model="model.end_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :placeholder="$t('systemOperation.resourceUsage.endTime')"
                    >
                    </cb-date-picker>
                  </div>
                  <div class="right-area">
                    <cb-search-input
                      style="width: 300px"
                      v-model="model.search"
                      :placeholder="
                        $t('systemOperation.resourceUsage.enterNameOrgScene')
                      "
                    ></cb-search-input>
                  </div>
                </div>
              </template>
              <template v-slot:file_name="scope">
                <!-- todo：下载 -->
                <span
                  class="download-file"
                  @click="downloadRecord(scope.data.file, scope.data.file_name)"
                  >{{ scope.data.file_name }}</span
                >
              </template>
            </cb-search-table>
          </cb-tab-pane>
          <cb-tab-pane :label="tabList[1].name" name="1">
            <cb-search-table
              v-show="isActive === '1'"
              ref="screenTableRef"
              class="table-area-table"
              :cols="colsJp"
              :selector="selector"
              :selection.sync="selection"
              :url="screenUrl"
              :data="model"
              baseURL="/api/mp"
              :searchBarBg="false"
            >
              <template v-slot:search>
                <cb-button
                  hollow
                  button-type="delete"
                  @click="multipleDelete"
                  :disabled="selection.length === 0"
                  mr
                ></cb-button>
                <cb-button
                  button-type="delete"
                  hollow
                  @click="deleteSelectedRow(selection, $event, 1)"
                  mr
                >
                  {{
                    $t('systemOperation.resourceUsage.deleteSixMonthsAgoFile')
                  }}
                </cb-button>
                <cb-button
                  button-type="delete"
                  hollow
                  @click="deleteSelectedRow(selection, $event, 2)"
                >
                  {{
                    $t('systemOperation.resourceUsage.deleteThreeMonthsAgoFile')
                  }}
                </cb-button>
              </template>
              <template v-slot:filter>
                <div class="search-form-item">
                  <div class="left-area">
                    <cb-date-picker
                      v-model="model.start_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :placeholder="
                        $t('systemOperation.resourceUsage.startTime')
                      "
                    >
                    </cb-date-picker>
                    <span class="to"
                      ><span>{{
                        $t('systemOperation.resourceUsage.to')
                      }}</span></span
                    >
                    <cb-date-picker
                      v-model="model.end_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :placeholder="$t('systemOperation.resourceUsage.endTime')"
                    >
                    </cb-date-picker>
                  </div>
                  <div class="right-area">
                    <cb-search-input
                      style="width: 300px"
                      v-model="model.search"
                      :placeholder="
                        $t('systemOperation.resourceUsage.enterNameOrgScene')
                      "
                    ></cb-search-input>
                  </div>
                </div>
              </template>
              <template v-slot:file_name="scope">
                <span
                  class="download-file"
                  @click="downloadScreen(scope.data.file, scope.data.file_name)"
                  >{{ scope.data.file_name }}</span
                >
              </template>
            </cb-search-table>
          </cb-tab-pane>
        </cb-tabs>
      </div>
    </div>
    <cb-dialog
      :title="$t('systemOperation.resourceUsage.autoClearConfiguration')"
      center
      :visible.sync="autoClearDialog"
      width="540px"
    >
      <div class="auto-clear-form-box">
        <cb-form
          ref="autoClearFormRef"
          :model="autoClearForm"
          :rules="autoClearRules"
          url="/devops/cluster/screenrecord/update_restore_limit_config"
          baseURL="/api/mp"
          label-width="150px"
          label-position="right"
          json
        >
          <cb-form-item
            :label="$t('systemOperation.resourceUsage.upperStorageSpaceLimit')"
            prop="file_limit_space"
          >
            <cb-input-number
              v-model="autoClearForm.file_limit_space"
              controls-position="right"
              :min="1"
            ></cb-input-number>
            <span>G</span>
          </cb-form-item>
          <cb-form-item
            :label="$t('systemOperation.resourceUsage.upperStorageTimeLimit')"
            prop="file_limit_time"
          >
            <cb-input-number
              v-model="autoClearForm.file_limit_time"
              controls-position="right"
              :min="1"
            ></cb-input-number>
            <span>{{ $t('systemOperation.resourceUsage.month') }}</span>
          </cb-form-item>
        </cb-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <cb-button-group>
          <cb-button button-type="confirm" @click="submit($event)"></cb-button>
          <cb-button
            button-type="cancel"
            @click="dialogOptCancel()"
          ></cb-button>
        </cb-button-group>
      </div>
    </cb-dialog>
  </cb-inner-page>
</template>

<script>
import {
  screenRecordingDelete,
  screenShotDelete,
  clusterScreenShotDelete,
  recordShotDelete,
  searchSpaceLimit,
} from '@/api/resource-usage-management';
import Utils from '@/utils/utils';
export default {
  name: 'ResourceManagement',
  data() {
    return {
      recordUrl: '/devops/cluster/screenrecord/page',
      screenUrl: '/devops/cluster/screenshot',
      ready: false,
      lengendLine: [
        {
          name: this.$t('systemOperation.resourceUsage.screenRecordingSpace'),
          value: 'screenRecordingSpace',
        },
        {
          name: this.$t('systemOperation.resourceUsage.screenShotSpace'),
          value: 'screenShotSpace',
        },
        {
          name: this.$t('systemOperation.resourceUsage.systemFreeSpace'),
          value: 'systemFreeSpace',
        },
        {
          name: this.$t('systemOperation.resourceUsage.otherSpace'),
          value: 'otherUsed',
        },
      ],

      usedTotalSize: 0,
      usedTotalPercent: 0,
      tooltipTitle: '',
      gbNumber: 0,
      proportion: 0, // 占比
      percent1: 0,
      percent2: 0,
      percent3: 0,
      percent4: 0,
      recordingNumber: 0,
      shotsNumber: 0,
      useNumber: 0,
      totalNumber: 1,
      tooltipShow: false,
      // 系统总空间
      totalSpace: 0,
      otherSpace: 0,
      isActive: '0',
      tabList: [
        {
          name: this.$t(
            'systemOperation.resourceUsage.recordScreenFileManagement',
          ),
        },
        {
          name: this.$t(
            'systemOperation.resourceUsage.shotScreenFileManagement',
          ),
        },
      ],
      selector: {
        maxSelect: 0,
      },
      selection: [],
      model: {
        start_time: '',
        end_time: '',
        search: '',
      },
      cols: [],
      // 录屏
      colsLp: [
        {
          label: this.$t('systemOperation.resourceUsage.name'),
          prop: 'user_name',
        },
        {
          label: this.$t('systemOperation.resourceUsage.organization'),
          prop: 'user_org_name',
        },
        {
          label: this.$t('systemOperation.resourceUsage.sceneName'),
          prop: 'scene_name',
          sorter: 'sceneName',
        },
        // 节点名称
        {
          label: this.$t('systemOperation.resourceUsage.nodeName'),
          prop: 'host',
        },
        {
          label: this.$t('systemOperation.resourceUsage.recordScreenFile'),
          slot: 'file_name',
          width: 350,
        },
        {
          label: this.$t('systemOperation.resourceUsage.fileSize'),
          sorter: 'file_size',
          getData: (data) => {
            const { file_size } = data;
            return Utils.filterSize(file_size);
          },
        },
        {
          label: this.$t('systemOperation.resourceUsage.recordScreenTime'),
          prop: 'create_time',
          sorter: 'create_time',
        },
      ],
      // 截屏
      colsJp: [
        {
          label: this.$t('systemOperation.resourceUsage.name'),
          prop: 'user_name',
        },
        {
          label: this.$t('systemOperation.resourceUsage.organization'),
          prop: 'user_org_name',
        },
        {
          label: this.$t('systemOperation.resourceUsage.sceneName'),
          prop: 'scene_name',
          sorter: 'sceneName',
        },
        {
          label: this.$t('systemOperation.resourceUsage.shotScreenFile'),
          slot: 'file_name',
          width: 350,
        },
        {
          label: this.$t('systemOperation.resourceUsage.fileSize'),
          sorter: 'fileSize',
          getData: (data) => {
            const { file_size } = data;
            return Utils.filterSize(file_size);
          },
        },
        {
          label: this.$t('systemOperation.resourceUsage.shotScreenTime'),
          prop: 'create_time',
          sorter: 'createTime',
        },
      ],
      autoClearDialog: false,
      autoClearForm: {
        file_limit_space: 0,
        file_limit_time: 0,
      },
      autoClearRules: {},
    };
  },
  created() {
    this.cols = [...this.colsLp];
    this.ready = true;
    this.getPercentData();
    this.searchSpaceLimitTh();
  },
  computed: {},
  watch: {
    isActive(val) {
      this.model = {
        start_time: '',
        end_time: '',
        search: '',
      };
      this.selection = [];
    },
  },
  methods: {
    searchSpaceLimitTh() {
      searchSpaceLimit().then((res) => {
        const data = _.get(res, 'data.data');
        this.autoClearForm = data;
      });
    },
    showClearDialog() {
      this.autoClearDialog = true;
    },
    dialogOptCancel() {
      this.clearForm();
    },
    submit(done) {
      this.$refs.autoClearFormRef
        .submit({
          ...this.autoClearForm,
        })
        .then((res) => {
          this.autoClearDialog = false;
          this.clearForm();
          this.searchSpaceLimitTh();
          done();
        });
    },
    clearForm() {
      this.autoClearDialog = false;
      this.$refs.autoClearFormRef.resetFields();
    },

    showTooltip(n, event) {
      let tooltip = null;
      tooltip = document.querySelector('#tooltip');
      let restWidth = document.body.offsetWidth - event.clientX;
      if (restWidth < 300) {
        tooltip.style.left = event.clientX - (300 - restWidth) + 'px';
      } else {
        tooltip.style.left = event.clientX + 'px';
      }

      tooltip.style.top = event.clientY - 80 - 16 - 10 + 'px';
      this.tooltipShow = true;
      if (n === 1) {
        this.tooltipTitle = this.$t(
          'systemOperation.resourceUsage.screenRecordingSpace',
        );
        this.gbNumber = (this.recordingNumber / 1024 / 1024 / 1024).toFixed(2);
        this.proportion = this.percent1;
      } else if (n === 2) {
        this.tooltipTitle = this.$t(
          'systemOperation.resourceUsage.screenShotSpace',
        );
        this.gbNumber = (this.shotsNumber / 1024 / 1024 / 1024).toFixed(2);
        this.proportion = this.percent2;
      } else if (n === 3) {
        this.tooltipTitle = this.$t(
          'systemOperation.resourceUsage.systemFreeSpace',
        );
        this.gbNumber = (this.useNumber / 1024 / 1024 / 1024).toFixed(2);
        this.proportion = this.percent3;
      } else {
        this.tooltipTitle = this.$t('systemOperation.resourceUsage.otherSpace');
        this.gbNumber = (this.otherSpace / 1024 / 1024 / 1024).toFixed(2);
        this.proportion = this.percent4;
      }
    },
    hideTooltip() {
      this.tooltipShow = false;
    },
    getPercentData() {
      this.$request
        .get(`/devops/cluster/screenrecord/space_statics`, null, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          const {
            used_total,
            used_percent,
            left_space,
            left_percent,
            screen_record_used,
            screen_record_percent,
            screenshot_used,
            screenshot_percent,
            other_used,
            other_percent,
          } = res.data.data;
          this.usedTotalSize = (used_total / 1024 / 1024 / 1024).toFixed(2);
          this.usedTotalPercent = used_percent;
          this.recordingNumber = screen_record_used;
          this.shotsNumber = screenshot_used;
          this.useNumber = left_space;
          this.otherSpace = other_used;
          this.percent1 = screen_record_percent;
          this.percent2 = screenshot_percent;
          this.percent3 = left_percent;
          this.percent4 = other_percent;
        });
    },
    // todo:文件路径拼接
    filePathJoint(path) {
      return (
        window.top.location.protocol + '//' + window.top.location.host + path
      );
    },
    // 删除
    deleteSelectedRow(data, done, date) {
      let params = {
        record_time: date,
      };
      if (this.isActive === '0') {
        // 录屏
        recordShotDelete(params)
          .then(() => {
            this.selection = [];
            this.$refs.recordTableRef.reload();
            this.getPercent();
            done();
          })
          .catch(() => {
            done(false);
          });
      } else {
        // 截屏
        screenShotDelete(params)
          .then(() => {
            this.selection = [];
            this.$refs.screenTableRef.reload();
            this.getPercent();
            done();
          })
          .catch(() => {
            done(false);
          });
      }
    },
    // 批量删除
    multipleDelete(done) {
      if (this.isActive === '0') {
        // 录屏
        let params = {
          record_names: this.selection.map((el) => el.file_name),
        };
        screenRecordingDelete(params)
          .then(() => {
            this.selection = [];
            this.$refs.recordTableRef.reload();
            this.getPercent();
            done();
          })
          .catch(() => {
            done(false);
          })
          .finally(() => {
            done(false);
          });
      } else {
        // 截屏
        let params = {
          ids: this.selection.map((el) => el.id),
        };
        clusterScreenShotDelete(params)
          .then(() => {
            this.selection = [];
            this.$refs.screenTableRef.reload();
            this.getPercent();
            done();
          })
          .catch(() => {
            done(false);
          })
          .finally(() => {
            done(false);
          });
      }
    },
    downloadRecord(file, name) {
      this.$request
        .get(
          `/devops/cluster/screenrecord/download`,
          { fileName: name },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          let url = res?.data?.data;
          window.top.open(url, '_blank');
        });
    },
    downloadScreen(file, name) {
      this.$request.binaryDownload(
        'get',
        '/devops/cluster/screenshot/download',
        { filePath: file },
        { baseURL: '/api/mp', filename: name },
      );
    },
  },
};
</script>
<style scoped>
.table-area-table /deep/ .cb-search-bar .cb-search__search {
  width: 100% !important;
}
</style>
<style lang="scss" scoped>
.template-all {
  .storage-area {
    .storage-content {
      .storage-content-line {
        background-color: var(--bg-color-2);
        .storage-title {
          color: var(--neutral8);
          span:first-child {
            background: var(--primary-color);
          }
        }
        .lengend-line-list {
          .used-total-lengend {
            .screen-lengend {
              span:first-child {
                background-color: var(--primary-color);
              }
              span:last-child {
                background: var(--yellow-color);
              }
            }
            .used-total-size {
              span:first-child {
                color: var(--neutral7);
              }
              span:last-child {
                color: var(--neutral8);
              }
            }
            .used-total-percent {
              span:first-child {
                color: var(--neutral7);
              }
              span:last-child {
                color: var(--neutral8);
              }
            }
          }
          .each-lengend {
            .lengend-line-item {
              color: var(--neutral8);
              span.item-circle0 {
                background-color: var(--primary-color);
              }
              span.item-circle1 {
                background-color: var(--yellow-color);
              }
              span.item-circle2 {
                background-color: var(--green-color);
              }
              span.item-circle3 {
                background-color: var(--neutral5);
              }
              span:last-child {
                color: var(--neutral8);
              }
            }
          }
        }
        .line-content {
          div.percent1 {
            background-color: var(--primary-color);
          }
          div.percent2 {
            background-color: var(--yellow-color);
          }
          div.percent3 {
            background-color: var(--green-color);
          }
          div.percent4 {
            background-color: var(--neutral5);
          }
        }
      }
    }
  }
  .tooltip {
    background: var(--bg-color-3);
    color: var(--neutral7);
    div {
      span:last-child {
        color: var(--neutral8);
      }
    }
  }
  .tab-table-area {
    .download-file {
      color: var(--primary-color);
    }
  }
}

.template-all {
  display: flex;
  flex-direction: column;

  .storage-area {
    margin-bottom: 16px;
    .storage-content {
      display: flex;
      flex-direction: row;
      .storage-content-line {
        display: flex;
        flex-grow: 1;
        width: 100%;
        height: 210px;
        padding: 20px 22px;
        flex-direction: column;
        .storage-title {
          font-size: 14px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          span:first-child {
            width: 6px;
            height: 8px;
            margin-right: 10px;
          }
        }
        .lengend-line-list {
          display: flex;
          flex-direction: row;
          margin-bottom: 21px;
          justify-content: space-between;
          .used-total-lengend {
            display: flex;
            flex-direction: row;
            .screen-lengend {
              width: 26px;
              position: relative;
              display: flex;
              align-items: center;
              margin-right: 10px;
              span {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                position: absolute;
              }
              span:first-child {
                position: absolute;
                z-index: 20;
                opacity: 0.8;
              }
              span:last-child {
                left: 10px;
                width: 15px;
                height: 15px;
                z-index: 1;
              }
            }
            .used-total-size {
              margin-right: 38px;
              span:first-child {
                font-size: 14px;
                margin-right: 10px;
              }
              span:last-child {
                font-weight: bold;
                font-size: 16px;
              }
            }
            .used-total-percent {
              span:first-child {
                font-size: 14px;
                margin-right: 10px;
              }
              span:last-child {
                font-weight: bold;
                font-size: 16px;
              }
            }
          }
          .each-lengend {
            display: flex;
            flex-direction: row;
            .lengend-line-item:last-child {
              margin-right: 0;
            }
            .lengend-line-item {
              font-size: 14px;
              margin-right: 39px;
              display: flex;
              flex-direction: row;
              align-items: center;
              span.item-circle {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
              }
            }
          }
        }
        .line-content {
          height: 16px;
          width: 100%;
          display: flex;
          flex-direction: row;
          div.percent {
            height: 100%;
          }
        }
      }
    }
  }
  .tooltip {
    min-width: 170px;
    max-width: 300px;
    height: 80px;
    position: fixed;
    display: flex;
    flex-direction: column;
    padding: 12px 15px;

    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:first-child {
        font-size: 14px;
        margin-right: 20px;
      }
      span:last-child {
        font-size: 16px;
      }
    }
    div:first-child {
      margin-bottom: 5px;
    }
  }
  .tab-table-area {
    display: flex;
    flex-direction: column;

    .search-form-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .to {
      font-size: 14px;
    }

    .download-file {
      cursor: pointer;
    }
  }
}
</style>
