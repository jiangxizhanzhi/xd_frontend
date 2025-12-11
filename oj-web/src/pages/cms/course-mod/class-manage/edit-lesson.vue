<template>
  <cb-inner-page :background="false">
    <div
      class="box-card add-content"
      ref="edit-lesson"
      :style="commonMarginRightStyle"
    >
      <cb-form
        ref="form"
        :model="formData"
        :rules="rules"
        :label-width="labelWidthForm"
        :isBgColor="true"
      >
        <cb-form-item :label="$t('m.courseName')" prop="name">
          <cb-input v-model="formData.name"></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('m.type')" prop="type">
          <cb-select v-model="formData.type" :options="typeOption"></cb-select>
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
          prop="pdf"
        >
          <cb-upload-file
            ref="upload"
            type="file"
            v-model="pdfList"
            :fetch-promise="uploadPdf"
            @preview="previewpdf"
            accept=".pdf,.zip,.pptx,.ppt,.docx,.doc"
            @delete="deleteHandout"
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
        </cb-form-item>

        <!-- //- 视频 -->
        <cb-form-item :label="$t('m.video')" prop="video">
          <cb-upload-file
            ref="uploadVideo"
            type="file"
            v-model="videoList"
            :fetch-promise="uploadVideo"
            accept=".mp4,.m4v"
            tipText=""
            @preview="previewvideo"
            @delete="deleteVideo"
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
        <!-- //- 附件 -->
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
            @download="downloadAttachment"
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
          v-if="formData.type === $CONSTANT.COURSES.TYPE.LABS_TYPE"
          :label="$t('m.shareEnvironment')"
          prop="destroy_delay"
        >
          <div class="fl" style="margin-top: 7px">
            <cb-switch
              style="display: block"
              v-model="formData.scene_share_mode"
              :active-value="1"
              :inactive-value="2"
              :active-text="$t('m.private')"
              :inactive-text="$t('m.share')"
            ></cb-switch>
          </div>
          <div class="fl mod mleft208 colorWhite">
            <span
              >{{ $t('m.survivalTime') }}
              <cb-input-number
                class="num-input"
                controls-position="right"
                v-model="formData.destroy_delay"
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
            :options="durationOption"
          ></cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('m.learningType')" prop="lesson_type">
          <cb-select
            v-model="formData.compulsory"
            :options="lessonOption"
          ></cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('m.public')" prop="public">
          <cb-switch v-model="formData.is_public"></cb-switch>
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
            ><span class="itemNum">{{ itemNum }}</span
            ><span>{{ $t('course.practices') }}</span>
          </div>
        </cb-form-item>
        <template slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button @click="onSubmit" :disabled="submitLoading">{{
              $t('button.confirm')
            }}</cb-button>
            <cb-button @click="onCnacle" button-type="cancel"></cb-button>
          </cb-button-group>
        </template>
      </cb-form>
      <cb-dialog
        class="mavon"
        width="50%"
        :title="$t('m.preview')"
        :visible.sync="mavenVisible"
        center="center"
      >
        <div class="cyber-scroll-bar" style="height: 600px; overflow: auto">
          <mavon-read :mavon-data.sync="formData.pdf"></mavon-read>
        </div>
      </cb-dialog>
      <cb-dialog
        width="88%"
        height="706px"
        class="dialog-style"
        v-if="getAllPracticeList"
        :title="$t('course.selectPractice')"
        :visible.sync="practiceVisible"
        center="center"
      >
        <div class="cyber-scroll-bar" style="height: 650px; overflow: auto">
          <practice-set-course
            :lesson_id_edit="lessonId"
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
        :video_url="formData.video || formData.video_url"
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
import Validate from '@/utils/validate.js';
import MavonRead from '@/components/markdown/mavon-read.vue';
import { errorMessage } from '@/utils/index.js';
import PracticeSetCourse from '@/pages/cms/exam/exercise-set/practice-set-course.vue';
import _ from 'lodash';
import { SceneEditor } from '@cyber/scene';
import UploadProcess from '@/components/upload-process';
import VideoCheckpoint from './components/video-chekpoint';
export default {
  components: {
    VideoCheckpoint,
    MavonRead,
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
      getAllPracticeList: false,
      itemNum: 0,
      practiceVisible: false,
      difficultyOptions: [],
      lessonOption: [
        {
          label: this.$t('m.noSet'),
          value: Constant.COURSES.LEARNTYPE.NOSET,
        },
        {
          label: this.$t('m.compulsory'),
          value: Constant.COURSES.LEARNTYPE.COMPULSORY,
        },
        {
          label: this.$t('m.elective'),
          value: Constant.COURSES.LEARNTYPE.ELECTIVE,
        },
      ],
      durationOption: [
        {
          label: this.$t('m.five'),
          value: Constant.COURSES.LEARNTIME.FIVE,
        },
        {
          label: this.$t('m.ten'),
          value: Constant.COURSES.LEARNTIME.TEN,
        },
        {
          label: this.$t('m.fifteen'),
          value: Constant.COURSES.LEARNTIME.FIFTEEN,
        },
        {
          label: this.$t('m.thirty'),
          value: Constant.COURSES.LEARNTIME.THIRTY,
        },
        {
          label: this.$t('m.sixty'),
          value: Constant.COURSES.LEARNTIME.SIXTY,
        },
        {
          label: this.$t('m.oneHundredTwenty'),
          value: Constant.COURSES.LEARNTIME.ONE_HUNDRED_TWENTY,
        },
      ],

      typeOption: [
        {
          label: this.$t('m.theory'),
          value: Constant.COURSES.TYPE.THEORY,
        },
        {
          label: this.$t('m.LABS'),
          value: Constant.COURSES.TYPE.LABS_TYPE,
        },
      ],
      submitLoading: false, // 是否有文件在上传
      enclosureUploading: 0,
      inputVisible: false,
      inputValue: '',
      Knowledgeerror: false,
      url: '/admin/system/system_configurations/batch_update/',
      // 场景配置
      sceneConfig: {
        showMenu: true,
        menubar: ['topology'],
        toolbar: [],
        showToolbar: true,
      },
      formData: {
        practice_list: '',
        name: '',
        type: 0,
        knowledge: [],
        video: '3333',
        attachment: '',
        difficulty: 0,
        duration: 5,
        compulsory: 0,
        is_public: false,
        pdf: '',
        markdown: '',
        html: '',
        lesson_file: [],
        destroy_delay: 2,
        share_mode: '',
        scene_share_mode: '',
        oj_scene_config: {
          scene_config: {},
        },
        scene_config_name: '',
        scene_permission: false,
        video_check_point: '', //视频检查点
      },
      // 用以判断是否更改了文件数据
      orginData: {
        video: '',
        pdf: '',
        attachment: '',
        html: '',
        markdown: '',
      },
      demoload: '/cpms/markdown/demo.zip',
      demopptload: '/cpms/markdown/demo_ppt.zip',
      videoflag: true,
      Handoufalg: true,
      attachmentflag: true,

      rules: {
        name: [
          { required: true, validator: Validate.courseName, trigger: 'blur' },
          { required: true, validator: Validate.courseName, trigger: 'change' },
        ],
        destroy_delay: [
          { required: true, validator: validateTime, trigger: 'blur' },
        ],
      },
      resource_id: '',
      upList: [],
      fileVisible: false,
      upCheckList: [],
      mavenVisible: false,

      pdfList: [], //指导讲义文件列表
      videoList: [], //视频文件列表
      attachmentList: [], //附件文件列表
      videoCheckpointVisible: false, // 视频检查点配置弹窗
    };
  },
  computed: {
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
    lessonId() {
      return _.get(this, '$route.params.lessonId');
    },
  },
  created() {
    this.getDifficultyOptions();
    this.getDirectionOptions();
    this.itemNum = _.get(this, '$route.params.itemNum');
    this.formData.practice_list = '';
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
    getPracticeListNew(data) {
      this.dialogPracticeList = data;
    },
    // 编辑点击确定
    apply() {
      const that = this;
      const { lessonId, model, courseId } = that;
      const practice_list = that.dialogPracticeList.map((item) => {
        return {
          ...item,
        };
      });
      if (this.lesson_id_edit != '') {
        this.practiceVisible = false;
        this.formData.practice_list = [];
        this.formData.practice_list = practice_list;
        this.itemNum = this.formData.practice_list.length;
      }
    },
    // 编辑点击取消
    cancel() {
      this.practiceVisible = false;
    },
    getPracticeList() {
      this.$request
        .get(
          '/oj/admin/lesson/practice',
          {
            lesson_id: this.lessonId,
            course_id: this.courseId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((resp) => {
          const tempdata = resp.data.data ? resp.data.data : [];
          this.$set(this.formData, 'practice_list', tempdata);
          this.getAllPracticeList = true;
        });
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
    // 计算表格难度列展示
    computedDiffculty(difficulty) {
      const data = this.difficultyOptions.filter(
        (item) => item.value === difficulty,
      );
      if (data.length) {
        return data[0].label;
      }
    },
    // 下载附件
    downloadAttachment(file) {
      this.$request.binaryDownload(
        'get',
        file.file_path,
        {},
        { filename: file.name, baseURL: '' },
      );
    },
    //讲义预览
    previewpdf() {
      if (this.formData.handout_type == 1) {
        this.mavenVisible = true;
      } else {
        const link = document.createElement('a');
        this.$refs['edit-lesson'].appendChild(link);
        link.href = this.orginData.html || this.orginData.pdf;
        link.target = '_blank';
        link.click();
        this.$refs['edit-lesson'].removeChild(link);
      }
    },
    //讲义上传
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
          this.formData.pdf = res.data.data.file_path;
        })
        .catch(() => {
          this.showProgress = false;
          this.process = 0;
        });
    },
    //视频上传
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
          this.formData.video_check_point = null;
        })
        .catch(() => {
          this.showProgress = false;
          this.process = 0;
        });
    },
    //视频预览
    previewvideo() {
      const link = document.createElement('a');
      this.$refs['edit-lesson'].appendChild(link);
      link.href = this.orginData.video;
      link.target = '_blank';
      link.click();
      this.$refs['edit-lesson'].removeChild(link);
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
          fileObj.is_public = true;
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
    addPractice() {
      this.practiceVisible = true;
    },
    handlePreview(file, fileList) {
      var a = document.createElement('a');
      a.href = file.attachment + '?attname=' + file.name;
      a.click();
    },
    pdfRemove(file) {
      this.formData.pdf = '';
    },
    videoRemove(file) {
      this.formData.video = '';
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
          totalCount += 1;
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
    // 查询
    getDirectionOptions() {
      this.$request
        .get(
          '/oj/admin/lesson',
          {
            course_id: this.courseId,
            lesson_id: this.lessonId,
          },
          {
            baseURL: '/api/ojj',
          },
        )
        .then((res) => {
          const dataBakup = _.cloneDeep(res.data.data);

          this.formData = dataBakup;
          this.getPracticeList();
          this.formData.destroy_delay =
            dataBakup.destroy_delay == null ? 2 : dataBakup.destroy_delay;
          this.formData.is_public = dataBakup.is_public;
          this.formData.compulsory = dataBakup.compulsory;
          this.formData.oj_scene_config =
            (dataBakup.scene_config && dataBakup.scene_config) || {};
          this.formData.video_duration = dataBakup.video_duration;
          this.upList = dataBakup.lesson_file ? dataBakup.lesson_file : [];
          this.formData.video_check_point =
            (dataBakup.video_check_point_config &&
              JSON.stringify(dataBakup.video_check_point_config)) ||
            [];
          //初始化附件列表文件
          this.attachmentList = this.upList;
          let attachmentBackup = [];
          if (this.attachmentList.length != 0) {
            this.attachmentList.forEach((item) => {
              attachmentBackup.push(item.resource_id);
              item.isDownload = true;
              item.name = item.file_name;
            });
          }

          //初始化视频文件列表
          if (dataBakup.video_url) {
            let resDataVideo = dataBakup.video_url;
            let videoIndex = dataBakup.video_url.lastIndexOf('/');
            this.videoflag = false;
            this.videoList.push({
              name: decodeURI(resDataVideo.substring(videoIndex + 1)),
              // name: resDataVideo.substring(videoIndex + 1),
              isPreview: false,
            });
          }
          // if (
          //   (res.data.markdown_file != null && dataBakup.markdown != '') ||
          //   dataBakup.html ||
          //   dataBakup.pdf
          // ) {
          //   this.Handoufalg = false;
          //   //讲义初始化pdfList
          //   let pdf =
          //     dataBakup.markdown_file || dataBakup.html || dataBakup.pdf;
          //   let i = pdf.lastIndexOf('/');
          //   this.pdfList.push({
          //     name: decodeURI(pdf.substring(i + 1)),
          //     isPreview: true,
          //   });
          // }
          // 0=什么都不是 1=markdown 2=ppt 4=pdf，3.word
          if (
            dataBakup.handout_name != null &&
            dataBakup.handout_url != '' &&
            dataBakup.handout_url != null
          ) {
            this.pdfList.push({
              name: dataBakup.handout_name,
              isPreview: true,
            });
          }

          this.formData.attachment = attachmentBackup.join(',');
          if (this.formData.attachment) {
            this.attachmentflag = false;
          }
          // this.orginData.attachment = dataBakup.attachments;
          // 备份video判断video是否变化
          this.formData.video =
            dataBakup.video_url != null ? dataBakup.video_url : '';
          this.formData.video_url =
            dataBakup.video_url != null ? dataBakup.video_url : '';
          this.orginData.video =
            dataBakup.video_url != null ? dataBakup.video_url : '';
          // 用于视频没有改动时向后台的传值
          this.orginData.video_url =
            dataBakup.video_url != null ? dataBakup.video_url : '';
          this.orginData.pdf =
            dataBakup.handout_url != null ? dataBakup.handout_url : '';
          this.formData.pdf =
            dataBakup.handout_url != null ? dataBakup.handout_url : '';
          // 用于附件没修改时传到后台
          this.formData.handout_url =
            dataBakup.handout_url != null ? dataBakup.handout_url : '';
          // this.orginData.markdown =
          //   dataBakup.markdown != null && dataBakup.markdown_file != null
          //     ? dataBakup.markdown
          //     : '';
          // this.orginData.html =
          //   dataBakup.handout_url != null ? dataBakup.handout_url : '';
        });
    },
    deleteHandout() {
      this.formData.pdf = 'delete';
      this.formData.html = '';
      this.formData.markdown = '';
      this.Handoufalg = true;
    },
    deleteVideo() {
      this.formData.video = 'delete';
      this.videoflag = true;
    },
    deleteAttachment() {
      this.formData.attachment = '';
      this.formData.lesson_file = [];
      this.upList = [];
      this.attachmentflag = true;
    },
    // 判断两个数值是否一样
    isEqual(a, b) {
      return !(a === b);
    },
    onSubmit() {
      const that = this;
      if (this.Knowledgeerror) {
        return false;
      }
      if (that.formData.type === Constant.COURSES.TYPE.LABS_TYPE) {
        let editorData = this.$refs.sceneeditor.getData();
        let { scene_config } = editorData;
        this.formData.oj_scene_config.scene_config = _.clone(scene_config);
        this.formData.oj_scene_config.scene_config.topology.scene = {
          ...this.formData.oj_scene_config.scene_config.topology.scene,
          name: this.formData.name,
        };
      }
      this.$refs['form'].validate((valid) => {
        // if (this.$refs.cyTags.inputError !== '') return;
        const submitForm = new FormData();
        submitForm.append('name', this.formData.name);
        submitForm.append('type', this.formData.type);
        submitForm.append('knowledge', JSON.stringify(this.formData.knowledge));

        if (this.attachmentList) {
          submitForm.append(
            'attachment_ids',
            this.attachmentList.map((item) => item.resource_id).join(','),
          );
        }
        submitForm.append('difficulty', this.formData.difficulty);
        submitForm.append('duration', this.formData.duration);
        submitForm.append('compulsory', this.formData.compulsory);
        submitForm.append('is_public', this.formData.is_public);
        submitForm.append('course_id', this.courseId);
        submitForm.append(
          'oj_scene_config',
          JSON.stringify(this.formData.oj_scene_config),
        );
        submitForm.append('destroy_delay', this.formData.destroy_delay);
        submitForm.append(
          'scene_share_mode',
          this.formData.scene_share_mode == null
            ? 2
            : this.formData.scene_share_mode,
        );
        if (this.formData.pdf == null) {
          this.formData.pdf = '';
        }
        if (this.formData.html == null) {
          this.formData.html = '';
        }
        if (this.formData.markdown == null) {
          this.formData.markdown = '';
        }
        if (this.formData.video == null) {
          this.formData.video = '';
        }
        if (this.isEqual(this.formData.pdf, this.orginData.pdf)) {
          if (this.formData.pdf != 'delete') {
            //删除
            submitForm.append('handout', this.formData.pdf);
          }
        } else {
          submitForm.append('handout_url', this.formData.handout_url);
        }
        // if (this.isEqual(this.formData.html, this.orginData.html)) {
        //   submitForm.append('handout', this.formData.html);
        // }
        // if (this.isEqual(this.formData.markdown, this.orginData.markdown)) {
        //   submitForm.append('handout', this.formData.markdown);
        // }
        if (this.isEqual(this.formData.video, this.orginData.video)) {
          if (this.formData.video != 'delete') {
            submitForm.append('video', this.formData.video);
          }
        } else {
          submitForm.append('video_url', this.formData.video_url);
        }
        if (
          (this.formData.video_url || this.formData.video) &&
          this.formData.video != 'delete'
        ) {
          if (!this.formData.video_check_point) {
            // 默认10秒分隔
            let checkPoints = JSON.stringify({
              points: this.generateDefaultCheckPoints(
                10,
                this.formData.video_duration,
              ),
              custom_points: [],
            });
            this.formData.video_check_point = checkPoints;
          }
          submitForm.append(
            'video_check_point',
            this.formData.video_check_point,
          );
        } else {
          submitForm.append('video_check_point', null);
        }
        // partic_list_new是‘’时代表没有编辑练习
        if (
          typeof this.formData.practice_list == 'undefined' ||
          this.formData.practice_list === ''
        ) {
          submitForm.append('practice_list', '');
        } else {
          submitForm.append(
            'practice_list',
            JSON.stringify(this.formData.practice_list),
          );
        }

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
              .catch(() => {});
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
      submitForm.append('resource_id', this.lessonId);
      that.submitLoading = true;
      this.$request
        .patch('/oj/admin/lesson', submitForm, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('m.successful'),
          });
          this.$router.push({
            name: 'lessons-manage',
            courseId: this.courseId,
          });
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
    showfile() {
      this.fileVisible = true;
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
.changJingInfo {
  color: var(--neutral8);
}

.pCount {
  .itemNum {
    margin: 0 5px;
  }
}
.mcolor {
  color: #fff;
}
.mleft {
  margin-left: 10px;
}

.mleft208 {
  margin-left: 20px;
}

.cooller {
  width: 100% !important;
}
</style>
<style scoped lang="scss">
.add-content {
  ::v-deep .cb-upload-file {
    max-width: 600px;
  }
}

.mavon {
  ::v-deep.el-dialog__body {
    height: 600px;
    overflow: hidden;
    padding: 20px;
  }
  .el-scrollbar {
    height: 100%;
  }
  ::v-deep.el-scrollbar__bar {
    z-index: 9999 !important;
  }
  .el-scrollbar__bar.is-horizontal {
    height: 0 !important;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-scrollbar__view {
    height: 100%;
  }
}
.margtop5 {
  margin-top: -6px;
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
        color: #fff;
        cursor: pointer;
      }
      .mod {
        margin-left: 208px;
      }
      .el-form-item {
        ::v-deep.el-form-item__label {
          font-weight: bold;
        }
      }
      .name {
        float: left;
        width: 138px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .cooller {
    width: 100% !important;
    position: relative;
    ::v-deep.el-icon-close-tip {
      display: none !important;
      .gray {
        color: #666;
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
