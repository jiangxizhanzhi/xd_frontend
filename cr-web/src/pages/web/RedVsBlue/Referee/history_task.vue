<template>
  <!-- 红蓝对抗历史任务 -->
  <div class="history-task-page">
    <cb-scrollbar style="height: 100%">
      <div class="content clearfix">
        <div class="history-top">
          <p class="condition-title fl color-gray">{{ $t('m.allResult') }}:</p>
          <div class="fl" style="width: 89%">
            <div v-show="showUserName" class="fl choosed" :title="allUserName">
              <span class="search-name">{{ $t('m.username') }}:</span>
              <span class="search-con color-sky-blue">{{ userName }}</span>
              <span @click="removeUser()">
                <cb-iconfont
                  type="icon-guanbi"
                  color="var(--red-color)"
                  size="12"
                  style="margin-left: 6px; cursor: pointer; font-weight: bolder"
                ></cb-iconfont>
              </span>
            </div>
            <div v-show="showRole" class="fl choosed" :title="allRoleName">
              <span class="search-name">{{ $t('device.role') }} :</span>
              <span class="search-con color-sky-blue">{{ roleName }}</span>
              <span @click="removeRole()">
                <cb-iconfont
                  type="icon-guanbi"
                  color="var(--red-color)"
                  size="12"
                  style="margin-left: 6px; cursor: pointer; font-weight: bolder"
                ></cb-iconfont>
              </span>
            </div>
            <div
              v-show="showFinishState"
              class="fl choosed"
              :title="allFinishStateName"
            >
              <span class="search-name">{{ $t('m.completionStatus') }} :</span>
              <span class="search-con color-sky-blue">{{
                finishStateName
              }}</span>
              <span @click="removeFinishState()">
                <cb-iconfont
                  type="icon-guanbi"
                  color="var(--red-color)"
                  size="12"
                  style="margin-left: 6px; cursor: pointer; font-weight: bolder"
                ></cb-iconfont>
              </span>
            </div>
          </div>
        </div>
        <div class="history-content task-scoped">
          <div v-show="showSelectUser" class="query-criteria">
            <cb-row>
              <screen-queries
                v-if="isRouterUser"
                :state="stateUser"
                :label="labelUser"
                :init-data="dataUser"
                @listenEnsure="ensureMultiple"
                @listenSingle="ensureSingle"
                @listenCancel="cancelUser"
              />
            </cb-row>
          </div>
          <div v-show="showSelectRole" class="query-criteria">
            <cb-row>
              <screen-queries
                v-if="isRouterRole"
                :label="labelRole"
                :state="stateRole"
                :init-data="dataRole"
                class="state-role"
                @listenEnsure="ensureMultipleRole"
                @listenSingle="ensureSingleRole"
                @listenCancel="cancelRole"
              />
            </cb-row>
          </div>
          <div v-show="showSelectFinishState" class="query-criteria">
            <cb-row>
              <screen-queries
                v-if="isRouterFinishState"
                :label="labelCompletionStatus"
                :state="stateCompletionStatus"
                :init-data="dataCompletionStatus"
                @listenEnsure="ensureMultipleFinishState"
                @listenSingle="ensureSingleFinishState"
                @listenCancel="cancelFinishState"
              />
            </cb-row>
          </div>
          <div class="query-criteria clearfix">
            <div class="search-title color-gray fl">
              {{ $t('m.taskNameKeyword') }} :
            </div>
            <div class="fl">
              <cb-input
                v-model="search"
                class="task-input elc-input elc-input-16"
                size="small"
                type="num"
                @keyup.enter.native="selectTable()"
                @change="selectTable()"
                :placeholder="$t('m.enterKeywords')"
              />
            </div>
            <div class="fl" style="margin-top: 5px">
              <div class="search-title color-gray search-tips">
                {{ $t('m.KeywordSegmentationBySemicolon') }}
              </div>
            </div>
          </div>
          <div class="query-criteria clearfix">
            <div class="search-title color-gray fl">
              {{ $t('m.satartAndStop') }} :
            </div>
            <div class="fl query-time elc-date-picker elc-input-16">
              <cb-date-picker
                v-model="startEndTime"
                :range-separator="$t('m.to')"
                :start-placeholder="$t('m.startTime')"
                :end-placeholder="$t('m.endTime')"
                type="datetimerange"
                @change="timeChange"
              />
            </div>
          </div>
        </div>
        <!-- 历史任务table -->
        <div class="history-bottom task-scoped elc-table">
          <!-- <el-scrollbar> -->
          <template>
            <cb-search-table
              :cols="colnums"
              rowKey="resource_id"
              :dataSource="paginationData"
              :hidePaginOnDemand="true"
              :searchBarBg="false"
            >
              <template v-slot:score="scope">
                <span>{{ scope.data.score }}{{ $t('common.score') }}</span>
              </template>
              <template v-slot:evaluator="scope">
                <cb-iconfont
                  v-if="scope.data.evaluator"
                  size="16"
                  class="color-green"
                  type="icon-ren"
                ></cb-iconfont>
                <cb-iconfont
                  v-else
                  size="16"
                  class="color-green"
                  type="icon-diannao"
                ></cb-iconfont>
                <span v-if="scope.data.evaluator" style="margin-left: 10px">{{
                  $t('m.peopleReview')
                }}</span>
                <span v-else style="margin-left: 10px">{{
                  $t('m.machineReview')
                }}</span>
              </template>
              <template v-slot:evaluateStatus="scope">
                <span
                  v-if="
                    scope.data.evaluate_status ===
                    $CONSTANT.SceneTerminal.ReviewStatus.WAIT.value
                  "
                  class="toevaluate"
                  >{{ $t('m.toEvaluate') }}</span
                >
                <span
                  v-else-if="
                    scope.data.evaluate_status ===
                    $CONSTANT.SceneTerminal.ReviewStatus.SUCCESS.value
                  "
                  class="success"
                  >{{ $t('m.success') }}</span
                >
                <span
                  v-else-if="
                    scope.data.evaluate_status ===
                    $CONSTANT.SceneTerminal.ReviewStatus.FAIL.value
                  "
                  class="fail"
                  >{{ $t('m.fail') }}</span
                >
                <span
                  v-else-if="
                    scope.data.evaluate_status ===
                    $CONSTANT.SceneTerminal.ReviewStatus.REJECT.value
                  "
                  class="reject"
                  >{{ $t('m.reject') }}</span
                >
                <span v-else />
              </template>
              <template v-slot:operation="scope">
                <div
                  class="btn-row color-sky-blue"
                  @click="taskCheck(scope.$index, scope.data)"
                >
                  <cb-iconfont
                    size="14"
                    class="color-sky-blue fl"
                    type="icon-chakan"
                    style="margin: 4px 3px 0 0"
                  ></cb-iconfont>
                  <span>{{ $t('m.check') }}</span>
                </div>
              </template>
            </cb-search-table>
          </template>
          <!-- </el-scrollbar> -->
        </div>
        <div class="history-footer">
          <!-- 任务table分页 -->
          <cb-pagination
            :total="pagination.total"
            :pageSizes="['5', '10']"
            :current.sync="pagination.current_page"
            :page-size.sync="pagination.per_page"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </cb-scrollbar>
    <!--查看任务弹窗-->
    <cb-dialog
      :title="$t('m.taskDetails')"
      :visible.sync="dialogSee"
      width="50%"
      class="dialogSee elc-dialog"
      :append-to-body="true"
    >
      <check-task :form-info="form" :pieLabelData="pieLabelArr" v-if="ready" />
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import wsutil from '@/utils/websocket';
import utils from '@/utils/utils';
import CheckTask from './components/check_task.vue';
import ScreenQueries from '@/components/ScreenQueries/query.vue';
import { getTaskList } from '@/api/web/expert_assess.js';
import { evaluationSubmit } from '@/api/web/expert_assess.js';
import moment from 'moment';
import { getRadarLabels } from '@/api/common.js';

export default {
  components: {
    CheckTask,
    ScreenQueries,
  },
  filters: {},
  props: {
    breadcrumbName: {
      type: String,
      default: '',
    },
    crEventData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    var checkScore = (rule, value, callback) => {
      if (
        isNaN(value) ||
        value.trim === '' ||
        !/(^[0-9]*[1-9][0-9]*$)/.test(value)
      ) {
        callback(new Error(this.$t('m.pleaseEnterPositiveInteger')));
      } else {
        if (value > this.rejectForm.score) {
          callback(
            new Error(
              this.$t('m.theScoreMustNotExceed')`${this.rejectForm.score}`,
            ),
          );
        } else {
          callback();
        }
      }
    };
    return {
      ready: true,
      listen: new this.$ListenDomChange({
        dom: document.body,
        callback: this.listenFunc,
      }),
      cookie: '',
      pattern: /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g,
      isReject: true,
      visibleOperation: false,
      resource_id: null,
      search: '',
      startEndTime: null,
      historyTask: this.$t('m.historyTask'),
      pagination: {
        current_page: 1,
        from: 0,
        to: 0,
        last_page: 1,
        next_page_url: null,
        per_page: 5,
        prev_page_url: null,
      },
      previous: this.$t('m.previous'),
      next: this.$t('m.next'),
      tableTaskList: [],
      resultDataFilter: [],
      dialogReject: false,
      form: {
        evaluation_id: '',
        name: '',
        content: '',
        userAnswers: '',
        standardAnswer: '',
        write_up: '',
        region: '',
        realReason: '',
        score: '',
        level_data: [],
        type: '',
        answerOption: [],
      },
      rejectForm: {
        evaluation_id: '',
        defaultReasons: '',
        realReason: '',
        score: '',
        judgeScore: '',
        evaluate_status: '',
      },
      dialogSee: false,
      selectReasons: [
        {
          value: 0,
          label: '事件支持充分',
        },
        {
          value: 1,
          label: '事件支持不充分',
        },
      ],
      checkList: [],
      showSelected: false,
      checkedUsers: [],
      checkBoxStatus: false,
      all: 10,
      userListSingle: [],
      userListMultiple: [],
      dataUser: [],
      dataRole: [],
      dataCompletionStatus: [
        { id: 1, logo: '', rep_name: this.$t('m.success') },
        { id: 2, logo: '', rep_name: this.$t('m.fail') },
        { id: 3, logo: '', rep_name: this.$t('m.reject') },
        { id: 0, logo: '', rep_name: this.$t('m.toEvaluate') },
      ],
      showUserName: false,
      userName: null,
      allUserName: null,
      showSelectUser: true,
      labelUser: this.$t('m.user'),
      labelRole: this.$t('m.role'),
      labelCompletionStatus: this.$t('m.completionStatus'),
      stateUser: '1',
      stateRole: '2',
      stateCompletionStatus: '3',
      showRole: false,
      roleName: null,
      allRoleName: null,
      showSelectRole: true,
      showFinishState: false,
      finishStateName: null,
      allFinishStateName: null,
      showSelectFinishState: true,
      isRouterUser: true,
      isRouterRole: true,
      isRouterFinishState: true,
      submitData: {
        user: [],
        role: [],
        status: [],
        keyword: [],
        time: [],
      },
      paginationData: [],
      tableInterim: [],
      tableIndex: null,
      rules: {
        defaultReasons: [
          {
            required: true,
            message: this.$t('m.pleaseSelectPresetReason'),
            trigger: 'change',
          },
        ],
        realReason: [
          {
            required: true,
            message: this.$t('m.pleaseEnterVerdictDetails'),
            trigger: 'blur',
          },
          {
            min: 1,
            max: 100,
            message: this.$t('m.assessScoreRules'),
            trigger: 'blur',
          },
        ],
        judgeScore: [
          {
            required: true,
            message: this.$t('m.scoreCannotBeEmpty'),
            trigger: ['change', 'blur'],
          },
          { validator: checkScore, trigger: ['change', 'blur'] },
        ],
      },
      colnums: [
        {
          label: this.$t('m.missionTitle'),
          getData(row) {
            return row.mission_data.title;
          },
        },
        {
          label: this.$t('m.user'),
          prop: 'submit_user_name',
        },
        {
          label: this.$t('m.role'),
          prop: 'submit_user_role',
        },
        {
          label: this.$t('m.scores'),
          slot: 'score',
        },
        {
          label: this.$t('m.sourceOfAssessment'),
          slot: 'evaluator',
        },
        {
          label: this.$t('m.completionStatus'),
          slot: 'evaluateStatus',
        },
        {
          label: this.$t('m.evaluateTime'),
          prop: 'evaluate_time',
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
      pieLabelArr: [],
    };
  },
  watch: {
    crEventData: {
      handler(val, oldval) {
        if (val !== oldval) {
          if (!_.isEmpty(val.data)) {
            this.$nextTick(() => {
              this.getListData();
              this.getUserRoleData();
            });
          }
        }
      },
      deep: true,
      immediate: true,
    },
    search: {
      handler(val, oldval) {
        if (val !== oldval) {
          this.selectTable();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this.cookie = document.cookie.split('cr_jwttoken=')[1];
    this.cookie = utils.getCookie('cr_jwttoken');
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    //  裁判角色的历史任务ws请求
    wsutil.bind(
      `/ojj/ws/cr/ce_base/mission?business_id=${this.resource_id}&token=${this.cookie}`,
      (data) => {
        if (data.code === 0 || data.code === 1) {
          this.getListData();
        }
      },
    );
  },
  mounted() {
    this.getPieLabel();
    // this.initData()
    this.getUserRoleData();
    this.listen.createListen();
  },
  beforeDestroy() {
    this.listen.destroyListen();
  },
  methods: {
    // 监听换肤，动态reload echarts
    listenFunc() {
      this.ready = false;
      this.$nextTick(() => {
        this.ready = true;
      });
    },
    // 获取雷达图label
    getPieLabel() {
      getRadarLabels().then((res) => {
        this.pieLabelArr = _.get(res, 'data.data.labels');
      });
    },

    // 获取用户角色数据
    getUserRoleData() {
      const getUserList = [];
      const getUserRole = [];
      if (!_.isEmpty(this.crEventData.data)) {
        _.forEach(this.crEventData.data.roles_data, (d) => {
          if (d.role_group >= 4) {
            _.forEach(d.children, (f) => {
              _.forEach(f.users_data, (e) => {
                getUserList.push({
                  id: e.resource_id,
                  rep_name: e.rep_name,
                  logo: e.logo,
                });
              });
              getUserRole.push({
                id: f.resource_id,
                rep_name: f.name,
              });
            });
          }
        });
        this.dataUser = getUserList;
        this.dataRole = getUserRole;
      }
    },
    operationTask(state, index, row) {
      this.dialogReject = true;
      if (state === 3) {
        this.isReject = false;
      } else {
        this.isReject = true;
      }
      this.rejectForm.evaluation_id = row.id;
      this.rejectForm.score = row.mission_data.score;
      this.rejectForm.evaluate_status = state;
      this.tableIndex = index;
    },
    taskCheck(index, row) {
      this.dialogSee = true;
      this.form.evaluation_id = row.id;
      this.form.name = row.mission_data.title;
      this.form.content = row.mission_data.description;
      this.form.userAnswers = row.submit_info.user_answer;
      this.form.standardAnswer = row.mission_data.answer;
      this.form.write_up = row.mission_data.write_up;
      this.form.score = row.score;
      this.form.total_score = row.total_score;
      this.form.level_data = JSON.parse(row.mission_data.skill_points);
      this.form.type = row.mission_data.type;
      this.form.answerOption = JSON.parse(row.mission_data.option);
    },
    operationSubmit() {
      this.$refs['rejectForm'].validate((valid) => {
        if (valid) {
          // 裁判历史任务的人工评估
          evaluationSubmit(this.resource_id, this.rejectForm.evaluation_id, {
            reason: this.rejectForm.defaultReasons,
            detail: this.rejectForm.realReason,
            score: this.rejectForm.judgeScore ? this.rejectForm.judgeScore : 0,
            evaluate_status: parseInt(this.rejectForm.evaluate_status),
          })
            .then((res) => {
              this.messageDialog('success', this.$t('m.successful'));
              // this.getListData()
              this.paginationData[this.tableIndex].score =
                this.rejectForm.score;
              this.paginationData[this.tableIndex].evaluate_status = parseInt(
                this.rejectForm.evaluate_status,
              );
              this.paginationData[this.tableIndex].evaluator = 3;
              this.paginationData[this.tableIndex].evaluate_time =
                moment().format('YYYY-MM-DD HH:mm:ss');
              this.rejectForm.evaluation_id = '';
              this.rejectForm.defaultReasons = '';
              this.rejectForm.realReason = '';
              this.rejectForm.score = '';
              this.rejectForm.judgeScore = '';
              this.dialogReject = false;
            })
            .catch((error) => {
              if (error.response.data.score.length > 0) {
                this.$message.error(error.response.data.score[0].message);
              }
            });
        }
      });
    },

    // 获取表格数据
    getListData() {
      //   裁判点击历史任务获取学员的评估记录
      getTaskList(this.url, { roomId: this.resource_id })
        .then((res) => {
          this.tableTaskList = res.data.data.list;
          _.forEach(res.data.data.list, (item) => {
            this.$set(item, 'id', item.resource_id);
          });
          this.tableInterim = res.data.data.list;
          this.searchData();
          this.paginationFilter();
        })
        .catch((error) => {
          if (error.response.data.length > 0) {
            this.$message.error(error.response.data[0].message);
          }
        });
    },
    // 内容关键字筛选
    selectTable() {
      if (this.search) {
        var search = this.search;
        const searchReplace = search.replace(/；/g, ';');
        const searchArray = searchReplace.split(';');
        const filterArray = searchArray.filter(function (s) {
          return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
        });
        this.submitData.keyword = filterArray;
        this.searchData('keyword');
      } else {
        this.submitData.keyword = [];
        this.searchMoveData();
      }
    },
    handleCurrentChange(val) {
      this.pagination.current_page = val;
      this.paginationFilter();
    },
    handleSizeChange(val) {
      this.pagination.per_page = val;
      this.pagination.current_page = 1;
      this.paginationFilter();
    },
    // 用户点击多选后将数据放在全部结果那
    ensureMultiple(checkedUserData, state) {
      this.showSelectUser = state;
      this.showUserName = true;
      this.userName = this.standardName(checkedUserData);
      this.allUserName = this.allName(checkedUserData);
      if (checkedUserData) {
        _.forEach(checkedUserData, (d) => {
          this.submitData.user.push(d.id);
        });
      }
      this.searchData('user');
    },
    // role 角色
    ensureMultipleRole(checkedUserData, state) {
      this.showSelectRole = state;
      this.showRole = true;
      this.roleName = this.standardName(checkedUserData);
      this.allRoleName = this.allName(checkedUserData);
      if (checkedUserData) {
        _.forEach(checkedUserData, (d) => {
          this.submitData.role.push(d.id);
        });
      }
      this.searchData('role');
    },
    // 完成状态
    ensureMultipleFinishState(checkedUserData, state) {
      this.showSelectFinishState = state;
      this.showFinishState = true;
      this.finishStateName = this.standardName(checkedUserData);
      this.allFinishStateName = this.allName(checkedUserData);
      if (checkedUserData) {
        _.forEach(checkedUserData, (d) => {
          this.submitData.status.push(d.id);
        });
      }
      this.searchData('status');
    },

    // 改变用户、角色等任务列表更新
    searchData(state) {
      this.tableInterim = this.tableTaskList;
      if (this.submitData.user.length !== 0) {
        this.screenMultipleTableUser(this.submitData.user, 'user');
      }
      if (this.submitData.role.length !== 0) {
        this.screenMultipleTableRole(this.submitData.role, 'role');
      }
      if (this.submitData.status.length !== 0) {
        this.screenMultipleTableStatus(this.submitData.status, 'status');
      }
      if (this.submitData.keyword.length !== 0) {
        this.screenMultipleTableKeyword(this.submitData.keyword, 'keyword');
      }
      if (this.submitData.time.length !== 0) {
        this.screenMultipleTableTime(
          this.dateToMs(this.startEndTime[0]),
          this.dateToMs(this.startEndTime[1]),
        );
      }
      this.pagination.current_page = 1;
      this.paginationFilter();
    },
    searchMoveData() {
      this.tableInterim = this.tableTaskList;
      if (this.submitData.user.length !== 0) {
        this.screenMultipleTableUser(this.submitData.user);
      }
      if (this.submitData.role.length !== 0) {
        this.screenMultipleTableRole(this.submitData.role);
      }
      if (this.submitData.status.length !== 0) {
        this.screenMultipleTableStatus(this.submitData.status);
      }
      if (this.submitData.keyword.length !== 0) {
        this.screenMultipleTableKeyword(this.submitData.keyword);
      }
      if (this.submitData.time.length !== 0) {
        this.screenMultipleTableTime(
          this.dateToMs(this.startEndTime[0]),
          this.dateToMs(this.startEndTime[1]),
        );
      }
      this.paginationFilter();
    },

    // 选中用户，更新表格
    screenMultipleTableUser(checkedUserData) {
      const dataArray = [];
      _.forEach(checkedUserData, (b) => {
        _.forEach(this.tableInterim, (a) => {
          if (b === a.submit_user) {
            dataArray.push(a);
          }
        });
      });
      this.tableInterim = dataArray;
    },

    // 选中角色，更新表格
    screenMultipleTableRole(checkedUserData) {
      const dataArray = [];
      _.forEach(checkedUserData, (b) => {
        _.forEach(this.tableInterim, (a) => {
          if (b === a.submit_user_role_resource_id) {
            dataArray.push(a);
          }
        });
      });
      this.tableInterim = dataArray;
    },
    screenMultipleTableStatus(checkedUserData) {
      const dataArray = [];
      _.forEach(checkedUserData, (b) => {
        _.forEach(this.tableInterim, (a) => {
          if (b === a.evaluate_status) {
            dataArray.push(a);
          }
        });
      });
      this.tableInterim = dataArray;
    },
    screenMultipleTableKeyword(checkedUserData, state) {
      const dataArray = [];
      _.forEach(checkedUserData, (b) => {
        _.forEach(this.tableInterim, (a) => {
          if (
            a.mission_data.title.toUpperCase().indexOf(b.toUpperCase()) !== -1
          ) {
            dataArray.push(a);
          }
        });
      });
      this.tableInterim = this.uniqArray(dataArray);
    },
    screenMultipleTableTime(startTime, endTime) {
      const dataArray = [];
      _.forEach(this.tableInterim, (a) => {
        const evaluate_time = this.dateToMs(a.evaluate_time);
        if (evaluate_time >= startTime && evaluate_time <= endTime) {
          dataArray.push(a);
        }
      });
      this.tableInterim = dataArray;
    },
    paginationFilter() {
      this.paginationData = this.tableInterim.slice(
        (this.pagination.current_page - 1) * this.pagination.per_page,
        this.pagination.current_page * this.pagination.per_page,
      );
      this.pagination.total = this.tableInterim.length;
    },
    allName(checkedUserData) {
      let name = '';
      _.forEach(checkedUserData, function (item, key) {
        if (key === checkedUserData.length - 1) {
          name += item.rep_name;
        } else {
          name += item.rep_name + '、';
        }
      });
      return name;
    },
    standardName(checkedUserData) {
      let name = '';
      _.forEach(checkedUserData, function (item, key) {
        name += item.rep_name + '、';
      });
      if (name.length >= 20) {
        name = name.substring(0, 20) + '...';
      }
      return name;
    },
    // 用户 单选
    ensureSingle(user, i, state) {
      this.showSelectUser = state;
      this.showUserName = true;
      this.userName = user.rep_name;
      this.allUserName = user.rep_name;
      if (user) {
        this.submitData.user.push(user.id);
      }
      this.searchData('user');
    },
    // 角色 单选
    ensureSingleRole(user, i, state) {
      this.showSelectRole = state;
      this.showRole = true;
      this.roleName = user.rep_name;
      this.allRoleName = user.rep_name;
      if (user) {
        this.submitData.role.push(user.id);
      }
      this.searchData('role');
    },
    // 完成状态 单选
    ensureSingleFinishState(user, i, state) {
      this.showSelectFinishState = state;
      this.showFinishState = true;
      this.finishStateName = user.rep_name;
      this.allFinishStateName = user.rep_name;
      if (user) {
        this.submitData.status.push(user.id);
      }
      this.searchData('status');
    },
    // 时间
    timeChange() {
      if (this.startEndTime) {
        _.forEach(this.startEndTime, (d) => {
          this.submitData.time.push(d);
        });
        this.searchData('time');
      } else {
        this.submitData.time = [];
        this.searchMoveData();
      }
    },
    dateToMs(date) {
      const result = new Date(date).getTime();
      return result;
    },
    // user删除
    removeUser() {
      this.submitData.user = [];
      this.showSelectUser = true;
      this.showUserName = false;
      this.isRouterUser = false;
      this.$nextTick(() => (this.isRouterUser = true));
      this.searchMoveData();
    },
    // role删除
    removeRole() {
      this.submitData.role = [];
      this.showSelectRole = true;
      this.showRole = false;
      this.isRouterRole = false;
      this.$nextTick(() => (this.isRouterRole = true));
      this.searchMoveData();
    },
    // 完成状态删除
    removeFinishState() {
      this.submitData.status = [];
      this.showSelectFinishState = true;
      this.showFinishState = false;
      this.isRouterFinishState = false;
      this.$nextTick(() => (this.isRouterFinishState = true));
      this.searchMoveData();
    },
    // 用户多选之后取消
    cancelUser() {
      this.isRouterUser = false;
      this.$nextTick(() => (this.isRouterUser = true));
    },
    // 角色多选之后取消
    cancelRole() {
      this.isRouterRole = false;
      this.$nextTick(() => (this.isRouterRole = true));
    },
    // 完成状态多选之后取消
    cancelFinishState() {
      this.isRouterFinishState = false;
      this.$nextTick(() => (this.isRouterFinishState = true));
    },
    messageDialog(type, message) {
      this.$message({
        type: type,
        message: message,
      });
    },
    uniqArray(array) {
      var temp = []; // 一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) === -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
  },
};
</script>

<style lang="scss" scoped>
$titleColor: #c0cce7;
.clearfix:after {
  content: '';
  height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.state-role {
  ::v-deep .elc-user-drag-selector-user-item {
    min-width: 65px !important;
    width: auto !important;
  }
  ::v-deep .user-name {
    overflow: inherit !important;
  }
}
.history-task-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background: var(--bg-color-2);
  ::v-deep .el-scrollbar__bar.is-horizontal > div {
    display: none;
  }
  .content {
    width: 100%;
    height: 100%;
    padding: 15px 20px;
    box-sizing: border-box;
  }
  .history-top {
    height: 40px;
    width: 100%;
    font-size: 14px;

    .condition-title {
      height: 30px;
      line-height: 30px;
      // color:rgba(192,204,231,1);
      font-size: 14px;
      margin-right: 20px;
    }
    .choosed {
      height: 30px;
      line-height: 30px;
      background-color: rgba(91, 112, 159, 0.36);
      border-radius: 2px;
      padding: 0 20px;
      margin-right: 20px;
      box-sizing: border-box;
      .search-name {
        margin-right: 5px;
      }
      .remove {
        width: 10px;
        height: 10px;
        font-weight: normal;
        margin-left: 5px;
      }
    }
  }
  .history-content {
    width: 98%;
    padding: 10px 15px;
  }
  .history-bottom {
    width: 100%;
  }
  .task-scoped {
    border-radius: 2px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .query-criteria {
    margin-bottom: 20px;
    .search-title {
      font-size: 14px;
      min-width: 120px;
    }
    .search-tips {
      margin-left: 15px;
    }
    .query-time {
      width: 60%;
      display: flex;
      align-items: center;
      ::v-deep.el-date-editor .el-range__close-icon {
        line-height: 26px;
      }
    }
  }
}
</style>
<style lang="scss">
.history-task-page {
  .task-input {
    .el-input__inner {
      width: 300px;
      border-radius: 2px;
    }
  }
  .el-scrollbar {
    .el-scrollbar__wrap {
      margin-bottom: 0 !important;
    }
  }
  .query-time {
    .el-range-editor.el-input__inner {
      height: 30px;
      border-radius: 2px;
    }
    .el-range-separator {
      position: relative;
    }
    .el-date-editor .el-range__icon {
      position: relative;
      top: -3px;
    }
  }
}
.dialogSee {
  .el-dialog__body {
    border-bottom: 0 !important;
  }
}
</style>
