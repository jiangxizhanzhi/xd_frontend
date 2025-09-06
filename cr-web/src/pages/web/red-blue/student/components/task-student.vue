<template>
  <div>
    <!-- 学员页面任务矩阵 -->
    <div class="task-dialog-content cyber-scroll-bar-small">
      <div
        class="task-item"
        :key="item.resource_id"
        v-for="item in taskList"
        @click="openTaskFn(item)"
      >
        <div
          class="decorate"
          :class="[
            item.status === 1
              ? 'decorate-success'
              : item.status === 2
              ? 'decorate-fail'
              : item.status === 0
              ? 'decorate-waiting'
              : item.status === 3
              ? 'decorate-reject'
              : 'decorate-not-submit',
          ]"
        ></div>
        <!-- 0未评估,1成功2失败3驳回11未提交 -->
        <span
          class="tag"
          :class="[
            item.status === 1
              ? 'tag-success'
              : item.status === 2
              ? 'tag-fail'
              : item.status === 0
              ? 'tag-waiting'
              : item.status === 3
              ? 'tag-reject'
              : 'tag-not-submit',
          ]"
          >{{
            item.status === 1
              ? $t('rbt.success')
              : item.status === 0
              ? $t('rbt.toEvaluate')
              : item.status === 2
              ? $t('rbt.fail')
              : item.status === 3
              ? $t('rbt.reject')
              : $t('rbt.unSubmit')
          }}
        </span>
        <span class="title" :title="item.name">{{ item.name }}</span>
      </div>
      <!-- 暂无数据 -->
      <div
        v-if="!taskList.length"
        class="empty-comp"
        style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      >
        <empty-page ref="emptyComp" />
      </div>
    </div>
    <!--答题弹框-->
    <cb-dialog
      v-if="innerVisible"
      :title="titleName"
      width="50%"
      :visible.sync="innerVisible"
      append-to-body
      :close-on-press-escape="false"
      class="task-answer"
      :custom-class="
        $route.name === 'scene-screen-recording' ? 'inner-dialog' : ''
      "
    >
      <div
        class="cyber-scroll-bar-small"
        style="width: 100%; height: 500px; overflow: auto"
        ref="AnswerDialog"
      >
        <div id="blueAnswerDialog">
          <cb-tabs v-model="activeName">
            <cb-tab-pane :label="$t('m.task')" name="task">
              <div class="task-desc-name">
                <div class="task-desc">
                  {{ taskInfos && taskInfos.description }}
                </div>
              </div>

              <div
                v-if="taskInfos.type === testType.JUDGE"
                class="answer-common answer-jude"
              >
                <!--判断-->
                <div>
                  <cb-radio-group v-model="judgeAnswer" direction="vertical">
                    <cb-radio
                      v-for="(item, i) in judgeOption"
                      :key="i"
                      :label="item.optionLabel"
                      :disabled="false"
                    >
                      {{ item.optionLabel + '、' }}
                      <span class="el-radio-choose-span"
                        >{{ item.optionValue }}
                      </span>
                    </cb-radio>
                  </cb-radio-group>
                </div>
              </div>
              <div
                v-else-if="taskInfos.type === testType.SINGLE"
                class="answer-common answer-single"
              >
                <!--单选-->
                <div>
                  <cb-radio-group v-model="singleAnswer" direction="vertical">
                    <cb-radio
                      v-for="(item, i) in option"
                      :key="i"
                      :label="item.optionLabel"
                      :disabled="false"
                    >
                      {{ item.optionLabel + '、' }}
                      <span class="el-radio-choose-span">
                        {{ item.optionValue }}
                      </span>
                    </cb-radio>
                  </cb-radio-group>
                </div>
              </div>
              <div
                v-else-if="taskInfos.type === testType.MULTIPLE"
                class="answer-common answer-single"
              >
                <!--多选-->
                <div>
                  <cb-checkbox-group
                    v-model="multipleAnswer"
                    direction="vertical"
                  >
                    <cb-checkbox
                      v-for="(item, i) in option"
                      :key="i"
                      :label="item.optionLabel"
                      :disabled="false"
                    >
                      {{ item.optionLabel + '、' }}
                      <span class="el-radio-choose-span">
                        {{ item.optionValue }}
                      </span>
                    </cb-checkbox>
                  </cb-checkbox-group>
                </div>
              </div>
              <div
                v-else-if="taskInfos.type === testType.FILE"
                class="answer-common answer-single"
              >
                <!--文件题-->
                <div>
                  <span
                    v-if="fileMD5"
                    class="color-gray"
                    style="display: block; margin-bottom: 5px"
                  >
                    {{ fileMD5 }}
                  </span>
                  <cb-button @click="btnUpload">
                    {{ $t('m.upload') }}
                  </cb-button>
                  <input
                    id="file"
                    ref="uploadFile"
                    type="file"
                    style="display: none"
                    @change="changeFile($event)"
                  />
                  <span style="padding-left: 10px">{{ fileName }}</span>
                </div>
              </div>
              <div class="task-name">
                <span class="fl i-color">{{ $t('m.taskType') }}：</span>
                <div class="fl">
                  {{ taskInfos && taskInfos.category }}
                </div>
              </div>
              <div style="display: flex; align-items: center">
                <div>{{ $t('rbt.historicalRejection') }}：</div>
                <cb-button @click="viewReject()" hollow>{{
                  $t('rbt.view')
                }}</cb-button>
              </div>
              <div class="answer-div markDownCommon write-mavon">
                <CbMarkdown
                  v-model="content"
                  :uploadImages="uploadImages"
                  :uploadFile="uploadFile"
                  :uploadZip="uploadZip"
                  :exportFile="exportFile"
                />
              </div>
            </cb-tab-pane>
            <cb-tab-pane :label="$t('m.answerKey')" name="md">
              <CbMarkdown type="viewer" v-model="write_up" v-if="write_up" />
              <div v-else style="height: 440px">
                <empty-page ref="emptyComp" />
              </div>
            </cb-tab-pane>
          </cb-tabs>
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
      @close="cancelFn"
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
        <cb-button hollow @click="cancelFn">{{ $t('m.cancel') }}</cb-button>
      </span>
    </cb-dialog>
  </div>
</template>

<script>
import emptyPage from '@/pages/web/Empty';
import {
  getRedBlueMatrix,
  getMeissionDetail,
  beginMission,
  submitAnswer,
} from '@/api/web/red-blue';
import _ from 'lodash';
import SparkMD5 from 'spark-md5';
import { saveImageWeb, uploadAttachmentWeb, uploadMd } from '@/api/common';
import { getUserInfo } from '@cyber/helper';
import { errorMessage } from '@/assets/js/tools.js';
import { BUSINESS_TYPE } from '@/pages/web/red-blue/constants.js';
export default {
  components: {
    emptyPage,
  },
  props: {
    resource_id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      BUSINESS_TYPE,
      fileSize: 1024 * 1024 * 1024,
      titleName: '',
      content: '',
      testType: {
        // 题目类型
        JUDGE: 0, // 判断
        SINGLE: 1, // 单选
        MULTIPLE: 2, // 多选
        FILE: 7, // 文件题
      },
      activeName: 'task',
      taskList: [],
      // 是否展示题解
      showAnswer: false,
      // 题解内容
      write_up: '',
      // 答题弹框
      innerVisible: false,
      // 历史驳回弹窗
      innernewVisible: false,
      taskListName: '',
      taskListContent: '',
      taskType: '',
      taskHash: '',
      taskValue: 5,
      judgeAnswer: '',
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
      singleAnswer: '',
      multipleAnswer: [],
      option: [],
      fileName: '',
      fileMD5: '',
      rejectList: [],
      content: '',
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
      sourceIP: '',
      sourcePort: '',
      aimIP: '',
      aimPort: '',
      state: '',
      answerExtension: {},
    };
  },
  watch: {
    innerVisible: {
      handler(nv) {
        if (nv) {
          this.activeName = 'task';
        }
      },
    },
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    btnUpload() {
      this.$refs.uploadFile.click();
    },
    cancelFn() {
      this.innernewVisible = false;
      this.innerVisible = true;
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
          _this.fileMD5 = md5;
        };
      } else {
        this.fileName = '';
        this.fileMD5 = '';
      }
    },
    uploadFile($file) {
      return new Promise((resolve) => {
        //校验文件大小
        if ($file[0].size > this.fileSize) {
          this.$message.warning(
            this.$t('m.fileSizeLimit', {
              size: (this.fileSize / 1024 / 1024).toFixed(2),
            }),
          );
          return false;
        }
        const formdata = new FormData();
        formdata.append('type', '12');
        formdata.append('file', $file[0]);
        uploadAttachmentWeb(formdata).then((res) => {
          const data = _.get(res, 'data.data', []);
          resolve([
            {
              name: data.file_name,
              url: data.file_path,
            },
          ]);
        });
      });
    },
    uploadZip(file) {
      return new Promise((resolve, reject) => {
        //校验文件大小
        if (file.size > this.fileSize) {
          this.$message.warning(
            this.$t('m.fileSizeLimit', {
              size: (this.fileSize / 1024 / 1024).toFixed(2),
            }),
          );
          return false;
        }
        const formdata = new FormData();
        formdata.append('md', file);
        uploadMd(formdata).then((res) => {
          const data = _.get(res, 'data.data', []);
          const is_extract = data.is_extract;
          if (is_extract) {
            this.content = data.content;
          }
        });
      });
    },
    exportFile() {
      this.$request.download('/cpms/built_in/Demo.zip');
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        this.initData();
      });
    },
    //  初始化数据
    initData() {
      if (this.resource_id) {
        getRedBlueMatrix({
          user_id: this.$store.state.user.id,
          resource_id: this.resource_id,
        }).then((res) => {
          const data = _.get(res, 'data.data', '');
          this.taskList = data.task_list;
          // 任务矩阵传给外层
          this.$emit('getTaskList', data);
        });
      }
    },
    // 点击题目
    openTaskFn(item) {
      this.write_up = '';
      this.content = '';
      this.taskHash = item.mission_id;
      getMeissionDetail({
        resource_id: item.resource_id,
        mission_id: item.mission_id,
      }).then((res) => {
        this.taskInfos = JSON.parse(JSON.stringify(res.data.data));
        const data = _.get(res, 'data.data', '');
        this.titleName = data.title;
        if (data) {
          this.taskListName = data.title;
          this.taskListContent = data.description;
          this.taskType = data.type;

          if (data.write_up_show) {
            // 是否显示题解
            this.showAnswer = true;
            this.write_up = data.write_up;
          } else {
            this.showAnswer = false;
          }
          if (data.user_mission_status) {
            // 未开始
            this.innerVisible = true;
          }
          if (
            !(
              data.type === this.$CONSTANT.Mission.TastType.MULTIPLE.value ||
              data.type === this.$CONSTANT.Mission.TastType.SINGLE.value ||
              data.type === this.$CONSTANT.Mission.TastType.FILE.value
            )
          ) {
            this.option = JSON.parse(data.option);
          } else {
            // this.option = task.option;
            this.option = JSON.parse(data.option);
          }
          if (res.data.data.remark) {
            this.content = res.data.data.remark;
          }
          if (data.user_answer) {
            if (data.type === this.testType.JUDGE) {
              this.judgeAnswer = data.user_answer;
            } else if (data.type === this.testType.SINGLE) {
              this.singleAnswer = data.user_answer;
            } else if (data.type === this.testType.MULTIPLE) {
              this.multipleAnswer = JSON.parse(data.user_answer);
            } else if (data.type === this.testType.FILE) {
              this.fileMD5 = data.user_answer;
            } else {
              this.content = data.user_answer;
            }
          } else {
            this.judgeAnswer = '';
            this.singleAnswer = '';
            this.multipleAnswer = [];
            this.fileMD5 = '';
            this.fileName = '';
          }
          this.rejectList = data.reject_log;
        }
      });
    },
    // 开始任务
    //学员登录点击任务列表题目开始答题
    beginMission() {
      beginMission({
        resource_id: this.resource_id,
        mission_hash: this.taskHash,
      })
        .then((res) => {
          this.initData();
          this.innerVisible = true;
          this.status = this.$t('m.running');
        })
        .catch((error) => {
          errorMessage(error, this);
        });
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
      submitAnswer({
        resource_id: this.resource_id,
        mission_hash: this.taskHash,
        answer: answer,
        remark: this.content,
      })
        .then((res) => {
          this.innerVisible = false;
          // 判断0、单选1、多选2、文件7
          if ([0, 1, 2, 7].includes(this.taskType)) {
            // 判断0、单选1、多选2、文件7 （客观题提示'上报成功'）
            this.$message({
              message: this.$t('m.reportSuccess'),
              type: 'success',
            });
          } else if ([3, 4, 5, 6].includes(this.taskType)) {
            //填空3、问答4、攻击5、防御6（主观题提示'已提交，等待评估'）
            this.$message({
              message: this.$t('m.submittedWaitingForEvaluation'),
              type: 'success',
            });
          }
          this.content = '';
          this.fileName = '';
          this.initData();
        })
        .catch((error) => {
          if (error.data.message) {
            this.$message.error(error.data.message);
          }
        });
    },
    cancelSubmit() {
      this.content = '';
      this.innerVisible = false;
    },
    // 查看驳回
    viewReject() {
      this.innernewVisible = true;
      this.innerVisible = false;
    },
    // 上传图片
    uploadImages(item) {
      var formdata = new FormData();
      formdata.append('file', item[0]);
      formdata.append('type', this.BUSINESS_TYPE.CR_WEB_RED);
      return saveImageWeb(formdata).then((res) => {
        return [
          {
            url: res.data.data.file_path,
          },
        ];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.empty-comp {
  .empty_page {
    .not-data {
      .cb-iconfont {
        font-size: 56px !important;
      }
      .text-data {
        font-size: 14px !important;
      }
    }
  }
}
.v-note-wrapper {
  height: 450px;
}
#blueAnswerDialog {
  width: 100%;
  height: 99%;
  .task-name {
    width: 100%;
    margin-bottom: 15px;
    min-height: 25px;
  }
  .task-desc-name {
    width: 100%;
    margin-bottom: 15px;
  }
  .answer-common {
    width: 100%;
    margin: 20px 0;
    overflow: hidden;
  }
  .answer-jude {
    min-height: 60px;
  }
  .answer-div {
    width: 100%;
    height: 240px;
    margin: 20px 0;
    min-height: 40px;
  }
  .el-radio,
  .el-checkbox {
    display: block;
  }
  .el-radio-group {
    width: 99%;
  }
  .el-radio {
    width: 98%;
  }
  .el-radio__label {
    width: 90%;
    line-height: 120%;
  }
  .el-checkbox-group {
    width: 99%;
  }
  .el-checkbox {
    width: 99%;
  }
  .el-checkbox__label {
    width: 90%;
    line-height: 120%;
  }
  .el-radio-choose-span {
    white-space: initial !important;
    display: inline-block;
    vertical-align: top;
  }
  .el-checkbox .el-checkbox__label,
  .el-checkbox .el-checkbox__input.is-checked + .el-checkbox__label {
    height: auto;
  }
}
.task-dialog {
  ::v-deep .el-dialog {
    margin-right: 0;
  }
  &-content {
    min-height: 300px;
  }
}

.task-dialog-content {
  width: 100%;
  height: 400px;
  overflow-y: scroll;
  margin-bottom: 16px;
  position: relative;
  .task-item {
    height: 48px;
    display: flex;
    align-items: center;
    background: var(--bg-color-3);
    border-bottom: 1px solid var(--neutral0);
    padding-left: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    cursor: pointer;
    &:hover {
      background: var(--neutral0);
    }
    &:hover .title {
      color: var(--primary-color);
    }
    .decorate {
      width: 2px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .decorate-success {
      background: var(--green-color);
    }
    .decorate-fail {
      background: var(--red-color);
    }
    .decorate-waiting {
      background: var(--primary-color-2);
    }
    .decorate-reject {
      background: var(--orange-color);
    }
    .decorate-not-submit {
      background: var(--primary-color);
    }
    .tag {
      display: inline-block;
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      padding: 0 8px;
    }
    .tag-success {
      background: var(--green-color-2);
      color: var(--green-color);
    }
    .tag-fail {
      background: var(--red-color-2);
      color: var(--red-color);
    }
    .tag-waiting {
      background: var(--primary-color-2);
      color: var(--primary-color);
    }
    .tag-reject {
      background: var(--yellow-color-2);
      color: var(--yellow-color);
    }
    .tag-not-submit {
      background: var(--bg-color-2);
      color: var(--neutral8);
    }
    .title {
      width: 456px;
      display: inline-block;
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      color: var(--neutral8);
      margin-left: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
<style lang="scss">
.inner-dialog {
  margin-right: 0 !important;
}
</style>
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
