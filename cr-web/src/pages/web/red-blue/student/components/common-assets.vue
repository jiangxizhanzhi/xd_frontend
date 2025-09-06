<template>
  <div class="added-wrap">
    <equipment-list
      :showCategory="false"
      :showSearch="false"
      :showDevice="true"
      :showActice="false"
      :deviceList="addedList"
      :showConfig="false"
      :showRecreate="false"
      :showRestart="false"
      :showOpenClose="false"
      :showDelete="false"
      :start="start"
      @connect="openTap"
      :showDeleteAsset="true"
      @deleteAsset="deleteAsset"
    >
    </equipment-list>

    <!-- 添加资产弹窗 -->
    <cb-dialog
      :title="$t('rbt.addAssets')"
      :append-to-body="false"
      :visible.sync="showDeviceDialog"
      class="editParams"
      width="800px"
    >
      <div class="main-wrap">
        <div
          class="device-item"
          :key="index"
          v-for="(item, index) in canAddList"
          @click="changeChecked(item)"
          :class="[
            item.checked ? 'device-item-checked' : 'device-item-not-checked',
          ]"
        >
          <div class="device-detail">
            <!-- 设备logo -->
            <div class="left-wrap">
              <div
                class="logo-wrap"
                :style="{
                  opacity: item.occupy_flag === 1 ? 0.5 : 1,
                }"
              >
                <img :src="item.icon2" />
              </div>
            </div>
            <div class="right-wrap">
              <!-- 设备名称 -->
              <div
                class="device-name"
                :class="[
                  item.occupy_flag === 1
                    ? 'device-name-occupy'
                    : 'device-name-not-occupy',
                ]"
                :title="item.name"
              >
                {{ item.name }}
              </div>
              <!-- 设备分类 -->
              <div
                class="device-category"
                :class="[
                  item.occupy_flag === 1
                    ? 'device-category-occupy'
                    : 'device-category-not-occupy',
                ]"
              >
                <span
                  :title="computedCategory(item.category)"
                  class="name-style"
                  >{{ computedCategory(item.category) }}</span
                >
                <span class="mark-style"> | </span>
                <span
                  :title="handleVirtualType(item.virtual_type)"
                  class="name-style"
                  >{{ handleVirtualType(item.virtual_type) }}</span
                >
                <span class="mark-style"> | </span>
                <span :title="item.system_type_name" class="name-style">{{
                  item.system_type_name
                }}</span>
              </div>
              <div
                class="num-info"
                :class="[
                  item.occupy_flag === 1
                    ? 'num-info-occupy'
                    : 'num-info-not-occupy',
                ]"
              >
                <!-- ip显示状态 -->
                <div class="ip-info">
                  <div class="img-wrap">
                    <cb-iconfont
                      :size="16"
                      type="icon-IP"
                      class="num-info-icon"
                    ></cb-iconfont>
                  </div>
                  <div class="ip-value">
                    {{
                      item.ports.length && item.ports[0].ip
                        ? item.ports[0].ip
                        : '--'
                    }}
                  </div>
                </div>
                <!-- cpu显示状态 -->
                <div class="cpu-info">
                  <div class="img-wrap">
                    <cb-iconfont
                      :size="16"
                      type="icon-cpu"
                      class="num-info-icon"
                    ></cb-iconfont>
                  </div>
                  <div class="cpu-value">
                    {{
                      item.host_state && item.host_state.cpu_percent
                        ? item.host_state.cpu_percent + '%'
                        : '--'
                    }}
                  </div>
                </div>
                <!-- 内存显示状态 -->
                <div class="ram-info">
                  <div class="img-wrap">
                    <cb-iconfont
                      :size="16"
                      type="icon-neicun"
                      class="num-info-icon"
                    ></cb-iconfont>
                  </div>
                  <div class="ram-value">
                    {{
                      item.host_state && item.host_state.memory_percent
                        ? item.host_state.memory_percent + '%'
                        : '--'
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="connect-wrap">
            <div class="connect-info">
              <div
                v-if="item.occupy_flag === 1"
                :class="[
                  item.occupy_flag === 1
                    ? 'connect-info-occupy'
                    : 'connect-info-not-occupy',
                ]"
              >
                <!-- 占用状态  -->
                <span class="outer-wrap">
                  <i class="dot green"></i>
                  <span class="name">{{ item.collect_user }}</span>
                  <span> {{ $t('rbt.occupied') }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <cb-button button-type="confirm" @click="confirm" mr> </cb-button>
        <cb-button button-type="cancel" @click="cancel"> </cb-button>
      </div>
    </cb-dialog>
  </div>
</template>

<script>
import utils from '@/utils/utils';
import wsutil from '@/utils/websocket';
import { getSceneStatus, handleWsData } from '@/utils/scene-websocket';
import equipmentList from '@/pages/web/red-blue/admin/components/equipment-list.vue';
import {
  getCanAddList,
  getAddedList,
  postCommonDevice,
  deleteCommonDevice,
} from '@/api/web/red-blue.js';
import emptyPage from '@/pages/web/Empty';
export default {
  components: {
    equipmentList,
    emptyPage,
  },
  props: {
    topologyData: {
      type: Object,
      default: () => {},
    },
    resource_id: {
      type: String,
      default: '',
    },
    runningStatus: {
      // 判断是否可以添加主机, 处于[2, 3]时可以添加主机，其他状态码不允许添加主机
      type: Number,
      default: undefined,
    },
    start: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cookie: '',
      showDeviceDialog: false,
      categoryOption: [
        {
          label: this.$t('rbt.allEquipment'),
          value: '',
        },
        {
          label: this.$t('admin.OS'),
          value: 1,
        },
        {
          label: this.$t('admin.appSystem'),
          value: 2,
        },
        {
          label: this.$t('admin.netDevice'),
          value: 3,
        },
        {
          label: this.$t('admin.secDevice'),
          value: 4,
        },
      ],
      canAddList: [], //可添加列表
      addedList: [], //已添加列表
      wsData: {},
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.cookie = utils.getCookie('cr_jwttoken');
    // 获取已添加资产列表
    this.getAddedDevice();
    this.bindSceneWs();
  },
  methods: {
    // 获取已添加资产列表
    getAddedDevice() {
      getAddedList({ resource_id: this.resource_id }).then((res) => {
        this.addedList = [];
        const data = _.get(res, 'data.data', []);
        if (data?.length) {
          data.forEach((item) => {
            item.device_info.del_id = item.resource_id;
            this.addedList.push(item.device_info);
          });
        }
      });
    },
    // 获取可添加常用资产列表
    getCanAddDevice() {
      this.canAddList = [];
      getCanAddList({ resource_id: this.resource_id }).then((res) => {
        const data = _.get(res, 'data.data', []);
        data.forEach((item) => {
          // occupy_flag占用状态，1占用，0未占用
          item.device_info.occupy_flag = item.occupy_flag;
          item.device_info.collect_user = item.collect_user;
          // 添加checked属性用来控制选中状态
          item.device_info.checked = false;
          this.canAddList.push(item.device_info);
        });
        if (this.canAddList.length) {
          this.showDeviceDialog = true;
        } else {
          this.$message.error(this.$t('m.noHasAircraft'));
          return false;
        }
      });
    },
    confirm() {
      // 筛选出选中的设备
      const common_device_context_list = [];
      this.canAddList.forEach((item) => {
        if (item.checked === true) {
          common_device_context_list.push({
            device_id: item.id,
          });
        }
      });
      if (common_device_context_list.length) {
        const params = {
          room_id: this.resource_id,
          common_device_context_list: common_device_context_list,
        };
        postCommonDevice(params).then((res) => {
          this.getAddedDevice();
          this.showDeviceDialog = false;
        });
      } else {
        this.$message.error(this.$t('rbt.selectAssets'));
        return false;
      }
    },
    cancel() {
      this.canAddList.forEach((item) => {
        item.checked = false;
      });
      this.showDeviceDialog = false;
    },
    // 选中状态改变
    changeChecked(data) {
      this.canAddList.forEach((item) => {
        // occupy_flag为0未占用才可以选中
        if (item.occupy_flag === 0) {
          if (item.id === data.id) {
            item.checked = !item.checked;
          }
        }
      });
    },
    // 设备分类
    computedCategory(category) {
      const data = this.categoryOption.filter((item) => {
        return item.value === category;
      });
      if (data.length) {
        return data[0].label;
      }
    },
    // 机器类型
    handleVirtualType(value) {
      // 1 交换机
      // 2 路由器
      // 3 防火墙
      // 4 虚拟机
      // 5 容器
      // 6 实体设备
      const data = {
        1: this.$t('device.switch'),
        2: this.$t('device.router'),
        3: this.$t('device.firewall'),
        4: this.$t('device.vm'),
        5: this.$t('device.docker'),
        6: this.$t('device.real'),
      };
      return data[value];
    },
    // 接入方式
    openTap(connection_url, access_modes, nodeId, image_type, nodeName) {
      this.$emit(
        'connect',
        connection_url,
        access_modes,
        nodeId,
        image_type,
        nodeName,
      );
    },
    deleteAsset(data) {
      this.$confirm(this.$t('common.confirmDelete') + '?').then(() => {
        deleteCommonDevice({ resource_id: data.del_id }).then((res) => {
          this.getAddedDevice();
          this.$message.success(this.$t('common.operateSuccess'));
        });
      });
    },
    // ws请求
    bindSceneWs() {
      wsutil.cbind(
        `/ojj/ws/cr/ce_base/scene?business_id=${this.resource_id}&token=${this.cookie}`,
        {
          '': (data) => {
            const wsData = handleWsData(data, this.progress, this.sceneData);
            if (data.type === 'scene_element') {
              this.wsData = data.data;
              this.addedList.forEach((item) => {
                if (item.id === this.wsData.scene_element.id) {
                  item.event = this.wsData.scene_element.event;
                  item.event_status = this.wsData.scene_element.event_status;
                  item.name = this.wsData.scene_element.name;
                  // 更新节点端口的port协议接入数据
                  item.ports.forEach((port) => {
                    if (
                      this.wsData.scene_element_port_plugin_data.cpcloud.hasOwnProperty(
                        port.id,
                      )
                    ) {
                      port['cloud_access_modes'] =
                        this.wsData.scene_element_port_plugin_data.cpcloud[
                          port.id
                        ].access_modes;
                    }
                  });
                }
              });
            }
          },
        },
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.added-wrap {
  height: 100%;
  ::v-deep.equipment-list {
    padding: 0 !important;
    .device-list {
      height: 100%;
    }
  }
}

.main-wrap {
  display: flex;
  flex-wrap: wrap;
  .device-item {
    width: calc(50% - 8px);
    margin-right: 16px;
    height: 134px;
    padding: 8px;
    background: var(--bg-color-3);
    margin-bottom: 16px;
    cursor: pointer;
    &:nth-child(2n) {
      margin-right: 0;
    }
    .device-detail {
      height: 85px;
      border-bottom: 1px solid var(--neutral1);
      display: flex;
      .left-wrap {
        .logo-wrap {
          width: 32px;
          height: 32px;
          opacity: 1;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .right-wrap {
        margin-left: 8px;
        flex: 1;
        cursor: pointer;
        .device-name {
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .device-name-occupy {
          color: var(--neutral4);
        }
        .device-name-not-occupy {
          color: var(--neutral8);
        }
        .device-category {
          margin-top: 4px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          .name-style {
            max-width: 80px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .mark-style {
            position: relative;
            top: -6px;
          }
        }
        .device-category-occupy {
          color: var(--neutral4);
        }
        .device-category-not-occupy {
          color: var(--neutral7);
        }
        .num-info {
          margin-top: 8px;
          display: flex;
          .ip-info,
          .cpu-info,
          .ram-info {
            height: 20px;
            display: flex;
            align-items: center;
            font-size: 12px;
            margin-right: 20px;
            .img-wrap {
              width: 16px;
              height: 16px;
              margin-right: 6px;
              .num-info-icon {
                color: var(--neutral5);
              }
            }
          }

          .ip-value {
            width: 94px;
          }
          .cpu-value {
            width: 50px;
          }
          .ram-value {
            width: 50px;
          }
        }
        .num-info-occupy {
          color: var(--neutral4);
        }
        .num-info-not-occupy {
          color: var(--neutral8);
        }
      }
    }
    .connect-wrap {
      margin-top: 4px;
      height: 32px;
      line-height: 32px;
      position: relative;
      .connect-info {
        display: flex;
        align-items: center;
        .outer-wrap {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          display: flex;
          align-items: center;
          color: var(--neutral4);
        }
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-right: 5px;
          opacity: 0.5;
        }
        .green {
          background: var(--green-color);
        }
        .red {
          background: var(--red-color);
        }
        .connect-tip {
          display: flex;
          align-items: center;
          color: var(--neutral7);
          font-size: 12px;
          span {
            display: inline-block;
            max-width: 60px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .connect-info-occupy {
        color: var(--neutral8);
      }
      .connect-info-not-occupy {
        color: var(--neutral4);
      }
    }
  }
  .device-item-checked {
    border: 1px solid var(--primary-color);
  }
  .device-item-not-checked {
    border: 1px solid var(--bg-color-3);
  }
}
</style>
