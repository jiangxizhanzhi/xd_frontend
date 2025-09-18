<template>
  <div id="taskAnswerDialog">
    <div class="task-name">
      <span class="fl i-color" style="width: 15%">{{
        $t('m.trainStage')
      }}</span>
      <div class="fl" style="width: 75%">{{ taskStage }}</div>
    </div>
    <div class="task-name">
      <span class="fl i-color" style="width: 15%">{{
        $t('m.missionTitle')
      }}</span>
      <div class="fl" style="width: 75%">{{ taskInfos.title }}</div>
    </div>
    <div class="task-name">
      <span class="fl i-color" style="width: 15%">{{ $t('m.taskType') }}</span>
      <div class="fl" style="width: 75%">{{ taskInfos.category }}</div>
    </div>
    <div class="task-desc-name">
      <span class="fl i-color" style="width: 15%">{{
        $t('m.taskDescription2')
      }}</span>
      <div class="fl task-desc">
        <cb-scrollbar>
          {{ taskInfos.description }}
        </cb-scrollbar>
      </div>
    </div>
    <div class="answer-div markDownCommon write-mavon">
      <template v-if="taskInfos.type === testType.JUDGE">
        <!--判断-->
        <span class="fl" style="width: 15%">{{ $t('m.option') }}</span>
        <div class="fl" style="width: 75%">
          <cb-radio-group v-model="judgeAnswer" direction="vertical">
            <cb-radio
              v-for="(item, i) in judgeOption"
              :key="i"
              :label="item.optionLabel"
            >
              {{ item.optionLabel + '、' }}
              <span class="el-radio-choose-span">{{ item.optionValue }}</span>
            </cb-radio>
          </cb-radio-group>
        </div>
      </template>
      <template v-else-if="taskInfos.type === testType.SINGLE">
        <!--单选-->
        <span class="fl" style="width: 15%">{{ $t('m.option') }}</span>
        <div class="fl" style="width: 85%">
          <cb-radio-group v-model="singleAnswer" direction="vertical">
            <cb-radio
              v-for="(item, i) in taskInfos.option"
              :key="i"
              :label="item.optionLabel"
            >
              {{ item.optionLabel + '、' }}
              <span class="el-radio-choose-span">{{ item.optionValue }}</span>
            </cb-radio>
          </cb-radio-group>
        </div>
      </template>
      <template v-else-if="taskInfos.type === testType.MULTIPLE">
        <!--多选-->
        <span class="fl" style="width: 15%">{{ $t('m.option') }}</span>
        <div class="fl" style="width: 85%">
          <cb-checkbox-group v-model="multipleAnswer" direction="vertical">
            <cb-checkbox
              v-for="(item, i) in taskInfos.option"
              :key="i"
              :label="item.optionLabel"
            >
              {{ item.optionLabel + '、' }}
              <span class="el-radio-choose-span">{{ item.optionValue }}</span>
            </cb-checkbox>
          </cb-checkbox-group>
        </div>
      </template>
      <template v-else-if="taskInfos.type === testType.FILE">
        <!--文件题-->
        <span class="fl i-color" style="width: 15%">{{ $t('m.file') }}</span>
        <div class="fl" style="width: 75%">
          <span
            v-if="fileMD5"
            class="color-gray"
            style="display: block; margin-bottom: 5px"
          >
            {{ fileMD5 }}
          </span>
          <cb-button style="padding: 6px 20px" @click="btnUpload">
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
      </template>
      <!--其他类型-->
      <template v-else>
        <!-- <cb-scrollbar> -->
        <CbMarkdown v-model="taskAnswer" :uploadImages="uploadImages" />
        <!-- </cb-scrollbar> -->
      </template>
    </div>
    <div v-if="taskInfos.show_writeup" class="task-name">
      <div class="i-color" style="margin-bottom: 5px">
        {{ $t('m.task') }}{{ $t('m.viewAnswer') }}
      </div>
      <div class="markDownCommon student-write">
        <CbMarkdown v-model="taskInfos.write_up" type="viewer" />
      </div>
    </div>
  </div>
</template>
<script>
import SparkMD5 from 'spark-md5';
import toolbars from '@/constants/model/markdown_toolbars';
import { getLanguage } from '@cyber/helper';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';
export default {
  name: 'AnswerDialog',

  props: {
    taskResourceId: {
      type: String,
      default: null,
    },
    showRecord: {
      type: Boolean,
      default: false,
    },
    taskStage: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      BUSINESS_TYPE,
      resource_id: '',
      toolbars: toolbars,
      judgeAnswer: '',
      singleAnswer: '',
      multipleAnswer: [],
      taskAnswer: '',
      taskInfos: {
        title: '',
        description: '',
        category: '',
        type: null,
      },
      testType: {
        // 题目类型
        JUDGE: 0, // 判断
        SINGLE: 1, // 单选
        MULTIPLE: 2, // 多选
        FILE: 7, // 文件题
      },
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
      language: getLanguage(),
    };
  },
  computed: {},
  watch: {
    taskResourceId: {
      handler(val, oldval) {
        if (val) {
          if (val !== oldval) {
            if (!this.showRecord) {
              // 综合演训
              this.initTeamTaskData(val);
            }
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
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
          _this.taskAnswer = md5;
        };
      } else {
        this.fileName = '';
        this.taskAnswer = '';
      }
    },
    // [前台]学员-获取任务详情
    initTeamTaskData(val) {
      this.resource_id = this.$route.params && this.$route.params.resource_id;
      this.$request
        .get(
          '/cr/training_team/training_team_students/get_mission_detail',
          {
            resource_id: this.resource_id,
            mission_id: val,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          this.taskInfos = JSON.parse(JSON.stringify(res.data.data));
          if (res.data.data.type === this.testType.SINGLE) {
            this.taskInfos.option = JSON.parse(this.taskInfos.option);
          } else if (res.data.data.type === this.testType.MULTIPLE) {
            this.taskInfos.option = JSON.parse(this.taskInfos.option);
          }
          if (res.data.data.user_answer) {
            if (res.data.data.type === this.testType.JUDGE) {
              this.judgeAnswer = res.data.data.user_answer;
            } else if (res.data.data.type === this.testType.SINGLE) {
              this.singleAnswer = res.data.data.user_answer;
              this.taskInfos.option = JSON.parse(this.taskInfos.option);
            } else if (res.data.data.type === this.testType.MULTIPLE) {
              this.multipleAnswer = JSON.parse(res.data.data.user_answer);
              this.taskInfos.option = JSON.parse(this.taskInfos.option);
            } else if (res.data.data.type === this.testType.FILE) {
              this.fileMD5 = res.data.data.user_answer;
            } else {
              this.taskAnswer = res.data.data.user_answer;
            }
          }
        });
    },
    uploadImages(item) {
      var formdata = new FormData();
      formdata.append('file', item[0]);
      formdata.append('type', this.BUSINESS_TYPE.CR_WEB_TEAM);
      // 团队学员答题填空问答等上传图片
      return this.$request
        .post('/common/web/image_upload', formdata, { baseURL: '/api/ojj' })
        .then((res) => {
          return [
            {
              url: res.data.data.file_path,
            },
          ];
        })
        .catch((res) => {});
    },
  },
};
</script>

<style lang="scss">
#taskAnswerDialog {
  width: 100%;
  box-sizing: border-box;
  .el-checkbox {
    align-items: normal;
  }
  .el-checkbox .el-checkbox__label,
  .el-checkbox .el-checkbox__input.is-checked + .el-checkbox__label {
    height: auto;
  }
  .el-radio-choose-span {
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    display: inline-block;
    vertical-align: top;
  }
  .student-write {
    min-height: 200px;
    .el-scrollbar {
      height: 100%;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
  .task-name {
    width: 100%;
    margin-bottom: 15px;
    min-height: 25px;
  }
  .task-desc-name {
    width: 100%;
    margin-bottom: 15px;
    height: 60px;
    .task-desc {
      height: 100%;
      width: 83%;
      padding: 5px;
      .el-scrollbar {
        height: 100%;
      }
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .el-scrollbar__view {
        height: 100%;
      }
    }
  }
  .answer-div {
    width: 100%;
    margin: 20px 0;
    height: 300px;
    overflow: hidden;
    .v-note-wrapper {
      min-height: 400px;
      // background: transparent !important;
    }
    .markdown-body table tr {
      background-color: transparent !important;
    }
    .markdown-body .highlight pre,
    .markdown-body pre {
      background-color: #0f4377 !important;
    }
    .markdown-body em {
      font-style: italic;
    }
    .markdown-body h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      border-bottom: 0 !important;
    }
    .op-icon.dropdown-wrapper.dropdown .popup-dropdown[data-v-548e2160] {
      background: #1c2238 !important;
      color: #ffffff;
    }
    .op-icon.dropdown-wrapper.dropdown .dropdown-item[data-v-548e2160]:hover {
      background: #35406b !important;
    }
    .v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper,
    .auto-textarea-wrapper .auto-textarea-input.no-resize,
    .v-note-wrapper .v-note-panel .v-note-show .v-show-content,
    .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html,
    .v-note-wrapper .v-note-op.shadow {
      background: transparent !important;
      color: white;
    }
    .v-note-wrapper .v-note-panel .v-note-show .v-show-content,
    .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
      width: 100%;
      height: 90%;
      padding: 8px 25px 15px 15px;
      overflow-y: auto;
      box-sizing: border-box;
      overflow-x: hidden;
      background: #fbfbfb;
    }
    .v-note-wrapper .v-note-op.shadow {
      border-bottom: 1px dashed #3b4465;
    }
    .v-note-wrapper .v-note-op .v-left-item .op-icon:hover,
    .v-note-wrapper .v-note-op .v-right-item .op-icon.selected,
    .v-note-wrapper .v-note-op .v-right-item .op-icon:hover {
      background: transparent !important;
      color: #dbdfeb;
    }
    .content-input-wrapper,
    .auto-textarea-input .no-border .no-resize {
      background: transparent !important;
    }
    .auto-textarea-wrapper {
      background: transparent !important;
    }
    .v-note-op {
      background: transparent !important;
      border-bottom: 1px solid rgba(67, 76, 110, 1);
    }
  }
}
</style>
