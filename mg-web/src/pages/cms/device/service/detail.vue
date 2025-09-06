<template>
  <cb-inner-page
    :background="false"
    v-loading="loading"
    element-loading-custom-class="custom-loading"
  >
    <div class="image-detail-content">
      <!-- <cb-form :ref="ref" :model="model" :rules="rules" label-width="120px"> -->
      <cb-form
        ref="techfromRef"
        :model="model"
        :rules="rules"
        label-width="120px"
        :url="url"
        baseURL="/api/mp"
        :id="id"
        json
        :isBgColor="true"
      >
        <cb-form-item id="name" :label="$t('device.name')" prop="name">
          <cb-input v-model="model.name" />
        </cb-form-item>
        <cb-form-item :label="$t('device.description')" prop="description">
          <cb-input v-model="model.description" type="textarea" />
        </cb-form-item>
        <cb-form-item :label="$t('device.logo')" prop="logo">
          <cb-input v-model="model.logo" style="display: none" />
          <cb-upload-file
            v-model="logoList"
            :fetch-promise="uploadFunc"
            :tipText="$t('device.tipTextPngService')"
            accept=".jpg,.png"
            :fileSize="1024 * 1024 * 10"
            @delete="deleteLogo"
          ></cb-upload-file>
        </cb-form-item>
        <cb-form-item :label="$t('device.category')" prop="categories">
          <cb-input v-model="model.categories.length" style="display: none" />
          <cb-col :span="24">
            <cb-checkbox-group v-model="model.categories">
              <template v-for="item in service_categories_all">
                <cb-checkbox :key="item.id" :label="item.id">
                  {{ item.name }}
                </cb-checkbox>
              </template>
            </cb-checkbox-group>
          </cb-col>
        </cb-form-item>
        <cb-form-item
          :label="$t('device.serviceType')"
          style="width: 40%"
          prop="deploy_type"
        >
          <!-- <cb-select
            v-model="model.deploy_type"
            :placeholder="$t('device.serviceType')"
            :options="deploy_type_all"
            titleField="name"
            valueField="id"
            @change="deployTypeChange"
            :disabled="id ? true : false"
          /> -->
          <span class="default-docker">{{
            this.$CONSTANT.DeviceService.DeployType.DOCKER.name
          }}</span>
        </cb-form-item>
        <template
          v-if="
            model.deploy_type ===
            this.$CONSTANT.DeviceService.DeployType.DOCKER.value
          "
        >
          <div>
            <cb-form-item
              :label="$t('device.dockerFile')"
              prop="docker_installer_data.user_filename"
            >
              <cb-input
                v-model="model.docker_installer_data.user_filename"
                style="display: none"
              />
              <cb-upload-file
                v-model="fileList"
                type="file"
                :fetch-promise="uploadFileFunc"
                :fileSize="1024 * 1024 * 1024 * 3"
                :tipText="$t('device.tipTextZipService')"
                accept=".zip,.tar"
                @delete="deleteFile"
              ></cb-upload-file>
            </cb-form-item>
          </div>
          <div>
            <cb-form-item :label="$t('device.startupParam')">
              <multi-line-input
                :model="model.docker_installer_data"
                :item="items.start_up_parameter_list"
              >
                <template v-slot="sp">
                  <cb-select
                    v-model="sp.line.type"
                    :placeholder="$t('device.paramType')"
                    :options="deviceServiceDockerParamTypeCom"
                    @change="settingTypeChange(sp.line)"
                    style="width: 200px !important"
                  />
                  <template
                    v-if="
                      sp.line.type ===
                      $CONSTANT.DeviceService.DockerParamType.ENV.value
                    "
                  >
                    <cb-select
                      v-model="sp.line.required"
                      :options="spLineRequiredCom"
                      style="width: 200px !important"
                    />
                    <cb-input
                      v-model="sp.line.name"
                      :placeholder="$t('device.paramName')"
                      style="width: 200px"
                    />
                    <cb-input
                      v-model="sp.line.default_val"
                      :placeholder="$t('device.paramDefaultValue')"
                      style="width: 200px"
                    />
                    <cb-input
                      v-model="sp.line.desc"
                      :placeholder="$t('device.paramDesc')"
                      style="width: 200px"
                    />
                  </template>
                  <template
                    v-if="
                      sp.line.type ===
                      $CONSTANT.DeviceService.DockerParamType.PORT.value
                    "
                  >
                    <cb-input
                      v-model="sp.line.container_port"
                      :placeholder="$t('device.dockerPort')"
                      style="width: 200px"
                    />
                    <cb-input
                      v-model="sp.line.host_port"
                      :placeholder="$t('device.hostPort')"
                      style="width: 200px"
                    />
                    <cb-input
                      v-model="sp.line.desc"
                      :placeholder="$t('device.portDesc')"
                      style="width: 200px"
                    />
                  </template>
                  <template
                    v-if="
                      sp.line.type ===
                      $CONSTANT.DeviceService.DockerParamType.CMD.value
                    "
                  >
                    <cb-input
                      v-model="sp.line.cmd"
                      :placeholder="$t('device.command')"
                      style="width: 200px"
                    />
                    <cb-input
                      v-model="sp.line.desc"
                      :placeholder="$t('device.commandDesc')"
                      style="width: 200px"
                    />
                  </template>
                </template>
              </multi-line-input>
            </cb-form-item>
          </div>
        </template>
        <cb-form-item
          v-if="
            model.deploy_type ===
            $CONSTANT.DeviceService.DeployType.INSTALLER.value
          "
          :label="$t('device.resourceList')"
        >
          <cb-search-table
            :cols="columns"
            :dataSource="model.resource_list"
            :hidePaginOnDemand="true"
            style="margin-bottom: 20px"
          >
            <template v-slot:operation="scope">
              <cb-button
                button-type="edit"
                type="text"
                @click="
                  showEditResourceDialog(scope.data.resourceKey, scope.data)
                "
              >
                {{ $t('common.edit') }}
              </cb-button>

              <cb-button
                button-type="delete"
                type="text"
                @click="deleteResource(scope.data.resourceKey, $event)"
              >
                {{ $t('common.delete') }}
              </cb-button>
            </template>
          </cb-search-table>
          <cb-button button-type="add" @click="showEditResourceDialog(-1, {})">
            {{ $t('device.addResource') }}
          </cb-button>
        </cb-form-item>
        <div slot="fixedBottom">
          <cb-button-group space="middle">
            <cb-button
              :disabled="loading"
              buttonType="confirm"
              @click="submitForm"
              mr
            >
              {{ $t('common.submit') }}
            </cb-button>
            <cb-button buttonType="cancel" @click="goBack">
              {{ $t('common.cancel') }}
            </cb-button>
          </cb-button-group>
        </div>
      </cb-form>

      <cb-dialog
        :title="$t('probeConf.editParams')"
        :visible.sync="showResourceEdit"
        class="resource-dialog"
        width="60%"
        :before-close="closeResourceForm"
      >
        <cb-form
          v-loading="windowLoading"
          ref="resourceForm"
          class="resourceForm"
          :model="resource_list"
          :rules="resourceFormRules"
          label-width="120px"
        >
          <cb-form-item
            :label="$t('device.platform')"
            prop="platforms"
            style="width: 100%"
            class="resource-dialog-form-item"
          >
            <cb-transfer
              v-model="resource_list.platforms"
              :data="systemList"
              style="width: 100%"
            />
          </cb-form-item>
          <cb-form-item
            :label="$t('device.file')"
            prop="user_filename"
            style="width: 100%; bottom: 20px"
          >
            <cb-input
              v-model="resource_list.user_filename"
              style="display: none"
            />
            <cb-upload-file
              ref="upload2"
              type="file"
              v-model="attachmentList"
              :fetch-promise="uploadAttachment"
              @delete="deleteAttachment"
              :tipText="$t('device.tipTextZipOther')"
              accept=".zip,.exe,.msi,.rar"
            ></cb-upload-file>
          </cb-form-item>
        </cb-form>
        <span slot="footer" class="dialog-footer">
          <cb-button
            :disabled="windowLoading"
            button-type="confirm"
            @click="saveResource"
            mr
          >
            {{ $t('common.submit') }}
          </cb-button>
          <cb-button button-type="cancel" @click="closeResourceForm">
            {{ $t('common.cancel') }}
          </cb-button>
        </span>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';
import md5 from 'crypto-js/md5';
import {
  forbiddenSpaces,
  validateTitleLength255,
  validateDescLength2048,
} from '@/utils/rules-cms';
import MultiLineInput from '@/components/MultiLineInput/index';
import { getServiceCategoriesMgData } from '@/api/device/service.js';
function md5Value(value) {
  if (value instanceof File) {
    return md5(`${value.name}:${value.size}:${value.type}`).toString();
  } else {
    return md5(JSON.stringify(value)).toString();
  }
}
function getMd5Model(model) {
  const result = {};
  _.forEach(model, (value, key) => {
    result[key] = md5Value(value);
  });
  return result;
}

function getDiffFields(md5Model1, md5Model2) {
  const fields = [];
  _.forEach(md5Model1, (value, key) => {
    if (value !== md5Model2[key]) {
      fields.push(key);
    }
  });
  return fields;
}
export default {
  name: 'ImageDetail',
  components: {
    MultiLineInput,
  },
  props: {
    id: {
      type: [Number, String],
      default: '',
    },
  },
  data() {
    const validator = (typeList, notFoundError, TypeError) => {
      return (rule, value, callback) => {
        if (!value) {
          return callback(new Error(notFoundError));
        } else if (value.name || value) {
          const name = value.name || value;
          const type = name.split('.');
          const upper = type[type.length - 1].toUpperCase();
          if (typeList.includes(upper)) {
            return callback();
          } else {
            return callback(new Error(TypeError));
          }
        } else {
          return callback();
        }
      };
    };
    const CategoryValidator = (notFoundError) => {
      return (rule, value, callback) => {
        if (!value || value.length === 0) {
          return callback(new Error(notFoundError));
        } else {
          return callback();
        }
      };
    };
    const that = this;
    return {
      auxiliary: {
        initMd5Model: {},
      },
      loading: false,
      windowLoading: false,
      error: '',
      diffCheck: true,
      attachmentList: [], //windows服务  文件列表
      url: '/devops/cluster/service/',
      noDiffCheckFields: [],
      timeout: 60 * 1000 * 60 * 6,
      fileType: 'file',
      fileList: [],
      logoList: [],
      model: {
        name: '',
        description: '',
        logo: '',
        categories: [],
        deploy_type: this.$CONSTANT.DeviceService.DeployType.DOCKER.value,

        docker_installer_data: {
          start_up_parameter_list: [],
          user_filename: '',
          tmpdir_uuid: '',
        },
        resource_list: [],
      },
      deploy_type_all: [],
      service_categories_all: [],
      showDockerParam: false,
      showResourceEdit: false,
      resource_list: { platforms: '', user_filename: '', tmpdir_uuid: '' },
      index: -1,
      systemTypeOptions: [],
      osTypes: [],
      systemList: [],
      systemDefaultList: [],
      platforms: [],
      items: {
        start_up_parameter_list: {
          name: 'start_up_parameter_list',
          options: {
            empty: () => {
              return {
                required: 'YES',
                type: this.$CONSTANT.DeviceService.DockerParamType.ENV.value,
                name: '',
                desc: '',
                default_val: '',
              };
            },
          },
        },
      },
      formatters: {
        platformFormatter: (row, column) => {
          let v = [];
          row.platforms.forEach((item) => {
            const label = this.systemDefaultList.find((i) => {
              return i.key === item;
            });
            if (label) {
              v.push(label.label);
            }
          });
          v = _.join(v, '、') || '';
          return v;
        },
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('device.nameInput'),
            trigger: 'blur',
          },
          { validator: validateTitleLength255, trigger: 'blur' },
          {
            validator: forbiddenSpaces,
            message: this.$t('device.containSpaces'),
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: this.$t('device.descInput'),
            trigger: 'blur',
          },
          { validator: validateDescLength2048, trigger: 'blur' },
        ],
        logo: [
          {
            required: true,
            message: this.$t('device.needLogo'),
            trigger: ['blur', 'change'],
          },
        ],
        categories: [
          {
            required: true,
            message: this.$t('device.pleaseInputCategorys'),
            trigger: ['blur', 'change'],
          },
          {
            validator: CategoryValidator(
              this.$t('device.pleaseInputCategorys'),
            ),
            message: this.$t('device.pleaseInputCategorys'),
            trigger: ['change', 'blur'],
          },
        ],
        deploy_type: [
          /* {
            required: true,
            message: this.$t('device.pleaseSelectServiceType'),
            trigger: 'change',
          }, */
        ],
        'docker_installer_data.user_filename': [
          {
            required: true,
            message: this.$t('device.needDockerFile'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      resourceFormRules: {
        platforms: [
          {
            required: true,
            message: this.$t('device.pleaseSeclectPlatform'),
            trigger: 'blur',
          },
        ],
        user_filename: [
          {
            required: true,
            message: this.$t('device.needNormalFile'),
            trigger: ['blur', 'change'],
          },
          {
            validator: validator(
              ['ZIP', 'EXE', 'MSI', 'RAR'],
              this.$t('device.needNormalFile'),
              this.$t('device.normalFileTypeError'),
            ),
            trigger: ['change', 'blur'],
          },
        ],
      },
      columns: [
        {
          label: this.$t('device.platform'),
          getData(row) {
            return that.formatters.platformFormatter(row);
          },
        },
        {
          label: this.$t('device.file'),
          getData(row) {
            return that.fileFormatter(row);
          },
        },
        {
          label: this.$t('common.operation'),
          slot: 'operation',
        },
      ],
    };
  },
  computed: {
    isUpdate() {
      return this.action !== 'post';
    },
    isDiffCheck() {
      return this.id != '' && this.diffCheck;
    },
    deviceServiceDeployTypeCom() {
      let arr = [];
      _.forEach(this.$CONSTANT.LIST.DeviceService.DeployType, (item) => {
        arr.push({
          label: item.name.toString(),
          value: item.value,
        });
      });
      return arr;
    },
    deviceServiceDockerParamTypeCom() {
      let arr = [];
      _.forEach(this.$CONSTANT.LIST.DeviceService.DockerParamType, (item) => {
        arr.push({
          label: item.name.toString(),
          value: item.value,
        });
      });
      return arr;
    },
    spLineRequiredCom() {
      const arr = [
        { label: this.$t('device.required'), value: 'YES' },
        { label: this.$t('device.optional'), value: 'NO' },
      ];
      return arr;
    },
  },
  created() {
    // this.getSystemTypeOptions();
    this.getCategoriesMgData();
  },
  mounted() {
    if (this.id) {
      this.$refs.techfromRef.getModelData().then((data) => {
        this.initData(data);
        _.forEach(this.model, (value, key) => {
          if (_.has(data, key)) {
            this.$set(this.model, key, this.dataToModel(data, key));
          }
        });
        if (this.isDiffCheck) {
          this.auxiliary.initMd5Model = getMd5Model(this.model);
        }
      });
    }
  },
  methods: {
    getCategoriesMgData() {
      getServiceCategoriesMgData().then((res) => {
        const categoriesData = res.data.data;
        /* this.deploy_type_all = categoriesData.deploy_type; */
        this.service_categories_all = categoriesData.service_categories;
        // this.systemList = categoriesData.installer_platforms
        _.forEach(categoriesData.installer_platforms, (item) => {
          this.systemList.push({
            label: item.name,
            key: item.id,
          });
        });
        this.systemDefaultList = this.systemDefaultList.concat(this.systemList);
      });
    },
    initData(data) {
      data.categories = data.categories
        ? _.map(data.categories.split('|'), (category) => category)
        : [];

      if (data.resource_list) {
        data.resource_list.forEach((item) => {
          item.platforms = item.platforms.split('|') || [];
        });
        _.forEach(data.resource_list, (item, index) => {
          this.$set(item, 'resourceKey', index);
        });
      }

      this.logoList.push({
        url: data.logo,
      });
      if (data.docker_installer_data) {
        if (data.docker_installer_data.start_up_parameter_list === null) {
          data.docker_installer_data.start_up_parameter_list = [];
        }
      }
      if (
        data.docker_installer_data &&
        data.docker_installer_data.user_filename
      ) {
        this.fileList.push({
          name: data.docker_installer_data.user_filename,
        });
      }
    },
    dataToModel(data, modelKey) {
      return data[modelKey];
    },
    getData(callback) {
      getData(this.url, { _fields: this.dataFields })
        .then((response) => {
          this.initData(response.data);
          callback(response.data);
        })
        .catch((error) => {
          this.error = this.getError(error);
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    submitForm() {
      let data;
      let currentMd5Model;
      if (this.isDiffCheck) {
        currentMd5Model = getMd5Model(this.model);
        const diffFields = getDiffFields(
          this.auxiliary.initMd5Model,
          currentMd5Model,
        );
        data = _.pick(this.model, _.union(diffFields, this.noDiffCheckFields));
      } else {
        data = this.model;
      }
      const submitData = this.generateSubmitData(data);

      this.$refs.techfromRef.submit(submitData).then((res) => {
        this.goBack();
      });
      // .catch((err) => {
      //   this.$serverError(err);
      //   this.error = util.getError(err);
      //   if (this.error !== undefined) {
      //     this.$message({ message: this.error, type: 'error' });
      //   }
      // });
    },
    comUpload(file) {
      return new Promise((resolve, reject) => {
        const fileData = new FormData();
        fileData.append('file', file);
        this.$request
          .post(`/devops/cluster/service/upload/docker`, fileData, {
            baseURL: '/api/mp',
          })
          .then((res) => {
            resolve(res);
          })
          .catch(() => {
            reject();
          });
      });
    },
    // windows服务 上传文件
    uploadAttachment(file) {
      this.windowLoading = true;
      this.comUpload(file)
        .then((res) => {
          this.windowLoading = false;
          this.$set(
            this.resource_list,
            'user_filename',
            res.data.data.file_names[0],
          );
          this.$set(
            this.resource_list,
            'tmpdir_uuid',
            res.data.data.tmpdir_uuid,
          );
        })
        .catch(() => {
          this.windowLoading = false;
          this.attachmentList = [];
        });
    },
    deleteAttachment() {
      this.resource_list.user_filename = '';
      this.resource_list.tmpdir_uuid = '';
    },
    goBack() {
      this.$router.push('/admin/std/service-manage');
    },
    uploadFunc(file) {
      const formData = new FormData();
      formData.append('file', file);
      this.$request
        .post('/devops/cluster/target/upload/icon', formData, {
          baseURL: '/api/mp',
        })
        .then((res) => {
          this.model.logo = res.data.data.http_url;
        });
    },
    deleteLogo() {
      this.model.logo = '';
      this.logoList = [];
    },
    // docker 文件上传
    uploadFileFunc(file) {
      this.loading = true;
      this.comUpload(file)
        .then((res) => {
          this.loading = false;
          this.model.docker_installer_data.user_filename =
            res.data.data.file_names[0];
          this.model.docker_installer_data.tmpdir_uuid =
            res.data.data.tmpdir_uuid;
          this.fileList = [
            {
              name: res.data.data.file_names[0],
              url: res.data.data.tmpdir_uuid,
            },
          ];
        })
        .catch(() => {
          this.loading = false;
          this.fileList = [];
        });
    },
    deleteFile() {
      this.model.docker_installer_data.user_filename = '';
      this.model.docker_installer_data.tmpdir_uuid = '';
    },
    generateSubmitData(data) {
      const submitData = _.cloneDeep(data);
      if (_.has(submitData, 'categories')) {
        submitData.categories = _.join(submitData.categories, '|');
      }
      delete submitData.logoList;
      if (
        this.model.deploy_type ===
        this.$CONSTANT.DeviceService.DeployType.DOCKER.value
      ) {
        if (_.has(submitData, 'resource_list')) {
          delete submitData.resource_list;
        }
      } else {
        if (_.has(submitData, 'docker_installer_data')) {
          delete submitData.docker_installer_data;
        }
        if (_.has(submitData, 'resource_list')) {
          const data = [];
          submitData.resource_list.forEach((item) => {
            item.platforms = _.join(item.platforms, '|');
            delete item.resourceKey;
            delete item.id;
            data.push(item);
          });
          delete submitData.resource_list;
          submitData.resource_list = data;
        }
      }

      return submitData;
    },
    fileFormatter(row, column) {
      return row.user_filename;
    },
    deployTypeChange(type) {
      this.error = '';
    },
    settingTypeChange(setting) {
      _.forEach(_.keys(setting), (key) => {
        if (key !== 'type') {
          _.unset(setting, key);
        }
      });
      if (
        setting.type === this.$CONSTANT.DeviceService.DockerParamType.ENV.value
      ) {
        this.$set(setting, 'required', 'YES');
        this.$set(setting, 'name', '');
        this.$set(setting, 'desc', '');
        this.$set(setting, 'default_val', '');
      } else if (
        setting.type === this.$CONSTANT.DeviceService.DockerParamType.PORT.value
      ) {
        this.$set(setting, 'container_port', '');
        this.$set(setting, 'host_port', '');
        this.$set(setting, 'desc', '');
      } else if (
        setting.type === this.$CONSTANT.DeviceService.DockerParamType.CMD.value
      ) {
        this.$set(setting, 'cmd', '');
        this.$set(setting, 'desc', '');
      }
    },
    parseJson(value) {
      if (value && typeof value === 'string') {
        value = JSON.parse(value);
      }
      return value;
    },
    saveResource() {
      this.$refs['resourceForm'].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          if (this.resource_list.resourceKey > -1) {
            this.model.resource_list.splice(
              this.resource_list.resourceKey,
              1,
              Object.assign({}, this.resource_list),
            );
          } else {
            this.model.resource_list.push(
              Object.assign({}, this.resource_list),
            );
          }

          _.forEach(this.model.resource_list, (item, index) => {
            this.$set(item, 'resourceKey', index);
          });
          this.closeResourceForm();
        }
      });
    },

    showEditResourceDialog(resourceKey, row) {
      this.resource_list = Object.assign({}, row);
      this.attachmentList = [];
      if (resourceKey != -1) {
        this.attachmentList.push({
          name: row.user_filename,
        });
      }
      this.showResourceEdit = true;
    },
    deleteResource(id, done) {
      const filterIndex = _.findLastIndex(this.model.resource_list, (item) => {
        return item.resourceKey === id;
      });
      if (filterIndex > -1) {
        this.model.resource_list.splice(filterIndex, 1);
      }
      done();
    },
    closeResourceForm() {
      this.showResourceEdit = false;
      this.$refs.resourceForm.clearValidate();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .custom-loading {
  position: absolute;
  z-index: 9;
  background-color: var(--mask-color);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
}
.default-docker {
  color: var(--white-color);
}
.cb-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
.image-detail-content {
  // margin-top: 40px;
  margin-bottom: 15%;

  .el-form-item {
    margin: 0 6% 0 3%;
    padding-bottom: 25px;
    .select-default-panel {
      width: 92%;
    }
  }

  .el-select--medium {
    width: 100%;
  }
}

.main-container .el-form-item .el-select {
  width: 100%;
}
::v-deep .resource-dialog {
  .el-form-item {
    width: 100%;
  }
}
.device-service-logo-select {
  .image {
    padding: 10px;
  }

  .image-item {
    padding: 10px;
  }
}

::v-deep .el-transfer-panel {
  width: 35%;
}
</style>
