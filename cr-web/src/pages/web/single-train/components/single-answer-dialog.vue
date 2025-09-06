<template>
  <div id="singleAnswerDialog">
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
          <div>
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
        <div class="answer-div markDownCommon write-mavon">
          <CbMarkdown
            v-model="taskAnswer"
            :uploadImages="uploadImages"
            :uploadFile="uploadFile"
            :uploadZip="uploadZip"
            :exportFile="exportFile"
          />
        </div>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('m.answerKey')" name="md">
        <CbMarkdown type="viewer" v-model="mdContent" v-if="mdContent" />
        <div v-else style="height: 440px">
          <empty-page ref="emptyComp" />
        </div>
      </cb-tab-pane>
    </cb-tabs>
  </div>
</template>
<script>
import toolbars from '@/constants/model/markdown_toolbars';
import { getLanguage } from '@cyber/helper';
import SparkMD5 from 'spark-md5';
import { BUSINESS_TYPE } from '@/pages/web/RedVsBlue/constants.js';
import { saveImageWeb, uploadAttachmentWeb, uploadMd } from '@/api/common';
import { trainMission } from '@/api/web/single-train';
import _ from 'lodash';
import emptyPage from '@/pages/web/Empty';
export default {
  name: 'AnswerDialog',
  components: {
    emptyPage,
  },
  props: {
    taskResourceId: {
      type: String,
      default: null,
    },
    resourceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeName: 'task',
      BUSINESS_TYPE,
      resource_id: this.resourceId,
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
      fileSize: 1024 * 1024 * 1024,
      fileMD5: '',
      fileName: '',
      language: getLanguage(),
      mdContent: '题解',
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
      trainMission({ resource_id: this.resource_id, mission_id: val }).then(
        (res) => {
          this.taskInfos = JSON.parse(JSON.stringify(res.data.data));
          this.questionType = res.data.data && res.data.data.type;
          this.mdContent = _.get(res, 'data.data.write_up', '');
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
        },
      );
    },
    uploadImages(item) {
      var formdata = new FormData();
      formdata.append('file', item[0]);
      formdata.append('type', this.BUSINESS_TYPE.CR_WEB_SINGLE);
      return saveImageWeb(formdata).then((res) => {
        return [
          {
            url: res.data.data.file_path,
          },
        ];
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
            this.taskAnswer = data.content;
          }
        });
      });
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
    exportFile() {
      this.$request.download('/cpms/built_in/Demo.zip');
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
</style>
