<template>
  <div class="basic-info-wrapper">
    <cb-row class="port-select-wrapper" v-if="nodeInfo.image_type == 'simple'">
      <cb-col :span="12">
        <cb-col :span="12">
          <cb-form-item :label="$tt('target.powerInterfaceCount') + ' ：'" prop="electrical">
            <cb-select
              size="small"
              v-model="electricalCountForm"
              :options="handleOptions(_electricalCount, CONSTANT.common.electricalOptions)"
              @change="(val) => changeCount(val, 'electrical')"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
        <cb-col :span="8">
          <cb-form-item class="unit">
            <cb-select
              size="small"
              v-model="electricalUnitForm"
              :options="CONSTANT.common.electricalUnitOptions"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
      </cb-col>
      <cb-col :span="12">
        <cb-col :span="12">
          <cb-form-item :label="$tt('target.fiberInterfaceCount') + ' ：'" prop="light">
            <cb-select
              size="small"
              v-model="lightCountForm"
              :options="handleOptions(_lightCount, CONSTANT.common.lightOptions)"
              @change="(val) => changeCount(val, 'light')"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
        <cb-col :span="8">
          <cb-form-item class="unit">
            <cb-select
              size="small"
              v-model="lightUnitForm"
              :options="CONSTANT.common.lightUnitOptions"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
      </cb-col>
    </cb-row>
    <!--    镜像类型且非核心路由器和镜像交换机 端口为52-->
    <cb-row class="port-select-wrapper" v-if="nodeInfo.image_type != 'simple' && !type">
      <cb-col :span="12">
        <cb-col :span="12">
          <cb-form-item :label="$tt('target.wanInterfaceCount') + ' ：'" prop="wan">
            <cb-select
              size="small"
              v-model="wanCountForm"
              :options="handleOptions(_wanCount, CONSTANT.common.portsOptions)"
              @change="(val) => changeCount(val, 'wan')"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
        <cb-col :span="8">
          <cb-form-item class="unit">
            <cb-select
              size="small"
              v-model="wanUnitForm"
              :options="CONSTANT.common.electricalUnitOptions"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
      </cb-col>
      <cb-col :span="12">
        <cb-col :span="12">
          <cb-form-item :label="$tt('target.lanInterfaceCount') + ' ：'" prop="lan">
            <cb-select
              size="small"
              v-model="lanCountForm"
              :options="handleOptions(_lanCount, CONSTANT.common.portsOptions)"
              @change="(val) => changeCount(val, 'lan')"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
        <cb-col :span="8">
          <cb-form-item class="unit">
            <cb-select
              size="small"
              v-model="lanUnitForm"
              :options="CONSTANT.common.electricalUnitOptions"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
      </cb-col>
    </cb-row>
    <!--    核心路由器-->
    <cb-row class="port-select-wrapper" v-if="type==='core-router'">
      <cb-col :span="12">
        <cb-col :span="12">
          <cb-form-item :label="$tt('target.portCount') + ' ：'" prop="wan">
            <cb-select
              size="small"
              v-model="wanCountForm"
              :options="handleOptions(_wanCount, CONSTANT.common.portsOptions)"
              @change="(val) => changeCount(val, 'wan')"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
        <cb-col :span="8">
          <cb-form-item class="unit">
            <cb-select
              size="small"
              v-model="wanUnitForm"
              :options="CONSTANT.common.lightUnitOptions"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
      </cb-col>
    </cb-row>
    <!--    镜像交换机-->
    <cb-row class="port-select-wrapper" v-if="type==='image-switcher'">
      <cb-col :span="12">
        <cb-col :span="12">
          <cb-form-item :label="$tt('target.portCount') + ' ：'" prop="lan">
            <cb-select
              size="small"
              v-model="lanCountForm"
              :options="handleOptions(_lanCount, CONSTANT.common.portsOptions)"
              @change="(val) => changeCount(val, 'lan')"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
        <cb-col :span="8">
          <cb-form-item class="unit">
            <cb-select
              size="small"
              v-model="lanUnitForm"
              :options="CONSTANT.common.electricalUnitOptions"
              width="100%"
              :popper-append-to-body="false"
            ></cb-select>
          </cb-form-item>
        </cb-col>
      </cb-col>
    </cb-row>
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, ref} from '@vue/composition-api';
import {PORT_INFO} from '../constant/device-info.ts';
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "electrical-light-port",
  props: {
    /**
     * 电口数量和单位
     */
    electricalCount: {
      type: Number | String,
      default: null,
    },
    lightCount: {
      type: Number | String,
      default: null,
    },
    electricalUnit: {
      type: String,
      default: '',
    },
    lightUnit: {
      type: String,
      default: '',
    },
    /**
     * wan口lan口数量和单位
     */
    wanCount: {
      type: Number | String,
      default: null,
    },
    lanCount: {
      type: Number | String,
      default: null,
    },
    wanUnit: {
      type: String,
      default: '',
    },
    lanUnit: {
      type: String,
      default: '',
    },
    nodeInfo: {
      type: Object,
      default: () => {
      },
    },
    /**
     *  type="image-switcher" 镜像交换机 只有lan口
     *  core-router 核心路由器 只有wan 口
     *  其他 镜像类型 需要限制 wan + lan 口 《= 52
     */
    type: {
      type: String,
      default: ''
    },
    /**
     * 初始端口数量
     * 用于以下几种节点的动态更新
     * 简易型交换机、简易型路由器、简易型防火墙
     * 核心路由器
     */
    originalCount: {
      type: Object,
      default: () => {
      },
    }
  },
  setup(props, {emit}) {
    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
      },
    });
    let _electricalCount = ref(0);
    let _lightCount = ref(0);
    let _wanCount = ref(0);
    let _lanCount = ref(0);

    if (uneditableBySceneStatus.value) {
      _electricalCount.value = props.originalCount?.electric_port_number;
      _lightCount.value = props.originalCount?.optical_port_number;
      _wanCount.value = props.originalCount?.wan_port_number;
      _lanCount.value = props.originalCount?.lan_port_number;
    }
    // 回显电口数量和单位
    const electricalCountForm = computed({
      get: () => {
        return props.electricalCount
      },
      set: (val) => {
        emit('update:electricalCount', val);
        return val;
      }
    });
    const electricalUnitForm = computed({
      get: () => {
        return props.electricalUnit
      },
      set: (val) => {
        emit('changeUnit', { type: 'electrical', unit: val });
        emit('update:electricalUnit', val);
        return val;
      }
    });
    // 回显光口数量和单位
    const lightCountForm = computed({
      get: () => {
        return props.lightCount
      },
      set: (val) => {
        emit('update:lightCount', val);
        return val;
      }
    });
    const lightUnitForm = computed({
      get: () => {
        return props.lightUnit
      },
      set: (val) => {
        emit('changeUnit', { type: 'light', unit: val });
        emit('update:lightUnit', val);
        return val;
      }
    });

    // 回显wan口数量和单位
    const wanCountForm = computed({
      get: () => {
        return props.wanCount
      },
      set: (val) => {
        emit('update:wanCount', val);
        return val;
      }
    });
    const wanUnitForm = computed({
      get: () => {
        return props.wanUnit
      },
      set: (val) => {
        emit('changeUnit', { type: 'wan', unit: val });
        emit('update:wanUnit', val);
        return val;
      }
    });

    // 回显lan口数量和单位
    const lanCountForm = computed({
      get: () => {
        return props.lanCount
      },
      set: (val) => {
        emit('update:lanCount', val);
        return val;
      }
    });
    const lanUnitForm = computed({
      get: () => {
        return props.lanUnit
      },
      set: (val) => {
        emit('changeUnit', { type: 'lan', unit: val });
        emit('update:lanUnit', val);
        return val;
      }
    });
    // 对于镜像类型路由器，WAN口LAN口数量总和为52，上方去掉光口和电口标识，保留WAN口标识，如先选择WAN口数为48，再选择LAN口数为24，那么WAN口数自动修改为28，保证其和为52
    // 像类型的交换机无WAN口，去掉WAN口类型，只显示端口数量，上方端口光口电口类型去掉，最高序号改为52
    /**
     * 对于镜像类型路由器，WAN口LAN口数量总和为52，上方去掉光口和电口标识，保留WAN口标识，如先选择WAN口数为48，再选择LAN口数为24，那么WAN口数自动修改为28，保证其和为52
     * 镜像类型的交换机无WAN口，去掉WAN口类型，只显示端口数量，上方端口光口电口类型去掉，最高序号改为52
     *  其他 镜像类型 需要限制 wan + lan 口 《= 52
     * @param count
     * @param type
     */
    const changeCount = (count, type) => {
      if (props.nodeInfo.image_type != 'simple' && !props.type) {
        if (type === 'wan' && (count + lanCountForm.value > 52)) {
          lanCountForm.value = 52 - count
          emit('changeCount', 52 - count, 'lan')
        } else if (type === 'lan' && (count + wanCountForm.value > 52)) {
          wanCountForm.value = 52 - count
          emit('changeCount', 52 - count, 'wan')
        }
      }
      emit('changeCount', count, type)
    }
    // 根据场景模式不同生成有限制的下拉端口项
    const handleOptions = (countForm, OPTIONS)=> {
      if (uneditableBySceneStatus.value) {
        return OPTIONS?.map(option => {
          return {
            ...option,
            disabled: parseFloat(option.value) < parseFloat(countForm)
          }
        })
      } else {
        return OPTIONS;
      }
    }
    return {
      uneditableBySceneStatus,
      CONSTANT: PORT_INFO,
      electricalCountForm,
      electricalUnitForm,
      lightCountForm,
      lightUnitForm,
      wanCountForm,
      wanUnitForm,
      lanCountForm,
      lanUnitForm,
      _electricalCount,
      _lightCount,
      _wanCount,
      _lanCount,
      changeCount,
      handleOptions,
      $tt: t,
    }
  }
}
</script>
<style lang="scss" scoped>
.basic-info-wrapper {
  .cb-select {
    width: 100% !important;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin: 0 !important;
    }
  }
}
</style>
