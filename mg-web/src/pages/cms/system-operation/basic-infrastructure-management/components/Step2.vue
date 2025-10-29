<template>
  <div>
    <cb-form
      ref="step2FormRef"
      label-position="right"
      v-loading="loading"
      :model.sync="model"
      :rules="rules"
      :fetchPromise="fetchForm"
      :label-width="getI18Nn().locale == 'en-US' ? '165px' : '120px'"
      :isBgColor="true"
    >
      <template v-if="!roleSet.includes(52)">
        <!--        暂时注释实体防火墙的虚拟设备组-->
        <!--        <cb-form-item-->
        <!--          v-if="roleSet.includes(23)"-->
        <!--          :label="$t('device.virtualDeviceGroup')"-->
        <!--          prop="virtual_device_group"-->
        <!--        >-->
        <!--          <cb-switch-->
        <!--            v-model="model.virtual_device_group"-->
        <!--          >-->
        <!--          </cb-switch>-->
        <!--        </cb-form-item>-->
        <cb-form-item
          :label="$t('device.AccessConfiguration')"
          prop="in_configuration"
        >
          <cb-search-table
            :scroll="{ y: 560 }"
            :cols="NO_VIRTUAL_DEVICE_GROUPS"
            :selector="selector"
            :selection.sync="selection"
            ref="accessTableRef"
            :hidePaginOnDemand="true"
            :data-source="accessTableData"
            :searchBarBg="false"
          >
            <template v-slot:search>
              <cb-button
                button-type="add"
                @click="addPortConfiguration"
              ></cb-button>
              <cb-button
                hollow
                button-type="delete"
                @click="deleteSelected(selection, $event)"
                :disabled="selection.length === 0"
              ></cb-button>
            </template>
            <template v-slot:switch_port="scope">
              <span
                :title="`${scope.data.switch_name}/${scope.data.switch_port}`"
                >{{
                  `${scope.data.switch_name}/${scope.data.switch_port}`
                }}</span
              >
            </template>

            <template v-slot:access_protocols="scope">
              <div class="protocol-group">
                <div class="add-wrapper" @click="addProtocol(scope.data)">
                  <cb-iconfont type="icon-xinzeng" />
                </div>
                <div class="protocol-tag cyber-scroll-bar-small">
                  <cb-tag
                    size="middle"
                    :key="tag.protocol"
                    v-for="tag in scope.data.access_protocols"
                    closable
                    :disable-transitions="false"
                    @close.self="handleClose(tag, scope.data)"
                  >
                    {{ tag.protocol }}
                  </cb-tag>
                </div>
              </div>
            </template>
          </cb-search-table>
        </cb-form-item>
        <cb-form-item :label="$t('device.serialConfig')" prop="ccm_port">
          <cb-col :span="7">
            <cb-cascader
              style="width: 100%"
              v-model="ccmPortSet"
              :options="ccmPortOptions"
              :props="cascaderProps"
              @change="ccmPortChange"
            />
          </cb-col>
          <cb-col :span="7" :offset="1">
            <cb-input
              v-model="model.ccm_username"
              :placeholder="$t('device.username')"
            ></cb-input>
          </cb-col>
          <cb-col :span="8" :offset="1">
            <cb-input
              v-model="model.ccm_password"
              :placeholder="$t('device.password')"
            ></cb-input>
          </cb-col>
        </cb-form-item>
      </template>
      <template v-else>
        <!--usb配置-->
        <cb-form-item :label="$t('device.serverNode')" prop="host">
          <cb-select
            v-model="model.host"
            :options="NODE_LIST_OPTIONS"
            :placeholder="$t('device.pleaseSelectTheServerNode')"
            clearable
            @change="selectServerNode"
          ></cb-select>
        </cb-form-item>
        <cb-form-item>
          <cb-search-table
            :cols="USB_COLUMNS"
            :selector="selector_usb"
            :selection.sync="selection_usb"
            ref="usbConfigRef"
            :data="query"
            row-key="id"
            :searchBarBg="false"
            :data-source="usbListTableData"
          >
            <template v-slot:status="scope">
              <span>{{ $t('device.connected') }}</span>
            </template>
          </cb-search-table>
        </cb-form-item>
      </template>
      <div slot="fixedBottom">
        <cb-button-group space="middle">
          <cb-button
            :disabled="loading"
            button-type="confirm"
            mr
            @click="back"
            >{{ $t('device.prev') }}</cb-button
          >
          <cb-button
            v-if="roleSet.includes(52)"
            :disabled="loading"
            button-type="confirm"
            mr
            @click="submitForm"
            >{{ $t('device.save') }}
          </cb-button>
          <cb-button
            v-if="!roleSet.includes(52)"
            :disabled="loading"
            button-type="confirm"
            mr
            @click="nextStep"
            >{{ $t('device.next') }}
          </cb-button>
          <cb-button button-type="cancel" @click="cancel"></cb-button>
        </cb-button-group>
      </div>
    </cb-form>
    <!-- 新增接入配置的弹框 -->
    <cb-dialog
      :title="$t('device.newPortConfig')"
      center
      :visible.sync="portDialogVisible"
      :width="getI18Nn().locale == 'en-US' ? '660px' : '500px'"
    >
      <cb-form
        :model.sync="accessPortModel"
        :rules="portRules"
        :label-width="getI18Nn().locale == 'en-US' ? '180px' : '100px'"
        ref="accessPortFormRef"
      >
        <cb-form-item :label="$t('device.accessType')" prop="access_type">
          <cb-select
            style="width: 100%"
            v-model="accessPortModel.access_type"
            :options="accessTypeList"
            @change="accessTypeChange"
          />
        </cb-form-item>
        <cb-form-item :label="$t('device.switchPort')" prop="switch_port">
          <cb-cascader
            style="width: 100%"
            v-model="switchPortSet"
            :options="switchPortOptions"
            :props="cascaderProps"
            @change="switchPortChange"
            :placeholder="$t('device.plzSelectSwitchPort')"
          />
        </cb-form-item>
        <cb-form-item :label="$t('device.pyPortNumber')" prop="port_name">
          <cb-input
            v-model="accessPortModel.port_name"
            :placeholder="$t('device.plzInputPortName')"
          ></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('device.IP')" prop="ip">
          <cb-input
            v-model="accessPortModel.ip"
            :placeholder="$t('device.plzInputIp')"
          ></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('device.macAddress')" prop="mac">
          <cb-input
            v-model="accessPortModel.mac"
            :placeholder="$t('device.plzInputMac')"
          ></cb-input>
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button
              button-type="confirm"
              mr
              @click="accessPortSubmit"
            ></cb-button>
            <cb-button
              button-type="cancel"
              @click="accessPortCancel"
            ></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </cb-dialog>
    <!-- 接入协议弹框 -->
    <cb-dialog
      :title="$t('device.accessProtocol')"
      center
      :visible.sync="innerProtocolVisible"
      width="500px"
    >
      <cb-form
        :model.sync="accessProtocolModel"
        :rules="protocolRules"
        label-width="100px"
        ref="protocolFormRef"
      >
        <cb-form-item :label="$t('device.agreement')" prop="protocol">
          <cb-select
            style="width: 100%"
            v-model="accessProtocolModel.protocol"
            :options="protocolList"
            :placeholder="$t('device.plzSelectagree')"
            clearable
          />
        </cb-form-item>
        <cb-form-item :label="$t('device.port')" prop="port">
          <cb-input v-model="accessProtocolModel.port"></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('device.accessIPAddress')" prop="hostname">
          <cb-input v-model="accessProtocolModel.hostname"></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('device.username')" prop="username">
          <cb-input v-model="accessProtocolModel.username"></cb-input>
        </cb-form-item>
        <cb-form-item :label="$t('device.password')" prop="password">
          <cb-input v-model="accessProtocolModel.password"></cb-input>
        </cb-form-item>
        <div class="form-button-bar">
          <cb-button-group space="middle">
            <cb-button
              button-type="confirm"
              mr
              @click="protocolSubmit"
            ></cb-button>
            <cb-button button-type="cancel" @click="protocolCancel"></cb-button>
          </cb-button-group>
        </div>
      </cb-form>
    </cb-dialog>
  </div>
</template>

<script>
import {
  getSwitchTree,
  getEditBackData,
  addRealEquipment,
  editRealEquipment,
  getPortList,
} from '@/api/device/real';
import {
  ACCESSTYPE,
  NO_VIRTUAL_DEVICE_GROUPS,
  PROTOCOLLIST,
  SNMPLIST,
  VIRTUAL_DEVICE_GROUP,
} from '../constant';
import { getI18n } from '@/lang/';
import {
  getServerNodeList,
  getUSBListByHostname,
} from '../../../../../api/device/real';
export default {
  name: 'Step2',
  props: {
    id: {
      type: String,
      default: '',
    },
    roleSet: {
      type: Array,
      default: [],
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const validateIP = (rule, value, callback) => {
      const valid =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g;
      if (value && valid.test(value)) {
        callback();
      } else if (!value) {
        callback();
      } else {
        callback(new Error(this.$t('device.plzInputCorrectIp')));
      }
    };
    return {
      query: {},
      loading: true,
      moreSnmpSpan: 7,
      lessSnmpSpan: 4,
      model: {
        virtual_device_group: false,
        ccm_port: null,
        ccm_username: null,
        ccm_password: null,
        ccm_server_name: null,
        host: null,
      },
      rules: {},
      // 接入配置表格
      selector: {
        maxSelect: 0,
        read_group_words: '',
      },
      selection: [],
      selector_usb: {
        maxSelect: 1,
      },
      selection_usb: [],
      USB_COLUMNS: [
        {
          label: this.$t('device.port'),
          prop: 'usb_port',
        },
        {
          label: this.$t('device.ukey'),
          prop: 'usb_info',
        },
        {
          label: this.$t('device.Status'),
          slot: 'status',
        },
      ],
      accessTableData: [],
      // 新增接入配置的弹框
      portDialogVisible: false,
      accessPortModel: {
        access_type: 'remote_address', // 接入类型
        switch_name: null,
        switch_port: null,
        port_name: null,
        ip: null,
        mac: null,
      },
      portRules: {
        access_type: [
          {
            required: true,
            message: this.$t('device.plzSelectAccessagree'),
            trigger: 'blur',
          },
        ],
        port_name: [
          {
            required: true,
            message: this.$t('device.plzInputPortName'),
            trigger: 'blur',
          },
        ],
        ip: [{ validator: validateIP, trigger: 'blur' }],
        // server_node: [
        //   {
        //     required: true,
        //     message: this.$t('device.pleaseSelectTheServerNode'),
        //     trigger: ['blur', 'change'],
        //   },
        // ],
      },
      accessTypeList: ACCESSTYPE,
      switchPortSet: [],
      cascaderProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
      },
      // 交换机端口 数据
      switchPortOptions: [],
      // 接入协议弹框
      innerProtocolVisible: false,
      tableItemData: {},
      accessProtocolModel: {
        protocol: null,
        port: null,
        hostname: null,
        username: null,
        password: null,
      },
      protocolRules: {
        protocol: [
          {
            required: true,
            message: this.$t('device.plzSelectagree'),
            trigger: 'blur',
          },
        ],
        hostname: [{ validator: validateIP, trigger: 'blur' }],
      },
      // 协议数据
      protocolList: PROTOCOLLIST,
      ccmPortSet: [],
      // 串口配置数据
      ccmPortOptions: [
        {
          value: 'CCM-1',
          label: 'CCM-1',
          children: [],
        },
      ],
      NO_VIRTUAL_DEVICE_GROUPS, // 通用接入配置列
      NODE_LIST_OPTIONS: [], // 服务器节点下拉项
      usbListTableData: [], // 根据hostName查询的usb列表
    };
  },
  watch: {
    // 交换机端口监听
    switchPortSet(value) {
      if (value && value.length > 0) {
        this.accessPortModel.switch_name = value[0];
        this.accessPortModel.switch_port = value[value.length - 1];
      } else {
        this.accessPortModel.switch_name = null;
        this.accessPortModel.switch_port = null;
      }
    },
    // 串口配置监听
    ccmPortSet(value) {
      if (value && value.length > 0) {
        this.model.ccm_server_name = value[0];
        this.model.ccm_port = value[value.length - 1];
      } else {
        this.model.ccm_server_name = null;
        this.model.ccm_port = null;
      }
    },
    // 表单数据
    formData: {
      handler(value) {
        value && this.id && this.editBack(value);
      },
      immediate: true,
    },
    // 监听角色
    roleSet: {
      handler(val) {
        this.getConfig(val);
      },
      immediate: true,
    },
  },
  created() {
    this.getConfig(this.roleSet);
  },
  beforeDestroy() {
    this.$store.commit({
      type: 'real/setActive',
      active: 1,
    });
  },
  methods: {
    usb_buskey(record) {
      return record.usb_bus + record.usb_port;
    },
    getI18Nn() {
      return getI18n();
    },
    getConfig(roleSet) {
      if (roleSet.includes(52)) {
        this.loading = false;
        // 获取服务器节点配置
        !this.NODE_LIST_OPTIONS.length &&
          getServerNodeList().then((res) => {
            this.NODE_LIST_OPTIONS = res?.data?.data?.map((item) => ({
              label: item.hostname,
              value: item.hostname,
            }));
          });
      } else {
        !this.switchPortOptions.length &&
          !this.ccmPortOptions[0].children.length &&
          Promise.all([this.getSwitch(), this.getPortData()]).then(() => {
            this.loading = false;
          });
      }
    },
    // 获取串口配置
    getPortData() {
      return new Promise((resolve) => {
        getPortList().then((res) => {
          const portList = _.get(res, 'data.data', []);
          if (portList && portList.length > 0 && portList[0].children) {
            const childrenList = portList[0].children;
            this.ccmPortOptions[0].children = this.listMap(childrenList);
          }
          resolve();
        });
      });
    },
    listMap(data) {
      const list = data.map((item) => {
        return {
          label: item.interface_id,
          value: item.interface_id,
        };
      });
      return list;
    },
    // 编辑回显
    editBack(res) {
      let data = _.get(res, 'data.data', {});
      const { ext_entity_access, ext_entity, ext_entity_usb } = data;
      // 表格的"接入类型"需要展示 label文字, 增加id,便于删除
      if (ext_entity_access && ext_entity_access.length > 0) {
        const accessTypeList = this.accessTypeList;
        ext_entity_access.forEach((item) => {
          accessTypeList.forEach((item2) => {
            if (item2.value === item.access_type) {
              item.access_type_name = item2.label;
            }
          });
          item.id = (new Date().getTime() + Math.random() * 100).toString();
        });
        this.accessTableData = ext_entity_access;
      }

      if (ext_entity) {
        this.model.ccm_port = ext_entity.ccm_port;
        this.model.ccm_username = ext_entity.ccm_username;
        this.model.ccm_password = ext_entity.ccm_password;
        this.model.ccm_server_name = ext_entity.ccm_server_name;
        this.ccmPortSet = [ext_entity.ccm_server_name, ext_entity.ccm_port];
      }

      if (ext_entity_usb) {
        this.model.host = ext_entity_usb.host;
        this.selectServerNode(this.model.host, ext_entity_usb);
      }
    },
    // 交换机端口
    getSwitch() {
      return new Promise((resolve) => {
        getSwitchTree().then((res) => {
          let switchList = _.get(res, 'data.data', []);
          this.switchPortOptions = switchList;
          if (
            switchList &&
            switchList.length &&
            switchList[0].children &&
            switchList[0].children.length
          ) {
            this.switchPortSet = [
              switchList[0].value,
              switchList[0].children[0].value,
            ];
          }
          resolve();
        });
      });
    },

    // 接入类型
    accessTypeChange(value) {},
    // 保存
    fetchForm() {
      let params = {};
      let ext_entity = this.model;
      const { firstStepFormValue } = this.$store.state.real; // 第一步的 数据

      params = {
        ext_entity_access: [],
        ...firstStepFormValue,
        ext_entity: {
          ...firstStepFormValue.ext_entity,
          ...ext_entity,
          snmp_version: null, // 版本V1...
          snmp_config: {
            community_name: null, // 团体字
            priv_key: null, // 用户组名
            username: null, // 用户名
            auth_key: null, // 认证密码
            ip: null, // ip地址
          },
          snmp_cpu_oid: null,
          snmp_mem_oid: null,
          snmp_disk_oid: null,
        },
        ext_entity_usb:
          (this.selection_usb.length && this.selection_usb[0]) || {},
      };

      if (this.id) {
        let editParams = {
          uuid: this.id,
          ...params,
        };
        return editRealEquipment(editParams).then(() => {
          this.$router.push({ name: 'basic-infrastructure-management' });
        });
      } else {
        return addRealEquipment(params).then(() => {
          this.$router.push({ name: 'basic-infrastructure-management' });
        });
      }
    },

    submitForm() {
      if (this.model.host && !this.selection_usb.length) {
        this.$message.error(this.$t('device.selectTheNode'));
      } else {
        this.$refs.step2FormRef.submit();
      }
    },
    // 下一步
    nextStep() {
      this.$refs.step2FormRef.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          const ext_entity_access = _.cloneDeep(this.accessTableData);
          const ccmPortSet = _.cloneDeep(this.model);
          const secondStepFormValue = {
            ext_entity_access: ext_entity_access,
            ccmPortSet: ccmPortSet,
          };
          this.$store.commit({
            type: 'real/setsecondStepFormValue',
            secondStepFormValue,
          });
          this.$store.commit({
            type: 'real/setActive',
            active: 3,
          });
        }
      });
    },

    back() {
      this.$store.commit({
        type: 'real/setActive',
        active: 1,
      });
    },

    cancel() {
      this.$router.push({ name: 'basic-infrastructure-management' });
    },

    // 无接口删除表格数据
    deleteSelected(selection, done) {
      let tableList = this.accessTableData;
      for (let i = 0; i < selection.length; i++) {
        for (let j = 0; j < tableList.length; j++) {
          if (tableList[j].id === selection[i].id) {
            tableList.splice(j, 1);
            j -= 1;
          }
        }
      }
      done();
      this.selection = [];
    },

    // 新增接入配置
    addPortConfiguration() {
      // 每次点开弹窗都需要使交换机端口有默认值
      if (
        this.switchPortOptions &&
        this.switchPortOptions.length &&
        this.switchPortOptions[0].children &&
        this.switchPortOptions[0].children.length
      ) {
        this.switchPortSet = [
          this.switchPortOptions[0].value,
          this.switchPortOptions[0].children[0].value,
        ];
      }
      this.portDialogVisible = true;
    },

    // 交换机端口值变化
    switchPortChange(value) {
      if (value && value.length > 0) {
        this.accessPortModel.switch_name = value[0];
        this.accessPortModel.switch_port = value[value.length - 1];
      } else {
        this.accessPortModel.switch_name = '';
        this.accessPortModel.switch_port = '';
      }
    },

    // 接入配置确定
    accessPortSubmit() {
      this.$refs.accessPortFormRef.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          let accessType = this.accessPortModel.access_type,
            accessTableData = this.accessTableData;
          // 校验用户新选择的接入类型，接入类型必须只能一种
          for (let i = 0, len = accessTableData.length; i < len; i++) {
            if (accessType !== accessTableData[i].access_type) {
              this.$message.error(this.$t('device.accessTypeMustBeSame'));
              return;
            }
          }

          let num = (new Date().getTime() + Math.random() * 100).toString();
          const accessConfig = _.cloneDeep(this.accessPortModel);

          // 表格“接入类型”显示类型的名称
          this.accessTypeList.forEach((item) => {
            if (this.accessPortModel.access_type === item.value) {
              accessConfig.access_type_name = item.label;
            }
          });

          accessConfig.id = num;
          accessConfig.access_protocols = [];

          this.accessTableData.push(accessConfig);
          this.$refs.accessPortFormRef.resetFields();
          this.switchPortSet = [];
          this.portDialogVisible = false;
        }
      });
    },

    accessPortCancel() {
      this.switchPortSet = [];
      this.$refs.accessPortFormRef.resetFields();
      this.portDialogVisible = false;
    },

    // 串口配置值变化
    ccmPortChange(value) {
      if (value && value.length > 0) {
        this.model.ccm_server_name = value[0];
        this.model.ccm_port = value[value.length - 1];
      } else {
        this.model.ccm_server_name = null;
        this.model.ccm_port = null;
      }
    },

    // 添加管理协议
    addProtocol(data) {
      this.tableItemData = { ...data }; // 表格的某一行数据
      this.innerProtocolVisible = true;
    },

    // 管理协议确定
    protocolSubmit() {
      this.$refs.protocolFormRef.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          let protocolNew = this.accessProtocolModel.protocol;
          const { id } = this.tableItemData; // 提取当前点击列的id 和 此行已有协议protocol的数组，便于去重
          const tableData = this.accessTableData; // 接入配置表格的所有数据
          let protocolAll = [];
          tableData.forEach((item, i) => {
            let itemProtocols = item.access_protocols;
            if (itemProtocols.length > 0) {
              itemProtocols.forEach((item2) => {
                protocolAll.push(item2.protocol);
              });
            }
          });

          if (protocolAll.indexOf(protocolNew) >= 0) {
            this.$message.error(this.$t('device.agreementHasExist'));
            return;
          } else {
            // 在当前点击列，添加协议
            tableData.forEach((item) => {
              if (item.id === id) {
                let obj = _.cloneDeep(this.accessProtocolModel);
                item.access_protocols.push(obj);
              }
            });
          }

          this.$refs.protocolFormRef.resetFields();
          this.innerProtocolVisible = false;
        }
      });
    },
    protocolCancel() {
      this.innerProtocolVisible = false;
    },
    // 管理协议删除
    handleClose(value, data) {
      const { access_protocols: protocolArr } = data;
      let i = protocolArr.indexOf(value);
      if (i >= 0) {
        protocolArr.splice(i, 1);
      }
    },
    // 选择服务器节点
    selectServerNode(server, ext_entity_usb) {
      if (server) {
        getUSBListByHostname({ hostName: server }).then((res) => {
          this.usbListTableData = res?.data?.data?.list.map((item) => {
            return {
              ...item,
              id: item.usb_bus + item.usb_port,
            };
          });
          ext_entity_usb &&
            this.selection_usb.push({
              ...ext_entity_usb,
              id: ext_entity_usb.usb_bus + ext_entity_usb.usb_port,
            });
        });
      } else {
        this.usbListTableData = [];
        this.selection_usb = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add_protocol {
  display: flex;
  align-items: center;
  ::v-deep .el-button {
    height: 20px;
    width: 20px;
  }
}
.protocol-group {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  .add-wrapper {
    padding: 4px;
    border: 1px solid var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
  }
  .protocol-tag {
    width: calc(100% - 30px);
    overflow-x: auto;
    z-index: 999;
    ::v-deep .cb-tag {
      cursor: pointer;
      margin-left: 10px;
      .cb-tag-content-close:hover {
        transform: scale(1.2, 1.2);
      }
    }
  }
}
</style>
