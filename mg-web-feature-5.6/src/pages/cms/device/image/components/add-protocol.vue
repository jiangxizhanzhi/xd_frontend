<template>
  <div class="add-item-group">
    <cb-tabs>
      <cb-tab-pane :label="$t('device.protocolAccess')">
        <cb-row v-if="model.length > 0">
          <div class="protocol-content" v-for="item in model" :key="item.id">
            <div class="protocol-content-bg">
              <cb-select
                class="protocol-item-width"
                v-model="item.protocol"
                :options="protocolList"
                @change="protocolChange(item)"
              >
              </cb-select>
              <!-- 端口 -->
              <cb-input
                class="protocol-item-width"
                type="text"
                :value="item.port"
                :placeholder="$t('device.port')"
                @input="portChange(item, $event)"
              ></cb-input>
              <!-- 用户名 -->
              <cb-input
                class="protocol-item-width160"
                type="text"
                v-model="item.username"
                :placeholder="$t('device.username')"
              ></cb-input>
              <!-- 密码密钥开关 SSH协议才显示-->
              <cb-switch
                class="protocol-item-width160"
                style="margin: 9px 8px 0 14px"
                v-show="item.isSSH"
                v-model="item.private_key_enable"
                :active-text="$t('device.sshKey')"
                :inactive-text="$t('device.sshPassword')"
                @change="keyValueChange($event, item.id)"
              >
              </cb-switch>
              <!-- 密钥上传 SSH协议才显示-->
              <div v-show="item.isSSH && item.private_key_enable">
                <div class="upload-btn-tip-group">
                  <cb-upload-file
                    type="file"
                    :showFileList="false"
                    :fetch-promise="
                      (file) => {
                        uploadEncryption(file, item.id);
                      }
                    "
                    accept=".txt"
                  ></cb-upload-file>
                  <span class="upload-tip">{{ $t('device.uploadTxt') }}</span>
                </div>
                <div
                  v-if="item.private_key_path"
                  class="upload-filename-delete"
                >
                  <span class="upload-filename">{{
                    item.private_key_file_name
                  }}</span>
                  <cb-button
                    type="text"
                    style="margin-right: 10px"
                    @click="downLoadFile(item.private_key_path)"
                  >
                    {{ $t('device.download') }}
                  </cb-button>
                  <cb-button
                    @click="deleteEncryptionFile(item.id)"
                    type="text"
                    color-type="red"
                    >{{ $t('device.delete') }}</cb-button
                  >
                </div>
              </div>
              <!-- 密码、附加信息 不是SSH协议或者密码时显示-->
              <div
                v-show="!item.isSSH || !item.private_key_enable"
                class="protocol-item-group-flex"
              >
                <cb-input
                  class="protocol-item-width160"
                  type="text"
                  v-model="item.password"
                  :placeholder="$t('device.password')"
                ></cb-input>
                <cb-input
                  class="protocol-item-width294"
                  type="text"
                  v-model="item.description"
                  :placeholder="$t('device.additionalInformation')"
                ></cb-input>
              </div>
              <!-- 仅管理员接入选择 -->
              <div v-show="item.isSSH || item.isRDP" class="admin-checkbox">
                <cb-checkbox v-model="item.manage_mode">
                  {{ $t('device.onlyAdmin') }}</cb-checkbox
                >
              </div>
            </div>
            <div class="protocol-item-delete-btn">
              <cb-iconfont
                size="18"
                class="icon"
                type="icon-jianshao"
                @click="deleteItem(item.id)"
              ></cb-iconfont>
            </div>
          </div>
        </cb-row>
        <cb-row :class="['icon-left', { center: model.length > 0 }]">
          <cb-iconfont
            size="18"
            class="icon"
            type="icon-xinzeng"
            @click="addItem()"
          ></cb-iconfont>
        </cb-row>
      </cb-tab-pane>
      <!-- 直接接入下拉框console,COM -->
      <cb-tab-pane :label="$t('device.directAccess')">
        <div v-show="consoleKeys" class="port-item-bg">
          <!-- <cb-input
            class="protocol-item-width200"
            disabled
            type="text"
            value="console"
          ></cb-input> -->
          <!-- 终端节点的直接接入 -->
          <cb-select
            class="protocol-item-width200"
            type="text"
            v-model="model_console.protocol"
            :options="directList"
          >
          </cb-select>
          <cb-input
            class="protocol-item-width200"
            type="text"
            v-model="model_console.username"
            :placeholder="$t('device.username')"
          ></cb-input>
          <cb-input
            class="protocol-item-width200"
            type="text"
            v-model="model_console.password"
            :placeholder="$t('device.password')"
          ></cb-input>
          <cb-input
            class="protocol-item-width200"
            type="text"
            v-model="model_console.description"
            :placeholder="$t('device.additionalInformation')"
          ></cb-input>
          <!-- 仅管理员接入选择 -->
          <div class="admin-checkbox">
            <cb-checkbox v-model="model_console.manage_mode">
              {{ $t('device.onlyAdmin') }}</cb-checkbox
            >
          </div>
          <div class="protocol-item-delete-btn">
            <cb-iconfont
              size="18"
              class="icon"
              type="icon-jianshao"
              @click="deleteConsoleItem"
            ></cb-iconfont>
          </div>
        </div>
        <cb-row class="icon-left">
          <cb-iconfont
            v-show="!consoleKeys"
            size="18"
            class="icon"
            type="icon-xinzeng"
            @click="addConsoleItem()"
          ></cb-iconfont>
        </cb-row>
      </cb-tab-pane>
    </cb-tabs>
  </div>
</template>

<script>
import _ from 'lodash';
import { PROTOCOLLISTPORT, DIRECTLISTPORT } from '../constant';
import { encryptionUpload } from '@/api/device/image';
export default {
  name: 'AddProtocol', // 和接入方式待合并，判断表单项
  props: {
    accessProtocolList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    accessConsoleConfig: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      protocolList: PROTOCOLLISTPORT,
      directList: DIRECTLISTPORT,
    };
  },

  computed: {
    model: {
      get() {
        return this.accessProtocolList;
      },
      set(val) {
        this.$emit('update:accessProtocolList', val);
      },
    },
    model_console: {
      get() {
        return this.accessConsoleConfig;
      },
      set(val) {
        this.$emit('update:accessConsoleConfig', val);
      },
    },
    // 判断model_console是否是空对象
    consoleKeys() {
      let keys = Object.keys(this.model_console);
      if (keys.length) return true;
      return false;
    },
  },

  methods: {
    // 删除端口协议
    deleteItem(id) {
      const modelList = this.model;
      modelList.forEach((item, i) => {
        if (item.id === id) {
          modelList.splice(i, 1);
        }
      });
      this.model = modelList;
      this.$emit('setProtocolList', this.model, this.model_console);
    },

    // 添加端口协议
    addItem() {
      const modelList = this.model;
      modelList.push({
        id: new Date().getTime() + Math.random() * 100,
        protocol: '',
        port: '',
        username: '',
        password: '',
        hostname: '',
        auth_protocol: '',
        description: '',
        private_key_enable: false,
        private_key_path: '',
        private_key_file_name: '',
        isSSH: false,
        isRDP: false,
        // 管理员接入
        manage_mode: false,
      });
      this.model = modelList;
      this.$emit('setProtocolList', this.model, this.model_console);
    },

    // 协议变化
    protocolChange(item) {
      // 不同的协议，有默认的端口
      if (item.protocol === 'ssh') {
        item.port = '22';
        item.isSSH = true;
      } else {
        /* 其他协议要清空字段 */
        item.isSSH = false;
        item.private_key_path = '';
        item.private_key_file_name = '';
        if (item.protocol === 'rdp') {
          item.isRDP = true;
          item.port = '3389';
        } else {
          item.isRDP = false;
          if (item.protocol === 'https') {
            item.port = '443';
          } else if (item.protocol === 'nc') {
            item.port = '9999';
          } else if (item.protocol === 'http') {
            item.port = '80';
          } else if (item.protocol === 'telnet') {
            item.port = '23';
          }
        }
      }
    },

    // 端口值变化
    portChange(item, value) {
      if (/^[0-9]*$/.test(value)) {
        item.port = value;
      } else {
        item.port = value.replace(/[^0-9]/gi, '');
      }
    },

    // 密钥密码切换, 清空字段
    keyValueChange(value, id) {
      if (value) {
        const modelList = this.model;
        for (let i = 0, len = modelList.length; i < len; i++) {
          if (modelList[i].id === id) {
            modelList[i].username = '';
            modelList[i].password = '';
            modelList[i].description = '';
            break;
          }
        }
        this.model = modelList;
        this.$emit('setPortList', this.model, this.model_console);
      } else {
        const modelList = this.model;
        for (let i = 0, len = modelList.length; i < len; i++) {
          if (modelList[i].id === id) {
            modelList[i].private_key_path = '';
            modelList[i].private_key_file_name = '';
            break;
          }
        }
        this.model = modelList;
        this.$emit('setPortList', this.model, this.model_console);
      }
    },

    //上传密钥
    uploadEncryption(file, id) {
      const formData = new FormData();
      formData.append('file', file);
      encryptionUpload(formData).then((res) => {
        const data = _.get(res, 'data.data', {}) || {};
        const modelList = this.model;
        for (let i = 0, len = modelList.length; i < len; i++) {
          if (modelList[i].id === id) {
            modelList[i].private_key_path = data.file_path;
            modelList[i].private_key_file_name = data.file_name;
            break;
          }
        }
        this.model = modelList;
        this.$emit('setPortList', this.model, this.model_console);
      });
    },

    // 下载密钥
    downLoadFile(path, done) {
      this.$request
        .binaryDownload(
          'get',
          '/devops/cluster/images/file/download/ssh',
          {
            filePath: path,
          },
          {
            baseURL: '/api/mp',
          },
        )
        .then((res) => {
          done();
        })
        .catch(() => {
          done();
        });
    },
    // 删除密钥
    deleteEncryptionFile(id) {
      const modelList = this.model;
      for (let i = 0, len = modelList.length; i < len; i++) {
        if (modelList[i].id === id) {
          modelList[i].private_key_path = '';
          modelList[i].private_key_file_name = '';
          break;
        }
      }
      this.model = modelList;
      this.$emit('setPortList', this.model, this.model_console);
    },

    // 新增console
    addConsoleItem() {
      this.model_console = {
        protocol: '',
        port: '',
        username: '',
        password: '',
        hostname: '',
        auth_protocol: '',
        description: '',
        manage_mode: false,
      };
    },
    deleteConsoleItem() {
      this.model_console = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.add-item-group {
  background-color: var(--neutral0);
  padding: 2px 16px 16px;
  .protocol-content {
    display: flex;
  }
  .protocol-content-bg {
    display: flex;
    flex: none;
    padding: 12px 16px;
    margin-bottom: 8px;
    background-color: var(--bg-color-2);
    ::v-deep .el-col {
      margin-right: 10px;
    }
  }
  .icon {
    font-size: 30px;
    cursor: pointer;
  }
  .icon-left {
    text-align: left;
  }
  .center {
    text-align: center;
  }
  .port-item-bg {
    display: flex;
    flex-direction: row;
    padding: 8px;
    margin-bottom: 15px;
    background-color: var(--bg-color-2);
  }
  .upload-btn-tip-group {
    display: flex;
    height: 40px;
    .upload-tip {
      margin-left: 10px;
      color: var(--neutral5);
    }
  }
  .upload-filename-delete {
    display: flex;
    .upload-filename {
      color: var(--white-color);
      margin-right: 5px;
    }
  }
  .protocol-item-width {
    width: 120px !important;
    margin-right: 8px;
  }
  .protocol-item-width160 {
    width: 160px !important;
    margin-right: 8px;
  }
  .protocol-item-width294 {
    width: 294px !important;
    margin-right: 8px;
  }
  .protocol-item-width200 {
    width: 200px !important;
    margin-right: 8px;
  }
  .protocol-item-group-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .protocol-item-delete-btn {
    margin-left: 16px;
    display: flex;
    align-items: center;
  }
  .admin-checkbox {
    margin-left: 16px;
    display: flex;
    align-items: center;
  }
}
</style>
