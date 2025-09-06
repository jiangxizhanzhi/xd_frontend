<template>
  <div class="paper-form" v-loading="loading">
    <cb-form
      ref="formRef"
      :model.sync="formData"
      :rules="rules"
      :url="url"
      baseURL="/api/vuln"
      :id="paperId"
      :json="true"
      width="100%"
      label-width="auto"
      isBgColor
    >
      <!-- 名称 -->
      <cb-form-item
        :label="$t('common.vulName') + $t('common.colon')"
        prop="name"
      >
        <cb-input
          v-input-trim
          v-model="formData.name"
          :placeholder="$t('paperMgr.pleaseEnterPaperName')"
          type="text"
        >
        </cb-input>
      </cb-form-item>
      <!-- paper类型 -->
      <cb-form-item
        :label="$t('paperMgr.paperType') + $t('common.colon')"
        prop="category"
      >
        <cb-radio-group v-model="formData.category">
          <cb-radio
            v-for="item in classifyList"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</cb-radio
          >
        </cb-radio-group>
      </cb-form-item>
      <!-- content -->
      <cb-markdown
        v-model="formData.content"
        type="editor"
        :uploadImages="uploadImageHandler"
        :uploadFile="uploadFileHandler"
        :uploadZip="uploadZip"
        :exportFile="exportFile"
        style="height: 600px"
      />
    </cb-form>
    <div class="form-button-group" style="text-align: center">
      <cb-button-group space="middle">
        <cb-button
          loading
          button-type="confirm"
          @click="confirm($event)"
        ></cb-button>
        <cb-button button-type="cancel" @click="cancel"></cb-button>
      </cb-button-group>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { classifyOptions } from '@/constants/index.js';
import { uploadImage, uploadZip, uploadMd } from '@/api/vuln-cms';
export default {
  data() {
    return {
      loading: false,
      resourceId: '',
      paperId: '',
      formData: {
        name: '',
        category: 0,
        content: '',
      },
      rules: {
        // 名称
        name: [
          {
            required: true,
            message: `${this.$t('paperMgr.pleaseEnterPaperName')}`,
            trigger: ['blur', 'change'],
          },
          {
            max: 255,
            message: this.$t('common.lengthLimit255'),
            trigger: 'blur',
          },
        ],
      },
      // paper类型
      classifyOptions,
      classifyList: classifyOptions.list,
      //1GB
      zipFileSizeValidator: 1024,
    };
  },
  computed: {
    url() {
      return `/admin/vuln/${this.resourceId}/paper/`;
    },
  },
  created() {
    this.resourceId = this.$route.params.resource_id;
    this.paperId = this.$route.params.paper_id;
  },
  mounted() {
    if (this.paperId) {
      this.loading = true;
      this.$refs.formRef
        .getModelData()
        .then((formData) => {})
        .finally(() => {
          this.loading = false;
        });
    }
  },
  methods: {
    checkFileType(files, types) {
      const file = files[0];
      const fileType =
        '.' + file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      const isType = types.includes(fileType);
      return isType;
    },
    uploadImageHandler(files) {
      const typesArr = ['.jpg', '.jpeg', '.png'];
      const isType = this.checkFileType(files, typesArr);
      if (!isType) {
        this.$message.error(this.$t('common.imageTips'));
        return Promise.reject();
      }
      const fileSize = files[0].size / 1024 / 1024 > this.zipFileSizeValidator;
      if (fileSize) {
        this.$message.error(
          this.$t('components.fileLoad.sizeError') +
            this.zipFileSizeValidator +
            'MB',
        );

        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', files[0]);
        uploadImage(formData).then((resp) => {
          const url = _.get(resp, 'data.data.http_url');
          const fileName = _.get(resp, 'data.data.file_name');
          resolve([
            {
              name: fileName,
              url,
            },
          ]);
        });
      });
    },
    //上传文件
    uploadFileHandler(files) {
      const typesArr = ['.zip', '.rar'];
      const isType = this.checkFileType(files, typesArr);
      const fileSize = files[0].size / 1024 / 1024 > this.zipFileSizeValidator;
      if (!isType) {
        this.$message.error(this.$t('common.fileTips'));
        return Promise.reject();
      }
      if (fileSize) {
        this.$message.error(
          this.$t('components.fileLoad.sizeError') +
            this.zipFileSizeValidator +
            'MB',
        );
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', files[0]);
        uploadZip(formData).then((resp) => {
          const url = _.get(resp, 'data.data.file_path');
          const fileName = _.get(resp, 'data.data.file_name');
          resolve([
            {
              name: fileName,
              url,
            },
          ]);
        });
      });
    },
    confirm(done) {
      this.$refs['formRef']
        .submit()
        .then((res) => {
          this.cancel();
        })
        .finally(() => {
          done();
        });
    },
    cancel() {
      this.$refs.formRef.resetFields();
      this.$router.push({
        name: 'vuln-paper-mgr',
        params: {
          resource_id: this.resourceId,
        },
      });
    },
    uploadZip(file) {
      const fileSize = file.size / 1024 / 1024 > this.zipFileSizeValidator;
      if (fileSize) {
        this.$message.error(
          this.$t('components.fileLoad.sizeError') +
            this.zipFileSizeValidator +
            'MB',
        );
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('md', file);
        uploadMd(formData).then((resp) => {
          const data = _.get(resp, 'data.data', []);
          const is_extract = data.is_extract;
          if (is_extract) {
            this.formData.content = data.content;
          }
        });
      });
    },
    exportFile() {
      this.$request.filePathDownload('/cpms/built_in/Demo.zip');
    },
  },
};
</script>

<style scoped lang="scss">
.paper-form {
  .form-button-group {
    margin: 32px 0 20px;
  }
}
</style>
