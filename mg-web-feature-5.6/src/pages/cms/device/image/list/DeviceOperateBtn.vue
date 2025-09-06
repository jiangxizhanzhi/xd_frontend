<template>
  <div v-if="visible" class="device-operate-btn">
    <cb-popover
      placement="bottom-start"
      width="250"
      trigger="hover"
      :content="vmDockerError"
      :disabled="!vmDockerError || instanceState !== '3'"
    >
      <!-- 快照保存中：ws推送的device_actions等于a -->
      <template v-if="deviceActions === 'a' || imageStatus === '1'">
        <cb-button slot="reference" colorType="yellow" type="text">
          <cb-iconfont class="jia-zai" type="icon-jiazai"></cb-iconfont>
          <span>{{ $t('device.snapshotIsBeingSaved') }}</span>
        </cb-button>
      </template>
      <!-- 镜像状态 值是 0 || 2 || 3时，也就是 "待编辑" || "已保存" || "错误"时显示 -->
      <template v-else>
        <!-- 编辑镜像：instanceState === '0'且镜像实例不是创建中，表明实例不存在，编辑镜像按钮显示，点击时创建镜像场景 -->
        <cb-button
          v-if="
            instanceState === '0' &&
            deviceActions.indexOf('e') < 0 &&
            imageStatus === '2'
          "
          button-type="edit"
          type="text"
          slot="reference"
          @click="noSceneCreateImageScene"
        >
          {{ $t('device.editImage') }}
        </cb-button>
        <!-- 查看机器: instanceState === '2' 表明实例创建成功， 查看镜像按钮显示,点击时展示场景的"连接信息" -->
        <cb-button
          v-else-if="instanceState === '2' && deviceActions.indexOf('f') < 0"
          slot="reference"
          type="text"
          @click="showImageScene(data)"
        >
          {{ $t('device.showMachine') }}
        </cb-button>
        <!-- 删除中，释放镜像机器、创建错误删除镜像 -->
        <cb-button
          v-if="deviceActions === 'f'"
          slot="reference"
          type="text"
          colorType="yellow"
        >
          <cb-iconfont class="jia-zai" type="icon-jiazai"></cb-iconfont>
          <span>{{ $t('device.deleting') }}</span>
        </cb-button>
        <!-- 创建错误: 点击时是否删除镜像机器 -->
        <cb-button
          v-else-if="
            instanceState === '3' ||
            (deviceActions === '' && instanceState === '1')
          "
          slot="reference"
          type="text"
          colorType="red"
          size="mini"
          @click="deleteImageScene"
        >
          {{ $t('device.createError') }}
        </cb-button>
        <!-- 创建中-->
        <cb-button
          v-if="deviceActions === 'e'"
          slot="reference"
          colorType="yellow"
          type="text"
          class="cursor-default-btn"
        >
          <cb-iconfont class="jia-zai" type="icon-jiazai"></cb-iconfont>
          <span>{{ $t('device.creating') }}</span>
        </cb-button>
      </template>
    </cb-popover>
    <!-- 镜像导出 :表格数据中image_status === 2,也就是已保存，才显示-->
    <template v-if="device.image_status === 2">
      <cb-button
        v-if="deviceActions.indexOf('d') < 0"
        :disabled="!device.allow_export"
        type="text"
        style="margin: 0 5px"
        @click="exportImg(device)"
      >
        <span> {{ $t('device.exportImage') }}</span>
      </cb-button>
      <cb-button
        v-if="deviceActions === 'd'"
        type="text"
        colorType="yellow"
        style="margin: 0 5px"
      >
        <cb-iconfont class="jia-zai" type="icon-jiazai"></cb-iconfont>
        <span> {{ $t('service.exportingImage') }}</span>
      </cb-button>
    </template>

    <!-- 历史版本(number)：表格数据中的snapshots有值时才显示，点击时显示快照历史-->
    <cb-button type="text" v-if="snapshots" @click="snapshotTriggerEvent">
      {{ $t('device.snapshotCount') }}({{ snapshots }})
    </cb-button>
    <!-- 快照历史弹框 -->
    <snapshot
      v-if="snapshotModalTrigger"
      ref="snapshotModal"
      :device="device"
      :snapshot-modal-trigger="snapshotModalTrigger"
      @snapshot-hide="snapshotHide"
      @merge-snapshot="mergeSnapshot"
    />
    <snapshot-form-modal
      ref="snapshotFormModal"
      :device="device"
      @closeAccessInfoDialog="closeAccessInfoDialog"
    />
    <!-- 点击"查看机器"时显示 -->
    <cb-dialog
      :title="$t('device.accessInfo')"
      :visible.sync="sceneInfoVisible"
    >
      <div class="access-info">
        <div v-if="connectionData">
          <div
            style="margin-bottom: 5px"
            v-for="item in connectionData"
            :key="item.url"
          >
            <div style="display: flex">
              <span style="margin-right: 5px">
                <cb-iconfont
                  :size="item.connection_state === 2 ? '14' : '16'"
                  :type="connectionState(item)"
                ></cb-iconfont>
              </span>
              <span style="margin-right: 10px">{{ item.protocol }} </span>
              <template v-if="imageTypeNotVm(item)">
                <span style="margin-right: 10px">{{ item.ip_address }} </span>
                <span>{{ item.port }} </span>
              </template>
            </div>
            <div v-if="imageTypeNotVm(item)" style="display: flex">
              <span>{{ $t('device.username') }}：</span>
              <span style="min-width: 60px; margin-right: 10px">{{
                item.username
              }}</span>
              <span>{{ $t('device.password') }}：</span>
              <span style="min-width: 60px">{{ item.password }}</span>
            </div>
            <div v-if="connectBtn(item)" style="margin-top: 5px">
              <cb-button
                @click="openNewWindow(item)"
                icon="icon-zhongduanshebei"
                >{{
                  item.protocol === 'http'
                    ? $t('device.httpAccess')
                    : item.protocol === 'https'
                    ? $t('device.httpsAccess')
                    : $t('device.webAccess')
                }}</cb-button
              >
            </div>
          </div>
        </div>
        <p>
          <!-- 重启镜像机器：2 -->
          <cb-button
            v-if="instanceState === '2'"
            @click="restartImageScene"
            hollow
            icon="icon-bianjiqizhongqi"
          >
            {{ $t('device.restartSnapshotMachine') }}
          </cb-button>
          <!-- 释放镜像机器：2 -->
          <cb-button
            v-if="instanceState === '2'"
            @click="freeImageScene"
            colorType="red hollow"
            icon="icon-guanbi"
          >
            {{ $t('device.freeSnapshotMachine') }}
          </cb-button>
          <!-- 保存快照：2 -->
          <cb-button
            v-if="instanceState === '2'"
            colorType="hollow"
            icon="icon-kuaizhao"
            @click="showSnapshotForm"
          >
            {{ $t('device.saveSnapshot') }}
          </cb-button>
        </p>
        <!-- 错误信息：device对象里的error存在时显示错误信息 -->
        <p v-if="sceneError" class="error-info">
          <span class="image-error" :title="sceneError">
            {{ $t('device.error') }}：{{ sceneError }}
          </span>
        </p>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import {
  createImageScene,
  deleteImageScene,
  getImageSceneMessage,
  freeImageScene,
  restartImage,
  exportImage,
} from '@/api/device/image';
import Snapshot from './Snapshot';
import SnapshotFormModal from './SnapshotFormModal';
import wsutil from '@/utils/websocket-image';

export default {
  name: 'DeviceControl',
  components: {
    Snapshot,
    SnapshotFormModal,
  },
  props: {
    // 单行表格row的数据
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      iframeContent: false, //查看连接信息登录是否使用iframe嵌套
      sceneInfoVisible: false,
      connectionData: [],
      snapshotModalTrigger: false,
      deviceTemp: _.cloneDeep(this.data),
      enabledExportImg: true,
      socket: null,
    };
  },
  computed: {
    device() {
      return this.data;
    },
    // 快照: 父组件表格数据中snapshot_count 有数量时，操作列 展示"历史版本"，点击时展示快照历史
    snapshots() {
      if (
        (this.device?.ext_vm && this.device?.ext_vm?.snapshot_count) ||
        (this.device?.ext_docker && this.device?.ext_docker?.snapshot_count)
      ) {
        return (
          this.device?.ext_vm?.snapshot_count ||
          this.device?.ext_docker?.snapshot_count
        );
      }
    },

    // 父组件表格的device.image_type 必须是 虚拟机或者容器 或者 dynamips时，此操作组件DeviceOperateBtn才显示
    visible() {
      return (
        this.device.image_type === this.$CONSTANT.Device.ImageType.VM.value ||
        this.device.image_type ===
          this.$CONSTANT.Device.ImageType.CONTAINER.value ||
        this.device.image_type === 'dynamips'
      );
    },

    // image_type 和 instance_state 决定部分按钮的显示
    instanceState: {
      get() {
        const { image_type, ext_vm, ext_docker } = this.device;
        if (image_type === 'vm' || image_type === 'dynamips') {
          return ext_vm ? ext_vm.instance_state.toString() : '';
        } else if (image_type === 'container') {
          return ext_docker ? ext_docker.instance_state.toString() : '';
        }
      },
    },

    // 操作列中有"创建错误"等时 鼠标浮动上去 显示的错误信息
    vmDockerError() {
      let imageType = this.device.image_type;
      if (imageType === 'vm' || imageType === 'dynamips') {
        let extInfo = this.device?.ext_vm?.ext_info;
        if (extInfo && extInfo.message) {
          return extInfo.message;
        }
      } else if (imageType === 'container') {
        let extInfo = this.device?.ext_docker?.ext_info;
        if (extInfo && extInfo.message) {
          return extInfo.message;
        }
      }
    },
    // 父组件表格的 error 存在时
    sceneError() {
      return this.device.ext_image_info && this.device.ext_image_info.error
        ? this.device.ext_image_info.error
        : '';
    },

    // 操作类型:
    /* a: 快照保存中，
       b: 快照合并中，
       c: 文件注入中，
       d: 镜像导出中，
       e: 镜像实例创建中
       f: 镜像实例删除中
    */
    deviceActions() {
      const device_actions =
        _.get(this.device, 'ext_image_info.device_actions', '') || '';
      if (device_actions.indexOf('a') > -1) {
        return 'a';
      } else if (device_actions.indexOf('b') > -1) {
        return 'b';
      } else if (device_actions.indexOf('c') > -1) {
        return 'c';
      } else if (device_actions.indexOf('d') > -1) {
        return 'd';
      } else if (device_actions.indexOf('e') > -1) {
        return 'e';
      } else if (device_actions.indexOf('f') > -1) {
        return 'f';
      } else {
        return device_actions;
      }
    },

    // 镜像状态
    imageStatus() {
      return this.data.image_status?.toString();
    },
  },
  watch: {},
  mounted() {},
  methods: {
    // 查看机器->连接信息->协议前面加接入状态图标
    connectionState(item) {
      return !item.connection_state
        ? 'icon-jiazai'
        : item.connection_state === 1
        ? 'icon-danxuan-xuanzhong'
        : 'icon-liebiao-beigongxianbingdangji';
    },

    // 镜像导出
    exportImg() {
      let rowData = [];
      rowData = this.device;
      exportImage(rowData.uuid, rowData.name).then((res) => {
        let url = res?.data?.data;
        window.top.open(url, '_blank');
      });
    },

    // 查看机器、创建中 -> 连接信息
    bindSceneWs() {
      this.socket && this.socket.close();
      this.socket = wsutil.cbind(
        `/mp/ws/devops/cluster/images-connect/${this.device.uuid}`,
        {
          'MP-image-connection': (data) => {
            if (data && data.length) {
              this.connectionData = [];
              data.forEach((item) => {
                if (item.protocol === 'http' || item.protocol === 'https') {
                  item.url = `${item.protocol}://${item.ip_address}:${item.port}`;
                }
              });
              this.connectionData = data;
            }
          },
        },
      );
    },

    // 历史版本
    snapshotTriggerEvent() {
      this.snapshotModalTrigger = true;
    },

    // 合并快照弹框剔除
    snapshotHide(value) {
      this.snapshotModalTrigger = value;
    },

    mergeSnapshot() {
      this.snapshotModalTrigger = false;
    },

    // 点击"编辑镜像"时 创建镜像场景
    noSceneCreateImageScene() {
      createImageScene(this.device.uuid).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('common.operateSuccess'),
        });
      });
    },

    // 点击"查看机器" 时显示"连接信息"弹框
    showImageScene(data) {
      // 判断类型为容器container
      if (data.image_type === 'container') {
        this.iframeContent = true;
      }
      this.connectionData = [];
      getImageSceneMessage(this.device.uuid).then((res) => {
        const data = _.get(res, 'data.data', []) || [];
        if (data && data.length > 0) {
          data.forEach((item) => {
            if (item.protocol === 'http' || item.protocol === 'https') {
              item.url = `${item.protocol}://${item.ip_address}:${item.port}`;
            }
          });
          this.connectionData = [...data];
        }
        this.sceneInfoVisible = true;
        // 请求中台的ws更新连接信息
        this.bindSceneWs();
      });
    },

    openNewWindow(item) {
      if (this.iframeContent && item.protocol === 'console') {
        //点击登录容器的console协议
        const operationUrl = this.$router.resolve({
          name: 'image-manage-connect',
          query: {
            connectUrl: item.url,
          },
        });
        window.open(operationUrl.href, '_blank');
      } else {
        // 点击登录非容器或者容器的非console协议
        window.top.open(item.url, '_blank');
      }
    },

    // 点击"重启镜像机器"按钮，重新启动镜像场景
    restartImageScene() {
      let params = {};
      const { image_type, ext_vm, ext_docker } = this.device;
      if (image_type === 'vm' || image_type === 'dynamips') {
        params = {
          image_type,
          instance_id: ext_vm ? ext_vm.instance_uuid : '',
        };
      } else if (image_type === 'container') {
        params = {
          image_type,
          instance_id: ext_docker ? ext_docker.instance_uuid : '',
        };
      }
      restartImage(params).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('common.operateSuccess'),
        });
        this.$emit('reloadTable');
      });
    },

    // 点击"创建错误"
    deleteImageScene() {
      this.$confirm(this.$t('device.confirmDeleteImage')).then(() => {
        const params = {
          image_type: this.device.image_type,
          uuid: this.device.uuid,
        };
        deleteImageScene(params).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('common.operateSuccess'),
          });
        });
      });
    },

    // 点击"释放镜像机器" 和 创建错误 一样
    freeImageScene() {
      this.$confirm(this.$t('device.confirmDeleteImage')).then(() => {
        this.sceneInfoVisible = false;
        const params = {
          image_type: this.device.image_type,
          uuid: this.device.uuid,
        };
        freeImageScene(params).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('common.operateSuccess'),
          });
        });
      });
    },

    // 保存快照表单弹框
    showSnapshotForm() {
      this.$refs.snapshotFormModal.show();
    },

    closeAccessInfoDialog() {
      this.sceneInfoVisible = false;
    },

    // 协议对应的“web连接进入”按钮是否显示
    connectBtn(data) {
      let protocol = data.protocol;
      if (
        protocol === 'vnc' ||
        protocol === 'console' ||
        protocol === 'COM' ||
        protocol === 'ssh' ||
        protocol === 'rdp' ||
        protocol === 'telnet' ||
        protocol === 'serial' ||
        protocol === 'http' ||
        protocol === 'https'
      ) {
        return true;
      }
    },

    // 协议是console协议且虚拟类型不是虚拟机类型时，ip，端口，用户名，密码不展示。
    imageTypeNotVm(item) {
      return !(
        (item.protocol === 'console' || item.protocol === 'COM') &&
        this.device.image_type !== 'vm'
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.cursor-default-btn {
  min-width: 78px;
  ::v-deep .el-button {
    cursor: default;
  }
}
.snapshot {
  margin-right: 15px;
}

.device-operate-btn {
  display: inline-block;
}

.custom-icon {
  display: flex;
  align-items: center;
}
.jia-zai {
  animation-name: loading;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.error-info {
  color: #ff3045;
}
.image-error {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
