<template>
  <div class="popover" :id="nodePoverId">
    <template v-if="nodeId">
      <div class="title-box">{{ clickName }}</div>
      <!--      静态路由表-->
      <div class="zIndex" v-if="popoverData.staticRoutes.length">
        <div class="ft14 mt15">{{ $tt('stage.staticRouterList') }} :</div>
        <div
          v-for="(item, index) in popoverData.staticRoutes"
          :key="index"
          class="ft14"
        >
          {{ item.destination || '' }}
          <cb-iconfont
            class="direction-icon"
            type="icon-zhixiang"
            color="#fff"
            :size="28"
          ></cb-iconfont>
          {{ item.nexthop || '' }}
        </div>
      </div>
      <!--      协议登录-->
      <div
        class="zIndex"
        v-if="popoverData.access && Object.keys(popoverData.access).length"
      >
        <div
          v-for="(item, index) in popoverData.access"
          :key="index"
          class="ft14"
          :class="{ ft14: true, unusable: !item.busy }"
        >
          <div>
            <div
              class="mb10 mt15"
              v-if="
                (!popoverData.is_build_in && popoverData.role != 3) ||
                popoverData.type === 'build_in_router'
              "
            >
              <template
                v-if="
                  ![
                    'build_in_router',
                    'dyrouter',
                    'dyfirewall',
                    'dyswitcher',
                  ].includes(popoverData.type)
                "
              >
                {{
                  item.conn_to_ext_net
                    ? $tt('stage.externalNetworkAddress') + ' : '
                    : $tt('stage.intranetAddress') + ' : '
                }}{{ index }}
              </template>
            </div>
            <template
              v-if="
                ((!popoverData.is_build_in && popoverData.role != 3) ||
                  popoverData.type === 'build_in_router') &&
                showAccessFunc(nodeId, item)
              "
            >
              <template
                v-if="
                  item.modes &&
                  Object.keys(item.modes).length &&
                  checkIsAdmin(item.modes)
                "
              >
                <div>{{ $tt('stage.accessEnvironment') }} :</div>
                <template v-for="(itm, idx) in item.modes">
                  <div
                    :key="index + idx"
                    v-if="checkIsAdmin([itm]) && itm.protocol"
                  >
                    <div>
                      <!--开机状态显示图标-->
                      <template v-if="!showShutUpBtn">
                        <cb-iconfont
                          :class="[
                            'access-icon',
                            'access-icon-' + itm.available,
                          ]"
                          :type="itm.available ? 'icon-duigou' : 'icon-jiazai'"
                          :color="
                            itm.available
                              ? 'var(--green-color)'
                              : 'var(--primary-color)'
                          "
                        ></cb-iconfont>
                      </template>
                      <!--关机状态显示灰色的点-->
                      <template v-else>
                        <div class="circle-gray"></div>
                      </template>
                      {{ itm.protocol || ' -- ' }} {{ itm.access_ip || '  ' }}
                      {{ itm.access_port || ' -- ' }}
                    </div>
                    <div v-if="itm.username || itm.password">
                      {{ $tt('global.userName') }} :
                      {{ itm.username || ' -- ' }}
                      {{ $tt('global.password') }} :
                      {{ itm.password || ' -- ' }}
                    </div>
                    <div class="login-btn">
                      <cb-button
                        v-if="
                          ((itm.protocol != 'nc' && itm.proxy) ||
                            itm.protocol == 'console' ||
                            itm.protocol == 'COM') &&
                          showCurrentPageBtn
                        "
                        icon="icon-dangqianchuangkou"
                        @click="jumpToPage(itm, 'current')"
                        :disabled="!item.busy || !itm.available"
                        >{{ $tt('stage.currentPageLogin') }}
                      </cb-button>
                      <cb-button
                        v-if="
                          (itm.protocol != 'nc' && itm.proxy) ||
                          itm.protocol == 'console' ||
                          itm.protocol == 'COM'
                        "
                        icon="icon-web"
                        @click="jumpToPage(itm)"
                        :disabled="!item.busy || !itm.available"
                        >{{ itm.protocol }} {{ $tt('global.login') }}
                      </cb-button>
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>{{ $tt('stage.noAccessInformation') }}</template>
            </template>
          </div>
        </div>
      </div>
      <div class="zIndex nodeBtn" v-if="isShowNodeBtn">
        <cb-button-group v-if="showNodeBtn || showSnapShotBtn || showSnapshotHistoryBtn || showShutDownAndUpBtn">
          <cb-button
            v-if="showNodeBtn"
            hollow
            icon="icon-zhongjian"
            @click="onNodeRebuild"
            :disabled="disableRebuild"
          >{{ $tt('stage.rebuild') }}
          </cb-button>
          <cb-button
            v-if="showNodeBtn"
            hollow
            icon="icon-zhongqi1"
            @click="onNodeRestart"
            :disabled="disableRestart"
            >{{ $tt('stage.restart') }}
          </cb-button>
          <cb-button
            v-if="showNodeBtn && showShutDownBtn && showShutDownAndUpBtn"
            hollow
            icon="icon-guanji"
            @click="onNodeShutDown"
            >{{ $tt('stage.shutdown') }}
          </cb-button>
          <cb-button
            v-if="showNodeBtn && showShutUpBtn && showShutDownAndUpBtn"
            hollow
            icon="icon-guanji"
            @click="onNodeShutUp"
            >{{ $tt('stage.shutup') }}
          </cb-button>
          <cb-button
            v-if="showSnapShotBtn && popoverData.type != 'build_in_router'"
            :disabled="disableSaveSnapshot"
            hollow
            icon="icon-kuaizhao"
            @click="onNodeSnapshot"
            >{{ $tt('stage.saveSnapshot') }}
          </cb-button>
          <cb-button
            v-if="
              showSnapshotHistoryBtn &&
              snapshotHistoryCount &&
              popoverData.type != 'build_in_router'
            "
            hollow
            icon="icon-baocun"
            @click="onSnapshotHistory"
            >{{
              $tt('stage.snapshotHistory', {
                count: snapshotHistoryCount || '--',
              })
            }}
          </cb-button>
        </cb-button-group>
      </div>
      <!--      网络配置-->
      <div
        class="zIndex"
        v-if="popoverData.network && Object.keys(popoverData.network).length"
      >
        <div class="ft14 mt15">{{ $tt('stage.networkConfig') }} :</div>
        <div
          v-for="(item, index) in popoverData.network"
          :key="index"
          :class="{ ft14: true, unusable: !item.busy }"
        >
          {{ index }} : &nbsp;{{ item.ip || '--' }}
        </div>
        <cb-button @click="snpmClick" v-if="isShowSnpmBtn">{{
          $tt('stage.snmpCollection')
        }}</cb-button>
      </div>
      <!--      简易型交换机展示信息-->
      <div class="zIndex" v-if="popoverData.type === 'switcher'">
        <div class="ft14 mt15">{{ $tt('stage.networkConfig') }} :</div>
        <div
          v-for="(item, index) in popoverData.switcherInfo"
          :key="index"
          :class="{ ft14: true }"
        >
          <span class="txt-label">{{ item.label }} : &nbsp;</span
          >{{ item.value || '--' }}
        </div>
      </div>
    </template>
    <snmp-config
      ref="snmpRef"
      :title="snmpTitle"
      :mib-data="mibData"
      :snmp-config="snmpConfig"
      :scene-id="mpSceneId"
      :node-id="nodeId"
    ></snmp-config>
  </div>
</template>
<script>
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import getNodeCategory from '../../../types/get-node-category';
import { getSnapshotHistory } from '../../../api';
import t, { i18n } from '../../../utils/i18n';
import {
  edgesToMap,
  topoEdgesToConnections,
} from '../../../utils/port-processing/port-generation';
import SnmpConfig from '../dialog/snmp/index.vue';
import { ROLE } from '../../../types/role';
import sceneStore from "../../../store/scene-store";
export default {
  name: 'NodePopover',
  components: {
    SnmpConfig,
  },
  // inheritAttrs: false,
  props: {
    nodeId: {
      type: String,
      default: '',
    },
    mpSceneId: {
      type: String,
      default: '',
    },
    nodeData: {
      type: Object,
      default: () => {},
    },
    topologyEdges: {
      type: Array,
      default: () => [],
    },
    showAccessFunc: {
      type: Function,
      default: () => true,
    },
    showNodeBtn: {
      type: Boolean,
      default: true,
    },
    //是否显示关机开机按钮，针对竞赛不需要开机关机做的处理
    showShutDownAndUpBtn: {
      type: Boolean,
      default: true,
    },

    // 保存快照
    showSnapShotBtn: {
      type: Boolean,
      default: false,
    },
    // 历史版本
    showSnapshotHistoryBtn: {
      type: Boolean,
      default: false,
    },
    showPopover: {
      type: Boolean,
      default: false,
    },
    /**
     * 控制展示隐藏接入弹窗的空闲端口
     */
    hideUselessPortInAccessDialog: {
      type: Boolean,
      default: false,
    },
    sceneEid: {
      type: String,
      default: '',
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    // 是否显当前页面登录按钮
    showCurrentPageBtn: {
      type: Boolean,
      default: false,
    },
    // 是否需要判断节点的角色资产配置，用于限制接入面板的重启重建开关机按钮
    needToJudgeRoleAssetAllocation: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }, context) {
    let clickName = ref('');
    let snapshotHistoryCount = ref(0);
    let disableSaveSnapshot = ref(false);
    let disableRebuild = ref(false); // 重建按钮禁用
    let disableRestart = ref(false); // 重启按钮禁用
    let showShutDownBtn = ref(false);
    let showShutUpBtn = ref(false);
    let connectionMap = ref();
    let snmpRef = ref(null);
    let snmpTitle = ref(null);
    let mibData = ref(null);
    let snmpConfig = ref(null);
    let getSnapshotHistoryCountFlag = false;
    let clickedNodeInfo = ref({
      id: '',
      role: '',
      image_type: '',
      is_build_in: '',
      image_uuid: '',
    });
    const popoverData = ref({
      type: '',
      is_build_in: false,
      access: {},
      staticRoutes: [],
      network: {},
      switcherInfo: {}, // 简易型交换机展示信息
    });

    onMounted(() => {
      watch(
        () => props.nodeData,
        (val) => {
          snapshotHistoryCount.value = null;
          if (!val || !Object.keys(val).length) return;
          let { basicConfig } = val;
          clickedNodeInfo.value = {
            id: props?.nodeId,
            role: basicConfig?.role,
            image_type: basicConfig?.image_type,
            is_build_in: basicConfig?.is_build_in,
            image_uuid: basicConfig?.image_uuid,
          };
          if (isShowNodeBtn.value) {
            if (!getSnapshotHistoryCountFlag && props.showSnapshotHistoryBtn) {
              if (!basicConfig?.image_uuid) return;
              getSnapshotHistory(basicConfig?.image_uuid).then((res) => {
                snapshotHistoryCount.value = res?.data?.data?.length;
              });
            }
          }
          connectionMap.value = edgesToMap(
            topoEdgesToConnections(props.topologyEdges),
          );
          getAccessData(val);
        },
        {
          deep: true,
          immediate: true,
        },
      );
    });
    // 核心路由器+非内置的vm/container/dynamips 需要显示重启重建等按钮
    const isShowNodeBtn = computed(() => {
      let assetsAvailable = false;
      if (props.needToJudgeRoleAssetAllocation) {
        sceneStore.state.assets?.forEach(role => {
          role?.children?.forEach(child => {
            if (child.asset_nodes?.some(node => node.id === props.nodeId)) {
              assetsAvailable = true;
            }
          })
        })
      }
      let asset = props.needToJudgeRoleAssetAllocation ? assetsAvailable : true;
      return (
        (!props.nodeData?.basicConfig.is_build_in &&
          props.nodeData?.basicConfig.role !== 3 &&
          (props.nodeData?.basicConfig?.image_type === 'vm' ||
            props.nodeData?.basicConfig?.image_type === 'container' ||
            props.nodeData?.basicConfig?.image_type === 'dynamips')) ||
        (props.nodeData?.basicConfig.is_build_in &&
          props.nodeData?.basicConfig.role == ROLE['router'] &&
          props.nodeData?.basicConfig?.image_type === 'vm')
      ) && asset;
    });
    const isShowSnpmBtn = computed(() => {
      return (
        [ROLE['router'], ROLE['firewall'], ROLE['switch']].includes(
          props.nodeData?.basicConfig.role,
        ) &&
        props.nodeData?.basicConfig?.image_type === 'entity' &&
        props.nodeData?.snmp_config?.config_switch
      );
    });

    const showPopoverForm = computed({
      get: () => {
        return props.showPopover;
      },
      set: (val) => {
        emit('update:show-popover', val);
        return val;
      },
    });

    const nodePoverId = computed({
      get: () => {
        return 'node-popover-' + props.sceneEid;
      },
    });

    // snpm采集
    const snpmClick = () => {
      snmpRef.value.visible = true;
      snmpRef.value.name = '';
      snmpRef.value.oid = '';
      snmpRef.value.syntax = '';
      snmpRef.value.mibTree = false;
      snmpTitle.value = props.nodeData.basicConfig.name;
      mibData.value = props.nodeData.mib_data;
      snmpConfig.value = props.nodeData.snmp_config;
    };
    /**
     * 接入方式数据处理
     */
    const getAccessData = (nodeData) => {
      if (!nodeData) return;
      const networkConfig = nodeData?.networkConfig;
      const network = networkConfig?.network || [];
      const routerConfig = nodeData?.routerConfig.routerConfig || [];
      const basicConfig = nodeData?.basicConfig;
      clickName.value = basicConfig?.name;
      const { type: type } = getNodeCategory(
        basicConfig.role,
        basicConfig.image_type,
        basicConfig.is_build_in,
      );
      popoverData.value = {
        type: type,
        is_build_in: basicConfig.is_build_in,
        access: {},
        staticRoutes: routerConfig,
        network: {},
        switcherInfo: {},
      };

      // 历史快照
      if (basicConfig.event == 8 && basicConfig.event_status == 4) {
        snapshotHistoryCount.value = basicConfig?.image_snapshot_num;
      }
      // event_status 等于4或者5时，开启保存快照按钮
      disableSaveSnapshot.value =
        basicConfig.event_status != 4 && basicConfig.event_status != 5;

      // 开启重建重启
      /**
       * event:2,event_status:4 创建完成
       * event:5,event_status:4 重启完成
       * event:5,event_status:5 重启异常
       * event:11,event_status:4 重建成功
       * event:11,event_status:5 重建异常
       * event:7,event_status:4 暂停恢复完成
       * event:13,event_status:4 挂起状态恢复完成
       * event:8,event_status:4 快照完成
       *
       * 5.4需求
       *  event:3,event_status:4 启动完成
       *  event:4,event_status:4 停止完成
       *  event:2,event_status:5 创建异常
       *  event:3,event_status:5 启动异常
       *  event:4,event_status:5 停止异常
       *  event:5,event_status:5 重启异常
       *  event:6,event_status:5 暂停异常
       *  event:7,event_status:5 暂停恢复异常
       *  event:9,event_status:5 删除异常
       *  event:10,event_status:5 修改异常
       *  event:12,event_status:5 挂起异常
       *  event:13,event_status:5 挂起状态恢复异常
       */
      disableRebuild.value = !(
        (basicConfig.event == 2 && basicConfig.event_status == 4) ||
        (basicConfig.event == 5 && basicConfig.event_status == 4) ||
        (basicConfig.event == 5 && basicConfig.event_status == 5) ||
        (basicConfig.event == 11 && basicConfig.event_status == 4) ||
        (basicConfig.event == 11 && basicConfig.event_status == 5) ||
        (basicConfig.event == 7 && basicConfig.event_status == 4) ||
        (basicConfig.event == 13 && basicConfig.event_status == 4) ||
        (basicConfig.event == 8 && basicConfig.event_status == 4) ||
        // 5.4新需求 单个节点启动异常也可以重启重建以及开机关机状态下也可以重启重建
        (basicConfig.event == 4 && basicConfig.event_status == 4) ||
        (basicConfig.event == 3 && basicConfig.event_status == 4) ||
        (basicConfig.event == 2 && basicConfig.event_status == 5) ||
        (basicConfig.event == 3 && basicConfig.event_status == 5) ||
        (basicConfig.event == 4 && basicConfig.event_status == 5) ||
        (basicConfig.event == 6 && basicConfig.event_status == 5) ||
        (basicConfig.event == 7 && basicConfig.event_status == 5) ||
        (basicConfig.event == 9 && basicConfig.event_status == 5) ||
        (basicConfig.event == 10 && basicConfig.event_status == 5) ||
        (basicConfig.event == 12 && basicConfig.event_status == 5) ||
        (basicConfig.event == 13 && basicConfig.event_status == 5) ||
        (basicConfig.event == 10 && basicConfig.event_status == 4)
      );
      disableRestart.value = !(
        (basicConfig.event == 2 && basicConfig.event_status == 4) ||
        (basicConfig.event == 5 && basicConfig.event_status == 4) ||
        // (basicConfig.event == 5 && basicConfig.event_status == 5) ||
        (basicConfig.event == 11 && basicConfig.event_status == 4) ||
        // (basicConfig.event == 11 && basicConfig.event_status == 5) ||
        (basicConfig.event == 7 && basicConfig.event_status == 4) ||
        (basicConfig.event == 13 && basicConfig.event_status == 4) ||
        (basicConfig.event == 8 && basicConfig.event_status == 4) ||
        // 5.4新需求 单个节点启动异常也可以重启重建以及开机关机状态下也可以重启重建
        (basicConfig.event == 4 && basicConfig.event_status == 4) ||
        (basicConfig.event == 3 && basicConfig.event_status == 4) ||
        // (basicConfig.event == 2 && basicConfig.event_status == 5) ||
        (basicConfig.event == 3 && basicConfig.event_status == 5) ||
        (basicConfig.event == 4 && basicConfig.event_status == 5) ||
        (basicConfig.event == 6 && basicConfig.event_status == 5) ||
        (basicConfig.event == 7 && basicConfig.event_status == 5) ||
        // (basicConfig.event == 9 && basicConfig.event_status == 5) ||
        (basicConfig.event == 10 && basicConfig.event_status == 5) ||
        (basicConfig.event == 12 && basicConfig.event_status == 5) ||
        (basicConfig.event == 13 && basicConfig.event_status == 5) ||
        (basicConfig.event == 10 && basicConfig.event_status == 4)
      );
      /**
       * 开启关机按钮
       *
       */
      showShutDownBtn.value =
        (basicConfig.event == 2 && basicConfig.event_status == 4) ||
        (basicConfig.event == 3 && basicConfig.event_status == 4) ||
        (basicConfig.event == 5 && basicConfig.event_status == 4) ||
        (basicConfig.event == 7 && basicConfig.event_status == 4) ||
        (basicConfig.event == 8 && basicConfig.event_status == 4) ||
        (basicConfig.event == 10 && basicConfig.event_status == 4) ||
        (basicConfig.event == 11 && basicConfig.event_status == 4) ||
        (basicConfig.event == 13 && basicConfig.event_status == 4) ||
        (basicConfig.event == 3 && basicConfig.event_status == 5);
      /**
       * 开启开机按钮
       */
      showShutUpBtn.value =
        (basicConfig.event == 4 && basicConfig.event_status == 4) ||
        (basicConfig.event == 4 && basicConfig.event_status == 5);

      // 非內置的靶标（除外部网络） 展示接入方式
      if (
        !basicConfig.is_build_in &&
        basicConfig.role !== 3 &&
        basicConfig.image_type != 'dynamips'
      ) {
        network.forEach((item) => {
          if (item.ip) {
            if (popoverData.value.access[item.ip]) {
              popoverData.value.access[item.ip] = {
                modes: [
                  ...(popoverData.value.access[item.ip]?.modes||[]),
                  ...(item.access_modes || []),
                ],
                conn_to_ext_net: item.conn_to_ext_net,
                role: basicConfig.role,
                name: item.name,
                is_build_in: basicConfig.is_build_in,
                busy:
                  basicConfig.image_type === 'vm' || basicConfig.image_type === 'container'
                    ? true
                    : popoverData.value.access[item.ip]?.busy || connectionMap.value?.has(item.id),
              };
            } else {
              popoverData.value.access[item.ip] = {
                modes: item.access_modes,
                conn_to_ext_net: item.conn_to_ext_net,
                role: basicConfig.role,
                name: item.name,
                is_build_in: basicConfig.is_build_in,
                busy:
                  basicConfig.image_type === 'vm' || basicConfig.image_type === 'container'
                    ? true
                    : popoverData.value.access[item.ip]?.busy || connectionMap.value?.has(item.id),
              };
            }
          }
        });
        // 网络设备，如果没有接入信息，就把ip 和 接入信息部分都去掉
        if ([21, 22, 23].includes(basicConfig.role)) {
          for (let accessKey in popoverData.value?.access) {
            if (
              accessKey &&
              !popoverData.value?.access[accessKey].modes?.length
            ) {
              delete popoverData.value.access[accessKey];
            }
          }
        }
      }
      /**
       * 核心路由器展示console接入+重启重建+网络配置，不展示内外网ip地址
       * dynamips节点展示类同核心路由器，展示重启、重建、关机、保存快照、历史版本
       */
      if (
        ['build_in_router', 'dyrouter', 'dyfirewall', 'dyswitcher'].includes(
          type,
        )
      ) {
        network.forEach((item) => {
          if (
            item.access_modes &&
            !Object.keys(popoverData.value.access).length
          ) {
            popoverData.value.access[item.ip] = {
              modes: item.access_modes,
              busy: true,
            };
          }
        });
      }
      // 网关节点和仿真节点展示网络配置(除简易型交换机，简易型交换机只展示网关地址)
      if (
        [21, 22, 23, 7, 1].includes(basicConfig.role) &&
        type !== 'switcher'
      ) {
        // 如果配置不展示空闲端口，则跳过
        if (props.hideUselessPortInAccessDialog) {
          network.forEach((item) => {
            let busy = connectionMap.value?.has(item.id);
            if (busy) {
              popoverData.value.network[item.name] = {
                role: basicConfig.role,
                ip: item.ip,
                busy: busy,
              };
            }
          });
        } else {
          // 展示所有端口
          network.forEach((item) => {
            popoverData.value.network[item.name] = {
              role: basicConfig.role,
              ip: item.ip,
              busy: connectionMap.value?.has(item.id),
            };
          });
        }
      }
      // 简易型交换机只展示网关地址
      if (type === 'switcher') {
        popoverData.value.switcherInfo = {
          address: {
            label: t('target.addresses'),
            value: networkConfig.address || '',
          },
          gateway: {
            label: t('stage.gateway'),
            value: networkConfig.gateway || '',
          },
          vlanId: {
            label: 'vlanID',
            value: networkConfig.vlanId || '',
          },
        };
      }
    };

    /**
     * 跳转到新标签页
     */
    const jumpToPage = (path, jumpType) => {
      const basicConfig = props.nodeData?.basicConfig;
      emit(
        'jump-to-page',
        path.connection_url,
        path,
        props.nodeId,
        basicConfig?.image_type,
        clickName.value,
        jumpType,
      );
    };

    /**
     * 节点重启
     */
    const onNodeRestart = () => {
      emit('on-node-restart', clickedNodeInfo.value);
    };

    /**
     * 节点重建
     */
    const onNodeRebuild = () => {
      emit('on-node-rebuild', clickedNodeInfo.value);
    };
    /**
     * 节点关机
     */
    const onNodeShutDown = () => {
      emit('on-node-shutdown', clickedNodeInfo.value);
    };
    /**
     * 节点开机
     */
    const onNodeShutUp = () => {
      emit('on-node-shutup', clickedNodeInfo.value);
    };

    /**
     * 快照到靶标
     */
    const onNodeSnapshot = () => {
      emit('on-node-snapshot', clickedNodeInfo.value);
    };

    /**
     * 快照历史版本
     */
    const onSnapshotHistory = () => {
      emit('on-node-snapshot-history', clickedNodeInfo.value);
    };

    const checkIsAdmin = (arr) => {
      const result = arr.filter((i) => {
        if (props.isAdmin) {
          return true;
        } else {
          return !i.manage_mode;
        }
      });
      return result.length !== 0;
    };

    return {
      $tt: t,
      popoverData,
      clickName,
      snpmClick,
      jumpToPage,
      isShowNodeBtn,
      onNodeRestart,
      onNodeRebuild,
      onNodeShutUp,
      onNodeShutDown,
      onNodeSnapshot,
      onSnapshotHistory,
      nodePoverId,
      disableSaveSnapshot,
      snapshotHistoryCount,
      showPopoverForm,
      connectionMap,
      isShowSnpmBtn,
      snmpRef,
      snmpTitle,
      mibData,
      snmpConfig,
      disableRebuild,
      disableRestart,
      showShutDownBtn,
      showShutUpBtn,
      checkIsAdmin,
    };
  },
};
</script>

<style lang="scss" scoped>
@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.popover {
  display: none;
  position: absolute;
  background: var(--bg-color-2);
  border: 1px solid var(--neutral3);
  color: var(--neutral8);
  //padding-bottom: 11px;
  line-height: 1.7;
  min-width: 352px;
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
  overflow-x: hidden;
  user-select: text;
  z-index: 3;
  top: 0;
  left: 0;

  .g-ip {
    margin-bottom: 16px;
  }

  .access-icon {
    margin-right: 3px;
    vertical-align: middle;

    &-undefined,
    &-null,
    &-false {
      animation: loading 0.55s steps(150) infinite;
      color: var(--primary-color) !important;
    }

    &-true {
      color: var(--green-color) !important;
    }
  }

  & > div {
    margin-bottom: 10px;
    padding: 0 16px;
  }

  .nodeBtn {
    margin: 24px 0 16px 0;
  }

  .title-box {
    border-bottom: 1px solid var(--neutral3);
    width: calc(100% + 5px);
    position: sticky;
    margin: 0;
    top: 0;
    padding-left: 16px;
    height: 40px;
    line-height: 40px;
    z-index: 4;
    background: var(--bg-color-2);
    word-wrap: break-word;
    word-break: normal;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /*超出2行显示省略号*/
    overflow: hidden;
  }

  .zIndex {
    z-index: 3;
  }

  .txt-label {
    display: inline-block;
    width: 60px;
    text-align: right;
  }

  .mt15 {
    margin-top: 15px;
  }

  .mb16 {
    margin-bottom: 16px;
  }

  .login-btn {
    margin-bottom: 16px;
    margin-top: 4px;
  }

  .direction-icon {
    vertical-align: middle;
  }

  .unusable {
    opacity: 0.4;
  }

  .circle-gray {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    background-color: var(--neutral4);
    vertical-align: middle;
  }
}
</style>
