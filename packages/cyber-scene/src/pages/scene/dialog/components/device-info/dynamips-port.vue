<template>
  <div class="basic-info-wrapper">
    <!--    dynamips路由器-->
    <cb-row class="port-select-wrapper">
      <cb-col :span="12">
        <cb-col :span="12">
          <cb-form-item :label="$tt('target.portCount') + ' ：'" prop="wan">
            <cb-select
              size="small"
              v-model="wanCountForm"
              :options="dynamipsPortsOptions"
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
  </div>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, ref} from '@vue/composition-api';
import {PORT_INFO} from '../constant/device-info.ts';
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "dynamips-port",
  props: {
    platform: {
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
    wanUnit: {
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
    }
  },
  setup(props, {emit}) {
    // 下拉选项数量值
    let dynamipsPortsOptions = ref([]);
    // 端口
    let portInfos = ref([]);
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
        emit('update:wanUnit', val);
        return val;
      }
    });
    portInfos.value = sceneStore.state.dynamicsData?.filter(item => item.platform == props.platform)[0]?.port_infos || [];
    dynamipsPortsOptions.value = portInfos.value?.map(item => {
      return {
        label: item.port_num,
        value: item.port_num
      }
    })

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
      let nameData = portInfos.value?.filter(item => item.port_num === count)[0]?.port_names || [];
      emit('changeDynamipsCount', count, type, nameData)
    }
    return {
      CONSTANT: PORT_INFO,
      wanCountForm,
      wanUnitForm,
      changeCount,
      dynamipsPortsOptions,
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
