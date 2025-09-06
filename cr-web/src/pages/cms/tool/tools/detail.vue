<template>
  <cb-inner-page :background="false">
    <cb-form
      ref="fromRef"
      :model.sync="model"
      :label-width="getI18Nn().locale == 'en-US' ? '130px' : '120px'"
      :rules="rules"
      :baseURL="baseURL"
      :url="url"
      :id="id && { resource_id: id }"
      :contentType="contentType"
      :isBgColor="true"
    >
      <cb-form-item :label="$t('table.name')" prop="name">
        <cb-input v-model="model.name"></cb-input>
      </cb-form-item>
      <cb-form-item :label="$t('tools.toolType')">
        <cb-select
          v-model="model.tool_type"
          :options="toolTypesList"
          style="width: 100%"
        />
      </cb-form-item>
      <cb-form-item :label="$t('tools.category')" prop="category">
        <cb-select
          v-model="model.category"
          :options="toolCategoryList"
          multiple
          style="width: 100%"
        />
      </cb-form-item>
      <cb-form-item :label="$t('tools.platforms')" prop="platforms">
        <cb-select
          v-model="model.platforms"
          :options="platformsList"
          multiple
          style="width: 100%"
        />
      </cb-form-item>
      <cb-form-item :label="$t('tools.language')" prop="language">
        <cb-select
          v-model="model.language"
          :options="languageList"
          :placeholder="$t('tools.pleaseSelectLanguage')"
          multiple
          style="width: 100%"
        />
      </cb-form-item>
      <cb-form-item :label="$t('tools.cover')" prop="cover">
        <cb-input v-model="model.cover" style="display: none" />
        <cb-upload-file
          :fetchPromise="uploadImage"
          :fileSize="1024 * 1024 * 2"
          tipText=""
          :value="coverImage"
          @delete="removeImage"
          isPreview
          accept=".png,.jpg,.jpeg,.gif"
        />
      </cb-form-item>
      <cb-form-item :label="$t('tools.version')" prop="version">
        <cb-input v-model="model.version"></cb-input>
      </cb-form-item>
      <div
        v-if="model.tool_type === $CONSTANT.Tools.ToolTypes.OFFLINE_TOOL.value"
      >
        <cb-form-item :label="$t('tools.file')" prop="files">
          <cb-input v-model="model.files" style="display: none" />
          <cb-upload-file
            type="file"
            :fetchPromise="uploadFile"
            :fileSize="1024 * 1024 * 500"
            v-model="fileList"
            @delete="removeFile"
            @download="downloadFile"
            :isDownload="isDownload"
            tipText=""
            accept=".zip"
          />
        </cb-form-item>
      </div>
      <cb-form-item :label="$t('tools.cracked')">
        <cb-switch v-model="model.cracked" />
      </cb-form-item>
      <cb-form-item :label="$t('tools.visible')">
        <cb-switch v-model="model.visible" />
      </cb-form-item>
      <cb-form-item
        :label="$t('tools.introduction')"
        prop="introduction"
        class="toolMarkdown"
      >
        <div style="height: 300px">
          <cb-markdown
            ref="md"
            v-model="model.introduction"
            :uploadImages="_imgAdd"
            :uploadFile="_uploadFile"
            :uploadZip="_uploadZip"
            :exportFile="exportFile"
          />
        </div>
      </cb-form-item>
      <div slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button
            buttonType="confirm"
            @click="submitForm($event)"
          ></cb-button>
          <cb-button buttonType="cancel" @click="goBack"></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
    <select-device ref="selectDevice" @confirm="deviceSelectConfirm" />
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import SelectDevice from './components/SelectDevice';
import { saveImageAdmin, uploadAttachmentAdmin, uploadMd } from '@/api/common';
import { validateTitleLength } from '@/utils/rules-cms';
import { validateLengthVer } from '@/utils/validate-cms';
import { getI18n } from '@/lang/';
import { getI18N } from '@cyber/helper';
import { BUSINESS_TYPE } from '@/pages/cms/cr-event/constants.js';

export default {
  name: 'ToolDetail',
  components: {
    SelectDevice,
  },
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    const version = (rule, value, callback) => {
      if (value) {
        const len = validateLengthVer(value);
        if (len < 0 || len > 64) {
          callback(new Error(this.$t('tools.validataVersion')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    return {
      BUSINESS_TYPE,
      fileList: [],
      url: 'cr/admin/tools',
      baseURL: '/api/ojj',
      contentType: 'application/json',
      toolCategoryList: [],
      fileSize: 1024 * 1024 * 1024,
      file_name: null,
      cover_file_name: null,
      // 控制下载按钮显示与隐藏
      isDownload: false,
      orginalModel: {},
      model: {
        name: '',
        title: '',
        category: [],
        cover: null,
        cover_url: '',
        cracked: false,
        visible: true,
        language: [],
        platforms: [],
        public: true,
        homepage: '',
        introduction: '',
        version: '',
        files: '',
        tool_files: [],
        tool_type: this.$CONSTANT.Tools.ToolTypes.OFFLINE_TOOL.value,
        device_name: '',
        device_id: '',
        image_resource_id: '',
        publish_time: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('tools.pleaseInputName'),
            trigger: 'blur',
          },
          { validator: validateTitleLength, trigger: 'blur' },
        ],
        category: [
          {
            required: true,
            message: this.$t('tools.pleaseSelectCategory'),
            trigger: 'blur',
          },
        ],
        platforms: [
          {
            required: true,
            message: this.$t('tools.pleaseSelectPlatform'),
            trigger: 'blur',
          },
        ],
        image_resource_id: [
          {
            required: true,
            message: this.$t('tools.pleaseSelectImage'),
            trigger: ['change', 'blur'],
          },
        ],
        version: [{ validator: version, trigger: 'blur' }],
        language: [
          {
            required: true,
            message: this.$t('tools.pleaseSelectLanguage'),
            trigger: 'blur',
          },
        ],
        cover: [
          {
            required: true,
            message: this.$t('tools.pleaseUploadCover'),
            trigger: 'blur',
          },
        ],
        files: [
          {
            required: true,
            message: this.$t('tools.pleaseUploadFile'),
            trigger: 'blur',
          },
        ],
      },
      homepage: [
        {
          required: true,
          message: this.$t('tools.pleaseInputHomePage'),
          trigger: 'blur',
        },
      ],
    };
  },
  watch: {
    'model.tool_files': {
      handler(newValue) {
        if (newValue.length === 0) return;
        // this.model.files = [];
        _.forEach(newValue, (f) => {
          if (_.has(f, 'id') && f.id > 0) {
            this.model.files = f.id;
          }
        });
      },
      deep: true,
    },
  },
  created() {
    this.getToolCategoryList();
  },
  computed: {
    language() {
      if (getI18n().locale !== 'zh-CN') {
        var language = 'en';
      } else {
        language = 'zh-CN';
      }
      return language;
    },
    toolTypesList() {
      let arr = [];
      _.forEach(this.$CONSTANT.LIST.Tools.ToolTypes, (item) => {
        arr.push({
          label: item.name.toString(),
          value: item.value,
        });
      });
      return arr;
    },
    platformsList() {
      let arr = [];
      _.forEach(this.$CONSTANT.LIST.Tools.Platforms, (item) => {
        arr.push({
          label: item.name,
          value: item.value,
        });
      });
      return arr;
    },
    languageList() {
      let arr = [];
      _.forEach(this.$CONSTANT.LIST.Tools.Language, (item) => {
        arr.push({
          label: item.name.toString(),
          value: item.value,
        });
      });
      return arr;
    },

    coverImage() {
      return this.model.cover_url ? [{ url: this.model.cover_url }] : [];
    },
    toolFiles() {
      return _.map(this.model.tool_files, (el) => {
        return {
          name: el.file_name,
          ...el,
        };
      });
    },
  },
  mounted() {
    if (this.id) {
      this.isDownload = true;
      this.$refs.fromRef.getModelData().then((res) => {
        this.initData(res);
        this.orginalModel = _.cloneDeep(this.model);
      });
    }
  },
  methods: {
    getI18Nn() {
      return getI18N();
    },
    getToolCategoryList() {
      this.$request
        .get(
          '/cr/admin/tool/category/list',
          { per_page: 100 },
          { baseURL: '/api/ojj' },
        )
        .then((res) => {
          _.forEach(res.data.data.list, (item) => {
            // const category = { value: item.resource_id, label: item.cn_name };
            // 分类英文的时候取en_name,中文的时候取cn_name
            let category = {};
            if (getI18n().locale == 'zh-CN') {
              category = { value: item.resource_id, label: item.cn_name };
            } else {
              category = { value: item.resource_id, label: item.en_name };
            }

            this.toolCategoryList.push(category);
          });
        });
    },
    goBack() {
      this.$router.push('/admin/tool/tool');
    },
    submitForm() {
      this.beforeSubmit();
      const dataModel = this.generateSubmitData(this.model);
      this.$refs.fromRef
        .submit(dataModel)
        .then((res) => {
          this.goBack();
        })
        .catch((err) => {});
    },
    submitError(error) {
      this.$message({
        message: error.response.data.name[0].message,
        type: 'error',
      });
    },
    initData(data) {
      if (!_.isEmpty(data)) {
        // 避免语言数据为空显示空字符选项
        this.model = data;
        this.fileList = _.map(data.tool_files, (el) => {
          return {
            id: el.id,
            name: el.file_name,
            ...el,
          };
        });
        // eslint-disable-next-line
        if (this.model.language == '') {
          this.model.language = [];
        }
      }
    },
    beforeSubmit() {
      // 类型为离线工具，去除镜像
      if (
        this.model.tool_type ===
        this.$CONSTANT.Tools.ToolTypes.OFFLINE_TOOL.value
      ) {
        this.model.image_resource_id = '';
      } else {
        // 在线工具验证镜像
        if (!this.model.image_resource_id) {
          this.$message.error(this.$t('tools.pleaseSelectImage'));
          return false;
        }
      }
      return true;
    },
    generateSubmitData(data) {
      const submitData = _.cloneDeep(data);
      _.forEach(submitData.version_data, (v) => {
        let field = `version-${v.version}`;
        if (!_.isEmpty(v.id)) {
          field = `version-${v.version}-${v.id}`;
        }
        field = field.replace('.', '#');
        _.set(submitData, field, v.save_path);
      });
      _.unset(submitData, 'version_data');
      // if (
      //   this.model.tool_type ===
      //     this.$CONSTANT.Tools.ToolTypes.OFFLINE_TOOL.value &&
      //   submitData.files
      // ) {
      //   submitData.files = this.$_.join(submitData.files, ',');
      // } else if (
      //   this.model.tool_type ===
      //   this.$CONSTANT.Tools.ToolTypes.ONLINE_TOOL.value
      // ) {
      //   submitData.files = '';
      // }
      /*  if (
        this.model.tool_type ===
        this.$CONSTANT.Tools.ToolTypes.ONLINE_TOOL.value
      ) {
        submitData.files = '';
      } */
      if (submitData.language) {
        submitData.language = this.$_.join(submitData.language, ',');
      }
      if (submitData.platforms) {
        submitData.platforms = this.$_.join(submitData.platforms, ',');
      }
      if (submitData.category) {
        submitData.category = this.$_.join(submitData.category, ',');
      }
      if (submitData.publish_time === null) {
        submitData.publish_time = '';
      }
      return submitData;
    },
    uploadImageSuccess(data) {
      this.model.cover = data.file;
    },
    uploadImageDel() {
      this.model.cover_url = '';
    },
    deviceSelectConfirm(selectedRows) {
      if (selectedRows.length < 1) {
        this.$message.error({
          message: this.$t('tools.chooseAtLeastOne'),
        });
      } else {
        this.model.device_id = selectedRows[0].id;
        this.model.device_name = selectedRows[0].name;
        this.model.image_resource_id = selectedRows[0].uuid;
      }
    },
    startSelect() {
      this.$refs.selectDevice.show();
    },
    _imgAdd(item) {
      var formdata = new FormData();
      formdata.append('file', item[0]);
      formdata.append('type', BUSINESS_TYPE.CR_CMS_TOOL);
      return new Promise((resolve, reject) => {
        saveImageAdmin(formdata).then((res) => {
          resolve([
            {
              url: res.data.data.file_path,
            },
          ]);
        });
      });
    },
    _uploadFile($file) {
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
        formdata.append('type', '6');
        formdata.append('file', $file[0]);
        uploadAttachmentAdmin(formdata).then((res) => {
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
    _uploadZip(file) {
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
            this.model.introduction = data.content;
          }
        });
      });
    },
    exportFile() {
      this.$request.download('/cpms/built_in/Demo.zip');
    },
    filterImages(file) {
      const suffix = this.$_.last(this.$_.split(file.name, '.'));
      if (!this.$_.includes(['jpg', 'jpeg', 'png'], this.$_.toLower(suffix))) {
        this.$message({
          message: this.$t('tools.pleaseUploadPic'),
          type: 'error',
        });
        return false;
      }
      isDownload;
      return true;
    },
    uploadImage(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', BUSINESS_TYPE.CR_CMS_TOOL);
      saveImageAdmin(formData).then((res) => {
        this.model.cover = res.data.data.file_path;
      });
    },
    removeImage() {
      this.model.cover = '';
    },
    uploadFile(file) {
      this.isDownload = false;
      const formData = new FormData();
      formData.append('file', file);
      this.model.tool_files = [];
      this.$request
        .post('/cr/tools/file/upload_tool_file', formData, {
          baseURL: '/api/ojj',
        })
        .then((res) => {
          this.model.files = res.data.data.id;
          this.model.tool_files.push({
            id: res.data.data.id,
            file_name: res.data.data.file_name,
            save_path: res.data.data.save_path,
          });
          this.isDownload = true;
        });
    },
    removeFile(file) {
      _.remove(this.model.tool_files, (el) => el.file_name == file.name);
      // _.remove(this.model.files, (el) => el === file.id);
      this.model.files = '';
    },
    downloadFile(file) {
      if (file.file_url) {
        this.$request.binaryDownload(
          'get',
          file.file_url || '/cpms/' + file.save_path,
          {},
          { filename: file.file_name, baseURL: '' },
        );
      } else {
        const filterData = _.filter(this.model.tool_files, (item) => {
          return item.file_name === file.name;
        });
        if (filterData) {
          this.$request.binaryDownload(
            'get',
            filterData[0].file_url || '/cpms/' + filterData[0].save_path,
            {},
            { filename: filterData[0].file_name, baseURL: '' },
          );
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .toolMarkdown {
  .v-show-content {
    white-space: normal;
  }
}
.addIcon {
  color: #f56c6c;
  display: inline-block;
  margin-right: 4px;
}
</style>
<style lang="scss" scoped>
.image-name {
  padding-left: 10px;
  color: var(--neutral8);
}
</style>
