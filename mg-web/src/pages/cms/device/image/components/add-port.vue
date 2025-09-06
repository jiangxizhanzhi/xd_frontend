<template>
  <div class="add-item-group">
    <cb-tabs>
      <cb-tab-pane :label="$t('device.protocolAccess')">
        <cb-row v-if="model.length > 0">
          <div class="port-item-bg" v-for="item in model" :key="item.id">
            <cb-row style="margin-bottom: 12px; display: flex">
              <cb-col :span="7" class="port-item-col-mr8">
                <cb-select
                  style="width: 100%"
                  :disabled="item.disabled"
                  v-model="item.port_type"
                  :options="portTypeList"
                >
                </cb-select>
              </cb-col>
              <cb-col :span="7" class="port-item-col-mr8">
                <cb-input
                  type="text"
                  v-model="item.port_name"
                  :placeholder="$t('device.portName')"
                ></cb-input>
              </cb-col>
              <cb-col :span="7" class="port-item-col-mr8">
                <cb-input
                  type="text"
                  v-model="item.port_ips"
                  :placeholder="$t('device.portCidr')"
                ></cb-input>
              </cb-col>
              <div class="port-item-delete-add-btn">
                <cb-iconfont
                  size="18"
                  class="icon"
                  type="icon-jianshao"
                  @click="deleteItem(item.id)"
                ></cb-iconfont>
                <cb-iconfont
                  size="18"
                  class="icon"
                  type="icon-xinzeng"
                  @click="addItem()"
                ></cb-iconfont>
              </div>
            </cb-row>
            <div
              v-for="item2 in item.access_protocols"
              :key="item2.id"
              class="protocol-item-group"
            >
              <!-- 协议 -->
              <cb-select
                class="protocol-item-width120"
                v-model="item2.protocol"
                :options="protocolList"
                @change="protocolChange(item2)"
              >
              </cb-select>
              <!-- 端口 -->
              <cb-input
                class="protocol-item-width120"
                v-show="item2.protocol !== 'console'"
                type="text"
                :value="item2.port"
                :placeholder="$t('device.port')"
                @input="portChange(item2, $event)"
              ></cb-input>
              <!-- 用户 -->
              <cb-input
                class="protocol-item-width160"
                type="text"
                v-model="item2.username"
                :placeholder="$t('device.username')"
              ></cb-input>
              <!-- 密码密钥开关 SSH协议才显示-->
              <cb-switch
                class="protocol-item-width160"
                style="margin: 9px 8px 0 14px"
                v-show="item2.isSSH"
                v-model="item2.private_key_enable"
                :active-text="$t('device.sshKey')"
                :inactive-text="$t('device.sshPassword')"
                @change="keyValueChange($event, item.id, item2.id)"
              >
              </cb-switch>
              <!-- 密钥上传 SSH协议才显示-->
              <div v-show="item2.isSSH && item2.private_key_enable">
                <div class="upload-btn-tip-group">
                  <cb-upload-file
                    type="file"
                    :showFileList="false"
                    :fetch-promise="
                      (file) => {
                        uploadEncryption(file, item.id, item2.id);
                      }
                    "
                    accept=".txt"
                  ></cb-upload-file>
                  <span class="upload-tip">{{ $t('device.uploadTxt') }}</span>
                </div>
                <div
                  v-if="item2.private_key_path"
                  class="upload-filename-delete"
                >
                  <span class="upload-filename">{{
                    item2.private_key_file_name
                  }}</span>
                  <cb-button
                    type="text"
                    style="margin-right: 10px"
                    @click="downLoadFile(item2.private_key_path, $event)"
                  >
                    {{ $t('device.download') }}
                  </cb-button>
                  <cb-button
                    @click="deleteEncryptionFile(item.id, item2.id)"
                    type="text"
                    color-type="red"
                    >{{ $t('device.delete') }}</cb-button
                  >
                </div>
              </div>
              <!-- 密码、附加信息 不是SSH协议或者密码时显示-->
              <div
                v-show="!item2.isSSH || !item2.private_key_enable"
                class="protocol-item-group-flex"
              >
                <cb-input
                  class="protocol-item-width160"
                  type="text"
                  v-model="item2.password"
                  :placeholder="$t('device.password')"
                ></cb-input>
                <cb-input
                  class="protocol-item-width294"
                  type="text"
                  v-model="item2.description"
                  :placeholder="$t('device.additionalInformation')"
                ></cb-input>
              </div>
              <div class="protocol-item-delete-add-btn">
                <cb-iconfont
                  size="16"
                  class="icon"
                  type="icon-jianshao"
                  @click="deleteItemProtocol(item, item2.id)"
                ></cb-iconfont>
                <cb-iconfont
                  size="16"
                  class="icon"
                  type="icon-xinzeng"
                  @click="addItemProtocol(item)"
                ></cb-iconfont>
              </div>
              <!-- 仅管理员接入选择 -->
              <div v-show="item2.isSSH || item2.isRDP" class="admin-checkbox">
                <cb-checkbox v-model="item2.manage_mode">
                  {{ $t('device.onlyAdmin') }}</cb-checkbox
                >
              </div>
            </div>
          </div>
        </cb-row>
        <cb-row v-show="!model.length" class="icon-left">
          <cb-iconfont
            size="18"
            class="icon"
            type="icon-xinzeng"
            @click="addItem()"
          ></cb-iconfont>
        </cb-row>
      </cb-tab-pane>
      <cb-tab-pane :label="$t('device.directAccess')">
        <div class="port-item-bg" v-show="consoleKeys">
          <div style="display: flex">
            <!-- <cb-input
              class="protocol-item-width200"
              disabled
              type="text"
              value="console"
            ></cb-input> -->
            <!-- 网关节点的直接接入 -->
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
            <div class="protocol-item-delete-add-btn">
              <cb-iconfont
                size="18"
                class="icon"
                type="icon-jianshao"
                @click="deleteConsoleItem"
              ></cb-iconfont>
            </div>
            <!-- 仅管理员接入选择 -->
            <div class="admin-checkbox">
              <cb-checkbox v-model="model_console.manage_mode">
                {{ $t('device.onlyAdmin') }}</cb-checkbox
              >
            </div>
          </div>
        </div>
        <div class="icon-left">
          <cb-iconfont
            v-show="!consoleKeys"
            size="18"
            class="icon"
            type="icon-xinzeng"
            @click="addConsoleItem()"
          ></cb-iconfont>
        </div>
      </cb-tab-pane>
    </cb-tabs>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  PORTTYPELIST,
  PROTOCOLLISTPORT,
  PROTOCOLLISTPORTTELNET,
  DIRECTLISTPORT,
} from '../constant';
import { encryptionUpload } from '@/api/device/image';
export default {
  name: 'AddPort', // 和接入方式待合并，判断表单项
  props: {
    // 协议接入
    portList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 直接接入
    consoleConfig: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 角色数据
    role: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 编辑时的id
    id: {
      type: '',
      default: function () {
        return '';
      },
    },
  },

  data() {
    return {
      portTypeList: PORTTYPELIST,
      protocolList: PROTOCOLLISTPORT,
      directList: DIRECTLISTPORT,
      keyValue: false,
      encryptionList: [],
    };
  },
  computed: {
    model: {
      get() {
        return this.portList;
      },
      set(val) {
        this.$emit('update:portList', val);
      },
    },
    model_console: {
      get() {
        return this.consoleConfig;
      },
      set(val) {
        this.$emit('update:consoleConfig', val);
      },
    },
    // 判断model_console是否是空对象
    consoleKeys() {
      let keys = Object.keys(this.model_console);
      if (keys.length) return true;
      return false;
    },
  },
  mounted() {},
  methods: {
    // 删除端口信息
    deleteItem(id) {
      const modelList = this.model;
      modelList.forEach((item, i) => {
        if (item.id === id) {
          modelList.splice(i, 1);
        }
      });
      this.model = modelList;
      this.$emit('setPortList', this.model, this.model_console);
    },

    // 新增端口信息
    addItem() {
      const modelList = this.model,
        role = this.role;
      modelList.push({
        id: new Date().getTime() + Math.random() * 100,
        port_type: '',
        port_ips: '',
        port_name: '',
        access_protocols: [
          {
            id: new Date().getTime() + Math.random() * 1000,
            auth_protocol: '',
            description: '',
            hostname: '',
            password: '',
            port: '',
            protocol: '',
            username: '',
            private_key_enable: false,
            private_key_path: '',
            private_key_file_name: '',
            isSSH: false,
            isRDP: false,
            // 管理员接入
            manage_mode: false,
          },
        ],
      });
      if (role.length && role.length > 1 && role[role.length - 1] === 22) {
        // 父组件的角色是网关节点/交换机的时候, 协议接入默认选中Lan口
        for (let i = 0, len = modelList.length; i < len; i++) {
          modelList[i].port_type = 2;
          modelList[i].disabled = true;
        }
      }
      this.model = modelList;
      this.$emit('setPortList', this.model, this.model_console);
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
          if (item.protocol === 'http') {
            item.port = '80';
          } else if (item.protocol === 'https') {
            item.port = '443';
          } else if (item.protocol === 'nc') {
            item.port = '9999';
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
    keyValueChange(value, pId, id) {
      if (value) {
        const modelList = this.model;
        for (let i = 0, len = modelList.length; i < len; i++) {
          if (modelList[i].id === pId) {
            let protocols = modelList[i].access_protocols;
            for (let j = 0, lenj = protocols.length; j < lenj; j++) {
              if (protocols[j].id === id) {
                protocols[j].username = '';
                protocols[j].password = '';
                protocols[j].description = '';
                break;
              }
            }
            break;
          }
        }
        this.model = modelList;
        this.$emit('setPortList', this.model, this.model_console);
      } else {
        const modelList = this.model;
        for (let i = 0, len = modelList.length; i < len; i++) {
          if (modelList[i].id === pId) {
            let protocols = modelList[i].access_protocols;
            for (let j = 0, lenj = protocols.length; j < lenj; j++) {
              if (protocols[j].id === id) {
                protocols[j].private_key_path = '';
                protocols[j].private_key_file_name = '';
                break;
              }
            }
            break;
          }
        }
        this.model = modelList;
        this.$emit('setPortList', this.model, this.model_console);
      }
    },

    //上传密钥
    uploadEncryption(file, pId, id) {
      const formData = new FormData();
      formData.append('file', file);
      encryptionUpload(formData).then((res) => {
        const data = _.get(res, 'data.data', {}) || {};
        const modelList = this.model;
        for (let i = 0, len = modelList.length; i < len; i++) {
          if (modelList[i].id === pId) {
            let protocols = modelList[i].access_protocols;
            for (let j = 0, lenj = protocols.length; j < lenj; j++) {
              if (protocols[j].id === id) {
                protocols[j].private_key_path = data.file_path;
                protocols[j].private_key_file_name = data.file_name;
                break;
              }
            }
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
    deleteEncryptionFile(pId, id) {
      const modelList = this.model;
      for (let i = 0, len = modelList.length; i < len; i++) {
        if (modelList[i].id === pId) {
          let protocols = modelList[i].access_protocols;
          for (let j = 0, lenj = protocols.length; j < lenj; j++) {
            if (protocols[j].id === id) {
              protocols[j].private_key_path = '';
              protocols[j].private_key_file_name = '';
              break;
            }
          }
          break;
        }
      }
      this.model = modelList;
      this.$emit('setPortList', this.model, this.model_console);
    },

    // 端口协议的删除
    deleteItemProtocol(parent, protocolId) {
      const modelList = this.model;
      for (let i = 0, len = modelList.length; i < len; i++) {
        if (modelList[i].id === parent.id) {
          let protocols = modelList[i].access_protocols;
          for (let j = 0, lenj = protocols.length; j < lenj; j++) {
            if (protocols[j].id === protocolId) {
              protocols.splice(j, 1);
              break;
            }
          }
          break;
        }
      }
      this.model = modelList;
      this.$emit('setPortList', this.model, this.model_console);
    },

    // 端口协议的新增
    addItemProtocol(itemParent) {
      const modelList = this.model;
      let parentId = itemParent.id; // 父级端口的id
      for (let i = 0, len = modelList.length; i < len; i++) {
        if (modelList[i].id === parentId) {
          modelList[i].access_protocols.push({
            id: new Date().getTime() + Math.random() * 1000,
            auth_protocol: '',
            description: '',
            hostname: '',
            password: '',
            port: '',
            protocol: '',
            username: '',
            private_key_enable: false,
            private_key_path: '',
            private_key_file_name: '',
            isSSH: false,
          });
          break;
        }
      }
      this.model = modelList;
      this.$emit('setPortList', this.model, this.model_console);
    },

    // 新增console
    addConsoleItem() {
      this.model_console = {
        auth_protocol: '',
        description: '',
        hostname: '',
        password: '',
        port: '',
        protocol: '',
        username: '',
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
  .icon {
    cursor: pointer;
    margin-right: 16px;
  }
  .icon-left {
    text-align: left;
  }
  .center {
    text-align: center;
  }
  .port-item-bg {
    padding: 8px;
    margin-bottom: 16px;
    background-color: var(--bg-color-2);
  }
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
.port-item-col-mr8 {
  margin-right: 8px;
}
.port-item-delete-add-btn {
  margin-left: 8px;
  display: flex;
  align-items: center;
  text-align: right;
}
.protocol-item-group-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.protocol-item-width120 {
  width: 120px !important;
  margin-right: 8px;
}
.protocol-item-width160 {
  width: 160px !important;
  margin-right: 8px;
}
.protocol-item-width200 {
  width: 200px !important;
  margin-right: 8px;
}
.protocol-item-width294 {
  width: 294px !important;
  margin-right: 8px;
}
.protocol-item-group {
  display: flex;
  margin-bottom: 8px;
}
.protocol-item-delete-add-btn {
  margin-left: 8px;
  display: flex;
  align-items: center;
}
.admin-checkbox {
  margin-left: 16px;
  display: flex;
  align-items: center;
}
</style>
