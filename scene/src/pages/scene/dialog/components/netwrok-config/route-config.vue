<template>
  <div class="router-tab-container">
    <cb-tabs v-model="active" :class="{'protocol-tab': true, 'active-tab-static': active === 'staticRouter'}">
      <cb-tab-pane name="staticRouter" :label="$tt('target.staticRouter')">
        <div class="router-tab-wrapper">
          <template v-if="network.length">
            <cb-row v-for="(item, index) in staticRoutesForm" class="static-router-tab-item"
                    :key="JSON.stringify(item + index)">
              <cb-col :span="5">
                <cb-form-item :label="label['target']" :prop="'routerConfig.' + index + '.destination'"
                              :rules="FORM_RULES.staticRoutes.destination"
                              :class="{'destination-item-en': lang == 'en-US'}">
                  <cb-input size="small" v-model="item.destination" type="text"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="5">
                <cb-form-item :label="label['next']" :prop="'routerConfig.' + index + '.nexthop'"
                              :rules="FORM_RULES.staticRoutes.nextHop"
                              :class="{'destination-item-en': lang == 'en-US'}">
                  <cb-input size="small" v-model="item.nexthop" type="text"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="6">
                <cb-form-item :label="label['OutgoingInterface']" :prop="'routerConfig.' + index + '.nexthop_port_id'">
                  <cb-select
                    clearable
                    size="small"
                    v-model="item.nexthop_port_id"
                    :options="OutgoingInterface_OPTIONS"
                    @change="changeOutgoingInterface(index)"
                    class="protocol-select"
                    :popper-append-to-body="false"
                  ></cb-select>
                </cb-form-item>
              </cb-col>
              <cb-col :span="2">
                <div class="btn-box protocol">
                  <cb-button type="text" icon="icon-jianshao"
                             @click="deleteTable(index, item)"></cb-button>
                  <cb-button v-if="index == staticRoutesForm.length - 1" type="text" icon="icon-xinzeng"
                             @click="addTable()" class="add-btn"></cb-button>
                </div>
              </cb-col>
            </cb-row>
          </template>
          <div v-if="network.length == 0" class="empty-wrapper">
            {{ $tt('target.notOpenedPort') }}
          </div>
          <template v-if="network.length != 0 && staticRoutesForm.length == 0">
            <empty-box
              tab="kRouter_staticRoutes"
              :nodeInfo="nodeInfo"
              :is_build_in="is_build_in"
              @click="addTable()"
            ></empty-box>
          </template>
        </div>
      </cb-tab-pane>
      <cb-tab-pane name="OSPF" label="OSPF">
        <div class="router-tab-wrapper">
          <cb-row class="static-router-tab-item">
            <cb-col :span="5">
              <cb-form-item label="RouterID ：" :prop="'ospfRouterId'"
                            :class="{'as-item': lang == 'en-US', 'as-item-en': lang == 'en-US'}"
                            :rules="FORM_RULES.networkConfig.ip">
                <cb-input size="small" v-model="ospfRouterIdForm" type="text"
                          :placeholder="$tt('global.placeInput')"></cb-input>
              </cb-form-item>
            </cb-col>
          </cb-row>
          <template v-if="network.length != 0">
            <cb-row v-for="(item, index) in OSPFForm" class="static-router-tab-item"
                    :key="JSON.stringify(item + index)">
              <cb-col :span="5">
                <cb-form-item :label="label['portName']" :prop="'route.OSPF.' + index + '.portId'"
                              :class="{'as-item': lang == 'en-US', 'as-item-en': lang == 'en-US'}"
                              :rules="FORM_RULES.staticRoutes.require">
                  <cb-select
                    size="small"
                    v-model="item.portId"
                    :options="OSPF_PORTS_OPTIONS"
                    @change="changeOutgoingInterface(index, item.portId, 'ospf')"
                    class="protocol-select"
                    :popper-append-to-body="false"
                  ></cb-select>
                </cb-form-item>
              </cb-col>
              <cb-col :span="5">
                <cb-form-item :label="label['ipAddress']" :prop="'route.OSPF.' + index + '.ospfIp'"
                              :class="{'as-item': lang == 'en-US', 'as-item-en': lang == 'en-US'}"
                              :rules="FORM_RULES.staticRoutes.ip">
                  <cb-input size="small" v-model="item.ospfIp" type="text"
                            :disabled="true"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="5">
                <cb-form-item label="Area ：" :prop="'route.OSPF.' + index + '.ospfArea'"
                              :class="{'as-item': lang == 'en-US', 'as-item-en': lang == 'en-US'}"
                              :rules="FORM_RULES.staticRoutes.integer">
                  <cb-input size="small" v-model="item.ospfArea" type="text"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="2">
                <div class="btn-box">
                  <cb-button type="text" icon="icon-jianshao"
                             @click="deleteOSPF(index, item)"></cb-button>
                  <cb-button v-show="showAddOSPF" type="text" icon="icon-xinzeng" @click="addOSPF()"
                             class="add-btn"></cb-button>
                </div>
              </cb-col>
            </cb-row>
          </template>
          <div v-if="network.length == 0" class="empty-wrapper">
            {{ $tt('target.notOpenedPort') }}
          </div>
          <template v-if="network.length != 0 && OSPFForm.length == 0">
            <empty-box
              tab="kRouter_staticRoutes_OSPF"
              :nodeInfo="nodeInfo"
              @click="addOSPF()"
            ></empty-box>
          </template>
        </div>
      </cb-tab-pane>
      <cb-tab-pane name="RIP" label="RIP">
        <div class="router-tab-wrapper">
          <cb-row class="static-router-tab-item">
            <cb-col :span="5">
              <cb-form-item :label="label['loopback']" :prop="'ripLoopback'"
                            :class="{'as-item': lang == 'en-US', 'as-item-en': lang == 'en-US'}"
                            :rules="FORM_RULES.staticRoutes.loopback">
                <cb-input size="small" v-model="ripLoopbackForm" type="text"
                          :placeholder="$tt('global.placeInput')"></cb-input>
              </cb-form-item>
            </cb-col>
          </cb-row>
          <template v-if="network.length != 0">
            <cb-row v-for="(item, index) in RIPForm" class="static-router-tab-item"
                    :key="JSON.stringify(item + index)">
              <cb-col :span="5">
                <cb-form-item :label="label['portName']" :prop="'route.RIP.' + index + '.portId'"
                              :class="{'as-item': lang == 'en-US', 'as-item-en': lang == 'en-US'}"
                              :rules="FORM_RULES.staticRoutes.require">
                  <cb-select
                    size="small"
                    v-model="item.portId"
                    :options="RIP_PORTS_OPTIONS"
                    @change="changeOutgoingInterface(index, item.portId, 'rip')"
                    class="protocol-select"
                    :popper-append-to-body="false"
                  ></cb-select>
                </cb-form-item>
              </cb-col>
              <cb-col :span="5">
                <cb-form-item :label="label['ipAddress']" :prop="'route.RIP.' + index + '.ripIp'"
                              :class="{'as-item': lang == 'en-US', 'as-item-en': lang == 'en-US'}"
                              :rules="FORM_RULES.staticRoutes.ip">
                  <cb-input size="small" v-model="item.ripIp" type="text"
                            :disabled="true"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="5">
                <cb-form-item :label="label['neighbour']" :prop="'route.RIP.' + index + '.ripNeighbour'"
                              :class="{'as-item': lang == 'en-US', 'as-item-en': lang == 'en-US'}"
                              :rules="FORM_RULES.staticRoutes.neighbour">
                  <cb-input size="small" v-model="item.ripNeighbour" type="text"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="2">
                <div class="btn-box">
                  <cb-button type="text" icon="icon-jianshao"
                             @click="deleteRIP(index, item)"></cb-button>
                  <cb-button v-show="showAddRIP" type="text" icon="icon-xinzeng" @click="addRIP()"
                             class="add-btn"></cb-button>
                </div>
              </cb-col>
            </cb-row>
          </template>
          <div v-if="network.length == 0" class="empty-wrapper">
            {{ $tt('target.notOpenedPort') }}
          </div>
          <template v-if="network.length != 0 && RIPForm.length == 0">
            <empty-box
              tab="kRouter_staticRoutes_RIP"
              :nodeInfo="nodeInfo"
              @click="addRIP()"
            ></empty-box>
          </template>
        </div>
      </cb-tab-pane>
      <cb-tab-pane name="BGP" label="BGP">
        <div class="router-tab-wrapper">
          <template v-if="network.length != 0">
            <cb-row v-for="(item, index) in BGPForm" class="static-router-tab-item"
                    :key="JSON.stringify(item + index)">
              <cb-col :span="3">
                <cb-form-item label="AS ：" :prop="'route.BGP.' + index + '.bgpAs'" class="as-item"
                              :rules="FORM_RULES.staticRoutes.positiveInteger">
                  <cb-input size="small" v-model="item.bgpAs" type="text"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="4">
                <cb-form-item :label="label['portName']" :prop="'route.BGP.' + index + '.portId'"
                              :class="{'as-item': true, 'as-item-en': lang == 'en-US'}"
                              :rules="FORM_RULES.staticRoutes.require">

                  <cb-select
                    size="small"
                    v-model="item.portId"
                    :options="BGP_PORTS_OPTIONS"
                    @change="changeOutgoingInterface(index, item.portId, 'bgp')"
                    :popper-append-to-body="false"
                    class="protocol-select"
                  ></cb-select>
                </cb-form-item>
              </cb-col>
              <cb-col :span="5">
                <cb-form-item :label="label['ipAddress']" :prop="'route.BGP.' + index + '.bgpIp'"
                              :class="{'as-item': true, 'as-item-address': true}"
                              :rules="FORM_RULES.staticRoutes.ip">
                  <cb-input size="small" v-model="item.bgpIp" type="text"
                            :disabled="true"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="5">
                <cb-form-item label="Peer ：" :prop="'route.BGP.' + index + '.bgpPeer'" class="as-item"
                              :rules="FORM_RULES.staticRoutes.ip">
                  <cb-input size="small" v-model="item.bgpPeer" type="text"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="5">
                <cb-form-item label="Peer AS ：" :prop="'route.BGP.' + index + '.bgpPeerAs'"
                              :class="{'as-item': true, 'as-item-address': true}"
                              :rules="FORM_RULES.staticRoutes.positiveInteger">
                  <cb-input size="small" v-model="item.bgpPeerAs" type="text"
                            :placeholder="$tt('global.placeInput')"></cb-input>
                </cb-form-item>
              </cb-col>
              <cb-col :span="2">
                <div class="btn-box">
                  <cb-button type="text" icon="icon-jianshao"
                             @click="deleteBGP(index, item)"></cb-button>
                  <cb-button v-show="showAddBGP" type="text" icon="icon-xinzeng" @click="addBGP()"
                             class="add-btn"></cb-button>
                </div>
              </cb-col>
            </cb-row>
          </template>
          <div v-if="network.length == 0" class="empty-wrapper">
            {{ $tt('target.notOpenedPort') }}
          </div>
          <template v-if="network.length != 0 && BGPForm.length == 0">
            <empty-box
              tab="kRouter_staticRoutes_BGP"
              :nodeInfo="nodeInfo"
              @click="addBGP()"
            ></empty-box>
          </template>
        </div>
      </cb-tab-pane>
    </cb-tabs>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, getCurrentInstance, inject, nextTick, ref} from "@vue/composition-api";
import {FORM_RULES} from "../constant/form-rules";
import EmptyBox from "../empty-box/empty-box";
import {errorConversion} from "../../../../../utils/form/error-conversion";

export default {
  name: "router-config",
  components: {
    EmptyBox,
  },
  props: {
    static_routes: {
      type: Array,
      default: () => [],
    },
    OSPF: {
      type: Array,
      default: () => [],
    },
    RIP: {
      type: Array,
      default: () => [],
    },
    BGP: {
      type: Array,
      default: () => [],
    },
    nodeInfo: {
      type: Object,
      default: () => {
      }
    },
    network: {
      type: Array,
      default: () => [],
    },
    ospfRouterId: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      default: '',
    },
    activeRouteName: {
      type: String,
      default: '',
    },
    ripLoopback: {
      type: String,
      default: '',
    },
    is_build_in: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const { proxy } = getCurrentInstance();
    const { $message } = proxy;
    const $tt = t;
    const label = {
      target: `${$tt('target.targetSegment')} ：`,
      next: `${$tt('target.nextHop')} ：`,
      OutgoingInterface: `${$tt('target.OutgoingInterface')} ：`,
      portName: `${$tt('target.portName')} ：`,
      neighbour: `${$tt('target.neighbour')} ：`,
      loopback: `${$tt('target.loopback')} ：`,
      ipAddress: `${$tt('target.ipAddress')} ：`,
    }
    let active = computed({
      get: () => {
        return props.activeRouteName
      },
      set: (val) => {
        emit('update:activeRouteName', val);
        return val;
      }
    })
    let staticRoutesForm = computed({
      get: () => {
        return props.static_routes
      },
      set: (val) => {
        emit('update:static_routes', val);
        return val;
      }
    })
    let networkForm = computed({
      get: () => {
        return props.network
      },
      set: (val) => {
        emit('update:network', val);
        return val;
      }
    })
    let ospfRouterIdForm = computed({
      get: () => {
        return props.ospfRouterId
      },
      set: (val) => {
        emit('update:ospfRouterId', val);
        return val;
      }
    })
    let ripLoopbackForm = computed({
      get: () => {
        return props.ripLoopback
      },
      set: (val) => {
        emit('update:ripLoopback', val);
        return val;
      }
    })
    let OSPFForm = computed({
      get: () => {
        return props.OSPF
      },
      set: (val) => {
        emit('update:OSPF', val);
        return val;
      }
    })
    let BGPForm = computed({
      get: () => {
        return props.BGP
      },
      set: (val) => {
        emit('update:BGP', val);
        return val;
      }
    })
    let RIPForm = computed({
      get: () => {
        return props.RIP
      },
      set: (val) => {
        emit('update:RIP', val);
        return val;
      }
    })

    const dropdownPortOptions = (data) => {
      let options = [];
      props.network?.forEach((item) => {
        let disabled = false;
        if (data.some(route => route.portId == item.id)) {
          disabled = true;
        }
        options.push({
          value: item.id,
          label: item.name,
          disabled: disabled,
        });
      });
      return options;
    }
    // 静态路由tab 出接口下拉框
    const OutgoingInterface_OPTIONS = computed({
        get: () => {
          return dropdownPortOptions([]);
        }
      }
    )
    // 过滤已经选择的端口名
    const OSPF_PORTS_OPTIONS = computed({
        get: () => {
          return dropdownPortOptions(OSPFForm.value);
        }
      }
    )
    // 过滤已经选择的端口名
    const BGP_PORTS_OPTIONS = computed({
        get: () => {
          return dropdownPortOptions(BGPForm.value);
        }
      }
    )
    const showAddOSPF = computed({
        get: () => {
          return !!OSPF_PORTS_OPTIONS.value.some(option => !option.disabled) && OSPFForm.value.length < OSPF_PORTS_OPTIONS.value.length;
        }
      }
    )

    const showAddBGP = computed({
        get: () => {
          return !!BGP_PORTS_OPTIONS.value.some(option => !option.disabled) && BGPForm.value.length < BGP_PORTS_OPTIONS.value.length;
        }
      }
    )

    // 过滤已经选择的端口名
    const RIP_PORTS_OPTIONS = computed({
        get: () => {
          return dropdownPortOptions(RIPForm.value);
        }
      }
    )

    const showAddRIP = computed({
        get: () => {
          return !!RIP_PORTS_OPTIONS.value.some(option => !option.disabled) && RIPForm.value.length < RIP_PORTS_OPTIONS.value.length;
        }
      }
    )

    const changeOutgoingInterface = (index,portId, type) => {
      let portItem = props.network.filter(port => port.id == portId)[0]
      nextTick(() => {
        if (type === 'ospf') {
          OSPFForm.value[index].ospfIp = null
          if (portItem.ip) {
            OSPFForm.value[index].ospfIp = portItem.ip
          } else {
            $message.info($tt('target.addIp'));
          }
        }
        if (type === 'bgp') {
          BGPForm.value[index].bgpIp = null
          if (portItem.ip) {
            BGPForm.value[index].bgpIp = portItem.ip
          } else {
            $message.info($tt('target.addIp'));
          }
        }
        if (type === 'rip') {
          RIPForm.value[index].ripIp = null
          if (portItem.ip) {
            RIPForm.value[index].ripIp = portItem.ip
          } else {
            $message.info($tt('target.addIp'));
          }
        }
      })
    }
    const addTable = () => {
      let addData = {
        destination: null,
        nexthop: null,
        nexthop_port_id: null,
      }
      staticRoutesForm.value.push(addData);
    }
    const addOSPF = () => {
      let addData = {
        ospfIp: null,
        ospfArea: null,
        portId: null,
      }
      OSPFForm.value.push(addData);
    }
    const addBGP = () => {
      let addData = {
        bgpAs: null,
        bgpIp: null,
        bgpPeer: null,
        bgpPeerAs: null,
        portId: null,
      }
      BGPForm.value.push(addData);
    }
    const addRIP = () => {
      let addData = {
        ripIp: null,
        ripNeighbour: null,
        portId: null,
      }
      RIPForm.value.push(addData);
    }
    // 静态路由
    const deleteTable = (index) => {
      staticRoutesForm.value.splice(index, 1);
    }
    const deleteOSPF = (index) => {
      OSPFForm.value.splice(index, 1);
    }
    const deleteBGP = (index) => {
      BGPForm.value.splice(index, 1);
    }
    const deleteRIP = (index) => {
      RIPForm.value.splice(index, 1);
    }
    return {
      $tt,
      label,
      FORM_RULES,
      staticRoutesForm,
      OSPFForm,
      BGPForm,
      networkForm,
      ospfRouterIdForm,
      ripLoopbackForm,
      OutgoingInterface_OPTIONS,
      OSPF_PORTS_OPTIONS,
      BGP_PORTS_OPTIONS,
      RIP_PORTS_OPTIONS,
      showAddBGP,
      showAddOSPF,
      showAddRIP,
      active,
      RIPForm,
      addRIP,
      deleteRIP,
      changeOutgoingInterface,
      addTable,
      deleteTable,
      addOSPF,
      addBGP,
      deleteOSPF,
      deleteBGP,
    }
  }
}
</script>

<style lang="scss" scoped>
.router-tab-container {
  .cb-select {
    width: 100% !important;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin: 0 !important;
    }
  }
}
</style>
