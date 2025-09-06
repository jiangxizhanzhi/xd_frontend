<template>
  <cb-inner-page :background="false">
    <div class="box-card add-content">
      <cb-form
        class="base-form"
        ref="form"
        :model="model"
        :rules="rules"
        :label-width="language === 'zh-CN' ? '100px' : '140px'"
        :baseURL="baseURL"
        :url="url"
        :id="id && { resource_id: id }"
      >
        <div class="com-cut-title">{{ $t('flags.subjectInformation') }}</div>
        <cb-form-item :label="$t('flags.subjectHeadings')" prop="title">
          <cb-input v-model="model.title"></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('m.taskDesc')" prop="content">
          <mavon-editor
            :mavon-data.sync="model.content"
            :businessType="BUSINESS_TYPE.OJ_CMS_FLAG"
            :attachmentType="ATTACHMENT_TYPE.OJ_ADMIN_FLAG"
          ></mavon-editor>
        </cb-form-item>
        <cb-form-item :label="$t('m.problemSet')" prop="practice_set_id">
          <cb-select v-model="model.practice_set_id">
            <cb-option
              v-for="item in practice_set_id"
              :key="item.resource_id"
              :label="item.name"
              :value="item.resource_id"
            ></cb-option>
          </cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('flags.subjectDirection')" prop="category_id">
          <cb-select v-model="model.category_id">
            <cb-option
              v-for="item in category_id"
              :key="item.resource_id"
              :label="item.name"
              :value="item.resource_id"
            ></cb-option>
          </cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('m.knowledgePoint')">
          <cy-tags
            v-model="model.knowledge"
            :max="5"
            ref="cyTags1"
            :ctg="$t('m.knowledgePoint')"
          >
            <cb-button slot="trigger" :hollow="true" icon="icon-xinzeng">{{
              $t('m.add')
            }}</cb-button>
          </cy-tags>
        </cb-form-item>
        <cb-form-item :label="$t('flags.subjectDifficult')" prop="difficulty">
          <cb-select v-model="model.difficulty">
            <cb-option
              v-for="item in difficulty"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></cb-option>
          </cb-select>
        </cb-form-item>
        <cb-form-item :label="$t('flags.subjectScore')" prop="score">
          <cb-input-number
            v-model="model.score"
            :step="1"
            :min="1"
            :max="100"
            controls-position="right"
          ></cb-input-number
          ><span class="noticClass">({{ $t('m.notic') }})</span>
        </cb-form-item>
        <cb-form-item :label="$t('flags.defaultState')" prop="is_public">
          <cb-switch
            v-model="model.is_public"
            :active-text="$t('flags.public')"
            :inactive-text="$t('flags.hide')"
          ></cb-switch>
        </cb-form-item>
        <div class="black-cut-line"></div>
        <div class="com-cut-title">{{ $t('flags.subjectScene') }}</div>
        <cb-form-item :label="$t('m.answeringEnvironment')">
          <cb-switch
            v-model="model.dynamic_env"
            @change="modelStatus"
            :active-text="$t('flags.open')"
            :inactive-text="$t('flags.close')"
          ></cb-switch>
        </cb-form-item>
        <cb-form-item
          v-if="model.dynamic_env === true"
          :label="$t('m.sceneConfiguration')"
          prop="scene_config_data"
        >
          <div class="fl" style="height: 600px; width: 100%">
            <scene-editor
              ref="sceneeditor"
              :title="model.title"
              :showMask="false"
              :sceneConfig="sceneConfig"
              :topology-data="model.scene_config_data"
            />
          </div>
        </cb-form-item>
        <cb-form-item
          v-if="model.dynamic_env === true"
          :label="$t('m.survivalTime')"
          prop="destroy_delay"
        >
          <cb-input-number
            v-model="model.destroy_delay"
            :step="1"
            :min="1"
            :precision="0"
            :max="10"
            controls-position="right"
          ></cb-input-number>
          <span class="color-cy2" style="margin-left: 16px">
            {{ $t('m.hour') }}
          </span>
        </cb-form-item>
        <cb-form-item
          v-if="model.dynamic_env === true"
          :label="$t('m.iolationmode')"
          prop="scene_share_mode"
        >
          <cb-switch
            class="leng"
            style="display: block"
            v-model="model.scene_share_mode"
            :active-text="$t('m.shareIolation')"
            :inactive-text="$t('m.privateIolation')"
          ></cb-switch>
        </cb-form-item>
        <div class="black-cut-line"></div>
        <div class="com-cut-title">{{ $t('flags.flagConfiguration') }}</div>
        <cb-form-item :label="$t('flags.flagType')" prop="dynamic_flag">
          <!-- 没有场景的时候，只有随机flag -->
          <cb-select
            v-if="model.dynamic_env === true"
            v-model="model.dynamic_flag"
            :options="FLAG_TYPE_ARR_HAVE_SCENE"
            @change="changeFlag"
          ></cb-select>
          <cb-select
            v-else
            v-model="model.dynamic_flag"
            :options="FLAG_TYPE_ARR_NO_SCENE"
            @change="changeFlag"
          ></cb-select>
        </cb-form-item>
        <!-- 静态Flag -->
        <template v-if="model.dynamic_flag === FLAG_TYPE.static">
          <static-flag :flags="model.answer" ref="staticFlagRef" />
        </template>
        <!-- 动态Flag -->
        <template
          v-else-if="model.dynamic_flag === FLAG_TYPE.dynamic"
        ></template>
        <!-- 随机Flag -->
        <div v-else-if="model.dynamic_flag === FLAG_TYPE.random">
          <cb-form-item
            ref="installerFormEmail"
            :label="$t('flags.subjectFile')"
            :prop="
              model.dynamic_flag === FLAG_TYPE.random ? 'attachment_id' : ''
            "
          >
            <cb-input v-model="model.attachment_id" style="display: none" />
            <cb-upload-file
              ref="uploadRandom"
              type="file"
              accept=".zip"
              :limit="10"
              :showFileList="false"
              :fetch-promise="uploadRandomFile"
              :tipText="$t('flags.plzUploadFile')"
              @delete="removeRandomFile"
              fileSize="104857600"
              :disabled="loadingFileList"
            ></cb-upload-file>
            <file-list
              v-if="randomFileList.length > 0"
              v-loading="loadingFileList"
              :file-list.sync="randomFileList"
              ref="fileListRef"
            />
          </cb-form-item>
        </div>

        <cb-form-item
          v-if="model.dynamic_flag !== FLAG_TYPE.random"
          :label="$t('flags.subjectFile')"
          prop="file"
        >
          <cb-upload-file
            ref="upload"
            type="file"
            v-model="attachmentList"
            :fetch-promise="uploadAttachment"
            :tipText="$t('flags.plzUploadFile')"
            accept=".zip"
            @delete="deleteAttachment"
            :isDownload="true"
            fileSize="104857600"
            @download="downLoadFlagFile"
          ></cb-upload-file>
        </cb-form-item>

        <cb-form-item :label="$t('m.gameProblemSolution')" prop="writeup">
          <mavon-editor
            :mavon-data.sync="model.writeup"
            :businessType="BUSINESS_TYPE.OJ_CMS_FLAG"
            :attachmentType="ATTACHMENT_TYPE.OJ_ADMIN_FLAG"
          ></mavon-editor>
        </cb-form-item>
        <cb-form-item :label="$t('flags.WPStatus')" prop="writeup_public">
          <cb-switch
            v-model="model.writeup_public"
            :active-text="$t('flags.public')"
            :inactive-text="$t('flags.hide')"
          ></cb-switch>
        </cb-form-item>
        <template slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button
              mr="mr"
              button-type="confirm"
              @click="submit"
            ></cb-button>
            <cb-button button-type="cancel" @click="onCnacle"></cb-button>
          </cb-button-group>
        </template>
      </cb-form>
    </div>
  </cb-inner-page>
</template>
<script>
import {
  SCENE_SHOW,
  DIFF,
  FLAG_TYPE,
  FLAG_TYPE_ARR_HAVE_SCENE,
  FLAG_TYPE_ARR_NO_SCENE,
} from '../exercise-constants.js';
import Utils from '@/utils/util';
import MavonEditor from '@/components/markdown/mavon-editor.vue';
import _ from 'lodash';
import { SceneEditor } from '@cyber/scene';
import StaticFlag from './components/static-flag.vue';
import FileList from './components/file-list.vue';
import { getI18N } from '@cyber/helper';
import { BUSINESS_TYPE } from '@/pages/cms/course-mod/course-constant.js';
import { ATTACHMENT_TYPE } from '@/constants/attachment.js';
export default {
  components: {
    MavonEditor,
    SceneEditor,
    StaticFlag,
    FileList,
  },
  data() {
    var validateScene = (rule, value, callback) => {
      if (this.model.dynamic_env === true && value === '') {
        callback(new Error(this.$t('m.chooseScenePh')));
      } else {
        callback();
      }
    };
    var validateTask = (rule, value, callback) => {
      const len = Utils.getByteLen(value || '');
      if (value.trim() === '' || value === null || len > 2048) {
        this.task = true;
      } else {
        this.task = false;
      }
      if (this.task === true) {
        callback(new Error(this.$t('m.plaeaseFill')));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(this.$t('m.titleNamePh'));
      }
      const len = Utils.getByteLen(value);
      if (len < 1 || len > 255) {
        callback(this.$t('m.validataTitle'));
      } else {
        callback();
      }
    };
    return {
      // 难度类型数据
      difficulty: [],
      BUSINESS_TYPE,
      ATTACHMENT_TYPE,
      id: '',
      SCENE_SHOW,
      DIFF,
      FLAG_TYPE,
      FLAG_TYPE_ARR_HAVE_SCENE,
      FLAG_TYPE_ARR_NO_SCENE,
      attachmentList: [],
      randomFileList: [],
      url: '/oj/admin/practice/operation/',
      baseURL: '/api/ojj',
      // ref: 'form',
      // 场景配置
      sceneConfig: {
        showMenu: true,
        menubar: ['topology'],
        toolbar: [],
        showToolbar: true,
      },
      model: {
        practice_set_id: '',
        category_id: '',
        title: '',
        is_public: false,
        writeup_public: false,
        knowledge: [],
        difficulty: 0,
        content: '',
        file: '',
        file_name: '',
        answer: [],
        writeup: '',
        score: '',
        dynamic_flag: null,
        dynamic_env: false,
        scene_config_data: {
          scene_config: {},
        },
        destroy_delay: 2,
        scene_share_mode: false,
        scene_config_name: '',
        scene_permission: false,
        attachment_id: [],
      },
      rules: {
        title: [{ required: true, validator: validateName, trigger: 'blur' }],
        category_id: [
          {
            required: true,
            message: this.$t('m.pleaseChooseDirection'),
            trigger: 'change',
          },
        ],
        practice_set_id: [
          {
            required: true,
            message: this.$t('m.choicePracticeSet'),
            trigger: 'change',
          },
        ],
        difficulty: [
          {
            required: true,
            message: this.$t('m.pleaseChooseDifficulty'),
            trigger: 'change',
          },
        ],
        content: [
          { required: true, validator: validateTask, trigger: 'change' },
        ],
        answer: [
          {
            required: true,
            message: this.$t('m.pleaseFlag'),
            trigger: 'focus',
          },
        ],
        scene_config_data: [
          { required: true, validator: validateScene, trigger: 'change' },
        ],
        score: [
          {
            required: true,
            message: this.$t('m.inputSubjectScore'),
            trigger: 'blur',
          },
        ],
        destroy_delay: [
          {
            required: true,
            message: this.$t('m.pleaseFillInSurvivalTime'),
            trigger: 'blur',
          },
        ],
        dynamic_flag: [
          {
            required: true,
            message: this.$t('flags.plzSelFlagType'),
            trigger: 'blur',
          },
        ],
        attachment_id: [
          {
            required: true,
            message: this.$t('flags.plzUploadRandomFile'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      category_id: [],
      practice_set_id: [],
      attachmentflag: true,
      loadingFileList: false,
    };
  },
  computed: {
    language() {
      return this.$i18n.locale;
    },
    /* difficulty() {
      return [
        {
          label: this.$t('m.primary'),
          value: this.DIFF.INTRODUCTION,
        },
        {
          label: this.$t('m.medium'),
          value: this.DIFF.INCREASE,
        },
        {
          label: this.$t('m.advanced'),
          value: this.DIFF.EXPERT,
        },
      ];
    }, */
  },
  watch: {
    // 'model.destroy_delay'(nv, ov) {
    //   if (nv === undefined) {
    //     this.addTrainTagsStatus = false;
    //     return;
    //   } else {
    //     this.addTrainTagsStatus = true;
    //   }
    // },
  },
  mounted() {
    if (this.id) {
      this.$refs.form.getModelData().then((res) => {
        this.initData(res);
      });
    }
  },
  created() {
    this.id = this.$route.params.flagsId;
    this.rationaleGuidData();
    this.exercisesGuidData();
    this.getDifficultyOptions();
  },
  methods: {
    getI18Nn() {
      return getI18N();
    },
    // 获取难度分类
    getDifficultyOptions() {
      this.$request
        .get(
          '/cr/common/constants_config',
          {
            type: 10,
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
          this.difficulty = arr;
        });
    },
    submit() {
      if (this.beforeSubmit() === false) {
        return;
      } else {
        const formData = new FormData();
        _.forEach(this.model, (value, key) => {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (_.isPlainObject(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });
        //删除文件不传file和file_url参数
        if (this.model.file == '') {
          formData.delete('file');
          formData.delete('file_url');
        }
        this.$refs.form.submit(formData).then((res) => {
          this.$emit('create', res.data.data);
          this.$router.push({ name: 'flags-solve' });
          return this.$message({
            type: 'success',
            message: this.$t('m.successful'),
          });
        });
      }
    },

    modelStatus() {
      if (this.model.dynamic_env === false) {
        //无场景状态
        this.model.scene_config_name = '';
        this.model.scene_config_data = {};
        // this.model.is_dynamic_flag = false;
        this.model.scene_share_mode = false;
        if (this.model.dynamic_flag === this.FLAG_TYPE.dynamic) {
          this.model.dynamic_flag = this.FLAG_TYPE.static;
        }
      } else {
        this.model.scene_config_data = {
          scene_config: {},
        };
      }
    },
    changeFlag() {
      this.model.answer = [];
      if (this.model.dynamic_flag === this.FLAG_TYPE.random) {
        this.$set(this, 'randomFileList', []);
        this.model.attachment_id = [];
      } else {
        this.attachmentList = [];
      }
    },
    select(val) {
      this.options = val;
    },
    comGetArr(arr, id) {
      return _.map(arr, (item) => {
        return item[id];
      });
    },
    beforeSubmit() {
      if (this.model.scene_share_mode === true) {
        this.model.scene_share_mode = this.SCENE_SHOW.SHARED;
      } else {
        this.model.scene_share_mode = this.SCENE_SHOW.PRIVATE;
      }
      if (this.model.dynamic_env === true) {
        let editorData = this.$refs.sceneeditor.getData();
        let { scene_config, roles } = editorData;
        if (this.model.scene_config_data === null) {
          this.model.scene_config_data = {};
        }
        this.model.scene_config_data.scene_config = _.clone(scene_config);
        this.model.scene_config_data.scene_config.topology.scene = {
          ...this.model.scene_config_data.scene_config.topology.scene,
          name: this.model.title,
        };
        if (roles && roles.length) {
          delete this.model.scene_config_data.roles;
        }
      }
      this.model.files = [];
      const tagMsg1 = _.get(this, '$refs.cyTags1.inputError');
      const tagMsg2 = _.get(this, '$refs.cyTags2.inputError');
      if (tagMsg1 || tagMsg2) {
        return false;
      }
      // 静态flag&&flag list校验通过
      if (this.model.dynamic_flag === this.FLAG_TYPE.static) {
        let flag = true;
        this.$refs.staticFlagRef.$refs.formRef.validate((valid) => {
          if (valid) {
            const flagsArr = this.$refs.staticFlagRef.getArr();
            this.model.answer = flagsArr;
            const attachmentId = this.comGetArr(
              this.attachmentList,
              'resource_id',
            );
            this.model.attachment_id = attachmentId.join(',');
            flag = true;
          } else {
            flag = false;
          }
        });
        return flag;
      } else if (this.model.dynamic_flag === this.FLAG_TYPE.dynamic) {
        // 动态flag
        const attachmentId = this.comGetArr(this.attachmentList, 'resource_id');
        this.model.attachment_id = attachmentId.join(',');
      } else if (this.model.dynamic_flag === this.FLAG_TYPE.random) {
        // 随机flag
        let fileStatus = true;
        // 这里需要判断下 随机flag下是否有题目附件，若无，则不需要走附件列表的校验
        if (this.randomFileList.length > 0) {
          this.$refs.fileListRef.$refs.formRef.validate((valid) => {
            if (valid) {
              const attachmentId = this.comGetArr(
                this.randomFileList,
                'resource_id',
              );
              this.model.attachment_id = attachmentId.join(',');
              this.model.answer = this.comGetArr(
                this.randomFileList,
                'flagVal',
              );
              fileStatus = true;
            } else {
              fileStatus = false;
            }
          });
        } else {
          // 若随机flag 无题目附件，需要把attachment_id 赋空
          this.model.attachment_id = '';
        }
        return fileStatus;
      }
    },
    deleteAttachment() {
      this.model.file = '';
      this.attachmentflag = true;
    },
    downLoadFlagFile(val) {
      if (val.url.slice(0, 5) === '/cpms') {
        this.$request.binaryDownload(
          'get',
          val.url,
          {},
          { filename: val.name, baseURL: '' },
        );
      } else {
        this.$request.download(val.url, val.name);
      }
    },

    rationaleGuidData() {
      // 理论基础-类型
      const that = this;
      that.$request
        .get(
          '/oj/admin/practice/category/list/?page=1&per_page=999&practice_type=2',
          {},
          { baseURL: '/api/ojj' },
        )
        .then((resp) => {
          const newData = _.get(resp, 'data.data.list');
          that.category_id = newData;
        });
    },
    exercisesGuidData() {
      // 理论基础-习题集类型
      const that = this;
      that.$request
        .get(
          '/oj/admin/practice/set/list/?page=1&per_page=999&practice_type=2',
          {},
          { baseURL: '/api/ojj' },
        )
        .then((resp) => {
          const newData = _.get(resp, 'data.data.list');
          that.practice_set_id = newData;
        });
    },
    // 文件上传
    // beforeUpload(file, fileList) {
    //   const isLt2M = file.size / 1024 / 1024 < 101;
    //   if (!isLt2M) {
    //     this.$message.error(this.$t('m.theUploadFileSizeLimitationIs100M'));
    //     this.$refs.upload.clearFiles();
    //     return;
    //   }
    //   if (file.size === 0) {
    //     this.$message.error(this.$t('m.cannotUploadAnEmptyFile'));
    //     this.$refs.upload.clearFiles();
    //     return;
    //   }
    //   this.model.file = file.raw;
    // },
    fileRemove() {
      this.model.file = '';
    },
    uploadAttachment(file) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 4);
      this.$request
        .post('/common/admin/attachment_upload', uploadData, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.$set(
            this.attachmentList[this.attachmentList.length - 1],
            'resource_id',
            res.data.data.resource_id,
          );
        });
    },
    attachmentRemove() {
      // this.model.file = '';
    },
    // 随机Flag上传文件
    uploadRandomFile(file) {
      this.loadingFileList = true;
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('type', 4);
      this.$request
        .post('/common/admin/attachment_upload', uploadData, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.randomFileList.push(res.data.data);
          this.loadingFileList = false;
          // this.$nextTick(() => {
          //   this.$set(
          //     this.randomFileList[this.randomFileList.length - 1],
          //     'resource_id',
          //     res.data.data.resource_id,
          //   );
          //   this.loadingFileList = false;
          // });
        });
    },
    removeRandomFile() {},
    // 表单回填
    initData(data) {
      this.model = data;
      if (!data.destroy_delay) {
        this.model.destroy_delay = ''; // 解决bug
      }
      this.model.knowledge = JSON.parse(data.knowledge);
      this.model.answer = JSON.parse(data.answer);
      this.model.oj_scene_config = data.oj_scene_config
        ? JSON.parse(data.oj_scene_config)
        : null;
      // if (this.model.file_name !== null && this.model.file_url !== null) {
      //   this.attachmentflag = false;
      //   this.attachmentList.push({
      //     name: this.model.file_name,
      //     isDownload: true,
      //   });
      // }
      if (data.scene_share_mode === this.SCENE_SHOW.SHARED) {
        this.model.scene_share_mode = true;
      } else {
        this.model.scene_share_mode = false;
      }
      // 静态flag
      if (data.dynamic_flag === this.FLAG_TYPE.static) {
        if (data.files && data.files.length > 0) {
          this.$set(data.files[0], 'resource_id', data.attachment_id);
          this.$set(data.files[0], 'name', data.files[0].file_name);
          this.$set(data.files[0], 'url', data.files[0].file_url);
          this.attachmentList = data.files;
        }
      } else if (data.dynamic_flag === this.FLAG_TYPE.dynamic) {
        // 动态flag
        if (data.files && data.files.length > 0) {
          this.$set(data.files[0], 'resource_id', data.attachment_id);
          this.$set(data.files[0], 'name', data.files[0].file_name);
          this.$set(data.files[0], 'url', data.files[0].file_url);
          this.attachmentList = data.files;
        }
      } else if (data.dynamic_flag === this.FLAG_TYPE.random) {
        // 随机flag
        if (data.files && data.files.length > 0) {
          const attachmentId = data.attachment_id.split(',');
          _.forEach(data.files, (item, index) => {
            this.$set(item, 'resource_id', attachmentId[index]);
            // this.$set(item, 'name', item.file_name);
            // this.$set(item, 'url', item.file_url);
            this.$set(item, 'flagVal', this.model.answer[index]);
          });
          this.$set(this, 'randomFileList', data.files);
        }
      }
    },
    generateSubmitData(data) {
      const params = _.cloneDeep(data);
      if (data.oj_scene_config) {
        params.oj_scene_config = JSON.stringify(data.oj_scene_config);
      }
      if (params.knowledge !== undefined) {
        params.knowledge = JSON.stringify(data.knowledge);
      }
      if (params.answer !== undefined) {
        params.answer = JSON.stringify(data.answer);
      }
      if (this.model.scene_share_mode === true) {
        params.scene_share_mode = this.SCENE_SHOW.SHARED;
      } else {
        params.scene_share_mode = this.SCENE_SHOW.PRIVATE;
      }
      return params;
    },
    submitError(error) {
      this.$serverError(error);
    },
    submitSuccess(response) {
      this.$emit('create', response.data.data);
      this.$router.push({ name: 'flags-solve' });
      return this.$message({
        type: 'success',
        message: this.$t('m.successful'),
      }); // 修改 创建成功
    },
    onCnacle() {
      this.$router.push({ name: 'flags-solve' });
    },
  },
};
</script>

<style scoped lang="scss">
.add-content {
  .el-form {
    width: 100%;
  }
  .el-form-item {
    ::v-deep.el-form-item__label {
      font-weight: bold;
    }
    .noticClass {
      margin-left: 1rem;
      font-size: 13px;
    }
  }
}
.el-col-3 {
  width: 6%;
  margin-left: 38px;
}
.model {
  padding-left: 150px;
}
.mod {
  padding-left: 208px;
}
.wen {
  margin-right: 15px;
}
::v-deep.el-radio {
  margin-bottom: 15px;
}
.mar {
  margin-right: 15px;
}
::v-deep.el-col-9 {
  width: 30%;
}
.el-select {
  width: 367px;
}
.leng {
  margin-top: 8px;
}

::v-deep.el-dialog__footer {
  padding: 10px 20px 10px !important;
  .dialog-footer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
  }
}
.box-card {
  padding-right: 20px;
  .base-form {
    background: var(--bg-color-2);
  }
}
</style>

<style lang="scss">
.color-cy2,
.noticClass,
.el-switch__label {
  color: var(--neutral8);
}
.el-switch__label.is-active {
  color: var(--primary-color);
}
.color-cy1 {
  .el-link--inner {
    color: var(--primary-color);
  }
}
</style>
