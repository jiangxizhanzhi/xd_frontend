<template>
  <cb-inner-page :background="false">
    <div class="box-card add-content addClass" :style="commonMarginRightStyle">
      <cb-form
        ref="form"
        :model="formData"
        :rules="rules"
        :label-width="labelWidthForm"
        :url="url"
        baseURL="/api/ojj"
        :isBgColor="true"
      >
        <cb-form-item :label="$t('m.courseName')" prop="name">
          <cb-input v-model="formData.name"></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('m.type')" prop="type">
          <cb-select
            v-model="formData.type"
            :options="typeOptions"
            :placeholder="$t('m.allDifficulty')"
          ></cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('m.knowledgePoint')" prop="knowledge">
          <cy-tags
            v-model="formData.knowledge"
            ref="cyTags"
            :max="5"
            :ctg="$t('m.knowledgePoint')"
          >
            <cb-button
              button-type="add"
              hollow="hollow"
              slot="trigger"
            ></cb-button>
          </cy-tags>
        </cb-form-item>
        <!-- //- 讲义/指导 -->
        <cb-form-item
          :label="
            formData.type === $CONSTANT.COURSES.TYPE.THEORY
              ? $t('m.handout')
              : $t('m.guidance')
          "
        >
          <cb-upload-file
            ref="upload"
            type="file"
            v-model="pdfList"
            :fetch-promise="uploadPdf"
            accept=".pdf,.zip,.pptx,.ppt,.docx,.doc"
            @delete="pdfRemove"
            :fileSize="1024 * 1024 * 1024"
          >
            <template v-slot:tip>
              <div class="cb-upload__tip">
                {{ $t('m.fileTip') }} [<cb-link
                  :href="demoload"
                  download="demo.zip"
                  :underline="false"
                  class="lesson-link"
                  >demo.zip</cb-link
                >],
                {{ $t('m.pptWordFileTip') }}
              </div>
            </template>
          </cb-upload-file>
          <!-- 视频 -->
        </cb-form-item>
        <cb-form-item :label="$t('m.video')" prop="video">
          <cb-upload-file
            ref="uploadVideo"
            type="file"
            v-model="videoList"
            :fetch-promise="uploadVideo"
            accept=".mp4,.m4v"
            @delete="videoRemove"
            tipText=""
            :fileSize="1024 * 1024 * 1024"
            :is-preview="false"
          >
            <template v-slot:custom>
              <cb-button type="text" @click="setVideoConfig"
                >{{ $t('course.setCheckPoint') }}
              </cb-button>
            </template>
          </cb-upload-file>
        </cb-form-item>
        <!-- 附件 -->
        <cb-form-item :label="$t('m.enclosure')" prop="attachment">
          <cb-upload-file
            ref="upload2"
            type="file"
            v-model="attachmentList"
            :fetch-promise="uploadAttachment"
            :limit="10"
            :multiple="false"
            :tipText="$t('m.uploadUpTo10Attachments')"
            accept=".zip,.rar"
            :fileSize="1024 * 1024 * 100"
          ></cb-upload-file>
        </cb-form-item>
        <cb-form-item
          v-if="formData.type === $CONSTANT.COURSES.TYPE.LABS_TYPE"
          :label="$t('m.sceneConfiguration')"
          prop="value"
        >
          <div class="fl" style="height: 600px; width: 100%">
            <scene-editor
              ref="sceneeditor"
              :title="formData.name"
              :showMask="false"
              :sceneConfig="sceneConfig"
              :topology-data="formData.oj_scene_config"
            />
          </div>
        </cb-form-item>
        <cb-form-item
          v-if="
            formData.type === $CONSTANT.COURSES.TYPE.LABS_TYPE &&
            formData.oj_scene_config !== null
          "
          :label="$t('m.shareEnvironment')"
          prop="destroy_delay"
        >
          <div class="fl" style="margin-top: 7px">
            <cb-switch
              active-color="#52c41a"
              style="display: block"
              v-model="formData.share_mode"
              active-value="1"
              inactive-value="2"
              :active-text="$t('m.private')"
              :inactive-text="$t('m.share')"
            ></cb-switch>
          </div>
          <div class="fl mod colorWhite">
            <span
              >{{ $t('m.survivalTime') }}
              <cb-input-number
                class="num-input"
                v-model="formData.destroy_delay"
                controls-position="right"
                :step="1"
                :min="1"
                :max="100"
                :step-strictly="true"
              ></cb-input-number> </span
            ><span>{{ $t('m.hour') }}</span>
          </div>
        </cb-form-item>
        <cb-form-item :label="$t('m.difficulty')" prop="difficulty">
          <cb-select
            v-model="formData.difficulty"
            :options="difficultyOptions"
          ></cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('m.learningTime')" prop="duration">
          <cb-select
            v-model="formData.duration"
            :options="durationOptions"
          ></cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('m.learningType')" prop="lesson_type">
          <cb-select
            v-model="formData.lesson_type"
            :options="lessonOptions"
          ></cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('m.public')" prop="public">
          <cb-switch
            v-model="formData.public"
            active-color="#52c41a"
          ></cb-switch>
        </cb-form-item>
        <cb-form-item :label="$t('course.classInfo')">
          <cb-button
            icon="icon-xuanti"
            color-type="hollow"
            @click="addPractice"
            >{{ $t('course.selectPractice') }}</cb-button
          >
          <div class="pCount">
            <span>{{ $t('course.chosen') }}</span
            ><span class="itemNum">{{ ItemNumber }}</span
            ><span>{{ $t('course.practices') }}</span>
          </div>
        </cb-form-item>
        <template slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button
              @click="onSubmit"
              :disabled="submitLoading"
              button-type="confirm"
            ></cb-button>
            <cb-button @click="onCnacle" button-type="cancel"></cb-button>
          </cb-button-group>
        </template>
      </cb-form>
      <cb-dialog
        width="88%"
        height="706px"
        class="dialog-style"
        :title="$t('course.selectPractice')"
        :visible.sync="practiceVisible"
        center="center"
      >
        <div class="cyber-scroll-bar" style="height: 650px; overflow: auto">
          <practice-set-course
            :partic_list_new="formData.practice_list"
            @getPracticeListNew="getPracticeListNew"
          ></practice-set-course>
        </div>
        <div slot="footer" class="dialog-footer">
          <cb-button-group>
            <cb-button mr="mr" @click="apply">{{
              $t('button.confirm')
            }}</cb-button>
            <cb-button button-type="cancel" @click="cancel"></cb-button>
          </cb-button-group>
        </div>
      </cb-dialog>
      <upload-process :percentage="process" :isShowProgress="showProgress">
      </upload-process>
      <!-- 视频检查点 -->
      <video-checkpoint
        ref="checkpointRef"
        v-if="videoCheckpointVisible"
        :visible.sync="videoCheckpointVisible"
        :video_url="formData.video"
        :video_check_point.sync="formData.video_check_point"
        @close="handleCheckPointClose"
      ></video-checkpoint>
    </div>
  </cb-inner-page>
</template>
<script>
import Constant from '../course-constant.js';
import Http from '@/utils/http.js';
import Utils from '@/utils/util.js';
import msger from '@/utils/message.js';
import Validate from '@/utils/validate.js';
import PracticeSetCourse from '@/pages/cms/exam/exercise-set/practice-set-course.vue';
import { errorMessage } from '@/utils/index.js';
import _ from 'lodash';
import { SceneEditor } from '@cyber/scene';
import UploadProcess from '@/components/upload-process';
import VideoCheckpoint from './components/video-chekpoint';
export default {
  components: {
    VideoCheckpoint,
    PracticeSetCourse,
    SceneEditor,
    UploadProcess,
  },
  data() {
    var validateTime = (rule, value, callback) => {
      if (value == 0) {
        return callback(new Error(this.$t('views.course.liveTime')));
      }
      callback();
    };
    return {
      process: 0,
      showProgress: false,
      dialogPracticeList: [],
      url: '/oj/admin/lesson',
      practiceVisible: false,
      submitLoading: false, // 是否有文件在上传
      enclosureUploading: 0,
      inputVisible: false,
      inputValue: '',
      Knowledgeerror: false,
      // 难度分类数据
      difficultyOptions: [],
      // 场景配置
      sceneConfig: {
        showMenu: true,
        menubar: ['topology'],
        toolbar: [],
        showToolbar: true,
      },
      formData: {
        practice_list: [],
        name: '',
        type: 0,
        knowledge: [],
        video: null,
        attachment: '',
        difficulty: 0,
        duration: 5,
        lesson_type: 0,
        public: false,
        handout: null,
        share_mode: '1',
        destroy_delay: 2,
        oj_scene_config: {
          scene_config: {},
        },
        scene_config_name: '',
        video_check_point: '', //视频检查点
      },
      demoload: '/cpms/markdown/demo.zip',
      demopptload: '/cpms/markdown/demo_ppt.zip',
      rules: {
        name: [
          {
            required: true,
            validator: Validate.courseName,
            trigger: ['blur', 'change'],
          },
        ],
        destroy_delay: [
          { required: true, validator: validateTime, trigger: 'blur' },
        ],
      },
      resource_id: '',
      upList: [],
      fileVisible: false,
      upCheckList: [],
      fileList: [],
      pdfList: [], //讲义文件列表
      videoList: [], //视频文件列表
      attachmentList: [], //附件文件列表
      videoCheckpointVisible: false, // 视频检查点配置弹窗
      video_duration: 0, // 视频时长
    };
  },
  computed: {
    ItemNumber() {
      return this.formData.practice_list.length;
    },
    lessonOptions() {
      return [
        {
          label: this.$t('m.noSet'),
          value: this.$CONSTANT.COURSES.LEARNTYPE.NOSET,
        },
        {
          label: this.$t('m.compulsory'),
          value: this.$CONSTANT.COURSES.LEARNTYPE.COMPULSORY,
        },
        {
          label: this.$t('m.elective'),
          value: this.$CONSTANT.COURSES.LEARNTYPE.ELECTIVE,
        },
      ];
    },
    durationOptions() {
      return [
        {
          label: this.$t('m.five'),
          value: this.$CONSTANT.COURSES.LEARNTIME.FIVE,
        },
        {
          label: this.$t('m.ten'),
          value: this.$CONSTANT.COURSES.LEARNTIME.TEN,
        },
        {
          label: this.$t('m.fifteen'),
          value: this.$CONSTANT.COURSES.LEARNTIME.FIFTEEN,
        },
        {
          label: this.$t('m.thirty'),
          value: this.$CONSTANT.COURSES.LEARNTIME.THIRTY,
        },
        {
          label: this.$t('m.sixty'),
          value: this.$CONSTANT.COURSES.LEARNTIME.SIXTY,
        },
        {
          label: this.$t('m.oneHundredTwenty'),
          value: this.$CONSTANT.COURSES.LEARNTIME.ONE_HUNDRED_TWENTY,
        },
      ];
    },
    typeOptions() {
      return [
        {
          label: this.$t('m.theory'),
          value: this.$CONSTANT.COURSES.TYPE.THEORY,
        },
        {
          label: this.$t('m.LABS'),
          value: this.$CONSTANT.COURSES.TYPE.LABS_TYPE,
        },
      ];
    },
    commonMarginRightStyle() {
      return {
        marginRight: `16px`,
      };
    },
    labelWidth() {
      return this.$store.state.app.labelWidth;
    },
    labelWidthForm() {
      return `${this.labelWidth}px`;
    },
    $CONSTANT() {
      return Constant;
    },
    courseId() {
      return _.get(this, '$route.params.courseId');
    },
  },
  created() {
    this.getDifficultyOptions();
  },
  updated() {
    this.$nextTick(() => {
      //讲义文件名加title
      if (document.querySelector('.guidance-upload ul li')) {
        const aDom = document.querySelectorAll('.guidance-upload ul li');
        aDom.forEach((item) => {
          let aDomA = item.querySelector('a');
          aDomA.setAttribute('title', aDomA.innerText);
        });
      }
      //视频文件名设置title
      if (document.querySelector('.video-upload ul li')) {
        const aDom = document.querySelectorAll('.video-upload ul li');
        aDom.forEach((item) => {
          let aDomA = item.querySelector('a');
          aDomA.setAttribute('title', aDomA.innerText);
        });
      }
      //附件文件名设置title
      if (document.querySelector('.cooller ul li')) {
        const aDom = document.querySelectorAll('.cooller ul li');
        aDom.forEach((item) => {
          let aDomA = item.querySelector('a');
          aDomA.setAttribute('title', aDomA.innerText);
        });
      }
    });
  },
  methods: {
    // 获取勾选数据
    getPracticeListNew(data) {
      this.dialogPracticeList = data;
    },
    // 选题点击确定
    apply() {
      const that = this;
      const { lessonId, model, courseId } = that;
      const practice_list = that.dialogPracticeList.map((item) => {
        return {
          ...item,
        };
      });
      //typeof(lessonId) == 'undefined'说明是新增的
      if (typeof lessonId == 'undefined') {
        this.practiceVisible = false;
        this.formData.practice_list = practice_list;
      }
    },
    // 选题点击取消
    cancel() {
      this.practiceVisible = false;
    },
    // 获取难度类型
    getDifficultyOptions() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 9,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          let arr = res.data.data;
          arr = arr.map((item) => {
            return {
              value: item.code,
              label: item.name,
            };
          });
          this.difficultyOptions = arr;
        });
    },
    uploadAttachment(file) {
      const that = this;
      ++that.enclosureUploading;
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 2);
      this.$request
        .post('/common/admin/attachment_upload', uploadData, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          const fileObj = {};
          fileObj.uid = file.uid;
          fileObj.resource_id = res.data.data;
          fileObj.name = file.name;
          fileObj.public = true;
          // this.upList.push(fileObj);
          this.attachmentList[this.attachmentList.length - 1].resource_id =
            res.data.data.resource_id;
        })
        .catch((error) => {
          this.attachmentList.pop();
        })
        .finally(() => {
          --that.enclosureUploading;
        });
      return false;
    },
    uploadVideo(file) {
      this.showProgress = true;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 10);
      this.$request
        .post('/common/admin/attachment_upload', formData, {
          baseURL: '/api/ojj',
          onUploadProgress: (progressEvent) => {
            let processStatus =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            this.process = processStatus;
          },
        })
        .then((res) => {
          this.showProgress = false;
          this.process = 0;
          this.formData.video = res.data.data.file_path;
          // 获取视频时长
          const url = URL.createObjectURL(file);
          const audioElement = new Audio(url);
          audioElement.addEventListener('loadedmetadata', (_event) => {
            this.video_duration = Math.floor(audioElement.duration);
          });
        })
        .catch(() => {
          this.showProgress = false;
          this.process = 0;
        });
    },
    uploadPdf(file) {
      this.showProgress = true;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 9);
      this.$request
        .post('/common/admin/attachment_upload', formData, {
          baseURL: '/api/ojj',
          onUploadProgress: (progressEvent) => {
            let processStatus =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            this.process = processStatus;
          },
        })
        .then((res) => {
          this.showProgress = false;
          this.process = 0;
          this.formData.handout = res.data.data.file_path;
        })
        .catch(() => {
          this.showProgress = false;
          this.process = 0;
        });
    },
    addPractice() {
      this.practiceVisible = true;
    },
    handleSelectionChange(val) {
      this.upCheckList = val;
    },
    pdfRemove(file) {
      this.formData.handout = '';
    },
    videoRemove() {
      this.formData.video = null;
    },
    checkDesc(value) {
      let flag = false;
      var l = Utils.getByteLen(value) >= 4 && Utils.getByteLen(value) <= 40;
      this.descLength = Utils.getByteLen(value);
      if (!l) {
        this.formData.inputValue = this.countCharacters(value, 40);
        this.Knowledgeerror = true;
        flag = true;
      } else {
        this.Knowledgeerror = false;
        flag = false;
      }
      return flag;
    },
    countCharacters(str, size) {
      var totalCount = 0;
      var newStr = '';
      for (var i = 0; i < str.length; i++) {
        const a = str.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          totalCount += 2;
        } else {
          totalCount += 1;
        }
        if (totalCount <= size) {
          newStr = str.substring(0, i + 1);
        } else {
          return newStr;
        }
      }
      return newStr;
    },
    onSubmit() {
      const that = this;
      if (that.formData.type === that.$CONSTANT.COURSES.TYPE.LABS_TYPE) {
        let editorData = this.$refs.sceneeditor.getData();
        let { scene_config } = editorData;
        this.formData.oj_scene_config.scene_config = _.clone(scene_config);
        this.formData.oj_scene_config.scene_config.topology.scene = {
          ...this.formData.oj_scene_config.scene_config.topology.scene,
          name: this.formData.name,
        };
      }
      if (that.Knowledgeerror) {
        return false;
      }
      const fileArr = [];
      this.attachmentList.forEach((e) => {
        fileArr.push(e.resource_id);
      });
      this.$refs['form'].validate((valid) => {
        const submitForm = new FormData();
        const { formData, courseId } = that;
        submitForm.append('name', formData.name);
        submitForm.append('type', formData.type);
        submitForm.append('knowledge', JSON.stringify(formData.knowledge));
        submitForm.append('attachment_ids', fileArr.join(','));
        submitForm.append('difficulty', formData.difficulty);
        submitForm.append('duration', formData.duration);
        submitForm.append('compulsory', formData.lesson_type);
        submitForm.append('is_public', formData.public);
        submitForm.append('course_id', courseId);
        if (formData.handout) {
          submitForm.append('handout', formData.handout);
        }
        if (formData.video != null) {
          submitForm.append('video', formData.video);
          if (!formData.video_check_point) {
            // 默认10秒分隔
            let checkPoints = JSON.stringify({
              points: this.generateDefaultCheckPoints(10, this.video_duration),
              custom_points: [],
            });
            formData.video_check_point = checkPoints;
          }
          submitForm.append('video_check_point', formData.video_check_point);
        }
        submitForm.append(
          'oj_scene_config',
          JSON.stringify(formData.oj_scene_config),
        );
        submitForm.append('destroy_delay', formData.destroy_delay);
        submitForm.append('scene_share_mode', formData.share_mode);
        submitForm.append(
          'practice_list',
          JSON.stringify(formData.practice_list),
        );

        if (valid) {
          if (that.enclosureUploading > 0) {
            // 是否有附件上传
            this.$confirm(
              that.$t('m.enclosureUploadingTip'),
              that.$t('common.confirm'),
              {
                cancelButtonClass: 'btn-cancel-confirm',
                type: 'warning',
              },
            )
              .then(() => {
                that.lessonsSubmit(submitForm);
              })
              .catch((err) => {});
          } else {
            that.lessonsSubmit(submitForm);
          }
        } else {
          return false;
        }
      });
    },
    lessonsSubmit(submitForm) {
      const that = this;
      that.submitLoading = true;
      this.$refs.form
        .submit(submitForm)
        .then((res) => {
          msger.success(this.$t('m.successful'), that);
          that.$router.push({
            name: 'lessons-manage',
            courseId: this.courseId,
          });
        })
        .catch((error) => {
          if (typeof error.response.data.knowledge != 'undefined')
            this.$message({
              message: error.response.data.knowledge.knowledge.message,
              type: 'error',
            });
          else {
            msger.serverError(error, that);
          }
        })
        .finally(() => {
          that.submitLoading = false;
        });
    },
    onCnacle() {
      this.$router.push({
        name: 'lessons-manage',
        courseId: this.courseId,
      });
    },
    handleClose(tag) {
      this.formData.knowledge.splice(this.formData.knowledge.indexOf(tag), 1);
      this.isRequireKnowledge();
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      if (inputValue) {
        this.formData.knowledge.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
      this.isRequireKnowledge();
    },
    // 判断knowledge
    isRequireKnowledge() {
      for (let i = 0; i < this.formData.knowledge.length; i++) {
        if (this.checkDesc(this.formData.knowledge[i])) {
          break;
        }
      }
    },
    showfile() {
      this.fileVisible = true;
      this.getFileData();
    },
    setVideoConfig() {
      this.videoCheckpointVisible = true;
    },
    handleCheckPointClose() {
      this.videoCheckpointVisible = false;
    },
    // 生成默认检查点
    generateDefaultCheckPoints(split, video_duration) {
      if (split) {
        let checkPoints = [];
        // 均等分批量生成检查点
        if (video_duration) {
          let count = Math.floor(video_duration / split);
          for (let index = 1; index < count + 1; index++) {
            checkPoints.push({
              time: index * split,
              pop_up: false,
            });
          }
        }
        return checkPoints;
      }
      return [];
    },
  },
};
</script>

<style scoped lang="scss">
.colorWhite,
.pCount {
  color: var(--neutral8);
  .itemNum {
    color: var(--primary-color);
  }
}
.Scene {
  color: var(--neutral8);
}

.colorWhite {
  margin-left: 20px;
}
.pCount {
  .itemNum {
    margin: 0 5px;
  }
}

::v-deep .el-scrollbar__view {
  margin-right: 10px;
}
</style>

<style scoped lang="scss">
::v-deep.el-dialog__body {
  ::v-deep.el-checkbox {
    margin-top: 10px;
    display: block;
  }
}
.add-content {
  .el-form {
    width: 100%;
    .el-tag + .el-tag {
      margin-left: 10px;
      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }
      .time {
        margin-left: 10%;
        font-weight: bold;
      }
      .surviveTime {
        width: 30%;
        margin-left: 20px;
      }
      .hr-line-dashed {
        height: 1px;
        margin: 20px 0;
      }
      .el-links {
        margin-left: 10px;
        color: #409eff;
      }
      .fileManage {
        margin-left: 20px;
      }
      .mod {
        margin-left: 208px;
      }
      .el-form-item {
        ::v-deep.el-form-item__label {
          font-weight: bold;
        }
      }
      .gray {
        color: #fff;
      }
      .cooller {
        position: relative;
        ::v-deep.el-icon-close-tip {
          display: none;
        }
      }
      .gray {
        color: #fff;
        position: absolute;
        top: 0;
        left: 158px;
      }
    }
  }
}
.dialog-style {
  ::v-deep.el-dialog__wrapper {
    .el-dialog {
      top: -68px !important;
      left: 88px !important;
    }
    .el-dialog__header {
      cursor: default !important;
    }
    .el-dialog__body {
      padding: 0px 14px 14px 14px !important;
    }
  }
}
.cb-inner-page {
  padding-top: 4px !important;
}
</style>
