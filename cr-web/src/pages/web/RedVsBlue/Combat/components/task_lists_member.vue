<template>
  <div class="taskList taskList-single">
    <div class="title-user">
      <title-director
        :square-color="'bg-color-sky-blue'"
        :name="$t('m.taskList')"
      />
    </div>
    <div class="list">
      <template>
        <cb-scrollbar>
          <!-- <el-button type="text"> -->
          <div class="lists">
            <div
              v-for="(item, index) in taskLists"
              :key="index"
              class="task_lists"
              @click="getUserTaskStatus(item)"
            >
              <cb-row :gutter="24">
                <cb-tooltip
                  v-if="showTips"
                  class="item"
                  effect="dark"
                  :content="item.title"
                  placement="bottom-start"
                >
                  <cb-col :span="12">
                    <div class="taskName one-overflow" :title="item.title">
                      {{ item.title }}
                    </div>
                  </cb-col>
                </cb-tooltip>
                <cb-col v-if="!showTips" :span="12">
                  <div class="taskName one-overflow" :title="item.title">
                    {{ item.title }}
                  </div>
                </cb-col>
                <cb-col :span="6">
                  <div class="taskName one-overflow" :title="item.score">
                    {{ item.score }}{{ $t('score.grade') }}
                  </div>
                </cb-col>
                <cb-col :span="6">
                  <div
                    v-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.WAIT.value
                    "
                    class="toevaluate one-overflow"
                    :title="$t('m.toEvaluate')"
                  >
                    {{ $t('m.toEvaluate') }}
                  </div>
                  <div
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.SUCCESS.value
                    "
                    class="success one-overflow"
                    :title="$t('m.success')"
                  >
                    {{ $t('m.success') }}
                  </div>
                  <div
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.FAIL.value
                    "
                    class="fail one-overflow"
                    :title="$t('m.fail')"
                  >
                    {{ $t('m.fail') }}
                  </div>
                  <div
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.REJECT.value
                    "
                    class="reject one-overflow"
                    :title="$t('m.reject')"
                  >
                    {{ $t('m.reject') }}
                  </div>
                  <div
                    v-else-if="
                      item.evaluate_status ===
                      $CONSTANT.SceneTerminal.ReviewStatus.ISSUED.value
                    "
                    class="blue-color one-overflow"
                    :title="$t('m.hasIssued')"
                  >
                    {{ $t('m.hasIssued') }}
                  </div>
                  <div v-else />
                </cb-col>
              </cb-row>
            </div>
            <div
              v-if="taskLists.length === 0"
              style="padding: 10px; height: 100%"
            >
              <empty-page />
            </div>
          </div>
        </cb-scrollbar>
        <template>
          <!--一层弹窗-->
          <cb-dialog
            :title="$t('m.taskDetails')"
            :visible.sync="outerVisible"
            center
            :append-to-body="true"
            class="dialog2"
          >
            <cb-form label-width="85px" label-position="right">
              <cb-form-item :label="$t('m.taskName')">
                {{ taskListName }}
              </cb-form-item>

              <cb-form-item :label="$t('m.content')">
                <div class="block">
                  <cb-rate v-model="taskValue" disabled :colors="['#707894']" />
                </div>
              </cb-form-item>
            </cb-form>

            <div slot="footer" class="dialog-footer">
              <cb-button-group>
                <cb-button button-type="confirm" @click="beginMission()">{{
                  $t('m.start')
                }}</cb-button>
                <cb-button button-type="cancel" @click="outerVisible = false">{{
                  $t('m.cancel')
                }}</cb-button>
              </cb-button-group>
            </div>
          </cb-dialog>
        </template>
        <!--二层弹框-->
        <cb-dialog
          v-if="innerVisible"
          :title="$t('m.taskDetails')"
          width="50%"
          :visible.sync="innerVisible"
          :append-to-body="true"
          :close-on-press-escape="false"
        >
          <div
            class="cyber-scroll-bar"
            style="width: 100%; height: 500px; overflow: auto"
          >
            <div style="text-align: left; width: calc(100% - 5px)">
              <cb-row :gutter="10">
                <cb-col :span="3" class="out-span" style="line-height: 30px">{{
                  $t('m.taskName')
                }}</cb-col>
                <cb-col :span="20">
                  {{ taskListName }}
                  <!-- <cb-input v-model="taskListName" disabled /> -->
                </cb-col>
              </cb-row>
            </div>
            <div style="text-align: left; width: calc(100% - 5px)">
              <cb-row :gutter="10">
                <cb-col :span="3" class="out-span" style="line-height: 30px">
                  {{ $t('m.content') }}</cb-col
                >
                <cb-col :span="20">
                  <div class="markDownCommon viewMarkdown">
                    <CbMarkdown
                      style="padding: 0"
                      v-model="taskListContent"
                      type="viewer"
                      class=""
                    />
                  </div>
                </cb-col>
              </cb-row>
              <cb-row
                v-if="false"
                v-show="taskType === 1 || taskType === 2"
                :gutter="10"
              >
                <cb-col :span="3" class="out-span">选项</cb-col>
                <cb-col :span="20" style="cursor: pointer">
                  <div
                    style="
                      border: 1px solid #424c6f;
                      padding: 10px;
                      min-height: 40px;
                      margin-bottom: 10px;
                      color: #767d99;
                    "
                  >
                    <div v-for="(item, index) in option" :key="index">
                      <span style="margin-right: 15px">{{
                        item.optionLabel
                      }}</span>
                      <span>{{ item.optionValue }}</span>
                    </div>
                  </div>
                </cb-col>
              </cb-row>
              <cb-row :gutter="10">
                <cb-col :span="3" class="out-span">{{ $t('m.state') }}</cb-col>
                <cb-col :span="3" class="success">{{ status }}</cb-col>
                <cb-col :span="12" style="cursor: pointer">
                  <div
                    class="color-sky-blue"
                    style="white-space: nowrap"
                    @click="viewReject()"
                  >
                    <cb-iconfont type="icon-lishizuijinshijian" />
                    {{ $t('m.viewHistoryRejection') }}
                  </div>
                </cb-col>
                <cb-col v-if="showAnswer" :span="6" style="cursor: pointer">
                  <div class="color-sky-blue" @click="viewAnswer()">
                    <cb-iconfont type="icon-danxuan-xuanzhong" />
                    {{ $t('m.viewAnswer') }}
                  </div>
                </cb-col>
              </cb-row>
              <cb-row
                :gutter="10"
                style="text-align: left"
                class="attackDefenseTask"
              >
                <cb-col
                  v-show="
                    taskType === $CONSTANT.Mission.TastType.ATTACK.value ||
                    taskType === $CONSTANT.Mission.TastType.DEFENSE.value
                  "
                  style="padding-top: 5px"
                  :span="4"
                  >{{ $t('m.reportContent') }}</cb-col
                >
              </cb-row>
              <cb-row
                v-if="
                  taskType === $CONSTANT.Mission.TastType.MULTIPLE.value ||
                  taskType === $CONSTANT.Mission.TastType.SINGLE.value ||
                  taskType === $CONSTANT.Mission.TastType.JUDGE.value ||
                  taskType === $CONSTANT.Mission.TastType.FILE.value
                "
                :gutter="10"
              >
                <cb-col :span="3" class="out-span">
                  <span
                    v-if="taskType === $CONSTANT.Mission.TastType.FILE.value"
                    style="line-height: 38px"
                    >{{ $t('m.file') }}</span
                  >
                  <span v-else>{{ $t('m.option') }}</span>
                </cb-col>
                <cb-col
                  :span="20"
                  style="cursor: pointer"
                  :class="
                    taskType === $CONSTANT.Mission.TastType.FILE.value
                      ? ''
                      : 'optionSelect'
                  "
                >
                  <template
                    v-if="taskType === $CONSTANT.Mission.TastType.JUDGE.value"
                  >
                    <!--判断-->
                    <cb-radio-group v-model="judgeAnswer" direction="vertical">
                      <cb-radio
                        v-for="(item, i) in judgeOption"
                        :key="i"
                        :label="item.optionLabel"
                        >{{
                          item.optionLabel + '、' + item.optionValue
                        }}</cb-radio
                      >
                    </cb-radio-group>
                  </template>
                  <template
                    v-else-if="
                      taskType === $CONSTANT.Mission.TastType.SINGLE.value
                    "
                  >
                    <!--单选-->
                    <cb-radio-group v-model="singleAnswer" direction="vertical">
                      <cb-radio
                        v-for="(item, i) in option"
                        :key="i"
                        :label="item.optionLabel"
                        >{{
                          item.optionLabel + '、' + item.optionValue
                        }}</cb-radio
                      >
                    </cb-radio-group>
                  </template>
                  <template
                    v-else-if="
                      taskType === $CONSTANT.Mission.TastType.MULTIPLE.value
                    "
                  >
                    <!--多选-->
                    <cb-checkbox-group
                      v-model="multipleAnswer"
                      direction="vertical"
                    >
                      <cb-checkbox
                        v-for="(item, i) in option"
                        :key="i"
                        :label="item.optionLabel"
                        >{{
                          item.optionLabel + '、' + item.optionValue
                        }}</cb-checkbox
                      >
                    </cb-checkbox-group>
                  </template>
                  <template
                    v-else-if="
                      taskType === $CONSTANT.Mission.TastType.FILE.value
                    "
                  >
                    <!--文件题-->
                    <cb-input v-model="fileMD5" class="elc-input" />
                  </template>
                </cb-col>
              </cb-row>
              <cb-row :gutter="10">
                <cb-col
                  v-if="
                    !(
                      taskType === $CONSTANT.Mission.TastType.MULTIPLE.value ||
                      taskType === $CONSTANT.Mission.TastType.SINGLE.value ||
                      taskType === $CONSTANT.Mission.TastType.JUDGE.value ||
                      taskType === $CONSTANT.Mission.TastType.FILE.value
                    )
                  "
                  :span="24"
                  class="ql-editor"
                >
                  <div class="markDownCommon">
                    <CbMarkdown
                      style="height: 340px"
                      v-model="content"
                      :uploadImages="uploadImages"
                    />
                  </div>
                </cb-col>
              </cb-row>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <cb-button button-type="confirm" mr @click="submitAnswer()">{{
              $t('m.report')
            }}</cb-button>
            <cb-button button-type="cancel" @click="cancelSubmit()">{{
              $t('m.cancel')
            }}</cb-button>
          </span>
        </cb-dialog>
        <!--三层查看历史驳回弹窗-->
        <cb-dialog
          width="50%"
          :title="$t('m.historicalRejection')"
          :visible.sync="innernewVisible"
          :append-to-body="true"
          class="dialog3 elc-dialog"
        >
          <cb-scrollbar>
            <div class="elc-table">
              <template>
                <cb-search-table
                  ref="sdlRef"
                  :cols="columns"
                  :dataSource="rejectList"
                  :hidePaginOnDemand="true"
                  style="width: 100%"
                  :searchBarBg="false"
                >
                  <template v-slot:reason="scope">
                    <span v-if="scope.data.reject_reason === 1">{{
                      $t('m.insufficientEventSupport')
                    }}</span>
                    <span v-else>{{ $t('m.eventSupportSufficient') }}</span>
                  </template>
                </cb-search-table>
              </template>
            </div>
          </cb-scrollbar>
          <span slot="footer" class="dialog-footer">
            <cb-button hollow @click="innernewVisible = false">{{
              $t('m.cancel')
            }}</cb-button>
          </span>
        </cb-dialog>
        <!--题解弹窗-->
        <cb-dialog
          :title="$t('m.viewAnswer')"
          :visible.sync="viewAnswerDialog"
          width="50%"
          :append-to-body="true"
        >
          <div
            class="markDownCommon cyber-scroll-bar write-box"
            style="height: 600px; overflow: auto"
          >
            <CbMarkdown v-model="viewAswer" type="viewer" />
          </div>
          <span slot="footer" class="dialog-footer">
            <cb-button hollow @click="viewAnswerDialog = false">{{
              $t('m.cancel')
            }}</cb-button>
          </span>
        </cb-dialog>
      </template>
    </div>
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5';

import { mapGetters } from 'vuex';
import { beginMission, submitAnswer } from '@/api/web/access_center_member.js';
import TitleDirector from '@/pages/web/RedVsBlue/Director/components/title.vue';
import EmptyPage from '@/pages/web/Empty';
import _ from 'lodash';
import { errorMessage } from '@/assets/js/tools.js';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';
export default {
  name: 'TaskListsMember',
  components: {
    TitleDirector,
    EmptyPage,
  },
  props: {
    taskList: {
      type: Array,
      default: () => [],
    },
    scheme: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      BUSINESS_TYPE,
      titleList: this.$t('m.taskList'),
      // testType: {
      //   // 题目类型
      //   JUDGE: 0, // 判断
      //   SINGLE: 1, // 单选
      //   MULTIPLE: 2, // 多选
      //   FILE: 7 // 文件题
      // },
      judgeOption: [
        {
          optionLabel: 'A',
          optionValue: this.$t('missions.correct'),
        },
        {
          optionLabel: 'B',
          optionValue: this.$t('missions.error'),
        },
      ],
      fileName: '',
      fileMD5: '',
      judgeAnswer: '',
      singleAnswer: '',
      multipleAnswer: [],

      sourceIP: '',
      sourcePort: '',
      aimIP: '',
      aimPort: '',
      state: '',
      collapseTitle: this.$t('m.ReportFormattedContent'),
      taskValue: 5,
      outerVisible: false,
      innerVisible: false,
      innernewVisible: false,
      viewAnswerDialog: false,
      screenWidth: document.body.clientWidth, // 屏幕尺寸
      showTips: false,
      answer: '',
      content: '',
      editorOption: {
        theme: 'snow',
      },
      centerDialogVisible: false,
      columns: [
        {
          label: this.$t('m.refusalTime'),
          prop: 'reject_time',
        },
        {
          label: this.$t('m.reasonForRejection'),
          slot: 'reason',
          prop: 'reject_reason',
        },
        {
          label: this.$t('m.trialName'),
          prop: 'referee',
        },
      ],
      rejectList: [],
      subtaskId: 'Xx时xx分xx秒：使用xx工具探测网络拓扑结构完毕（附图）',
      description: '',
      principal: '',
      taskLists: [],
      taskListName: '',
      taskListContent: '门户网站系统漏洞扫描',
      resource_id: '',
      status: null,
      typeList: [
        {
          id: 1,
          name: '攻击',
          children: [
            {
              id: 11,
              name: '信息收集类',
              children: [
                {
                  id: 111,
                  name: 'PING扫描',
                },
                {
                  id: 112,
                  name: '端口扫描',
                },
                {
                  id: 113,
                  name: '系统漏洞扫描',
                },
                {
                  id: 114,
                  name: '应用漏洞扫描',
                },
                {
                  id: 115,
                  name: '数据嗅探',
                },
                {
                  id: 116,
                  name: '通用',
                },
              ],
            },
            {
              id: 12,
              name: '渗透类',
              children: [
                {
                  id: 121,
                  name: '口令攻击',
                },
                {
                  id: 122,
                  name: '电子邮件攻击',
                },
                {
                  id: 123,
                  name: '欺骗攻击',
                },
                {
                  id: 124,
                  name: '系统漏洞攻击',
                },
                {
                  id: 125,
                  name: '应用漏洞攻击',
                },
                {
                  id: 126,
                  name: '拒绝服务攻击',
                },
                {
                  id: 127,
                  name: '通用',
                },
              ],
            },
            {
              id: 13,
              name: '控制类',
              children: [
                {
                  id: 131,
                  name: '服务变更',
                },
                {
                  id: 122,
                  name: '管理员组用户变更',
                },
                {
                  id: 123,
                  name: '系统核心PE文件变更',
                },
                {
                  id: 124,
                  name: '管理员组用户异常登录',
                },
                {
                  id: 125,
                  name: '系统进程空间注入',
                },
                {
                  id: 126,
                  name: '管理员或系统级进程变更',
                },
                {
                  id: 127,
                  name: '系统重启',
                },
                {
                  id: 128,
                  name: '启动项变更',
                },
                {
                  id: 129,
                  name: '证书访问',
                },
                {
                  id: 1210,
                  name: '标靶文件被访问',
                },
                {
                  id: 1211,
                  name: '认证硬件操作',
                },
                {
                  id: 1212,
                  name: '服务拒绝',
                },
                {
                  id: 1213,
                  name: '通用',
                },
              ],
            },
            {
              id: 14,
              name: '通用',
            },
          ],
        },
        {
          id: 2,
          name: '防御',
          children: [
            {
              id: 21,
              name: '信息收集类',
              children: [
                {
                  id: 211,
                  name: 'PING扫描',
                },
                {
                  id: 212,
                  name: '端口扫描',
                },
                {
                  id: 213,
                  name: '系统漏洞扫描',
                },
                {
                  id: 214,
                  name: '应用漏洞扫描',
                },
                {
                  id: 215,
                  name: '数据嗅探',
                },
                {
                  id: 216,
                  name: '通用',
                },
              ],
            },
            {
              id: 22,
              name: '防御加固类',
              children: [
                {
                  id: 211,
                  name: '口令攻击',
                },
                {
                  id: 212,
                  name: '电子邮件攻击',
                },
                {
                  id: 213,
                  name: '欺骗攻击',
                },
                {
                  id: 214,
                  name: '系统漏洞攻击',
                },
                {
                  id: 215,
                  name: '应用漏洞攻击',
                },
                {
                  id: 216,
                  name: '拒绝服务攻击',
                },
                {
                  id: 217,
                  name: '通用',
                },
              ],
            },
            {
              id: 23,
              name: '检测类',
              children: [
                {
                  id: 211,
                  name: '服务变更',
                },
                {
                  id: 212,
                  name: '管理员组用户变更',
                },
                {
                  id: 213,
                  name: '系统核心PE文件变更',
                },
                {
                  id: 214,
                  name: '管理员组用户异常登录',
                },
                {
                  id: 215,
                  name: '系统进程空间注入',
                },
                {
                  id: 216,
                  name: '管理员或系统级进程变更',
                },
                {
                  id: 217,
                  name: '系统重启',
                },
                {
                  id: 217,
                  name: '启动项变更',
                },
                {
                  id: 217,
                  name: '证书访问',
                },
                {
                  id: 217,
                  name: '标靶文件被访问',
                },
                {
                  id: 217,
                  name: '认证硬件操作',
                },
                {
                  id: 217,
                  name: '服务拒绝',
                },
                {
                  id: 217,
                  name: '通用',
                },
              ],
            },
            {
              id: 24,
              name: '通用',
            },
          ],
        },
        {
          id: 3,
          name: '答题',
        },
      ],
      answerExtension: {},
      taskType: '',
      option: [],
      taskHash: '',
      viewAswer: '题解',
      showAnswer: false,
    };
  },
  computed: {
    ...mapGetters(['is_admin', 'user_data', 'name', 'language']),
  },
  watch: {
    innerVisible: {
      handler(val, oldval) {
        if (val) {
          this.outerVisible = false;
        }
      },
      immediate: true,
      deep: true,
    },
    taskList: {
      handler(val, oldval) {
        if (val) {
          this.taskLists = val;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.resource_id = this.$route.params && this.$route.params.resource_id;
    this.getScreenWidth();
  },
  methods: {
    // saveImageWeb(data) {
    //   return this.$request.post('/public/image_upload/', data, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //   });
    // },
    //红蓝学员答题填空等上传图片
    saveImageWeb(data) {
      return this.$request.post('/common/web/image_upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        baseURL: '/api/ojj',
      });
    },

    // 上传图片
    uploadImages($file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (_) => {
          if (this.filterImages($file[0])) {
            let formdata = new FormData();
            // formdata.append('image', $file[0]);
            formdata.append('file', $file[0]);
            formdata.append('type', this.BUSINESS_TYPE.CR_WEB_RED);
            BUSINESS_TYPE;
            this.saveImageWeb(formdata)
              .then((res) => {
                // resolve([res.data]);
                resolve([{ url: res.data.data.file_path }]);
              })
              .catch((err) => {
                this.$serverError(err);
              });
          }
        };
        reader.readAsDataURL($file[0]);
      });
    },
    // 上传图片校验
    filterImages(file) {
      const suffix = this.$_.last(this.$_.split(file.name, '.'));
      if (!this.$_.includes(['jpg', 'jpeg', 'png'], this.$_.toLower(suffix))) {
        this.$message({
          message: this.$t('m.pleaseUploadPictures'),
          type: 'error',
        });
        return false;
      }
      return true;
    },
    btnUpload() {
      this.$refs.uploadFile.click();
    },
    changeFile(event) {
      var file = event.target.files;
      if (file[0]) {
        this.fileName = file[0].name;
        var fileReader = new FileReader();
        var dataFile = file[0];
        const _this = this;
        var spark = new SparkMD5(); // 创建md5对象（基于SparkMD5）
        if (dataFile.size > 1024 * 1024 * 10) {
          var data1 = dataFile.slice(0, 1024 * 1024 * 10); // 将文件进行分块 file.slice(start,length)
          fileReader.readAsBinaryString(data1); // 将文件读取为二进制码
        } else {
          fileReader.readAsBinaryString(dataFile);
        }

        // 文件读取完毕之后的处理
        fileReader.onload = function (e) {
          spark.appendBinary(e.target.result);
          var md5 = spark.end();
          _this.content = md5;
        };
      } else {
        this.fileName = '';
        this.taskAnswer = '';
      }
    },
    viewAnswer() {
      // 查看题解
      this.viewAnswerDialog = true;
    },
    viewReject() {
      this.innernewVisible = true;
    },

    // 提交答案
    submitAnswer() {
      const inputName = ['sourceIP', 'sourcePort', 'aimIP', 'aimPort', 'state'];
      const inputValue = [
        this.sourceIP,
        this.sourcePort,
        this.aimIP,
        this.aimPort,
        this.state,
      ];
      _.forEach(inputValue, (i, index) => {
        this.answerExtension[inputName[index]] = inputValue[index];
      });
      // const submitUrl = `/red_vs_blue/red_vs_blue_users/${this.resource_id}/submit_missions/`;
      let answer = '';
      if (this.taskType === 0) {
        answer = this.judgeAnswer;
      } else if (this.taskType === 1) {
        answer = this.singleAnswer;
      } else if (this.taskType === 2) {
        answer = JSON.stringify(this.multipleAnswer);
      } else if (this.taskType === this.$CONSTANT.Mission.TastType.FILE.value) {
        answer = this.fileMD5;
      } else {
        answer = this.content;
      }
      // 学员答题后点击上报
      submitAnswer(this.url, {
        resource_id: this.resource_id,
        mission_hash: this.taskHash,
        answer: answer,
      })
        .then((res) => {
          this.innerVisible = false;
          this.$message({
            message: this.$t('m.submittedWaitingForEvaluation'),
            type: 'success',
          });
          this.content = '';
          this.fileName = '';
          this.$emit('listenSubmitAnswer');
        })
        .catch((error) => {
          if (error.response.data.length > 0) {
            this.$message.error(error.response.data[0].message);
          }
        });
      // submitAnswer(submitUrl, { mission_hash: this.taskHash, answer: answer })
      //   .then((res) => {
      //     this.innerVisible = false;
      //     this.$message({
      //       message: this.$t('m.submittedWaitingForEvaluation'),
      //       type: 'success',
      //     });
      //     this.content = '';
      //     this.fileName = '';
      //     this.$emit('listenSubmitAnswer');
      //   })
      //   .catch((error) => {
      //     this.content = '';
      //     if (error.response.data.length > 0) {
      //       this.$message.error(error.response.data[0].message);
      //     }
      //   });
    },
    cancelSubmit() {
      this.content = '';
      this.innerVisible = false;
    },
    // 开始任务
    //学员登录点击任务列表题目开始答题
    beginMission() {
      //  this.getUrl = `/red_vs_blue/red_vs_blue_users/${this.resource_id}/begin_mission/`;
      beginMission(this.url, {
        resource_id: this.resource_id,
        mission_hash: this.taskHash,
      })
        .then((res) => {
          this.innerVisible = true;
          this.status = this.$t('m.running');
          this.$emit('listenSubmitAnswer');
        })
        .catch((error) => {
          errorMessage(error, this);
        });
      // this.getUrl = `/red_vs_blue/red_vs_blue_users/${this.resource_id}/begin_mission/`;
      // beginMission(this.getUrl, { mission_hash: this.taskHash })
      //   .then((res) => {
      //     this.innerVisible = true;
      //     this.status = this.$t('m.running');
      //     this.$emit('listenSubmitAnswer');
      //   })
      //   .catch((error) => {
      //     errorMessage(error, this);
      //   });
    },
    // 获取用户任务状态
    getUserTaskStatus(task) {
      this.fileMD5 = '';
      this.taskListName = task.title;
      this.taskListContent = task.description;
      this.taskType = task.type;
      this.taskHash = task.resource_id;
      if (task.write_up_show) {
        // 是否显示题解
        this.showAnswer = true;
        this.viewAswer = task.write_up;
      } else {
        this.showAnswer = false;
      }
      if (task.user_mission_status === 1) {
        // 未开始
        this.outerVisible = true;
      } else {
        this.innerVisible = true;
        if (task.user_mission_status === 2) {
          // 进行中
          this.status = this.$t('m.running');
        } else if (task.user_mission_status === 3) {
          // 已完成
          this.status = this.$t('m.hasReport');
        }
      }
      if (
        !(
          task.type === this.$CONSTANT.Mission.TastType.MULTIPLE.value ||
          task.type === this.$CONSTANT.Mission.TastType.SINGLE.value ||
          task.type === this.$CONSTANT.Mission.TastType.FILE.value
        )
      ) {
        this.option = JSON.parse(task.option);
      } else {
        // this.option = task.option;
        this.option = JSON.parse(task.option);
      }
      if (task.user_answer) {
        if (task.type === this.$CONSTANT.Mission.TastType.JUDGE.value) {
          this.judgeAnswer = task.user_answer;
        } else if (task.type === this.$CONSTANT.Mission.TastType.SINGLE.value) {
          this.singleAnswer = task.user_answer;
        } else if (
          task.type === this.$CONSTANT.Mission.TastType.MULTIPLE.value
        ) {
          this.multipleAnswer = JSON.parse(task.user_answer);
        } else if (task.type === this.$CONSTANT.Mission.TastType.FILE.value) {
          this.fileMD5 = task.user_answer;
        } else {
          this.content = task.user_answer;
        }
      } else {
        this.judgeAnswer = '';
        this.singleAnswer = '';
        this.multipleAnswer = [];
      }
      this.rejectList = task.reject_log;
    },

    startBtn() {
      // this.disabled = false
    },
    // 判断屏幕大小
    getScreenWidth() {
      if (this.screenWidth < 1366) {
        this.showTips = true;
      }
    },
  },
};
</script>
<style lang="scss">
.viewMarkdown {
  .cb-markdown .markdown-body {
    padding: 0;
  }
}
.write-box {
  .cb-markdown {
    pre {
      white-space: pre !important;
      word-wrap: normal !important;
      word-break: normal !important;
    }
  }
}
</style>
<style lang="scss" scope>
$activeColor: #39e1ff;
.el-row {
  margin-bottom: 10px;
}
.dialog2 {
  .task-name {
    .task-detail {
      margin-left: 28px;
    }
  }
}
.taskList-single {
  .title-user {
    margin: 10px 0;
  }
  .dialog3 {
    z-index: 2555;

    .el-dialog__body .el-row {
      margin: 8px;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #35406b !important;
    }
    .el-table::before {
      height: 0;
    }
    .el-table {
      tbody {
        color: #8c93af;
        tr:nth-child(odd) {
          background-color: #262d47;
        }
        tr:nth-child(even) {
          background-color: #21273f;
        }
      }
      th.is-leaf,
      td {
        border-bottom: none;
      }
      thead {
        tr {
          background-color: #21273f !important;
          color: #e6ebfe;
        }
        th {
          background-color: #21273f !important;
        }
      }

      .el-dialog__body {
        color: #c0c5db;
        height: 66%;
        .el-scrollbar {
          border: 1px solid #3b435a;
          height: 100%;
          background-color: transparent;
          /*border-radius: 8px;*/
          .el-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
        .el-table,
        .el-table__expanded-cell {
          background-color: transparent;
        }
      }
    }
  }
}
.dialog2,
.dialog3 {
  .el-dialog {
    overflow: hidden;

    .el-row {
      margin: 8px;
    }
    .edit1 {
      border: 1px solid #424c6f;
      padding: 10px;
      min-height: 40px;
      margin-bottom: 10px;
      color: #767d99;
    }
    .taskListContent {
      box-shadow: none !important;
    }
  }
  .el-dialog__body {
    padding: 20px 42px !important;

    .inner-span {
      color: rgba(237, 242, 255, 1);
    }
    .specialStyle {
      padding: 5px 10px !important;
      border-radius: 2px;
    }
    .optionSelect {
      min-height: 50px;
      cursor: pointer;
      /*border: 1px solid rgba(132, 144, 159, 0.85);*/
      border-radius: 2px;
      padding: 0 10px 10px !important;
      /*width: 85%;*/
      background: rgba(31, 39, 54, 0.7);
      .cb-radio-horizontal {
        flex-direction: column;
        display: flex;
      }
    }
  }
}
.attackDefenseTask {
  .el-collapse-item__header {
    height: 31px;
    border-bottom: 1px solid transparent;
    color: rgba(40, 149, 201, 1);
    background: linear-gradient(
      0deg,
      rgba(63, 228, 238, 1) 0%,
      rgba(44, 163, 238, 1) 99.21875%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .el-collapse-item__content {
    color: #ffffff;
    padding-bottom: 10px;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
  .el-carousel__mask,
  .el-cascader-menu,
  .el-cascader-menu__item.is-disabled:hover,
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    background-color: transparent;
    color: #ffffff;
  }
  .el-collapse-item__arrow {
    /*position: absolute;*/
    margin: auto 5px;
  }
}

.taskList {
  height: 33%;
  padding-left: 30px;
  box-sizing: border-box;
  .mrg15R {
    margin-right: 15px;
  }
  .ql-toolbar.ql-snow {
    border: 2px solid #3b435a !important;
  }
  .ql-container.ql-snow {
    border: 2px solid #3b435a !important;
    border-top: 0px !important;
  }
  .ql-snow .ql-stroke {
    stroke: white !important;
  }
  .ql-snow .ql-fill,
  .ql-snow .ql-stroke.ql-fill {
    fill: white !important;
  }
  .ql-snow .ql-picker {
    color: white !important;
  }
  .title {
    position: relative;
    padding: 10px 0 10px 25px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 300;
    color: rgba(192, 204, 231, 1);
    i {
      position: absolute;
      top: 15px;
      left: 0px;
      width: 6px;
      height: 8px;
      background: linear-gradient(
        0deg,
        rgba(57, 239, 255, 1) 0%,
        rgba(58, 165, 255, 1) 100%
      );
    }
  }

  .list {
    width: 100%;
    height: calc(100% - 39px);
    .lists {
      height: calc(100% - 39px);
      ::v-deep .el-col {
        padding-left: 5px !important;
        padding-right: 5px !important;
      }
    }
    ::v-deep.el-scrollbar {
      height: 100%;
    }
    ::v-deep.el-scrollbar__bar {
      right: 10px !important;
    }
    ::v-deep.el-scrollbar__wrap {
      overflow-x: hidden;
    }
    ::v-deep.el-scrollbar__view {
      height: 100%;
    }
    .task_lists .el-row {
      height: 100%;
    }
    .task_lists:nth-child(odd) .el-col {
      background: rgba(132, 144, 159, 0.05);
      height: 100%;
    }
    .el-button--text {
      width: 100%;
    }
    .task-detail {
      width: 79%;
      padding: 10px;
      float: left;
      background-size: 100% 100%;
      height: 115px;
    }
    .edit1 {
      border: 2px solid #3b435a;
      padding: 10px;
      height: 95px;
      margin-top: 10px;
      margin-bottom: 10px;
      // .el-button {
      //   padding: 8px 16px;
      // }
    }
    .edit2 {
      margin-top: 10px;
      width: 100%;
    }
    .task_lists {
      cursor: pointer;
      padding-left: 5px;
      box-sizing: border-box;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: var(--neutral8);
      line-height: 40px;
      width: 100%;
      height: 40px;
      ::v-deep.el-row {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      ::v-deep.el-col-8 {
        text-align: left;
      }

      .circle {
        display: inline-block;
        width: 11px;
        height: 11px;
        background-color: #8a93b0;
        border-radius: 50%;
      }
      .noLock {
        color: white;
      }
      .taskName {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .el-switch {
      .el-switch__core {
        border-color: #9fa7aa !important;
        width: 53px !important;
      }
    }
    .el-switch.is-checked .el-switch__core::after {
      background: #fffeff;
    }
    .el-switch .el-switch__core::after {
      background: #9fa6ac;
    }
  }

  .has-gutter {
    color: #c0c5d8;
    font-size: 14px;
  }

  .footer {
    height: 55px;
    margin: 38px 0px;

    .el-form {
      margin-top: 2px;
    }
    .el-form-item {
      margin-bottom: 5px;
      margin-right: 11px;
      label {
        color: #a8afc1;
      }
    }

    .upload-demo {
      .el-button--primary {
        /* color: #FFF; */
        background-color: transparent;
        border-color: transparent;
      }
    }
  }
}

.block {
  display: flex;
  align-items: center;
  height: 36px;
}
</style>
