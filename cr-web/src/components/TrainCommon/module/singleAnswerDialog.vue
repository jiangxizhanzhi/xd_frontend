<template>
  <div id="singleAnswerDialog">
    <div class="task-name">
      <span class="fl i-color" style="width: 15%">
        {{ $t('m.missionTitle') }}
      </span>
      <div class="fl" style="width: 75%">
        {{ taskInfos && taskInfos.title }}
      </div>
    </div>
    <div class="task-name">
      <span class="fl i-color" style="width: 15%">{{ $t('m.taskType') }}</span>
      <div class="fl" style="width: 75%">
        {{ taskInfos && taskInfos.category }}
      </div>
    </div>
    <div class="task-desc-name">
      <span class="fl i-color" style="width: 15%">
        {{ $t('m.taskDescription') }}
      </span>
      <div class="fl task-desc">
        <cb-scrollbar>{{ taskInfos && taskInfos.description }}</cb-scrollbar>
      </div>
    </div>
    <div
      v-if="taskInfos.type === testType.JUDGE"
      class="answer-common answer-jude"
    >
      <!--判断-->
      <span class="fl i-color" style="width: 15%">{{ $t('m.option') }}</span>
      <div class="fl" style="width: 75%">
        <cb-radio-group v-model="judgeAnswer" direction="vertical">
          <cb-radio
            v-for="(item, i) in judgeOption"
            :key="i"
            :label="item.optionLabel"
            :disabled="false"
          >
            {{ item.optionLabel + '、' }}
            <span class="el-radio-choose-span">{{ item.optionValue }} </span>
          </cb-radio>
        </cb-radio-group>
      </div>
    </div>
    <div
      v-else-if="taskInfos.type === testType.SINGLE"
      class="answer-common answer-single"
    >
      <!--单选-->
      <span class="fl i-color" style="width: 15%">{{ $t('m.option') }}</span>
      <div class="fl" style="width: 75%">
        <cb-radio-group v-model="singleAnswer" direction="vertical">
          <cb-radio
            v-for="(item, i) in taskInfos.option"
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
      <span class="fl i-color" style="width: 15%">{{ $t('m.option') }}</span>
      <div class="fl" style="width: 75%">
        <cb-checkbox-group v-model="multipleAnswer" direction="vertical">
          <cb-checkbox
            v-for="(item, i) in taskInfos.option"
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
      <span class="fl i-color" style="width: 15%">{{ $t('m.file') }}</span>
      <div class="fl" style="width: 75%; margin-left: -18px">
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
    </div>
    <div class="answer-div markDownCommon write-mavon">
      <CbMarkdown v-model="taskAnswer" :uploadImages="uploadImages" />
    </div>
  </div>
</template>
<script>
import toolbars from '@/constants/model/markdown_toolbars';
import { getLanguage } from '@cyber/helper';
import SparkMD5 from 'spark-md5';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';

export default {
  name: 'AnswerDialog',
  props: {
    taskResourceId: {
      type: String,
      default: null,
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
      questionType: '',
      taskInfos: {
        title: '',
        desc: '',
        category: '',
        type: null,
      },
      testType: {
        // 题目类型
        JUDGE: 0, // 判断
        SINGLE: 1, // 单选
        MULTIPLE: 2, // 多选
        FILE: 7, //文件
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
      fileMD5: '',
      fileName: '',
      language: getLanguage(),
    };
  },
  computed: {},
  watch: {
    taskResourceId: {
      handler(val, oldval) {
        if (val) {
          if (val !== oldval) {
            this.initSingleTaskData(val);
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
          _this.fileMD5 = md5;
        };
      } else {
        this.fileName = '';
        this.fileMD5 = '';
      }
    },
    initSingleTaskData(val) {
      this.resource_id = this.$route.params && this.$route.params.resource_id;
      var url = `/cr/single_train/room/mission/`;
      this.$request
        .get(
          url,
          { resource_id: this.resource_id, mission_id: val },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          this.taskInfos = JSON.parse(JSON.stringify(res.data.data));
          this.questionType = res.data.data && res.data.data.type;
          if (
            res.data.data.training_record &&
            res.data.data.training_record.answer
          ) {
            if (res.data.data.type === this.testType.JUDGE) {
              this.judgeAnswer = res.data.data.training_record.answer;
            }
            if (res.data.data.type === this.testType.SINGLE) {
              this.singleAnswer = res.data.data.training_record.answer;
            }
            if (res.data.data.type === this.testType.MULTIPLE) {
              this.multipleAnswer = JSON.parse(
                res.data.data.training_record.answer,
              );
            }
            if (res.data.data.type === this.testType.FILE) {
              this.fileMD5 = res.data.data.training_record.answer;
            }
            this.taskAnswer = res.data.data.training_record.record;
          }
        });
    },
    uploadImages(item) {
      var formdata = new FormData();
      formdata.append('file', item[0]);
      formdata.append('type', this.BUSINESS_TYPE.CR_WEB_SINGLE);
      return this.$request
        .post(
          '/common/web/image_upload',

          formdata,

          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
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

<style lang="scss">
.v-note-wrapper {
  height: 450px;
}
#singleAnswerDialog {
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
    height: 60px;
    .task-desc {
      height: 100%;
      width: 83%;
      padding: 5px;
      border: 1px solid var(--neutral3);
    }
  }
  .answer-common {
    width: 100%;
    margin: 20px 0;
    overflow: hidden;
  }
  .answer-jude {
    min-height: 60px;
  }
  .answer-single {
    min-height: 100px;
  }
  .answer-div {
    width: 100%;
    height: 300px;
    margin: 20px 0;
    min-height: 40px;
    .v-note-wrapper {
      min-height: 360px;
      background: transparent !important;
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
</style>
