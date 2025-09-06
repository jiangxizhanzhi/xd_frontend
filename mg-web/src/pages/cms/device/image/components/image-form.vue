<template>
  <cb-inner-page
    :background="false"
    v-loading="loading"
    element-loading-custom-class="custom-loading"
  >
    <cb-form
      ref="formRef"
      label-position="right"
      label-width="120px"
      :model.sync="model"
      :rules="rules"
      :fetchPromise="fetchForm"
      :isBgColor="true"
    >
      <cb-form-item :label="$t('device.name')" prop="name">
        <cb-input
          :disabled="specificScene"
          v-model="model.name"
          style="width: 488px"
        />
      </cb-form-item>
      <cb-form-item :label="$t('device.description')" prop="description">
        <cb-input
          v-model="model.description"
          type="textarea"
          style="width: 488px"
        />
      </cb-form-item>
      <cb-form-item :label="$t('device.logo')" prop="logo">
        <cb-col :span="24">
          <cb-input v-model="model.logo" style="display: none" />
          <cb-upload-file
            v-model="logoList"
            :fetch-promise="uploadFunc"
            :tipText="$t('device.tipTextPng')"
            :image-size="[64, 64]"
            accept=".jpeg,.png,.jpg,.svg"
            @delete="deleteLogo"
            fit="scale-down"
          ></cb-upload-file>
          <cover-set
            :dataList="defaultLogoList"
            @selectDefaultLogo="selectDefaultLogo"
          ></cover-set>
          <!-- <fieldset class="select-default-panel">
            <legend class="title">
              {{ $t('device.selectDefaultLogo') }}
            </legend>
            <img
              v-for="item in defaultLogoList"
              :key="item.key"
              :src="item.url"
              class="image-item"
              @click="selectDefaultLogo(item)"
            />
          </fieldset> -->
        </cb-col>
        <!-- <div class="hint">
          {{ $t('device.imageSelectHint') }}
        </div> -->
      </cb-form-item>
      <!-- 角色：角色 对应 虚拟类型
      网关节点（路由器、交换机、防火墙）: 虚拟机、容器
      终端节点：虚拟机、容器
      -->
      <cb-form-item :label="$t('device.role')" prop="role">
        <cb-cascader
          class="form-item-width"
          :disabled="specificScene"
          v-model="roleSet"
          :options="roleOptions"
          :props="optionProps"
          @change="roleChange"
        />
      </cb-form-item>
      <!-- 设备类型，也就是分类 -->
      <cb-form-item :label="$t('device.deviceType')" prop="category">
        <cb-cascader
          class="form-item-width"
          ref="categoryRef"
          v-model="categorySet"
          :options="categoryOptions"
          :props="optionProps"
          @change="categoryChange"
        />
      </cb-form-item>
      <!-- 虚拟类型 -->
      <cb-form-item
        v-show="virtualTypeShow"
        :label="$t('device.virtualType')"
        prop="image_type"
      >
        <div class="form-item-group-flex">
          <cb-select
            class="form-item-width form-item-width-mr8"
            :disabled="specificScene"
            v-model="model.image_type"
            :options="virtualTypeOptions"
            @change="imageTypeChange"
          >
          </cb-select>

          <!-- 虚拟机资源大小 -->

          <cb-select
            class="form-item-width"
            v-show="vmFlavorShow"
            v-model="model.ext_vm.flavor"
            :options="vmFlavorOptions"
            @change="getFlavorMessage"
          >
          </cb-select>

          <!-- dynamips 资源大小 -->
          <cb-select
            class="form-item-width"
            v-if="vmDynamipsShow"
            v-model="model.ext_vm.ext_info.ext_dynamips.platform"
            :options="vmDynamipsOptions"
            @change="getDynamicFlavorMessage"
          >
          </cb-select>
          <!-- :options="dockerFlavorOptions" -->
          <cb-select
            class="form-item-width"
            v-show="dockerFlavorShow"
            v-model="model.ext_docker.flavor"
            :options="dockerFlavorOptions"
            @change="getDockerFlavorMessage"
          >
          </cb-select>
        </div>
      </cb-form-item>
      <!-- 端口信息：-->
      <cb-form-item
        v-show="portMessageShow"
        :label="$t('device.portInfo')"
        prop="ext_gateway"
      >
        <add-port
          @setPortList="getPortList"
          :console-config.sync="model.console_config"
          :port-list.sync="model.ext_gateway.port_configs"
          :role="roleSet"
          :id="id"
        ></add-port>
      </cb-form-item>
      <cb-form-item
        v-show="telnetDynamicShow"
        :label="$t('device.accessMode')"
        prop=""
      >
        <cb-checkbox v-model="checkTelnet">telnet</cb-checkbox>
      </cb-form-item>
      <div>
        <!-- 系统信息 -->
        <cb-form-item
          v-show="systemShow"
          :label="$t('device.systemInfo')"
          prop="ext_system_info"
        >
          <div class="form-item-group-flex">
            <cb-cascader
              class="form-item-width form-item-width-mr8"
              v-model="systemTypeSet"
              :options="systemTypeOptions"
              :props="optionProps"
              @change="systemTypeChange"
              clearable
            />
            <cb-select
              v-show="showSystemConfig"
              class="form-item-width form-item-width-mr8"
              v-model="model.ext_system_info.system_architecture"
              :options="SystemArchitectureCom"
            >
            </cb-select>
            <cb-select
              v-show="showSystemConfig"
              class="form-item-width form-item-width-mr8"
              v-model="model.ext_system_info.language"
              :options="LanguageCom"
            >
            </cb-select>
          </div>
        </cb-form-item>
        <!-- 系统镜像-->
        <cb-form-item
          v-show="systemImageShow"
          :label="$t('device.systemImage')"
          prop="ext_image_info"
        >
          <!-- 虚拟类型是 容器 时，默认选中'自定义上传'，但是也还可以切换别的选项 -->
          <div class="form-item-group-flex">
            <cb-select
              :disabled="specificScene"
              class="form-item-width form-item-width-mr8"
              v-model="model.ext_image_info.image_source"
              :options="systemImageTypeOptions"
              @change="imageSourceChange"
            >
            </cb-select>
            <!-- 基础镜像才显示 -->
            <div v-show="selectBaseImageBtnTrigger">
              <!-- 点击弹出 基础镜像 弹框 -->
              <cb-button @click="basicImageEvent" :disabled="disabled">{{
                $t('device.selectBaseImage')
              }}</cb-button>
              <span class="image-file-name">{{
                model.ext_image_info.base_image_name
              }}</span>
            </div>
            <!-- 自定义上传时才展示 -->
            <div v-show="customUploadTrigger" class="form-item-group-flex">
              <!-- 上传协议 -->
              <cb-select
                class="form-item-width form-item-width-mr8"
                :disabled="specificScene"
                v-model="model.ext_image_info.upload_type"
                :options="uploadTypeOptions"
                @change="uploadTypeChange"
              >
              </cb-select>
              <!-- 磁盘格式 -->
              <cb-select
                class="form-item-width form-item-width-mr8"
                :disabled="specificScene"
                v-model="model.ext_image_info.disk_format"
                :options="diskFormatOptions"
              >
              </cb-select>
              <!-- 选中文件：http选项时才展示 -->
              <div class="form-item-group-flex" v-show="httpUploadTrigger">
                <cb-upload-file
                  ref="dynamipsUpload"
                  v-show="model.image_type === 'dynamips'"
                  style="height: 36px"
                  :disabled="specificScene"
                  v-model="imageFileList"
                  type="file"
                  tipText=""
                  :showFileList="false"
                  accept=".bin"
                  :fileSize="1024 * 1024 * 1024"
                  :fetch-promise="uploadFileFunc"
                  @delete="deleteFile"
                >
                </cb-upload-file>
                <cb-upload-file
                  v-show="model.image_type !== 'dynamips'"
                  ref="otherUpload"
                  style="height: 36px"
                  :disabled="specificScene"
                  v-model="imageFileList"
                  type="file"
                  tipText=""
                  :showFileList="false"
                  accept=".vmdk,.raw,.qcow2,.vdi,.zip,.tar"
                  :fileSize="1024 * 1024 * 1024"
                  :fetch-promise="uploadFileFunc"
                  @delete="deleteFile"
                >
                </cb-upload-file>
                <span class="image-file-name">{{
                  model.ext_image_info.user_filename
                }}</span>
              </div>
              <!-- 镜像文件名称： ftp选项时才展示-->
              <cb-input
                v-show="!httpUploadTrigger"
                class="form-item-width form-item-width-mr8"
                :disabled="specificScene"
                :placeholder="$t('device.imageFileName')"
                v-model="model.ext_image_info.ftp_filename"
              />
            </div>
          </div>
        </cb-form-item>
        <!-- 上传说明：系统镜像 自定义上传时 才显示 -->
        <div v-show="customUploadTrigger" class="el-tag--danger">
          {{
            $t('device.uploadTips') +
            `(ip:${this.ftpIp} ` +
            $t('device.uploadTipsIp')
          }}
        </div>
        <!-- 高级选项：系统镜像是自定义上传且虚拟类型不是容器时，高级选项才显示 -->
        <cb-form-item
          v-if="customUploadTrigger && model.image_type === 'vm'"
          :label="$t('device.advancedOptions')"
        >
          <div>
            <cb-switch
              v-model="model.ext_image_info.meta_data.options"
            ></cb-switch>
          </div>
          <div
            v-if="model.ext_image_info.meta_data.options"
            class="form-item-group-flex advanced"
          >
            <cb-form-item
              label-width="110px"
              :label="$t('device.diskControllerType')"
            >
              <cb-select
                class="form-item-width form-item-width-mr8"
                v-model="model.ext_image_info.meta_data.hw_disk_bus"
                :options="hwDiskBus"
                clearable
              >
              </cb-select>
            </cb-form-item>
            <cb-form-item
              label-width="97px"
              :label="$t('device.virtualNetworkCardType')"
            >
              <cb-select
                class="form-item-width form-item-width-mr8"
                v-model="model.ext_image_info.meta_data.hw_vif_model"
                :options="hwVifModel"
                clearable
              >
              </cb-select>
            </cb-form-item>
            <cb-form-item
              label-width="97px"
              :label="$t('device.videoImageDriver')"
            >
              <cb-select
                class="form-item-width form-item-width-mr8"
                v-model="model.ext_image_info.meta_data.hw_video_model"
                :options="hwVideoModel"
                clearable
              >
              </cb-select>
            </cb-form-item>
            <cb-form-item
              label-width="97px"
              :label="$t('device.startupSelection')"
            >
              <cb-select
                class="form-item-width"
                v-model="model.ext_image_info.meta_data.hw_firmware_type"
                :options="startupSelectionOptions"
                clearable
              >
              </cb-select>
            </cb-form-item>
          </div>
        </cb-form-item>
        <!-- 容器高级选项：系统镜像是自定义上传且虚拟类型是容器时，高级选项显示 -->
        <cb-form-item
          v-if="customUploadTrigger && model.image_type === 'container'"
          :label="$t('device.advancedOptions')"
        >
          <div>
            <cb-switch
              v-model="model.ext_image_info.meta_data.options"
            ></cb-switch>
          </div>
          <div
            v-if="model.ext_image_info.meta_data.options"
            class="container-form-item-group"
          >
            <cb-form-item label-width="110px" label="interactive">
              <cb-select
                class="form-item-width form-item-width-mr8"
                v-model="model.ext_image_info.meta_data.interactive"
                :options="interactiveOptions"
                clearable
              >
              </cb-select>
            </cb-form-item>
            <cb-form-item label-width="97px" label="tty">
              <cb-select
                class="form-item-width form-item-width-mr8"
                v-model="model.ext_image_info.meta_data.tty"
                :options="ttyOptions"
                clearable
              >
              </cb-select>
            </cb-form-item>
            <cb-form-item label-width="97px" label="env">
              <div>
                <cb-input
                  v-model="model.ext_image_info.meta_data.environment_str"
                  style="width: 240px"
                />
              </div>
              <div class="env-tip">
                {{ $t('device.envTip') }}
              </div>
            </cb-form-item>
          </div>
          <cb-form-item
            v-if="model.ext_image_info.meta_data.options"
            label-width="110px"
            :label="$t('device.exStrLabel')"
          >
            <div class="host-config-ex-str-box">
              <cb-input
                v-model="model.ext_image_info.meta_data.host_config_ex_str"
                style="width: 50%"
              />
              <cb-tooltip
                effect="dark"
                :content="$t('device.exStrTip')"
                placement="top"
              >
                <cb-iconfont
                  class="help-icon"
                  type="icon-jingshi1"
                  color="var(--orange-color)"
                  size="18"
                ></cb-iconfont>
              </cb-tooltip>
            </div>
          </cb-form-item>
        </cb-form-item>
        <!-- 接入方式 -->
        <cb-form-item
          v-show="accessWayShow"
          :label="$t('device.accessMode')"
          prop="access_protocol_list"
        >
          <add-protocol
            @setProtocolList="getProtocolList"
            :access-protocol-list.sync="model.access_protocol_list"
            :access-console-config.sync="model.access_console_config"
          ></add-protocol>
        </cb-form-item>
        <!-- 支持快速构建 -->
        <div v-show="supportQuickClout">
          <cb-form-item
            :label="$t('device.supportQuickCreate')"
            prop="quick_create_support"
          >
            <cb-switch v-model="quick_create_support"> </cb-switch>
          </cb-form-item>
          <!-- 支持Cloud-init -->
          <!-- <cb-form-item :label="$t('device.supportClout')" prop="init_support">
            <cb-switch v-model="init_support"> </cb-switch>
          </cb-form-item> -->
        </div>
        <!-- IOS挂载 -->
        <cb-form-item v-show="isoFileShow" :label="$t('device.isoMount')">
          <cb-upload-file
            style="height: 36px"
            v-model="isoFileList"
            type="file"
            :tipText="$t('device.isoTip')"
            :showFileList="true"
            accept=".iso"
            :fileSize="8 * 1024 * 1024 * 1024"
            :fetch-promise="uploadIsoFileFuncChunk"
            @delete="deleteIsoFile"
            @download="downloadIsoFile"
            :disabled="allowChangeIso"
          >
          </cb-upload-file>
        </cb-form-item>
      </div>
      <div slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button
            :disabled="showProgress || loading"
            button-type="confirm"
            mr
            @click="submitForm"
          ></cb-button>
          <cb-button button-type="cancel" @click="cancel"></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
    <basic-image-dialog
      ref="basicImageDialog"
      :category="category"
      :basic-query="basicQuery"
      @setBasicImage="getBasicImage"
    >
    </basic-image-dialog>
    <upload-process :percentage="process" :isShowProgress="showProgress">
    </upload-process>
  </cb-inner-page>
</template>
<script>
import _ from 'lodash';
import { uploadLogo } from '@/api/device/real';
import {
  getFlavor,
  getDiskFormat,
  addImage,
  getEditBackData,
  editImage,
  getImageCategory,
  getFtpIp,
  getCategoryIcon,
  getDefaultLogoSet,
  getDynamicPlat,
  getDynamicSize,
} from '@/api/device/image';
import AddPort from './add-port.vue';
import AddProtocol from './add-protocol.vue';
import BasicImageDialog from './basic-image-dialog.vue';
import CoverSet from './cover-set.vue';
import {
  ROLEOPTIONS,
  VIRTUALTYPEOPTIONS,
  SYSTEMIMAGETYPEOPTIONS,
  SYSTEMIMAGETYPEOPTIONSDYANIMPS,
  VIRTUALTYPEOPTIONSTERMINAL,
  VIRTUALTYPEOPTIONSTERMINALDYNAMIPS,
  UPLOADTYPEOPTIONS,
  DISKFORMATOPTIONS,
  INTERACTIVEOPTIONS,
  TTYOPTIONS,
} from '../constant';
import UploadProcess from '@/components/upload-process';
import { v4 as uuidv4 } from 'uuid';
import {
  checkMd5,
  createFileChunk,
  getFileType,
  mergeFile,
  PostFile,
} from '../../../../../utils/chunk-upload';
import { getFirmwareType } from '../../../../../api/device/image';
export default {
  name: 'ImageForm',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  components: {
    AddPort,
    AddProtocol,
    BasicImageDialog,
    UploadProcess,
    CoverSet,
  },
  computed: {
    SystemArchitectureCom() {
      let arr = [];
      const datas = this.$CONSTANT.LIST.Device.SystemArchitecture;
      _.forEach(datas, (item) => {
        arr.push({
          label: item.name.toString(),
          value: item.value,
        });
      });
      return arr;
    },
    LanguageCom() {
      let arr = [];
      const datas = this.$CONSTANT.LIST.Device.Language;
      _.forEach(datas, (item) => {
        arr.push({
          label: item.name.toString(),
          value: item.value,
        });
      });
      return arr;
    },
    // 导入ISo文件是否显示
    isoFileShow() {
      if (
        this.roleSet[0] === 4 &&
        this.categorySet[0] === 1 &&
        (this.categorySet[1] === 1 || this.categorySet[1] === 2) &&
        this.model.image_type === 'vm'
      ) {
        // 角色-终端
        // 设备类型 操作系统--windows||linux
        // 虚拟类型--虚拟机
        return true;
      } else {
        this.isoFileList = [];
        this.model.ext_vm.iso_attach = false;
        this.model.ext_vm.iso_attach_filename = '';
        this.model.ext_vm.iso_tmpdir_uuid = '';
        return false;
      }
    },
    // 是否可以修改iso文件
    allowChangeIso() {
      return this.model.allow_change_iso ? false : true;
    },
    // 是否显示系统位数和语言配置
    showSystemConfig() {
      // USB 设备不显示位数和语言设置
      if (this.systemTypeSet[1] === 403) {
        return false;
      } else {
        return true;
      }
    },
  },
  data() {
    const validateName = (rule, value, callback) => {
      // 仅可由英文字母、数字、特殊字符点、短横以及下划线组成, 不能以特殊字符开始或结束
      const valid = /^[a-z0-9]+(?:(?:(?:[._]|__|[-]*)[a-z0-9]+)+)?$/;
      if (valid.test(value)) {
        callback();
      } else {
        callback(new Error(this.$t('device.containNameRule')));
      }
    };
    return {
      vmDynamipsShow: false,
      dockerFlavorShow: false,
      isoFileList: [], //ISo文件列表
      checkTelnet: false, //
      process: 0, //上传进度数据
      showProgress: false, //上传进度条是否显示
      disabled: false,
      specificScene: false,
      loading: false,
      defaultLogoList: [], // 默认图标
      selectBaseImageBtnTrigger: true,
      customUploadTrigger: false,
      httpUploadTrigger: false,

      virtualTypeShow: true, // 虚拟类型是否显示
      portMessageShow: false, // 端口信息是否显示
      vmFlavorShow: true, // 资源大小是否显示
      accessWayShow: true, // 接入方式是否显示
      systemShow: true, // 系统信息是否显示
      systemImageShow: true, // 系统镜像是否显示
      supportQuickClout: true, // 支持快速构建、支持Cloud-init是否显示

      telnetDynamicShow: false, // dynamips 接入方式是否显示

      model: {
        allow_change_iso: true, // 为true时可以重新上传和删除iso文件
        name: null,
        description: null,
        logo: null,
        role: 4,
        // 设备类型
        category: null,
        second_category: null,
        third_category: null,
        image_type: 'vm', // 默认虚拟机
        // 端口信息
        ext_gateway: {
          // 直接接入
          /* console_config: {
            auth_protocol: '',
            description: '',
            hostname: '',
            password: '',
            port: '',
            protocol: 'console',
            username: '',
          }, */
          // 协议接入
          port_configs: [],
        },
        // 端口信息的直接接入
        console_config: {},
        // 接入方式
        access_protocol_list: [],
        // 接入方式的直接接入
        access_console_config: {
          /* protocol: 'console',
          port: '',
          username: '',
          password: '',
          hostname: '',
          auth_protocol: '',
          description: '', */
        },
        // 系统信息
        ext_system_info: {
          parent_system_type: null,
          system_type: null,
          system_architecture: null,
          language: null,
        },
        // 系统镜像
        ext_image_info: {
          image_source: null, // 镜像类型
          base_image_name: null, // 基础镜像名称
          upload_type: 'http', // 上传协议
          disk_format: null,
          ftp_filename: null, // 镜像文件名称
          tmpdir_uuid: null, // 临时文件ID
          user_filename: null, // user_filename
          meta_data: {
            hw_disk_bus: '', // 磁盘控制器类型
            hw_vif_model: '', // 虚拟网卡型号
            hw_video_model: '', // 视频图像驱动
            interactive: false, //容器interactive配置
            tty: false, //容器tty配置
            environment_str: '', //环境变量
            host_config_ex_str: '', // 自定义命令参数
            hw_firmware_type: '', // 启动选择
            options: true, // 高级选项开关
          },
        },
        // 虚拟机
        ext_vm: {
          flavor: null, // 虚拟机配置信息
          quick_create_support: false, // 支持快速构建
          // init_support: false, // 支持Cloud-init
          cpu: null,
          ram: null,
          disk: null,
          iso_attach: false, // 是否挂载ISO文件
          iso_attach_filename: '', //ISO文件名称
          iso_tmpdir_uuid: '', //ISO临时文件地址
          ext_info: {
            ext_dynamips: {
              flavor: {
                nvram: null,
                ram: null,
              },
              platform: '', // dynamic类型
            },
          },
        },
        // 容器
        ext_docker: {
          quick_create_support: false, // 支持快速构建
          // init_support: false, // 支持Cloud-init
          flavor: null,
          ram: null,
          disk: null,
        },
      },
      // advanced_options_support: false, // 高级选项
      // container_advanced_options_support: false, //容器高级选项
      quick_create_support: false, // 支持快速构建
      // init_support: false, // 支持Cloud-init
      basicQuery: {},
      imageFileList: [],
      logoList: [],
      ftpIp: '',
      // 角色类型
      roleOptions: ROLEOPTIONS,
      roleSet: [4], // 默认终端节点
      categorySet: [],
      // 设备类型
      categoryOptions: [],
      categoryOptionsCopy: [],
      optionProps: {
        checkStrictly: false,
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'children',
      },
      // 虚拟类型
      virtualTypeOptions: VIRTUALTYPEOPTIONSTERMINAL,
      // 虚拟机配置
      vmFlavorOptions: [],
      // 容器大小flavor配置
      dockerFlavorOptions: [],
      vmFlavorOptionsCopy: [],
      // dynamips 平台
      vmDynamipsOptions: {}, //dynamips  资源大小配置
      vmDynamipsSizeOptions: [],
      systemTypeSet: [],
      // 系统信息
      systemTypeOptions: [],
      systemTypeOptionsCopy: [],
      // 镜像类型,如：基础镜像
      systemImageTypeOptions: SYSTEMIMAGETYPEOPTIONS,
      // 上传协议
      uploadTypeOptions: UPLOADTYPEOPTIONS,
      // 磁盘格式
      diskFormatOptions: [],
      // 磁盘格式副本
      diskFormatOptionsCopy: DISKFORMATOPTIONS,
      validateName: {
        validator: validateName,
        trigger: 'blur',
        container: true,
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('device.nameInput'),
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: this.$t('device.descInput'),
            trigger: 'blur',
          },
        ],
        logo: [
          {
            required: true,
            message: this.$t('device.needLogo'),
            trigger: 'blur',
          },
        ],
        category: [
          {
            required: true,
            message: this.$t('device.needCategory'),
            trigger: 'blur',
          },
        ],
      },
      category: {},
      hwDiskBus: [],
      hwVifModel: [],
      hwVideoModel: [],
      startupSelectionOptions: [], // 启动选择下拉项
      interactiveOptions: INTERACTIVEOPTIONS,
      ttyOptions: TTYOPTIONS,
      chunks: [],
    };
  },
  watch: {
    // 监听虚拟类型
    'model.image_type': {
      handler(value) {
        let role = this.model.role;
        /* 角色不是终端节点时 */
        if (role !== 4) {
          if (value === 'simple') {
            this.setformItemShow([
              false,
              false,
              false,
              false,
              false,
              false,
              false,
            ]);
          } else if (value === 'vm') {
            this.setformItemShow([true, true, false, true, true, true, false]);
          } else if (value === 'container') {
            this.setformItemShow([false, true, false, true, true, true, false]);
          } else if (value === 'dynamips') {
            this.setformItemShow([
              false,
              false,
              false,
              true,
              true,
              false,
              true,
            ]);
          }
        } else {
          this.setformItemShow([true, false, true, true, true, true, false]);
          if (value === 'container') {
            this.setformItemShow([false, false, true, true, true, true, false]);
          }
        }
        // 虚拟类型是简易型时, 清空虚拟类型以下所有表单项,包括虚拟机配置
        if (value === 'simple') {
          this.emptyPropValue(1);
        }
        // 角色是网关、虚拟类型是容器时，清空资源大小
        if (
          ((role === 21 || role === 22 || role === 23) &&
            value === 'container') ||
          (role === 4 && value === 'container')
        ) {
          this.emptyPropValue(3);
        }
        this.quick_create_support = false;
        // this.init_support = false;
        this.model.ext_docker.quick_create_support = false;
        // this.model.ext_docker.init_support = false;
        this.model.ext_vm.quick_create_support = false;
        // this.model.ext_vm.init_support = false;
        // 不同虚拟类型，展示不同的磁盘格式
        const diskList = _.cloneDeep(this.diskFormatOptionsCopy);
        if (value === 'container') {
          this.diskFormatOptions = diskList.filter((item) => {
            return item.value === 'raw';
          });
        } else if (value === 'vm') {
          this.diskFormatOptions = diskList.filter((item) => {
            return item.value !== 'dynamips';
          });
        } else if (value === 'dynamips') {
          this.diskFormatOptions = diskList.filter((item) => {
            return item.value === 'dynamips';
          });
        }
        // 虚拟类型不是容器时且系统镜像是自定义上传时，高级选项切换为true
        // if (value === 'vm' && this.customUploadTrigger) {
        //   this.advanced_options_support = true;
        // } else {
        //   this.advanced_options_support = false;
        // }
        // 虚拟类型是容器时且系统镜像是自定义上传时，容器高级选项切换为true
        // if (value === 'container' && this.customUploadTrigger) {
        //   this.container_advanced_options_support = true;
        // } else {
        //   this.container_advanced_options_support = false;
        // }
        if (value === 'dynamips') {
          // 底层image_source 1 ， 2， 3；   内置dynamips靶标是2， 新增限制为1和3
          // dynamips靶标为2的是云平台安装时内置的靶标。编辑时，需要展示为云平台。新建时，由于底层限制，是限制了只能新建1、3类型的dynamips靶标
          if ((this.$route.name = 'image-manage-edit')) {
            this.systemImageTypeOptions = SYSTEMIMAGETYPEOPTIONSDYANIMPS;
            this.setSystemTypeOptionsDisabled(true);
          } else {
            this.systemImageTypeOptions = SYSTEMIMAGETYPEOPTIONSDYANIMPS;
            this.setSystemTypeOptionsDisabled(true);
          }
        } else {
          this.systemImageTypeOptions = SYSTEMIMAGETYPEOPTIONS;
          this.setSystemTypeOptionsDisabled(false);
        }
      },
      immediate: true,
    },
    // 监听角色
    roleSet: {
      handler(value) {
        let length = value.length;
        this.model.role = value[value.length - 1];
        if (length === 1 && value[0] === 4) {
          /* 角色是终端节点时表单项显示情况：
          1、设备类型：操作系统、应用系统、安全设备可选。
          2、虚拟类型：虚拟机、容器。
          3、资源大小：显示。
          4、端口信息：不显示。
          5、接入方式：显示。
          6、系统信息：显示。
          7、系统镜像：显示
          8、支持快速构建、支持Cloud-init: 显示
        */
          this.categoryOptionsDisabled(4);
          this.virtualTypeShow = true;
          this.vmDynamipsShow = false;
          this.dockerFlavorShow = false;
          this.virtualTypeOptions = VIRTUALTYPEOPTIONSTERMINAL;
          this.setformItemShow([true, false, true, true, true, true, false]);
          this.model.image_type = 'vm';

          // 角色是终端节点时 清空值
          this.emptyPropValue(2);
        } else if (length === 1 && value[0] === 3) {
          // 角色是外部网络
          this.categoryOptionsDisabled(3);
          this.virtualTypeShow = false;
          this.setformItemShow([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ]);
          this.model.image_type = '';
          /* 角色是外部网络时 清空值 */
          this.emptyPropValue(1);
        } else if (length > 1) {
          // 角色是网关节点
          this.categoryOptionsDisabled(6);
          this.virtualTypeShow = true;
          this.vmDynamipsShow = false;
          this.dockerFlavorShow = false;
          this.virtualTypeOptions = VIRTUALTYPEOPTIONSTERMINALDYNAMIPS; // 角色是网关节点时，虚拟类型没有简易型
          this.setformItemShow([true, true, false, true, true, true, false]);
          this.model.image_type = 'vm';
          /* 角色是网关时 清空接入信息 */
          this.emptyPropValue(7);
        }
      },
      immediate: true,
    },
    // 监听系统镜像类型
    'model.ext_image_info.image_source': {
      handler(value) {
        if (value === 1) {
          this.selectBaseImageBtnTrigger = true;
          // 系统镜像是 基础镜像 时, 清空 ext_image_info 部分属性
          this.emptyPropValue(4);
        } else {
          this.selectBaseImageBtnTrigger = false;
        }
        // 系统镜像是 自定义上传 时, 清空 ext_image_info 部分属性
        if (value === 3) {
          this.customUploadTrigger = true;
          // 虚拟类型不是容器时且系统镜像是自定义上传时，高级选项切换为true
          if (this.model.image_type === 'vm') {
            // this.advanced_options_support = true;
            //编辑镜像时获取的meta_data可能为null,切换成自定义上传会报错，需要赋初始值
            if (!this.model.ext_image_info.meta_data) {
              this.model.ext_image_info.meta_data = {
                hw_disk_bus: '', // 磁盘控制器类型
                hw_vif_model: '', // 虚拟网卡型号
                hw_video_model: '', // 视频图像驱动
                hw_firmware_type: '', // 启动选择
              };
            }
          } else if (this.model.image_type === 'container') {
            //虚拟类型为容器且系统镜像是自定义上传
            // this.container_advanced_options_support = true;
          }
          this.emptyPropValue(6);
        } else {
          // this.advanced_options_support = false;
          // this.container_advanced_options_support = false;
          this.customUploadTrigger = false;
        }
        // 系统镜像是 CP-Cloud 时, 清空 ext_image_info 部分属性
        if (value === 2) {
          this.emptyPropValue(5);
        }
      },
      immediate: true,
    },
    // 监听协议
    'model.ext_image_info.upload_type': {
      handler(value) {
        if (value === 'http') {
          this.httpUploadTrigger = true;
        } else {
          this.httpUploadTrigger = false;
        }
      },
      immediate: true,
    },
    // 角色决定可选的设备类型,初始化时就监测设备类型副本,设置设备类型的可选项
    categoryOptionsCopy: {
      handler(value) {
        if (value) {
          this.categoryOptionsDisabled(this.roleSet[0]);
        }
      },
      immediate: true,
      deep: true,
    },
    // 监听快速构建
    quick_create_support: {
      handler(value) {
        if (value) {
          if (this.model.image_type === 'vm') {
            this.model.ext_vm.quick_create_support = value;
          } else if (this.model.image_type === 'container') {
            this.model.ext_docker.quick_create_support = value;
          }
        } else {
          this.model.ext_vm.quick_create_support = false;
          this.model.ext_docker.quick_create_support = false;
        }
      },
      immediate: true,
    },
    // // 监听 Clound-init
    // init_support: {
    //   handler(value) {
    //     if (value) {
    //       if (this.model.image_type === 'vm') {
    //         this.model.ext_vm.init_support = value;
    //       } else if (this.model.image_type === 'container') {
    //         this.model.ext_docker.init_support = value;
    //       }
    //     } else {
    //       this.model.ext_vm.init_support = false;
    //       this.model.ext_docker.init_support = false;
    //     }
    //   },
    //   immediate: true,
    // },
    // 监听高级选项的值
    // advanced_options_support: {
    //   handler(value) {
    //     if (!value) {
    //       this.model.ext_image_info.meta_data.hw_disk_bus = '';
    //       this.model.ext_image_info.meta_data.hw_vif_model = '';
    //       this.model.ext_image_info.meta_data.hw_video_model = '';
    //       this.model.ext_image_info.meta_data.hw_firmware_type = '';
    //     }
    //   },
    //   immediate: true,
    // },
    // 监听容器高级选项的值
    'model.ext_image_info.meta_data.options': {
      handler(value) {
        if (!value) {
          this.model.ext_image_info.meta_data.interactive = false;
          this.model.ext_image_info.meta_data.tty = false;
          this.model.ext_image_info.meta_data.environment_str = '';
          this.model.ext_image_info.meta_data.host_config_ex_str = '';

          this.model.ext_image_info.meta_data.hw_disk_bus = '';
          this.model.ext_image_info.meta_data.hw_vif_model = '';
          this.model.ext_image_info.meta_data.hw_video_model = '';
          this.model.ext_image_info.meta_data.hw_firmware_type = '';
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getDefalutLogo();
    // this.getLocalDefaultLogoSet(); // 获取靶标图集数据
    this.getCategories();
    if (this.id) {
      this.editBack();
    }
    // this.getDiskFormatList();
    this.getFlavorList();

    this.getFtpInfo();
    this.getDynamicPlatTh();
    this.getDynamicSizeTh();
    this.getStartupSelectionOptions();
  },
  methods: {
    // 编辑回显
    editBack() {
      getEditBackData(this.id).then((res) => {
        const data = _.get(res, 'data.data', {}) || {};
        if (data.ext_vm !== null && data.ext_docker === null) {
          //虚拟机判断quick_create_params字段是否为空,为空可以操作选择基础镜像,否则禁用
          // 或者snapshot_count为0可以操作,不为0禁用
          if (
            data.ext_vm.quick_create_params.length > 0 ||
            data.ext_vm.snapshot_count !== 0
          ) {
            this.disabled = true;
          }
        } else if (data.ext_docker !== null && data.ext_vm === null)
          if (data.ext_docker.snapshot_count !== 0) {
            // 容器判断ext_docker返回的snapshot_count为0可以操作,不为0禁用
            this.disabled = true;
          }
        const {
          name,
          description,
          logo,
          role,
          access_protocol_list,
          ext_gateway,
          ext_image_info,
          ext_system_info,
          ext_vm,
          ext_docker,
          category,
          second_category,
          third_category,
          image_type,
          is_import,
          is_internal,
          is_init,
          allow_change_iso,
        } = data;
        this.model.allow_change_iso = allow_change_iso;
        this.model.role = role;
        if (role === 21 || role === 22 || role === 23) {
          this.roleSet = [6, role];
        } else if (role === 4) {
          this.roleSet = [4];
        } else if (role === 3) {
          this.roleSet = [3];
        }
        this.$nextTick(() => {
          this.model.image_type = image_type;
          this.$nextTick(() => {
            if (image_type === 'vm') {
              for (let key in this.model.ext_docker) {
                this.model.ext_docker[key] = null;
              }
              // 虚拟机
              this.model.ext_vm = ext_vm ? ext_vm : {};
              this.model.ext_docker.quick_create_support = false;
              // this.model.ext_docker.init_support = false;
              if (ext_vm) {
                this.dockerFlavorShow = false;
                // this.init_support = ext_vm.init_support;
                this.quick_create_support = ext_vm.quick_create_support;
              }
            } else if (image_type === 'container') {
              // 容器
              for (let key in this.model.ext_vm) {
                // this.model.ext_vm[key] = null;
                if (key === 'iso_tmpdir_uuid') {
                  this.model.ext_vm.iso_tmpdir_uuid = '';
                }
                if (key === 'ext_info') {
                  this.model.ext_vm.ext_info.ext_dynamips.platform = '';
                  this.model.ext_vm.ext_info.ext_dynamips.flavor.nvram = null;
                  this.model.ext_vm.ext_info.ext_dynamips.flavor.ram = null;
                }
                if (key !== 'ext_info' && key !== 'iso_tmpdir_uuid') {
                  this.model.ext_vm[key] = null;
                }
              }
              if (ext_docker) {
                this.dockerFlavorShow = true;
                // this.init_support = ext_docker.init_support;
                this.quick_create_support = ext_docker.quick_create_support;
              }
              this.model.ext_docker = ext_docker ? ext_docker : {};
              // 容器名称校验
              let nameValidateList = this.rules.name;
              nameValidateList.push(this.validateName);
            } else if (image_type === 'dynamips') {
              const findIndex = _.findIndex(access_protocol_list, (item) => {
                return item.protocol === 'telnet';
              });
              if (findIndex >= 0) {
                this.checkTelnet = true;
              }
              this.vmDynamipsShow = true;
              this.portMessageShow = false;
              this.quick_create_support = ext_vm.quick_create_support;
              this.model.ext_vm.ext_info.ext_dynamips.platform =
                ext_vm.ext_info.ext_dynamips.platform;
              this.setSystemTypeOptionsDisabled(true);
              this.systemImageTypeOptions = SYSTEMIMAGETYPEOPTIONSDYANIMPS;
            }
            this.model.category = category;
            this.model.second_category = second_category;
            this.model.third_category = third_category;

            if (category === 1) {
              this.categorySet = [category, second_category, third_category];
            } else {
              this.categorySet = [category, second_category];
            }
            this.model.ext_system_info = ext_system_info ? ext_system_info : {};
            if (ext_system_info) {
              this.systemTypeSet = [
                ext_system_info.parent_system_type,
                ext_system_info.system_type,
              ];
            }
            this.model.ext_image_info = ext_image_info ? ext_image_info : {};
            if (access_protocol_list && access_protocol_list.length) {
              // 接入协议添加id,便于删除
              access_protocol_list.forEach((item, i) => {
                item.id = new Date().getTime() + Math.random() * 100 + i;
                if (item.protocol === 'ssh') {
                  item.isSSH = true;
                }
                if (item.protocol === 'rdp') {
                  item.isRDP = true;
                }
              });
              // 隔离出"直接接入"的console协议(加入COM协议)
              for (let i = 0; i < access_protocol_list.length; i++) {
                if (
                  access_protocol_list[i].protocol === 'console' ||
                  access_protocol_list[i].protocol === 'COM'
                ) {
                  this.model.access_console_config = access_protocol_list[i];
                  access_protocol_list.splice(i, 1);
                  break;
                }
              }
              this.model.access_protocol_list = access_protocol_list;
            }
            if (ext_gateway) {
              // 端口信息console协议
              if (ext_gateway.console_config) {
                this.model.console_config = ext_gateway.console_config;
              } else {
                this.model.console_config = {};
              }
              // 端口信息其他协议
              if (ext_gateway.port_configs.length) {
                // 端口信息添加id,便于删除
                const portList = ext_gateway.port_configs;
                portList.forEach((item, i) => {
                  item.id = new Date().getTime() + Math.random() * 100 + i;
                  if (item.access_protocols && item.access_protocols.length) {
                    item.access_protocols.forEach((item2, j) => {
                      item2.id =
                        new Date().getTime() + Math.random() * 1000 + j;
                      if (item2.protocol === 'ssh') {
                        item2.isSSH = true;
                      }
                      if (item2.protocol === 'rdp') {
                        item2.isRDP = true;
                      }
                    });
                  }
                });
                // 父组件的角色是网关节点/交换机的时候, 协议接入默认选中Lan口，且不可切换
                if (role === 22) {
                  portList.forEach((item, i) => {
                    item.disabled = true;
                  });
                }
                this.model.ext_gateway.port_configs = portList;
              }
            }

            this.model.name = name;
            this.model.description = description;
            this.model.logo = logo;

            // for (let i = 0, len = this.defaultLogoList.length; i < len; i++) {
            //   if (this.defaultLogoList[i].name === logo) {
            //     this.logoList = [
            //       { name: logo, url: this.defaultLogoList[i].url },
            //     ];
            //     break;
            //   }
            // }
            // if (!this.logoList.length) {
            //   this.logoList = [{ name: logo, url: logo }];
            // }
            this.logoList = [{ name: logo, url: logo }];
            // 镜像数据中 image_source是3或者2 image_status是2时，或者当前为初始靶标时(is_init为true)，名称、角色、虚拟类型、系统镜像 不可修改
            if (
              (ext_image_info &&
                (ext_image_info.image_source === 3 ||
                  ext_image_info.image_source === 2) &&
                ext_image_info.image_status === 2) ||
              is_init
            ) {
              this.specificScene = true;
            } else {
              this.specificScene = false;
            }
            if (ext_vm?.iso_tmpdir_uuid) {
              const data = [
                {
                  resource_id: ext_vm.iso_tmpdir_uuid,
                  name: ext_vm.iso_attach_filename,
                  isDownload: true,
                },
              ];
              this.isoFileList = data;
            }
          });
        });
      });
    },

    // 获取靶标图标
    getDefalutLogo() {
      getCategoryIcon().then((res) => {
        this.defaultLogoList = _.get(res, 'data.data', []) || [];
      });
    },
    // // 获取靶标图集
    // getLocalDefaultLogoSet() {
    //   getDefaultLogoSet().then((res) => {
    //     const tempData = _.get(res, 'data.data', []) || [];
    //   });
    // },

    // 获取角色、设备分类
    getCategories() {
      getImageCategory().then((res) => {
        this.category = res;
        let first_type_list = _.get(res, 'data.data.first_type_list', []) || [],
          second_type_list = _.get(res, 'data.data.second_type_list', []) || [],
          third_type_list = _.get(res, 'data.data.third_type_list', []) || [],
          hw_disk_bus_list = _.get(res, 'data.data.hw_disk_bus_list', []) || [],
          hw_vif_model_list =
            _.get(res, 'data.data.hw_vif_model_list', []) || [],
          hw_video_model_list =
            _.get(res, 'data.data.hw_video_model_list', []) || [];

        // 设备类型
        first_type_list.forEach((item1) => {
          item1.children = [];
          second_type_list.forEach((item2) => {
            if (item2.l1_parent_id === item1.id) {
              item1.children.push(item2);
            }
          });
        });
        first_type_list.forEach((item1) => {
          if (item1.id === 1) {
            item1.children.forEach((item2) => {
              item2.children = [];
              third_type_list.forEach((item3) => {
                if (item3.l2_parent_id === item2.id) {
                  item2.children.push(item3);
                }
              });
            });
          }
        });
        this.categoryOptions = [...first_type_list];
        this.categoryOptionsCopy = [...first_type_list];
        // 系统信息
        const systermFirst = _.cloneDeep(second_type_list).splice(0, 5);
        systermFirst.forEach((item) => {
          item.children = [];
          third_type_list.forEach((item2) => {
            if (item.id === item2.l2_parent_id) {
              item.children.push(item2);
            }
          });
        });
        this.systemTypeOptions = [...systermFirst];
        this.systemTypeOptionsCopy = [...systermFirst];
        // 高级选项的三项下拉赋值
        this.hwDiskBus = this.listMap2(hw_disk_bus_list);
        this.hwVifModel = this.listMap2(hw_vif_model_list);
        this.hwVideoModel = this.listMap2(hw_video_model_list);
      });
    },
    //  获取 dynamips  平台
    getDynamicPlatTh() {
      getDynamicPlat().then((res) => {
        const data = _.get(res, 'data.data', []);
        const dealData = [];
        _.forEach(data.platforms, (item) => {
          dealData.push({
            label: item,
            value: item,
          });
        });
        this.vmDynamipsOptions = dealData;
      });
    },
    //  获取 dynamips 内存和硬盘、NVRAM
    getDynamicSizeTh() {
      getDynamicSize().then((res) => {
        const data = _.get(res, 'data.data', []);
        this.vmDynamipsSizeOptions = data;
      });
    },

    // 获取虚拟机配置信息
    getFlavorList() {
      getFlavor().then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        this.vmFlavorOptionsCopy = _.cloneDeep(data);
        const list = data.map((item) => {
          return {
            label: `${item.cpu}${this.$t('device.core')}/${item.ram}M${this.$t(
              'device.ram',
            )}/${item.disk}G${this.$t('device.disk')}`,
            value: item.name,
          };
        });
        const dockerList = data.map((item) => {
          return {
            label: `${item.ram}M${this.$t('device.ram')}/${item.disk}G${this.$t(
              'device.disk',
            )}`,
            value: item.name,
          };
        });

        this.vmFlavorOptions = [...list];
        this.dockerFlavorOptions = [...dockerList];

        //虚拟类型为虚拟机,资源大小默认选中第一个
        if (!this.id) {
          this.model.ext_vm.flavor = this.vmFlavorOptions[0]?.value;
          this.model.ext_vm.cpu = data[0]?.cpu;
          this.model.ext_vm.ram = data[0]?.ram;
          this.model.ext_vm.disk = data[0]?.disk;
        }
      });
    },

    // 获取cpu,ram,disk
    getFlavorMessage(select) {
      let list = this.vmFlavorOptionsCopy;
      list.forEach((item) => {
        if (item.name === select) {
          this.model.ext_vm.cpu = item.cpu;
          this.model.ext_vm.ram = item.ram;
          this.model.ext_vm.disk = item.disk;
        }
      });
    },

    getDynamicFlavorMessage(select) {
      this.model.ext_vm.cpu = '';
      this.model.ext_vm.ram = '';
      this.model.ext_vm.disk = '';
    },
    // 获取容器内存磁盘
    getDockerFlavorMessage(select) {
      let list = this.vmFlavorOptionsCopy;
      list.forEach((item) => {
        if (item.name === select) {
          // this.model.ext_docker.cpu = item.cpu;
          this.model.ext_docker.ram = item.ram;
          this.model.ext_docker.disk = item.disk;
        }
      });
    },

    // 获取磁盘格式
    getDiskFormatList() {
      getDiskFormat().then((res) => {
        const data = _.get(res, 'data.data.disk_format', []) || [];
        const diskFormatOptions = this.listMap(data);
        this.diskFormatOptions = [...diskFormatOptions];
        this.diskFormatOptionsCopy = [...diskFormatOptions];
      });
    },

    // select接口值转化
    listMap(data) {
      const list = data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      return list;
    },

    // 高级选项select接口值转化
    listMap2(data) {
      const list = data.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
      return list;
    },

    // 获取提示语中的ip
    getFtpInfo() {
      getFtpIp().then((res) => {
        let ip = _.get(res, 'data.data', '') || '';
        this.ftpIp = ip;
      });
    },

    // 选择默认图标
    selectDefaultLogo(item) {
      this.model.logo = item.name;
      if (this.logoList.length > 0) {
        this.logoList[0].name = item.name;
        this.logoList[0].url = item.url;
      } else {
        this.logoList.push({
          name: item.name,
          url: item.url,
        });
      }
    },

    // 删除图标
    deleteLogo() {
      this.model.logo = null;
      this.logoList = [];
    },

    // 自定义上传图标
    uploadFunc(file) {
      const formData = new FormData();
      formData.append('file', file);
      uploadLogo(formData)
        .then((res) => {
          const data = _.get(res, 'data.data', '') || {};
          this.model.logo = data.http_url;
        })
        .catch((error) => {
          this.$serverError(error);
        });
    },

    // 设备类型变化
    categoryChange(value) {
      if (value[0] === 1) {
        // 操作系统
        this.model.category = value[0];
        this.model.second_category = value[1];
        this.model.third_category = value[2];
      } else {
        this.model.category = value[0];
        this.model.second_category = value[1];
        this.model.third_category = '';
      }
    },

    // 系统信息变化
    systemTypeChange(value) {
      this.model.ext_system_info.parent_system_type = value[0];
      this.model.ext_system_info.system_type = value[1];
      //系统信息改变时清空基础镜像，需要重新选择相匹配的基础镜像
      this.model.ext_image_info.base_image_name = null;
      // USB 设备清空系统位数和语言
      if (this.systemTypeSet[1] === 403) {
        this.model.ext_system_info.system_architecture = null;
        this.model.ext_system_info.language = null;
      }
    },

    // 系统镜像上传
    uploadFileFunc(file) {
      /* this.model.image_file = file; */
      this.showProgress = true;
      this.image_file_name = file.name;
      const formData = new FormData();
      formData.append('file', file);
      this.$request
        .post(`/devops/cluster/images/custom/upload`, formData, {
          baseURL: '/api/mp',
          onUploadProgress: (progressEvent) => {
            let processStatus =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            this.process = processStatus;
          },
        })
        .then((res) => {
          const data = _.get(res, 'data.data', '') || null;
          this.model.ext_image_info.user_filename = data.file_names[0];
          this.model.ext_image_info.tmpdir_uuid = data.tmpdir_uuid;
          this.showProgress = false;
          this.process = 0;
        })
        .catch((error) => {
          this.$serverError(error);
          this.showProgress = false;
          this.process = 0;
        });
    },

    deleteFile() {
      this.model.image_file = null;
      this.image_file_name = '';
    },

    // iso分片上传
    uploadIsoFileFuncChunk(file) {
      this.chunksUpload(file);
    },
    /**
     * @description: 上传文件
     * @param {*} file 文件
     * @returns {Object} 包含成功的文件地址、名称等
     */
    async chunksUpload(file) {
      this.showProgress = true;
      this.chunks = [];
      // step1 获取文件切片
      const initChunks = createFileChunk(file);
      // step2 获取文件 md5 值
      // const md5 = await calculateFileMd5ByDefaultChunkSize(initChunks[initChunks.length - 1]);
      const md5 = uuidv4();
      // step3 获取文件的上传状态
      const { uploaded, url, code } = await checkMd5(md5, file);
      if (uploaded) {
        // step4 如果上传成功
        this.process = 100;
        // step5 拿到结果
        return url;
      }
      if (!uploaded && code === 500) {
        return;
      }
      // step4 如果文件未传成功，执行切片上传
      for (let index = 0; index < initChunks.length; index++) {
        let data = await PostFile(file, index + 1, md5, this);
        this.process = ((data.num / initChunks.length) * 100).toFixed(0);
        // 过滤掉已上传的切片
        if (data.num == initChunks.length) {
          const res = await mergeFile(
            initChunks.length,
            file.name,
            md5,
            getFileType(file.name),
            file.size,
          );
          const data = _.get(res, 'data.data', '') || null;
          this.showProgress = false;
          this.process = 0;
          this.model.ext_vm.iso_attach = true;
          this.model.ext_vm.iso_attach_filename = data.file_name;
          this.model.ext_vm.iso_tmpdir_uuid = data.tmpdir_uuid;
          this.isoFileList = [
            {
              resource_id: data.tmpdir_uuid,
              name: data.file_name,
              isDownload: true,
            },
          ];
        }
      }
    },
    // // iso文件上传
    // uploadIsoFileFunc(file) {
    //   // let reg = /^[A-Za-z0-9.\-_]+$/;
    //   // if (file.name.indexOf(' ') >= 0 || !reg.test(file.name)) {
    //   //   this.$message.error(this.$t('device.fileNameError'));
    //   //   setTimeout(() => {
    //   //     this.isoFileList = [];
    //   //   }, 100);
    //   // } else {
    //   this.showProgress = true;
    //   this.image_file_name = file.name;
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   this.$request
    //     .post(`/devops/cluster/images/file/upload/iso`, formData, {
    //       baseURL: '/api/mp',
    //       onUploadProgress: (progressEvent) => {
    //         let processStatus =
    //           ((progressEvent.loaded / progressEvent.total) * 100) | 0;
    //         this.process = processStatus;
    //       },
    //     })
    //     .then((res) => {
    //       const data = _.get(res, 'data.data', '') || null;
    //       this.showProgress = false;
    //       this.process = 0;
    //       this.model.ext_vm.iso_attach = true;
    //       this.model.ext_vm.iso_attach_filename = data.file_name;
    //       this.model.ext_vm.iso_tmpdir_uuid = data.tmpdir_uuid;
    //     })
    //     .catch((error) => {
    //       this.$serverError(error);
    //       this.showProgress = false;
    //       this.process = 0;
    //     });
    //   // }
    // },

    deleteIsoFile(item) {
      this.$request
        .delete(
          `/devops/cluster/images/file/delete/iso`,
          {
            file_name: this.model.ext_vm.iso_attach_filename,
            tmpdir_uuid: this.model.ext_vm.iso_tmpdir_uuid,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          this.isoFileList = [];
          this.model.ext_vm.iso_attach = false;
          this.model.ext_vm.iso_attach_filename = '';
          this.model.ext_vm.iso_tmpdir_uuid = '';
        })
        .catch((error) => {});
    },
    downloadIsoFile(file) {
      this.$request
        .get(
          `devops/cluster/images/file/download/iso`,
          {
            fileName: file.name,
            tmpdirUuid: file.resource_id,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          const data = _.get(res, 'data.data', '');
          const link = document.createElement('a');
          link.href = data;
          link.target = '_blank';
          link.click();
        })
        .catch((error) => {});
    },
    // 提交表单
    fetchForm() {
      const submitData = _.cloneDeep(this.model);
      /* 接入协议数据处理：将console或COM协议对象合并到接口参数access_protocol_list */
      let accessList = [];
      let accessConsoleList = {};
      accessList = submitData.access_protocol_list;
      accessConsoleList = submitData.access_console_config;
      if (Object.keys(accessConsoleList).length) {
        accessList.push(accessConsoleList);
      }
      delete submitData.access_console_config;

      // 如果是dynamic类型，需要转换下access_protocol_list
      if (submitData.image_type === 'dynamips') {
        if (this.checkTelnet) {
          submitData.access_protocol_list = [
            {
              protocol: 'telnet',
            },
          ];
        } else {
          submitData.access_protocol_list = [];
        }
      }
      /* access_protocol_list接入方式及端口必填校验 */
      if (this.model.image_type !== 'dynamips') {
        const accessProtocolList = this.model.access_protocol_list;
        for (let i = 0, len = accessProtocolList.length; i < len; i++) {
          if (!(accessProtocolList[i].protocol && accessProtocolList[i].port)) {
            this.$message.error(this.$t('device.accessPortMessageTip'));
            return false;
          }
        }
      }
      // 端口信息直接接入数据处理
      let consoleList = _.cloneDeep(submitData.console_config);
      if (Object.keys(consoleList).length) {
        submitData.ext_gateway.console_config = consoleList;
      } else {
        submitData.ext_gateway.console_config = {};
      }
      delete submitData.console_config;

      /* 端口信息Wlan口必填校验 */
      const portConfigs = this.model.ext_gateway.port_configs;
      for (let i = 0, len = portConfigs.length; i < len; i++) {
        if (!portConfigs[i].port_type && !portConfigs[i].port_name) {
          this.$message.error(this.$t('device.portMessageTip'));
          return false;
        }
      }

      if (submitData.image_type === 'vm') {
        submitData.ext_docker = null;
      } else if (submitData.image_type === 'container') {
        submitData.ext_vm = null;
      }

      // 编辑
      if (this.id) {
        submitData.uuid = this.id;
        return editImage(submitData).then((res) => {
          this.cancel();
        });
      } else {
        return addImage(submitData).then((res) => {
          this.cancel();
        });
      }
    },

    submitForm() {
      const submitData = _.cloneDeep(this.model);
      // 处理dynamips 内存和硬盘、NVRAM
      if (
        submitData.image_type === 'dynamips' &&
        submitData?.ext_vm?.ext_info?.ext_dynamips?.platform
      ) {
        const platform = submitData?.ext_vm?.ext_info?.ext_dynamips?.platform;
        const dynamicNVRAM = this.vmDynamipsSizeOptions[platform];
        this.model.ext_vm.ext_info.ext_dynamips.flavor.nvram =
          dynamicNVRAM.nvram;
        this.model.ext_vm.ext_info.ext_dynamips.flavor.ram = dynamicNVRAM.ram;
      }
      let nameValidateList = this.rules.name;
      if (submitData.image_type === 'container') {
        nameValidateList.push(this.validateName);
      } else {
        for (let i = 0, len = nameValidateList.length; i < len; i++) {
          if (nameValidateList[i]?.container) {
            nameValidateList.splice(i, 1);
            break;
          }
        }
      }
      //参数校验通过则遮罩层开启
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.loading = true;
        }
      });
      this.$refs.formRef
        .submit()
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    cancel() {
      this.$router.push({ name: 'image-manage' });
    },
    // 端口信息数据
    getPortList(data, consoleData) {
      this.model.ext_gateway.port_configs = data;
      this.model.console_config = consoleData;
    },
    // 接入方式
    getProtocolList(data, consoleData) {
      this.model.access_protocol_list = data;
      this.model.access_console_config = consoleData;
    },
    // 选择基础镜像
    basicImageEvent() {
      const { system_type, system_architecture, language } =
        this.model.ext_system_info;
      this.basicQuery = {
        system_type,
        system_architecture,
        language,
        base_image_support: true,
        image_type: this.model.image_type,
      };
      this.$refs.basicImageDialog.visibleDialog = true;
    },
    // 获取基础镜像名称
    getBasicImage(data) {
      if (data.length > 0) {
        this.model.ext_image_info.base_image_name = data[0].name;
      }
    },

    // 角色决定可选的设备类型
    categoryOptionsDisabled(value) {
      const categoryOptions = _.cloneDeep(this.categoryOptionsCopy);
      // 角色是终端
      if (value === 4) {
        categoryOptions.forEach((item) => {
          if (item.id === 3 || item.id === 5) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
        // 网关节点的三种类型
      } else if (value === 6) {
        this.setChildrenDisabled(categoryOptions, true);
        // 外部网络
      } else if (value === 3) {
        this.setChildrenDisabled(categoryOptions, false);
      }
      this.categoryOptions = categoryOptions;
    },

    setChildrenDisabled(categoryOptions, boolValue) {
      categoryOptions.forEach((item) => {
        if (item.id !== 3) {
          item.disabled = true;
        } else {
          item.disabled = false;
          let children = item.children;
          children.forEach((item2) => {
            if (boolValue) {
              item2.disabled = true;
              if (item2.id === 53) {
                item2.disabled = true;
              }
              if (this.model.role === 21) {
                if (item2.id === 51) {
                  item2.disabled = false;
                }
              } else if (this.model.role === 22) {
                if (item2.id === 50) {
                  item2.disabled = false;
                }
              } else if (this.model.role === 23) {
                if (item2.id === 52) {
                  item2.disabled = false;
                }
              }
            } else {
              if (item2.id !== 53) {
                item2.disabled = true;
              }
            }
          });
        }
      });
    },

    // 角色切换
    roleChange(value) {
      this.categorySet = [];
      this.model.category = '';
      this.model.second_category = '';
      this.model.third_category = '';
      // 角色是网关时，切换不同网关，清空端口信息
      if (value.length > 1) {
        this.model.ext_gateway.port_configs = [];
        let consoleObj = this.model.console_config;
        for (let key in consoleObj) {
          consoleObj[key] = '';
        }
      }
    },

    // 虚拟类型切换
    imageTypeChange(value) {
      let nameValidateList = this.rules.name;
      // 虚拟类型是 容器 时，默认选中'自定义上传'，但是也还可以切换别的选项
      if (value === 'container') {
        this.dockerFlavorShow = true;
        this.model.ext_docker.flavor = this.dockerFlavorOptions[0]?.value;
        let list = this.vmFlavorOptionsCopy;
        list.forEach((item) => {
          if (item.name === this.dockerFlavorOptions[0].value) {
            // this.model.ext_docker.cpu = item.cpu;
            this.model.ext_docker.ram = item.ram;
            this.model.ext_docker.disk = item.disk;
          }
        });
        this.model.ext_image_info.image_source = 3;
        this.systemImageTypeOptions = SYSTEMIMAGETYPEOPTIONS;
        // 容器时需要校验镜像的name
        nameValidateList.push(this.validateName);
      } else if (value === 'dynamips') {
        this.dockerFlavorShow = false;
        this.model.ext_vm.ext_info.ext_dynamips.platform =
          this.vmDynamipsOptions[0]?.value;
        this.model.ext_gateway.port_configs = [];
        this.model.ext_gateway.console_config = null;
        this.model.ext_image_info.image_source = 1;
        this.systemImageTypeOptions = SYSTEMIMAGETYPEOPTIONSDYANIMPS;
        // this.model.ext_image_info.image_source = nul;
      } else {
        this.dockerFlavorShow = false;
        this.model.ext_vm.flavor = this.vmFlavorOptions[0]?.value;
        this.model.ext_image_info.image_source = 1;
        this.systemImageTypeOptions = SYSTEMIMAGETYPEOPTIONS;
        for (let i = 0, len = nameValidateList.length; i < len; i++) {
          if (nameValidateList[i]?.container) {
            nameValidateList.splice(i, 1);
            break;
          }
        }
      }
      if (value === 'vm') {
        this.model.ext_image_info.disk_format = null;
      } else if (value === 'container') {
        this.model.ext_image_info.disk_format = null;
      }
      if (value === 'dynamips') {
        this.vmDynamipsShow = true;
        this.setSystemTypeOptionsDisabled(true);
        this.supportQuickClout = false;
        this.quick_create_support = false;
        // dynamips 系统信息只能选择other-IOS
        this.model.ext_system_info.parent_system_type = '';
        this.model.ext_system_info.system_type = '';
        this.systemTypeSet = [];
        this.model.ext_image_info.disk_format = '';
      } else {
        this.vmDynamipsShow = false;
        this.setSystemTypeOptionsDisabled(false);
        this.supportQuickClout = true;
        this.quick_create_support = false;
      }
    },
    // 设置系统信息禁止选择
    setSystemTypeOptionsDisabled(val) {
      const systemTypeOptions = _.cloneDeep(this.systemTypeOptionsCopy);
      if (val) {
        systemTypeOptions.forEach((item) => {
          if (item.id !== 5) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
          item.children.forEach((itm) => {
            if (itm.id !== 401) {
              itm.disabled = true;
            } else {
              itm.disabled = false;
            }
          });
        });
      }
      this.systemTypeOptions = systemTypeOptions;
    },
    // 系统镜像切换
    imageSourceChange(value) {
      if (value === 3) {
        this.model.ext_image_info.upload_type = 'http';
        if (this.model.image_type === 'dynamips') {
          this.model.ext_image_info.disk_format = 'dynamips';
        }
      }
    },
    // 系统镜像的 协议切换
    uploadTypeChange(value) {
      if (value === 'http') {
        this.model.ext_image_info.ftp_filename = '';
      } else {
        this.model.ext_image_info.tmpdir_uuid = '';
        this.model.ext_image_info.user_filename = '';
      }
    },

    // 设置表单项
    setformItemShow(arr) {
      this.vmFlavorShow = arr[0]; // 资源大小是否显示
      this.portMessageShow = arr[1]; //端口信息
      this.accessWayShow = arr[2]; // 接入方式
      this.systemShow = arr[3]; //系统信息
      this.systemImageShow = arr[4]; //系统镜像
      this.supportQuickClout = arr[5]; // 支持快速构建、支持Cloud-init是否显示
      this.telnetDynamicShow = arr[6]; //dynamips 接入方式是否显示
    },

    // 清空model属性的值
    emptyPropValue(type) {
      let model = this.model;
      if (type === 1) {
        /* 角色是外部网络，清空设备类型以下所有表单元素的值，包括虚拟类型image_type字段 */
        /* 虚拟类型是简易型 清空设备类型、虚拟类型下的所有表单元素的值*/
        for (let key in model) {
          if (
            Object.prototype.toString.call(model[key]) === '[object Object]'
          ) {
            for (let innerKey in model[key]) {
              if (Array.isArray(model[key][innerKey])) {
                model[key][innerKey] = [];
              } else {
                if (
                  Object.prototype.toString.call(model[key][innerKey]) ===
                  '[object Object]'
                ) {
                  for (let deepInnerKey in model[key][innerKey]) {
                    model[key][innerKey][deepInnerKey] = '';
                  }
                } else {
                  model[key][innerKey] = null;
                }
              }
            }
          } else if (
            Object.prototype.toString.call(model[key]) === '[object Array]'
          ) {
            model[key] = [];
          }
        }
        /* 角色是外部网络 */
        if (this.model.role === 3) {
          this.model.image_type = '';
        }
      } else if (type === 2) {
        // 角色是终端节点时，清空端口信息
        for (let key in this.model.console_config) {
          this.model.console_config[key] = '';
        }
        this.model.access_protocol_list = [];
        this.model.ext_gateway.port_configs = [];
        this.model.ext_vm.ext_info.ext_dynamips.platform = '';
        this.model.ext_vm.ext_info.ext_dynamips.flavor.nvram = null;
        this.model.ext_vm.ext_info.ext_dynamips.flavor.ram = null;
      } else if (type === 7) {
        // 角色是网关时 清空接入信息
        this.model.access_protocol_list = [];
        this.model.access_console_config = {};
        this.model.ext_vm.ext_info.ext_dynamips.platform = '';
        this.model.ext_vm.ext_info.ext_dynamips.flavor.nvram = null;
        this.model.ext_vm.ext_info.ext_dynamips.flavor.ram = null;
      } else if (type === 3) {
        // 角色是网关或者终端节点，虚拟类型是容器时，清空资源大小
        for (let key in this.model.ext_vm) {
          if (key === 'iso_tmpdir_uuid') {
            this.model.ext_vm.iso_tmpdir_uuid = '';
          }
          if (key === 'ext_info') {
            this.model.ext_vm.ext_info.ext_dynamips.platform = '';
            this.model.ext_vm.ext_info.ext_dynamips.flavor.nvram = null;
            this.model.ext_vm.ext_info.ext_dynamips.flavor.ram = null;
          }
          if (key !== 'ext_info' && key !== 'iso_tmpdir_uuid') {
            this.model.ext_vm[key] = null;
          }
        }
        this.model.ext_vm.quick_create_support = false;
        // this.model.ext_vm.init_support = false;
        this.model.ext_vm.ext_info.ext_dynamips.platform = '';
        this.model.ext_vm.ext_info.ext_dynamips.flavor.nvram = null;
        this.model.ext_vm.ext_info.ext_dynamips.flavor.ram = null;
      } else if (type === 4) {
        // 系统镜像是 基础镜像
        let ext_image_info = this.model.ext_image_info;
        for (let key in ext_image_info) {
          if (
            key !== 'image_source' &&
            key !== 'base_image_name' &&
            key !== 'meta_data'
          ) {
            ext_image_info[key] = null;
          }
        }
      } else if (type === 5) {
        // 系统镜像是 CP-Cloud
        let ext_image_info = this.model.ext_image_info;
        for (let key in ext_image_info) {
          if (key !== 'image_source' && key !== 'meta_data') {
            ext_image_info[key] = null;
          }
        }
      } else if (type === 6) {
        // 系统镜像是 自定义上传 时, 清空 base_image_name
        let ext_image_info = this.model.ext_image_info;
        for (let key in ext_image_info) {
          if (key === 'base_image_name') {
            ext_image_info[key] = null;
          }
        }
      }
    },
    // 虚拟机-自定义上传-高级选项-启动选择
    getStartupSelectionOptions() {
      getFirmwareType().then((res) => {
        this.startupSelectionOptions =
          res.data?.data?.map((item) => {
            return {
              label: item,
              value: item,
            };
          }) || [];
      });
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
.hint,
.el-tag--danger {
  color: var(--red-color);
  font-size: 14px;
}
.el-tag--danger {
  padding-left: 120px;
}
.image-file-name {
  margin-left: 10px;
  color: var(--primary-color);
}
.image-item {
  width: 60px;
  height: 60px;
  padding: 10px;
}
.form-item-width {
  width: 240px !important;
}
.form-item-width-mr8 {
  margin-right: 8px;
}
.form-item-group-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  &.advanced {
    margin-top: 16px;
  }
}
.container-form-item-group {
  display: flex;
}
.env-tip {
  color: var(--red-color);
  font-size: 14px;
  margin-top: 6px;
  line-height: 18px;
}

// 选择默认图标
.select-default-panel {
  border: 1px solid var(--neutral3);
  .title {
    color: var(--neutral8);
    font-size: 14px;
  }
}
.host-config-ex-str-box {
  display: flex;
  align-items: center;
  .help-icon {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
