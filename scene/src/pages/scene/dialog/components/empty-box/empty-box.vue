<template>
  <div>
    <template v-if="type != 'table'">
      <div :class="{
        'empty-wrapper': true,
        'background': !['static_routes', 'kRouter_staticRoutes', 'kRouter_staticRoutes_OSPF', 'kRouter_staticRoutes_RIP', 'kRouter_staticRoutes_BGP'].includes(tab)
      }">
        <cb-button :disabled="disabledComputed" type="text" icon="icon-xinzeng" @click="handleClick()">{{ placeholder }}</cb-button>
      </div>
    </template>
    <template v-else>
      <div :class="{'empty-wrapper': true, 'table': true}">
        <cb-iconfont
          type="icon-zanwuziyuan"
          color="#838D9C"
          :size="56"
        ></cb-iconfont>
        <div>{{$tt('stage.noDataAvailable')}}</div>
      </div>
    </template>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, ref} from "@vue/composition-api";
import {ROLE} from "../../../../../types/role";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "empty-box",
  props: {
    nodeInfo: {
      type: Object,
      default: () => {
      }
    },
    tab: {
      type: String,
      default: 'network_config',
    },
    type: {
      type: String,
      default: 'network_config',
    },
    is_build_in: {
      type: Boolean,
      default: false,
    },
    // 节点的实例id
    eid: {
      type: String,
      default: ''
    },
  },
  setup(props, {emit}) {
    const $tt = t;
    const handleClick = () => {
      emit('click');
    }
    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        if (props.nodeInfo.role === 4) {
          if (props.eid) {
            return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
          } else {
            return false;
          }
        } else {
          return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
        }
      },
    });
    const disabledComputed = computed({
      get: () => {
        /**
         * 编辑场景时的输入限制
         * 1. 简易型防火墙可配置防火墙规则和静态路由表
         * 2. 简易型路由器可配置静态路由表
         * 3. 简易型交换机可配置dhcp地址范围
         * 4. 核心路由器可以配置静态路由表
         */
        return (uneditableBySceneStatus.value &&
            !(props.nodeInfo.image_type === 'simple' && props.nodeInfo.role === ROLE['firewall']) &&
            !(props.nodeInfo.image_type === 'simple' && props.nodeInfo.role === ROLE['router']) &&
            !(props.nodeInfo.image_type === 'vm' && props.nodeInfo.role === ROLE['router'] && props.is_build_in && props.tab === 'kRouter_staticRoutes')
          )
      }
    })
    let placeholder = ref('');
    if (props.type != 'table') {
      switch (props.nodeInfo.image_type) {
        case 'simple':
          if ([ROLE['router'], ROLE['firewall'], ROLE['switch'], ROLE['simpleSwitch']].includes(props.nodeInfo.role)) {
            if (props.tab === 'static_routes') {
              placeholder.value = $tt('target.addRouterList');
            } else if (props.tab === 'address_range') {
              placeholder.value = $tt('target.addAddressRange');
            } else if (props.tab === 'DNS') {
              placeholder.value = $tt('target.addDNS');
            } else {
              placeholder.value = $tt('target.addFirewallRules');
            }
            break;
          }
        case 'vm':
        case 'container':
          if (['kRouter_staticRoutes', 'kRouter_staticRoutes_OSPF', 'kRouter_staticRoutes_RIP', 'kRouter_staticRoutes_BGP'].includes(props.tab)) {
            placeholder.value = $tt('target.addConfig');
          } else {
            placeholder.value = $tt('target.addAccessProtocol');
          }
          break;
        case 'dynamips':
          if (props.tab === 'static_routes') {
            placeholder.value = $tt('target.addRouterList');
          }
          break;
        default:
          break;
      }
    }

    return {
      $tt,
      placeholder,
      uneditableBySceneStatus,
      disabledComputed,
      handleClick,
    }
  }
}
</script>

<style scoped>

</style>
