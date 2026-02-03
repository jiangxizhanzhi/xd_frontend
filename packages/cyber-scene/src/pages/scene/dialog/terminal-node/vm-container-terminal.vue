<template>
  <cb-form
    ref="formRef"
    :model.sync="nodeForm"
    :rules="rules"
    id="id"
    :json="true"
    label-position="right"
    :label-width="labelWidth"
    :inline="false"
  >
    <cb-tabs type="border-card" class="terminal-node-wrapper">
      <cb-tab-pane :label="$tt('target.deviceInfo')">
        <!--节点名称、设备类型、节点图标-->
        <name-category-icon
          :Name.sync="nodeForm.name"
          :category="nodeForm.category"
          :Icon2.sync="nodeForm.icon"
          :Icon3.sync="nodeForm.icon3"
          :lang="lang"
          :nodeInfo="nodeInfo"
        ></name-category-icon>
        <!--镜像信息-->
        <image-lang-architecture-snapshot
          :image_type="nodeForm.image_type"
          :image.sync="nodeForm.image"
          :image_uuid="nodeForm.image_uuid"
          :system_language="nodeForm.system_language"
          :system_architecture="nodeForm.system_architecture"
          :quick_create_params.sync="nodeForm.quick_create_params"
          :eid="nodeForm.eid"
          :role="nodeForm.role"
          @default-protocols="getDefaultProtocolsHandler"
        ></image-lang-architecture-snapshot>
        <!--网卡、cpu、内存、硬盘-->
        <card-cpu-ram-disk
          :image_type="nodeForm.image_type"
          :role="nodeForm.role"
          :netCardNum.sync="nodeForm.netCardNum"
          :cpu.sync="nodeForm.cpu"
          :ram.sync="nodeForm.ram"
          :disk.sync="nodeForm.disk"
          :system_type="nodeForm.system_type"
          :original-count="nodeForm.originalCount"
          :eid="nodeForm.eid"
          @change-card="changeNetCardHandler"
        ></card-cpu-ram-disk>
        <!--usb配置-->
        <usb-config
          :image_type="nodeForm.image_type"
          :role="nodeForm.role"
          :system_type="nodeForm.system_type"
          :virtual_usbs.sync="nodeForm.virtual_usbs"
          :entity_usbs.sync="nodeForm.entity_usbs"
          :nodeInfo="nodeInfo"
          :eid="nodeForm.eid"
        ></usb-config>
        <!--cloud-init 虚拟机显示-->
        <cloud-init :image_type="nodeForm.image_type" :init_support="nodeForm.init_support"></cloud-init>
        <!--高级选项 容器显示-->
        <docker-params
          v-if="nodeForm.image_type == 'container'"
          :docker_params.sync="nodeForm.docker_params"
          :eid="nodeForm.eid"
        ></docker-params>
      </cb-tab-pane>
      <cb-tab-pane :label="$tt('target.networkConfig')">
        <network-config
          :lang="lang"
          :nodeInfo="nodeInfo"
          :network.sync="nodeForm.network"
          :console_config.sync="console_config"
          :topology-edges="topologyEdges"
          :topology-nodes="topologyNodes"
          :eid="nodeForm.eid"
          :original-count="nodeForm.originalCount"
          @delete-port="handleDeletePort"
          :active-protocol-name.sync="activeProtocolName"
        ></network-config>
      </cb-tab-pane>
      <cb-tab-pane :label="$tt('target.otherConfig')" v-if="showOtherConfig">
        <other-config-validator
          :image_type="nodeForm.image_type"
          :init_support="nodeForm.init_support"
          :order.sync="nodeForm.order"
          :node_command.sync="nodeForm.node_command"
          :file.sync="nodeForm.file"
          :eid="nodeForm.eid"
          :role="nodeForm.role"
        ></other-config-validator>
      </cb-tab-pane>
    </cb-tabs>
  </cb-form>
</template>

<script>
import _ from 'lodash';
import t from '../../../../utils/i18n';
import {computed, inject, onUnmounted, reactive, ref} from '@vue/composition-api';
import {
  changeNetworkNum,
  clearConnectionPortUsable,
  getConsole,
  transferNull
} from "../../../../utils/port-processing/port-generation";
import NameCategoryIcon from "../components/device-info/name-category-icon";
import ImageLangArchitectureSnapshot from "../components/device-info/image-lang-architecture-snapshot";
import CardCpuRamDisk from "../components/device-info/card-cpu-ram-disk";
import NetworkConfig from "../components/netwrok-config/network-config.vue";
import otherConfigValidator from "../components/other-config/other-config-validator";
import {errorConversion} from "../../../../utils/form/error-conversion";
import {useResetForm, useSubmitForm} from "../../../../utils/form/submit";
import {getPortUUID} from "../../../../utils/common";
import CloudInit from "../components/device-info/cloud-init";
import usbConfig from "../components/device-info/usb-config";
import {getEntityUsb, getVirtualUsb} from "../../../../api";
import DockerParams from "../components/device-info/docker-params";

export default {
  name: 'vmContainerTerminal',
  components: {
    otherConfigValidator,
    NameCategoryIcon,
    ImageLangArchitectureSnapshot,
    CardCpuRamDisk,
    NetworkConfig,
    CloudInit,
    usbConfig,
    DockerParams,
  },
  props: {
    nodeInfo: {
      type: Object,
      default: () => {
      },
    },
    formData: {
      type: Object,
      default: () => {
      },
    },
    lang: {
      type: String,
      default: 'zh-CN',
    },
    topologyEdges: {
      type: Array,
      default: () => []
    },
    topologyNodes: {
      type: Array,
      default: () => []
    },
  },
  setup(props) {
    const formRef = ref(null);
    const labelWidth = computed(() => {
      return props.lang === 'zh-CN' ? '140px' : '200px';
    });
    const nodeFormData = computed(() => {
      return props.formData;
    });
    let networkForm = reactive(_.cloneDeep(nodeFormData.value.networkConfig || {network: []}));
    let activeProtocolName = ref('protocol-access');
    let nodeForm = reactive(_.cloneDeep(Object.assign(
      {},
      nodeFormData.value.basicConfig,
      nodeFormData.value.otherConfig,
      {...networkForm}
    )));
    nodeForm.netCardNum = nodeForm?.network?.length || 0;
    const rules = {};
    let snapshotOptions = ref([]);
    let imageName = ref('');
    let deleteData = ref([]);

    // 不支持Cloud-init的虚拟机主机，应该无自定义命令和上传文件功能，删除其他配置Tab页
    const showOtherConfig = computed({
      get: () => {
        return !(
          props.nodeInfo.image_type === 'vm' && !nodeForm.init_support
        )
      },
    });
    /**
     * 拆分成 协议接入 和 直接接入
     * 处理console协议接入信息，将原console协议拆到单独变量里
     * 此方法暂不支持表单校验，后续再考虑添加
     */
    let console_config = ref(getConsole(networkForm.network))
    let protocolsDefault = ref([]);
    let protocolsDefaultConsole = ref({});
    /**
     * 默认接入协议
     * @param protocol
     */
    const getDefaultProtocolsHandler = (protocol) => {
      if (!protocol.length) {
        return
      }
      let protocol_temp = [];
      let {ext_vm, ext_docker} = protocol[0];
      protocol_temp = ext_vm
        ? ext_vm.access_protocols
        : ext_docker
          ? ext_docker.access_protocols
          : [];
      protocol_temp?.forEach((protocol) => {
          if (protocol.protocol != 'console' && protocol.protocol != 'COM') {
            protocolsDefault.value.push({
              ...protocol,
              proxy: true,
            });
          } else {
            protocolsDefaultConsole.value = _.cloneDeep(protocol);
          }
        }
      )
    }

    // 更新虚拟usb的名称(删掉无效的usb --暂时注释)
    getVirtualUsb({page: 1, per_page: 9999}).then(res => {
      // let allUsbIds = res.data.data?.list?.map(item => item.uuid);
      let matchedUSB = new Map();
      res.data.data?.list?.forEach(item => {
        matchedUSB.set(item.uuid, item);
      });
      nodeForm.virtual_usbs?.length && nodeForm.virtual_usbs.forEach((usb, index) => {
        // if (!allUsbIds.includes(usb.uuid)) {
        //   nodeForm.virtual_usbs.splice(index, 1);
        // }
        nodeForm.virtual_usbs[index].name = matchedUSB.get(usb.uuid)?.name || nodeForm.virtual_usbs[index]?.name;
      })
    });

    // 更新实装usb的名称(删掉无效的usb --暂时注释)
    getEntityUsb().then(res => {
      // let allUsbIds = res.data.data?.list?.map(item => item.uuid);
      let matchedUSB = new Map();
      res.data.data?.list?.forEach(item => {
        matchedUSB.set(item.id, item);
      });
      nodeForm.entity_usbs?.length && nodeForm.entity_usbs.forEach((usb, index) => {
        nodeForm.entity_usbs[index].name = matchedUSB.get(usb.id)?.name || nodeForm.entity_usbs[index]?.name;
      })
    });

    return {
      rules,
      nodeFormData,
      nodeForm,
      networkForm,
      labelWidth,
      formRef,
      showOtherConfig,
      snapshotOptions,
      imageName,
      deleteData,
      console_config,
      activeProtocolName,
      protocolsDefault,
      protocolsDefaultConsole,
      getDefaultProtocolsHandler
    };
  },
  methods: {
    $tt: t,
    /**
     * 网卡数量改变事件处理
     */
    changeNetCardHandler(cur, old) {
      let type = '';
      if (cur < old) {
        type = 'delete';
      }
      if (old == 0) {
        this.console_config = this.protocolsDefaultConsole
      }
      this.nodeForm.network = this.getNetwork(
        this.nodeForm.netCardNum,
        type,
        Math.abs(cur - old),
      );
      this.activeProtocolName = 'protocol-access';
    },
    /**
     * 端口配置删除操作
     */
    handleDeletePort(portId, index) {
      this.nodeForm.netCardNum--;
      this.deleteData.push(portId);
    },

    /**
     * 更新表单image字段
     */
    changeImageHandler(val) {
      this.nodeForm.icon = val;
    },
    /**
     * 文件变动后更新file字段
     */
    changeFile(file) {
      this.nodeForm.file = file;
    },
    /**
     * 处理网卡数量change事件
     */
    getNetwork(netCardNum, type, num) {
      if (type === 'delete') {
        let _deleteData = changeNetworkNum(
          this.nodeForm.network,
          this.topologyEdges,
          num,
        );
        // 保存时需要删除的数据
        this.deleteData.push(..._deleteData);
        // 将原有的network配置数组执行遍历，剔除掉新的deleteData数组，得到新的数组
        _deleteData.forEach((data) => {
          this.nodeForm.network.map((port, index) => {
            if (port.id === data) {
              this.nodeForm.network.splice(index, 1);
            }
          });
        });
        return this.nodeForm.network;
      } else {
        let network = [];
        for (let i = 0; i < netCardNum; i++) {
          let portId = getPortUUID(this.nodeInfo.id, i + 1);
          const hasPortIndex = this.nodeForm.network?.findIndex((port) => {
            return port.id === portId;
          });
          network.push({
            id: portId,
            nat: false,
            name: `eth0/${i + 1}`,
            ip: hasPortIndex >= 0
              ? _.cloneDeep(this.nodeForm.network[hasPortIndex].ip)
              : '',
            egress: hasPortIndex >= 0
              ? _.cloneDeep(this.nodeForm.network[hasPortIndex].egress)
              : null,
            ingress: hasPortIndex >= 0
              ? _.cloneDeep(this.nodeForm.network[hasPortIndex].ingress)
              : null,
            access_modes:
              hasPortIndex >= 0
                ? _.cloneDeep(this.nodeForm.network[hasPortIndex].access_modes)
                : this.protocolsDefault,
            logic_network_id:
              hasPortIndex >= 0
                ? _.cloneDeep(this.nodeForm.network[hasPortIndex].logic_network_id)
                : null,
            resource_id:
              hasPortIndex >= 0
                ? _.cloneDeep(this.nodeForm.network[hasPortIndex].resource_id)
                : null,
            usable:
              hasPortIndex >= 0
                ? _.cloneDeep(this.nodeForm.network[hasPortIndex].usable)
                : true,
          });
          let deletePortIdx = this.deleteData?.findIndex(id => id === portId);
          if (deletePortIdx >= 0) {
            this.deleteData.splice(deletePortIdx, 1);
          }
        }
        return network;
      }
    },

    submitForm() {
      let result = useSubmitForm(this.formRef, {...this.nodeForm, ...this.networkForm});
      if (result.status) {
        if (this.nodeForm.name !== this.nodeFormData.basicConfig.name) {
          this.$emit('update-name', this.nodeForm.name);
        }
        if (this.nodeForm.icon !== this.nodeFormData.basicConfig.icon) {
          this.$emit('update-icon', this.nodeForm.icon);
        }

        const {file, order, node_command, network, ...basic} = this.nodeForm;
        this.nodeFormData.basicConfig = basic;
        this.nodeFormData.otherConfig = {file, order, node_command};

        // 处理直接接入
        network?.forEach((item, index) => {
          let new_access_modes = [];
          item.access_modes?.forEach((protocol, idx) => {
            if (!(protocol && protocol.protocol && (protocol.protocol == 'console' || protocol.protocol == 'COM'))) {
              new_access_modes.push(protocol)
            }
          })
          network[index]['access_modes'] = new_access_modes;
        })
        if (this.console_config && Object.keys(this.console_config).length) {
          this.nodeForm.network[0]?.access_modes?.unshift(this.console_config);
        }
        _.set(this.nodeFormData, 'networkConfig.network', transferNull(this.nodeForm.network));
        // 同时需要清空对端连接端口的usable属性
        this.deleteData?.forEach(portId => {
          clearConnectionPortUsable(portId, this.topologyEdges);
        })
        this.$emit('update-node-data', this.nodeFormData)
      } else {
        this.$message.info(errorConversion(result.error))
      }

      this.$emit("formCheck", result);
    },
    // 重置表单
    resetForm() {
      this.$emit("formCheck", useResetForm(this.formRef));
    },
  },
  filters: {
    formatText(param) {
      if (param === null || param === undefined || param === '') {
        return '--';
      } else {
        return param;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.form-wrapper {
  ::v-deep.el-form {
    padding-right: unset;
  }
}

.el-input-number.is-controls-right {
  width: 150px;
}
</style>
