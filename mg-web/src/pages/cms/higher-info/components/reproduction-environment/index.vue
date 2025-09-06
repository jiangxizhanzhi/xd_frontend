<template>
  <div class="reproduction-environment" v-loading="loading">
    <cb-form
      class="reproduction-environment__form"
      ref="formRef"
      :url="`/admin/vuln/scene_config/`"
      baseURL="/api/vuln"
      :id="resourceId"
      :model.sync="model"
      label-width="auto"
      json
      :rules="rules"
    >
      <cb-form-block>
        <cb-form-item
          :label="$t('higherInfo.environmentType') + $t('common.colon')"
          class="cascaded-form"
        >
          <cb-cascader
            v-model="model.scene_type"
            :options="typeList"
            :props="defaultProps"
            :show-all-levels="false"
            :placeholder="$t('higherInfo.selectEnvironmentType')"
            clearable
            style="width: 240px"
            class="type-cascader"
          ></cb-cascader>
        </cb-form-item>
      </cb-form-block>

      <cb-form-block :title="$t('higherInfo.topology')">
        <!-- 拓扑结构 -->
        <div style="height: 665px; padding-bottom: 15px">
          <scene-editor
            ref="sceneEditorTestRef"
            :title="$t('higherInfo.sceneName')"
            :show-label="false"
            :scene-config="baseStatus"
            :topology-data="model.scene_config"
            :show-mask="false"
            download-image
            status="edit"
          ></scene-editor>
        </div>
      </cb-form-block>
      <cb-form-block :title="$t('higherInfo.loophole')">
        <!-- 漏洞WP -->
        <cb-markdown
          v-model="model.scene_wp"
          type="editor"
          :uploadImages="uploadImageHandler"
          :uploadFile="uploadFileHandler"
          :uploadZip="uploadZip"
          :exportFile="exportFile"
          style="height: 400px; margin-bottom: 16px"
        />
      </cb-form-block>
      <template slot="fixedBottom">
        <cb-button
          loading
          button-type="confirm"
          @click="submitFormData"
        ></cb-button>
      </template>
    </cb-form>
  </div>
</template>

<script>
import { SceneEditor } from '@cyber/scene';
import {
  uploadImage,
  uploadZip,
  uploadMd,
  getVulnSceneCategory,
  uploadOtherFile,
} from '@/api/vuln-cms';
import _ from 'lodash';
export default {
  components: {
    SceneEditor,
  },
  data() {
    return {
      loading: true,
      vulnName: '',
      defaultProps: {
        label: 'name',
        value: 'id',
        emitPath: false,
      },
      typeList: [],
      baseStatus: {
        menubar: ['topology'],
        showMenu: true,
        toolbar: [],
        showToolbar: true,
      },
      model: {
        scene_type: null,
        scene_wp: '',
        scene_config: {},
      },

      rules: {},
      //1GB
      zipFileSizeValidator: 1024,
    };
  },
  created() {
    this.resourceId = this.$route.params.resource_id;
    this.vulnName = this.$route.query.name;
    this.getTypeList();
  },
  mounted() {
    if (this.resourceId) {
      this.$refs.formRef
        .getModelData()
        .then((res) => {
          this.model.scene_wp = this.model.scene_wp || '';
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  methods: {
    getTypeList() {
      getVulnSceneCategory().then((res) => {
        this.typeList = _.get(res, 'data.data') || [];
      });
    },
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
    beforeSubmit() {
      return new Promise((resolve) => {
        this.$refs.sceneEditorTestRef.getScreenShot().then((res) => {
          const file = new File([res], new Date() + '.png', {
            type: 'png',
          });
          const formData = new FormData();
          formData.append('file', file);
          uploadOtherFile(formData).then((resp) => {
            this.model.scene_img = _.get(resp, 'data.data.http_url');
            resolve(this.model);
          });
        });
      });
    },
    submitFormData(done) {
      this.model.scene_config =
        this.$refs['sceneEditorTestRef'].getData() || {};
      _.set(
        this.model.scene_config,
        'scene_config.topology.scene.name',
        this.vulnName,
      );
      let pointData =
        _.get(this.model.scene_config, 'scene_config.topology.elements') || [];
      if (pointData.length) {
        this.$refs.formRef
          .submit(this.model, {}, this.beforeSubmit)
          .then(() => {
            this.$message.success(this.$t('higherInfo.sceneSuccess'));
          })
          .finally(() => {
            done();
          });
      } else {
        this.$refs.formRef
          .submit()
          .then(() => {
            this.$message.success(this.$t('higherInfo.sceneSuccess'));
          })
          .finally(() => {
            done();
          });
      }
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
            this.model.scene_wp = data.content;
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
<style lang="scss" scoped>
.reproduction-environment {
  .reproduction-environment__form {
    padding-right: 0px;
    .cascaded-form {
      height: var(--form-item-height);
    }
  }
  ::v-deep .el-cascader,
  ::v-deep .el-input__icon {
    line-height: var(--input-default-height);
  }
}
</style>
