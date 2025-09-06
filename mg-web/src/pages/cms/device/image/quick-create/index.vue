<template>
  <cb-inner-page :background="false">
    <div ref="container" class="device-quick-create-content-form clearfix">
      <cb-tabs class="selector" value="1" type="border-card">
        <cb-tab-pane name="1" :label="$t('device.system')">
          <device-selector @select-device="selectQuickDevice" />
        </cb-tab-pane>
        <cb-tab-pane
          name="2"
          :label="$t('device.service')"
          :disabled="serviceDisabled"
        >
          <service-selector
            v-if="!serviceDisabled"
            ref="service"
            :deploy-type="deployType"
            @select-service="selectService"
          />
        </cb-tab-pane>
      </cb-tabs>
      <cb-form
        class="config"
        :model="model"
        :rules="rules"
        label-width="50px"
        ref="formRef"
        :fetchPromise="fetchForm"
      >
        <cb-form-item :label="$t('device.name')" prop="name">
          <cb-input v-model="model.name" class="config-input" />
        </cb-form-item>
        <div class="device-config">
          <div class="device">
            <span class="device-name">{{
              device.name || $t('device.SelectOperationSystem')
            }}</span>
          </div>
          <div class="services clearfix">
            <cb-scrollbar>
              <cb-popover
                v-for="(service, i) in services"
                :key="i"
                placement="right-start"
                width="300"
                trigger="hover"
              >
                <div>
                  <p>
                    {{ $t('device.type') }}:<span
                      class="quick-create-tooltip-p"
                      >{{ getServiceCategoryName(service) }}</span
                    >
                  </p>
                  <p>
                    {{ $t('device.description') }}:{{ service.description }}
                  </p>
                </div>
                <div slot="reference" class="service">
                  <img
                    :class="serviceMargin[service.logo]"
                    :style="{ height: serviceHeight[service.logo] }"
                    :src="service.logo"
                    @click="editService(service)"
                  />
                  <span
                    class="service-name"
                    :title="service.name"
                    @click="editService(service)"
                    >{{ service.name }}</span
                  >
                  <span @click.prevent="removeService(i)">
                    <cb-iconfont
                      :title="$t('common.delete')"
                      type="icon-guanbi"
                      class="remove-service"
                      themedColor="primary-color"
                    />
                  </span>
                </div>
              </cb-popover>
            </cb-scrollbar>
          </div>
        </div>
        <div class="error" v-if="error">
          {{ error }}
        </div>
        <div class="action">
          <cb-button button-type="confirm" @click="submitForm">{{
            $t('device.QuickCreate')
          }}</cb-button>
        </div>
      </cb-form>
      <cb-dialog
        :title="
          $t('device.EditServiceParam') +
          '-' +
          (editingServiceDialog.service && editingServiceDialog.service.name)
        "
        :visible.sync="editingServiceDialog.visible"
        width="50%"
      >
        <div v-if="editingServiceDialog.service" class="service-settings">
          <div
            v-for="(setting, i) in editingServiceDialog.parameterList"
            :key="i"
            class="service-setting clearfix"
          >
            <!-- type是 环境变量 -->
            <template
              v-if="
                setting.type ===
                $CONSTANT.DeviceService.DockerParamType.ENV.value
              "
            >
              <cb-input
                v-model="setting.default_val"
                :placeholder="setting.desc || $t('device.paramValue')"
                :title="setting.desc"
              >
                <div slot="prepend" class="slotStyle" :title="setting.name">
                  <template>
                    <span
                      v-if="setting.required === 'YES'"
                      class="setting-required"
                      >*</span
                    >
                    [{{
                      $CONSTANT.DICT.DeviceService.DockerParamType[
                        setting.type
                      ].toString()
                    }}] {{ setting.name }}
                  </template>
                </div>
              </cb-input>
              <!-- 文本框验证提示 -->
              <transition name="el-zoom-in-top">
                <div
                  v-show="!setting.default_val && setting.required === 'YES'"
                  class="tipsStyle"
                >
                  {{ $t('device.pleaseInputParams') }}
                </div>
              </transition>
            </template>
            <!-- type是 端口映射 -->
            <template
              v-else-if="
                setting.type ===
                $CONSTANT.DeviceService.DockerParamType.PORT.value
              "
            >
              <cb-input
                v-model="setting.host_port"
                :placeholder="setting.desc || $t('device.hostPort')"
                :title="setting.desc"
              >
                <div slot="prepend" class="slotStyle">
                  <template>
                    [{{
                      $CONSTANT.DICT.DeviceService.DockerParamType[
                        setting.type
                      ].toString()
                    }}] {{ setting.container_port }}
                  </template>
                </div>
              </cb-input>
            </template>
            <!-- type是 命令参数 -->
            <template
              v-else-if="
                setting.type ===
                $CONSTANT.DeviceService.DockerParamType.CMD.value
              "
            >
              <cb-input
                v-model="setting.cmd"
                :placeholder="setting.desc || $t('device.commandContent')"
                :title="setting.desc"
              >
                <div slot="prepend" class="slotStyle">
                  <template>
                    [{{
                      $CONSTANT.DICT.DeviceService.DockerParamType[
                        setting.type
                      ].toString()
                    }}]
                  </template>
                </div>
              </cb-input>
            </template>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <cb-button button-type="confirm" @click="dialogConfirm">
            <!-- editingServiceDialog.visible = false -->
            {{ $t('common.confirm') }}
          </cb-button>
        </span>
      </cb-dialog>
    </div>
  </cb-inner-page>
</template>

<script>
import _ from 'lodash';

import DeviceSelector from './device-selector';
import ServiceSelector from './service-selector';
import { forbiddenSpaces, validateTitleLength255 } from '@/utils/rules-cms';
import { quickBuild } from '@/api/device/image';

export default {
  name: 'DeviceQuickCreate',
  components: {
    DeviceSelector,
    ServiceSelector,
  },

  data() {
    const validatorType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('device.needLogo')));
      }
      if (value.name) {
        const type = value.name.split('.');
        const upper = type[type.length - 1].toUpperCase();
        const typeList = ['JPEG', 'PNG', 'JPG', 'GIF'];
        if (typeList.includes(upper)) {
          return callback();
        } else {
          return callback(new Error(this.$t('device.imageTypeError')));
        }
      } else {
        return callback();
      }
    };
    return {
      deployType: 1,
      serviceHeight: {},
      serviceMargin: {},
      model: {
        image_name: '',
        name: '',
        service_ids: [],
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
        logo: [{ required: true, trigger: 'change', validator: validatorType }],
      },
      services: [],
      device: {},
      serviceDisabled: true,
      editingServiceDialog: {
        visible: false,
        service: null,
        parameterList: [],
      },
      error: '',
    };
  },
  watch: {
    device: {
      handler(val) {
        this.$nextTick(() => {
          if (val) {
            this.serviceDisabled = false;
          } else {
            this.serviceDisabled = true;
          }
        });
      },
    },
  },
  created() {},
  mounted() {
    this.$refs.container.style.height =
      this.$refs.container.parentElement.offsetHeight + 'px';
  },
  methods: {
    closePopover() {
      let list = document.getElementsByClassName('el-popover');
      if (list.length > 0) {
        list[list.length - 1].style.display = 'none';
      }
    },
    // 服务类型的id => name
    getServiceCategoryName(service) {
      const categories = service.categories
        ? _.map(service.categories.split('|'), (category) => category)
        : [];

      const categoryNames = _.map(categories, (category) => {
        return this.$CONSTANT.DICT.DeviceService.Category[category].toString();
      });
      return categoryNames.join('|');
    },
    // 创建
    fetchForm() {
      const services = this.services;
      const installer_dtolist = [];
      services.forEach((item) => {
        const tmp = {
          docker_installer_data: {
            start_up_parameter_list: item.start_up_parameter_list,
            file: item.file,
          },
          uuid: item.uuid,
        };
        installer_dtolist.push(tmp);
      });
      const params = {
        image_name: this.device.name,
        installer_dtolist,
        name: this.model.name,
      };
      return quickBuild(params).then((res) => {
        this.$router.push('/admin/std/image-manage');
      });
    },
    // 对话框确认
    dialogConfirm() {
      // 筛选出required为YES的数据
      const data = this.editingServiceDialog.parameterList.filter((item) => {
        return item.required === 'YES';
      });
      // 每一项都要有值才返回true
      const result = data.every((item) => {
        return item.default_val.length > 0;
      });
      if (result) {
        this.editingServiceDialog.visible = false;
      } else {
        this.editingServiceDialog.visible = true;
      }
    },
    submitForm() {
      if (!this.device.name || !this.services.length) {
        this.error = this.$t('device.completeConfiguration');
        return;
      }
      /* TODO: this.error 详细的判断*/
      this.error = '';
      this.$refs.formRef.submit();
    },
    // 系统返回的表格数据
    selectQuickDevice(device) {
      if (device.uuid !== this.device.uuid) {
        this.device = _.cloneDeep(device);
        this.services = [];
        // 系统的image_type要传给 服务列表接口
        this.getDeployType(device);
      }
    },

    // 添加服务
    selectService(service) {
      const index = this.services.findIndex((item) => {
        return item.uuid === service.uuid;
      });
      if (index === -1) {
        const tmpService = _.cloneDeep(service);
        this.setImageHeight(tmpService.logo);
        this.services.push(tmpService);
      }
    },
    removeService(index) {
      this.services.splice(index, 1);
      /* this.closePopover() */
    },
    // 查看服务详情
    editService(data) {
      // 服务类型是windows服务，不弹框，docker服务弹框
      if (
        data.deploy_type ===
        this.$CONSTANT.DeviceService.DeployType.INSTALLER.value
      ) {
        this.editingServiceDialog.visible = false;
      } else {
        this.editingServiceDialog.visible = true;
        this.editingServiceDialog.service = data;
        this.editingServiceDialog.parameterList = data.start_up_parameter_list;
      }
    },
    // 设置计算后的logo大小
    setImageHeight(src) {
      const proportion = this.handlerImageProportion(src);
      if (proportion < 0.7) {
        this.serviceMargin[src] = 'service-margin';
      } else {
        this.serviceMargin[src] = 'service-logo';
      }
      this.serviceHeight[src] = 40 * proportion + 'px';
    },
    // 获取原始图片的长宽比例
    handlerImageProportion(src) {
      if (src) {
        var image = new Image();
        image.src = src;
        return image.height / image.width;
      }
      return 1;
    },
    // 根据parent_system_type ,获取deployType
    getDeployType(device) {
      let parent_system_type = _.get(
        device.ext_system_info,
        'parent_system_type',
        '',
      );
      if (parent_system_type > 1) {
        this.deployType = 2;
      } else {
        this.deployType = 1;
      }
    },
  },
};
</script>
<style lang="scss">
.device-quick-create-content-form {
  .config {
    background: var(--bg-color-3);
  }
  .device-name {
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    // border-color: var(--primary-color);
  }
  .services {
    .service {
      position: absolute;
      overflow: hidden;

      &::before {
        content: '';
        display: block;
        position: absolute;
        inset: 0;
        background: var(--bg-color-4);
        opacity: 0.5;
      }
    }
    .service-name {
      color: var(--neutral8);
    }
  }
}
</style>
<style lang="scss">
.device-quick-create-content-form {
  height: 100% !important;
  .selector {
    height: 100%;
    width: 49.5%;
    float: left;
    .el-tabs__content {
      height: calc(100% - 39px);
      overflow: auto;
    }
  }
  .config {
    height: 100%;
    width: 49.5% !important;
    float: right;
    padding: 15px;
  }
  .device-config {
    height: calc(100% - 176px);
    .device {
      text-align: center;
      padding: 0 0 10px;
    }
    .device-name {
      width: 100%;
      line-height: 32px;
      font-size: 14px;
      text-align: center;
      display: block;
      margin: auto;
    }
    .services {
      height: calc(100% - 100px);
      overflow: auto;
      .service {
        position: relative;
        padding: 8px 4px;
        width: 90px;
        height: 90px;
        margin: 10px;
        float: left;
        text-align: center;
        cursor: pointer;
        &.prepared {
          border: none;
          box-shadow: none;
        }
        &:hover {
          .remove-service {
            display: block;
          }
        }
        .service-logo {
          width: 40px;
        }
        .service-margin {
          margin-top: 25px;
          width: 80px;
        }
        .service-name {
          position: absolute;
          bottom: 1px;
          left: 50%;
          transform: translateX(-50%);
          overflow: hidden;
          width: 90%;
          text-overflow: ellipsis;
          line-height: 28px;
          font-size: 14px;
        }
        .remove-service {
          position: absolute;
          right: 3px;
          top: 4px;
          cursor: pointer;
          border-radius: 50%;
          display: none;
        }
      }
    }
  }
  .action {
    text-align: center;
    margin-top: 20px;
  }
}
</style>

<style lang="scss" scoped>
.service-settings {
  .service-setting {
    margin-bottom: 10px;
    .setting-required {
      color: var(--red-color);
    }
  }
}
.services ::v-deep .el-scrollbar__view {
  display: flex;
  flex-wrap: wrap;
}

.error {
  color: var(--red-color);
  font-size: 14px;
  margin-top: 20px;
}
.tipsStyle {
  margin-top: 10px;
  margin-left: 242px;
  color: #f56c6c;
  font-size: 10px;
}
.slotStyle {
  text-align: right;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
