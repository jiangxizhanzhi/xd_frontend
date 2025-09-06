<template>
  <div id="submitReview">
    <div class="submit-record">
      <div class="common-title-div">
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.submitRecord')"
        />
      </div>
      <div class="filter-group">
        <span
          style="display: block; margin: 0 6px 0 1%; text-align: right"
          class="fl one-overflow"
          >{{ $t('m.user') }}</span
        >
        <!-- 筛选器 -->
        <cb-select
          style="width: 25%"
          v-model="submitRecordFilterForm.user"
          :options="rolesList"
          @change="changeUser()"
          titleField="name"
          valueField="resource_id"
          :first="{
            resource_id: '',
            name: $t('m.all'),
          }"
        />
        <span
          style="margin: 0 6px 0; display: block"
          class="fl one-overflow"
          :title="$t('m.assessType')"
          >{{ $t('m.assessType') }}</span
        >
        <!-- 筛选器 -->
        <cb-select
          style="width: 25%"
          v-model="submitRecordFilterForm.assesType"
          :options="assesTypeCom"
          clearable
          @change="changeAssess()"
          :first="{
            value: '',
            label: $t('m.all'),
          }"
        />
        <!-- 未评估 -->
        <cb-checkbox
          v-model="submitRecordFilterForm.onlyNotAssess"
          style="margin: 0 0 0 5px"
          class="fl"
          @change="changeOnlyNotAssess()"
        />
        <span style="margin: 0 0 0 3px" class="fl one-overflow">{{
          $t('m.showOnlyUnevaluated')
        }}</span>
      </div>
      <!-- 提交记录：评估内容 -->
      <div class="record-data tableCommon">
        <cb-scrollbar>
          <div class="port-content">
            <div
              v-for="(item, index) in recordData"
              :key="index"
              class="piece fl"
            >
              <div class="people">
                <div class="potting">
                  <div
                    class="wait"
                    v-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.WAIT.value
                    "
                  >
                    {{ $t('m.toEvaluate') }}
                  </div>
                  <div
                    class="success-p"
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.SUCCESS.value
                    "
                  >
                    {{ $t('m.success') }}
                  </div>
                  <div
                    class="fail"
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.FAIL.value
                    "
                  >
                    {{ $t('m.fail') }}
                  </div>
                  <div
                    class="reject"
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.REJECT.value
                    "
                  >
                    {{ $t('m.reject') }}
                  </div>
                </div>
                <div
                  class="p-name fl one-overflow"
                  :title="item.submit_user_name"
                >
                  {{ item.submit_user_name }}
                </div>
                <div class="p-score fl">
                  <span
                    v-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.WAIT.value
                    "
                    class="to-score"
                    >{{ item.score }}</span
                  >
                  <span
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.SUCCESS.value
                    "
                    class="to-score"
                    >{{ item.score }}</span
                  >
                  <span
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.FAIL.value
                    "
                    class="to-score"
                    >{{ item.score }}</span
                  >
                  <span
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.REJECT.value
                    "
                    class="to-score"
                    >{{ item.score }}</span
                  >/{{ item.mission_data.score }}{{ $t('common.score') }}
                </div>
              </div>
              <div
                class="title fl one-overflow"
                :title="item.mission_data.title"
              >
                {{ item.mission_data.title }}
              </div>
              <div class="p-botton">
                <div class="p-time fl one-overflow" :title="item.evaluate_time">
                  {{ item.evaluate_time }}
                </div>
                <!--0自动评估，1人工评估-->

                <!-- <div v-if="item.evaluate_type == 1" class="p-port fr">
                  {{ $t('m.manualAssessment') }}
                </div>
                <div v-else class="p-port fr">
                  {{ $t('m.automaticEvaluation') }}
                </div> -->
                <!-- 根据evaluator是否有判断人工和自动-->
                <div v-if="item.evaluator" class="p-port fr">
                  {{ $t('m.manualAssessment') }}
                </div>
                <div v-else class="p-port fr">
                  {{ $t('m.automaticEvaluation') }}
                </div>
              </div>
              <div class="blur-box"></div>
              <div class="p-btn" @click="viewRecordAssess(item)">
                <span class="cy-color">{{ $t('m.clickEevaluation') }}</span>
              </div>
            </div>
          </div>
        </cb-scrollbar>
      </div>
      <div class="record-pagination">
        <cb-pagination
          layout="total,sizes, prev, pager, next"
          class="elc-pagination"
          :total="pagination.total"
          :current-page="pagination.current_page"
          :page-size="pagination.per_page"
          :pageSizes="['6', '12', '18', '24']"
          :showQuickJumper="false"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </cb-pagination>
      </div>
    </div>
    <!-- 数据支撑 -->
    <div class="data-support">
      <div class="common-title-div">
        <title-director
          :square-color="'bg-color-sky-blue'"
          :name="$t('m.dataSupport')"
        />
      </div>
      <div class="filter-group data-support-filter">
        <span
          style="display: block; margin: 0 6px 0 2%; cursor: pointer"
          class="fl one-overflow"
          :title="$t('m.main')"
          >{{ $t('m.main') }}</span
        >
        <!-- 主机筛选器 -->
        <cb-select
          style="width: 28%"
          v-model="dataSupportFilterForm.host"
          :options="hostOptions"
          titleField="node_name"
          valueField="server_id"
          @change="changeProbe()"
        />
        <span
          style="margin: 0 6px 0 1%; display: block; cursor: pointer"
          class="fl one-overflow"
          :title="$t('m.time')"
          >{{ $t('m.time') }}</span
        >
        <!-- 时间筛选器 -->
        <!-- popper-class="submit_review" -->
        <cb-date-picker
          v-model="dataSupportFilterForm.time"
          type="datetimerange"
          align="right"
          popper-class="submit_reviews"
          value-format="yyyy-MM-dd HH:mm:ss"
          :range-separator="$t('m.to')"
          :start-placeholder="$t('m.startTime')"
          :end-placeholder="$t('m.endTime')"
          style="width: 60%"
          @change="getProdeByTime()"
        />
      </div>
      <!-- 数据支撑内容 -->
      <div class="data-div">
        <cb-scrollbar>
          <div
            v-for="(item, index) in dataSupport"
            :key="index"
            class="data-lists"
          >
            <cb-row>
              <cb-col :span="6">
                <div :title="item.time" class="support-data">
                  [{{ item.time }}]
                </div>
              </cb-col>
              <cb-col :span="6">
                <div class="support-data" :title="item.ip">{{ item.ip }}</div>
              </cb-col>
              <cb-col :span="6">
                <div
                  class="support-data"
                  style="width: 160px"
                  :title="item.event_desc"
                  v-if="item.event_desc"
                >
                  {{ item.event_desc }}
                </div>
                <div
                  class="support-data"
                  style="width: 160px"
                  :title="item.event_desc"
                  v-else
                >
                  {{ '-' }}
                </div>
              </cb-col>
              <cb-col :span="4">
                <div class="support-data">
                  <cb-button
                    class="fl"
                    @click="viewData(item)"
                    type="text"
                    icon="icon-shiyanbaogaochakan"
                    >{{ $t('m.check') }}</cb-button
                  >
                </div>
              </cb-col>
            </cb-row>
          </div>
        </cb-scrollbar>
      </div>
      <div class="record-pagination">
        <cb-pagination
          layout="total,sizes, prev, pager, next"
          class="elc-pagination"
          :total="paginationInfo.total"
          :current-page="paginationInfo.current_page"
          :page-size="paginationInfo.per_page"
          :pageSizes="['6', '12', '18', '24']"
          :showQuickJumper="false"
          background
          @current-change="currentChange"
          @size-change="sizeChange"
        >
        </cb-pagination>
      </div>
    </div>
    <!--提交记录->点击评估->评估任务弹窗-->
    <cb-dialog
      :title="$t('m.taskAssessment')"
      :visible.sync="dialogAssess"
      width="50%"
      height="500px"
      class="dialogAssess"
      :append-to-body="true"
    >
      <template>
        <assess-score
          v-if="dialogAssess"
          ref="childAssessScore"
          :task-data="taskData"
          @refershData="refershData"
        />
      </template>
      <span slot="footer" class="dialog-footer">
        <cb-button-group>
          <cb-button v-if="isEvaluate" @click="assessSubmit()">{{
            $t('m.ensure')
          }}</cb-button>
          <cb-button v-if="!isEvaluate" disabled>{{
            $t('m.ensure')
          }}</cb-button>
          <cb-button button-type="cancel" @click="cancelAssessForm()">{{
            $t('m.cancel')
          }}</cb-button>
        </cb-button-group>
      </span>
    </cb-dialog>
    <!--数据支撑：查看数据弹窗-->
    <cb-dialog
      :title="$t('m.lookDetails')"
      :visible.sync="dialogView"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      width="50%"
      class="dialogView elc-dialog"
    >
      <template>
        <cb-scrollbar>
          <json-view :json-data="jsonData" />
        </cb-scrollbar>
      </template>
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import utils from '@/utils/utils';
import TitleDirector from '@/pages/web/RedVsBlue/Director/components/title.vue';
import JsonView from '@/components/JsonView/index.vue';
import AssessScore from '@/components/Assess/assessScore.vue';
import wsutil from '@/utils/websocket';
import { getTheme } from '@cyber/helper';
export default {
  components: {
    JsonView,
    AssessScore,
    TitleDirector,
  },
  props: {
    rolesList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    sceneId: {
      type: String,
      default: () => {
        return '';
      },
    },
    flagData: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    // 自动评估: 成功、失败、待评估
    // 自动评估: 成功、失败、驳回
    return {
      cookie: '',
      submitRecordFilterForm: {
        user: '',
        assesType: '',
        onlyNotAssess: false,
      },
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 6,
      },
      paginationInfo: {
        current_page: 1,
        total: 0,
        per_page: 6,
      },
      previous: this.$t('m.previous'),
      next: this.$t('m.next'),
      recordData: [],
      dataSupportFilterForm: {
        host: '',
        /* probe: '', */
        time: [],
      },
      dataSupport: [],
      dialogView: false,
      jsonData: {},
      dialogAssess: false,
      taskData: {},
      resource_id: this.$route.params && this.$route.params.resource_id,
      hostOptions: [],
      prodeOptions: [],
      currentChoosedHost: null,
      setFlag: false,
      isEvaluate: true,
      theme: getTheme(),
      hostAllData: [],
    };
  },
  computed: {
    assesTypeCom() {
      return [
        {
          label: this.$t('m.manualAssessment'),
          value: 1,
        },
        {
          label: this.$t('m.automaticEvaluation'),
          value: 0,
        },
      ];
    },
  },
  watch: {
    'dataSupportFilterForm.host'(nv, ov) {
      this.getProbeUploads();
    },
    'dataSupportFilterForm.time'(nv, ov) {
      this.getProbeUploads();
    },
    flagData: {
      handler(val, oldval) {
        if (val) {
          this.getSceneNodeList();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // 获取cookie
    /* this.cookie = document.cookie.split('cr_jwttoken=')[1]; */
    this.cookie = utils.getCookie('cr_jwttoken');
    this.getSubmitReviewList();
    // this.getGatherInfo();
    this.ReportWs();
    // this.getSceneNodeList();
  },
  methods: {
    getTitle(id, list, idName, username) {
      let name = '';
      const nameArray = _.filter(list, function (ele) {
        return ele[idName] === id;
      });
      nameArray.length > 0 ? (name = nameArray[0][username]) : (name = '');
      return name;
    },

    // [前台]教员-获取学员任务提交记录
    getSubmitReviewList() {
      this.$request
        .get(
          '/cr/training_team/training_team/scene_mission_evaluations',
          {
            roomId: this.resource_id,
            studentHash: this.submitRecordFilterForm.user, // 学员id
            evaluateType: this.submitRecordFilterForm.assesType, // 评估类型
            isShowEvaluated: !this.submitRecordFilterForm.onlyNotAssess, // 是否仅显示已评估数据
            page: this.pagination.current_page,
            per_page: this.pagination.per_page,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.recordData = res.data.data.list;
          this.pagination.total = res.data.data.total;
        });
    },
    ReportWs() {
      wsutil.bind(
        `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
        (data) => {
          if (data.code === 0 || data.code === 2) {
            this.getSubmitReviewList();
          }
        },
      );
    },

    refershData() {
      this.getSubmitReviewList();
      this.dialogAssess = false;
    },

    // 提交记录当前页变化
    handleCurrentChange(val) {
      this.pagination.current_page = val;
      this.getSubmitReviewList();
    },

    // 提交记录分页变化
    handleSizeChange(val) {
      this.pagination.current_page = 1;
      this.pagination.per_page = val;
      this.getSubmitReviewList();
    },

    // 数据支撑当前页变化
    currentChange(val) {
      this.paginationInfo.current_page = val;
      this.getProbeUploads();
    },

    // 数据支撑分页变化
    sizeChange(val) {
      this.paginationInfo.current_page = 1;
      this.paginationInfo.per_page = val;
      this.getProbeUploads();
    },

    // 提交记录搜索组，改变用户
    changeUser() {
      this.pagination.current_page = 1;
      this.getSubmitReviewList();
    },

    // 提交记录搜索组，改变评估方式
    changeAssess() {
      this.pagination.current_page = 1;
      this.getSubmitReviewList();
    },

    // 提交记录搜索组，改变是否只显示未评估数据
    changeOnlyNotAssess() {
      this.pagination.current_page = 1;
      this.getSubmitReviewList();
    },

    // 提交记录：点击评估
    viewRecordAssess(task) {
      // 查看提交记录及评估
      // 只用人工评估的驳回不可以再次评估
      this.isEvaluate = !(
        task.evaluate_type === 1 && task.evaluate_status === 3
      );
      this.dialogAssess = true;
      this.taskData = task;
    },

    // 评估时提交
    assessSubmit() {
      this.$refs['childAssessScore'].validateAssessForm();
    },

    // 取消评估
    cancelAssessForm() {
      this.dialogAssess = false;
    },

    viewData(item) {
      // 点击eye按钮查看数据信息
      this.jsonData = JSON.stringify(item.content);
      this.dialogView = true;
    },

    // 数据支撑获取主机列表
    getSceneNodeList() {
      // 场景id存在再请求此接口
      if (!this.sceneId) {
        this.$message({
          message: this.$t('m.startWithoutScene'),
          type: 'error',
        });
      } else if (this.sceneId) {
        this.$request
          .get(
            `/cscene/monitor/scene/all_elements/${this.sceneId}?realTimeHostState=false`,
            null,
            {
              baseURL: '/api/mp',
            },
          )
          .then((res) => {
            const data = _.get(res, 'data.data', []) || [];
            this.hostAllData = data;
            const hostList = data.map((item) => {
              return {
                node_name: item.name,
                server_id: item.id,
              };
            });
            this.hostOptions = hostList;
            if (this.hostOptions.length) {
              this.dataSupportFilterForm.host = this.hostOptions[0].server_id;
            }

            this.getProbeUploads();
          });
      }
    },

    // 获取数据支撑列表
    getProbeUploads() {
      this.$request
        .get(
          `/cscene/cscene_instances/list_host_events`,
          {
            id: this.sceneId,
            node_ids: [this.dataSupportFilterForm.host],
            start_time:
              (this.dataSupportFilterForm.time &&
                this.dataSupportFilterForm.time.length &&
                this.dataSupportFilterForm.time[0]) ||
              '', // 查询日期范围的初始时间
            end_time:
              (this.dataSupportFilterForm.time &&
                this.dataSupportFilterForm.time.length &&
                this.dataSupportFilterForm.time[1]) ||
              '', // 查询日期范围的结束时间
            page: this.paginationInfo.current_page,
            per_page: this.paginationInfo.per_page,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const list = _.get(res, 'data.data.list', []) || [];
          /* 根据主机匹配主机的ports.ip, 表格要展示ip*/
          let host = this.dataSupportFilterForm.host,
            ipHost = '',
            hostAllData = this.hostAllData;
          for (let i = 0, len = hostAllData.length; i < len; i++) {
            if (host === hostAllData[i].id) {
              if (hostAllData[i].ports.length) {
                ipHost = hostAllData[i].ports[0].ip;
                break;
              }
            }
          }
          list.forEach((item) => {
            item.ip = ipHost;
          });
          this.dataSupport = list;
          this.paginationInfo.total = res?.data?.data?.total;
        })
        .catch((res) => {
          this.$message.error(
            this.$t('m.failedToObtainInformationReportedByTheHost'),
          );
        });
    },

    // 探针
    changeProbe() {
      this.paginationInfo.current_page = 1;
      this.getProbeUploads();
    },

    // 时间
    getProdeByTime() {
      this.paginationInfo.current_page = 1;
      this.getProbeUploads();
    },
  },
};
</script>

<style lang="scss" scoped>
#submitReview {
  width: 100%;
  height: 100%;
  padding: 20px 0;
  .headLine {
    .title-name {
      padding-left: 10px !important;
    }
  }
  .common-title-div {
    width: calc(100% - 8px);
    height: 30px;
    font-size: 14px;
    margin-top: 12px auto 0;
    text-align: center;
    ::v-deep .common-title {
      width: auto !important;
      margin-left: 8px;
      .name-div {
        font-size: 14px !important;
        height: 30px;
      }
    }
  }
  .submit-record {
    width: 100%;
    height: 50%;
  }
  .filter-group {
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px 0 0;
    display: flex;
    justify-content: flex-start;
    ::v-deep .el-input__inner {
      width: 100%;
      height: 30px;
      line-height: 30px;
      padding-left: 5px !important;
      margin-top: 0 !important;
    }
    ::v-deep.el-input__icon {
      line-height: 25px !important;
    }
    & > span {
      min-width: 35px;
    }
  }
  ::v-deep.data-support-filter {
    .el-date-editor .el-range__icon {
      display: none;
    }
    ::v-deep.el-range-input {
      background-color: transparent !important;
    }
    ::v-deep.el-range-separator {
      padding: 0 12px 0 5px;
      line-height: 23px;
    }
  }
  .record-data {
    clear: both;
    width: calc(100% - 14px);
    height: calc(100% - 92px);
    padding: 0 10px;
    .port-content {
      cursor: pointer;
      width: 100%;
      height: 100%;
      padding: 10px 0;
      .piece {
        position: relative;
        width: 215px;
        padding: 21px 10px 21px 15px;
        box-sizing: border-box;
        border-radius: 2px;
        margin: 0 0 4px 10px;
        &:hover {
          .blur-box {
            bottom: 0;
            display: block;
          }
          .p-btn {
            bottom: 0;
            display: block;
            background: var(--bg-color-4);
          }
        }
        .p-btn,
        .blur-box {
          display: none;
          position: absolute;
          left: 0;
          bottom: -40px;
          width: 100%;
          height: 40px;
          text-align: center;
          line-height: 40px;
          border-radius: 0px 0px 2px 2px;
          span {
            font-size: 14px;
            font-weight: 400;
          }
        }
        .potting {
          position: absolute;
          top: 0px;
          right: 0px;
          height: 52px;
          z-index: 99;
          img {
            width: 100%;
            height: 100%;
          }
          .wait,
          .success-p,
          .fail,
          .reject {
            padding: 0 10px;
            height: 24px;
            font-size: 12px;
            font-weight: 400;
            line-height: 24px;
            text-align: center;
            border-radius: 2px;
          }
          .success-p {
            background: var(--green-color-2);
            color: var(--green-color);
            border: 1px solid var(--green-color);
          }
          .fail {
            background: var(--red-color-2);
            color: var(--red-color);
            border: 1px solid var(--red-color);
          }
          .reject {
            background: var(--orange-color-2);
            color: var(--orange-color);
            border: 1px solid var(--orange-color);
          }
          .wait {
            background: var(--primary-color-2);
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
          }
        }
        .p-score {
          position: absolute;
          left: 45%;
        }
        .people {
          width: 100%;
          height: 18px;
          font-size: 14px;
          .p-name {
            width: 35%;
            height: 20px;
            font-weight: bold;
          }
        }
        .title {
          width: 100%;
          height: 40px;
          padding-top: 10px;
          box-sizing: border-box;
          font-size: 14px;
          font-weight: 300;
        }
        .p-botton {
          width: 100%;
          height: 14px;
          font-size: 12px;
          font-weight: 400;
          padding-top: 3px;
          box-sizing: border-box;
          .p-time,
          .p-port {
            width: 63%;
            height: 20px;
            text-align: center;
            line-height: 20px;
            border-radius: 2px;
          }
          .p-port {
            width: 30%;
            height: 20px;
          }
        }
      }
    }
  }
  .record-pagination {
    width: 100%;
    height: 35px;
    .el-pagination {
      margin: 3px 0 0;
    }
    .el-pagination button span,
    .el-pagination.is-background .el-pager li {
      line-height: 21px !important;
    }
  }
  .data-support {
    width: 100%;
    height: 50%;
    .data-div {
      width: calc(100% - 20px);
      height: 160px;
      // margin: 16px 10px 10px 10px;
      margin: 16px 10px 2px 10px;
      font-size: 14px;
      font-weight: 400;
    }
    .data-lists {
      width: 100%;
      height: 40px;
      text-align: center;
      line-height: 40px;
    }
    .btn {
      cursor: pointer;
      width: 10%;
      height: 40px;
      text-align: center;
      line-height: 40px;
      padding-left: 10px;
      img {
        display: inline-block;
        margin: 3px 5px 0 0;
        vertical-align: middle;
      }
      span {
        font-size: 12px;
        vertical-align: middle;
      }
    }
  }
}
.dialogAssess,
.dialogView {
  width: 100%;
  height: 100%;
  ::v-deep .el-dialog__body {
    height: 600px;
    padding: 20px 40px;
    .el-scrollbar__bar {
      z-index: 9999;
    }
  }
}
.support-data {
  width: 180px;
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style lang="scss">
.submit_reviews {
  .el-time-panel {
    left: -28px;
  }
}
</style>
