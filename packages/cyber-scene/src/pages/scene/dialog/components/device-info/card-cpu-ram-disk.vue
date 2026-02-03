<template>
  <cb-row class="card-cpu-ram-disk-wrapper">
    <cb-col class="item">
      <cb-form-item :label="$tt('target.networkCardCount') + ' ：'" v-if="role === 4">
        <cb-input-number
          v-model="max_port_number_form"
          :min="uneditableBySceneStatus ? _netCardNum : 0"
          :max="3"
          controls-position="right"
          :step-strictly="true"
          @change="changeCard"
          size="small"
        ></cb-input-number>
      </cb-form-item>
    </cb-col>
    <cb-col class="item">
      <cb-form-item label="CPU ：" v-if="image_type !== 'container'" :label-width="role === 4 ? '110px' : '120px'">
        <cb-input-number
          v-model="cpuForm"
          :min="1"
          controls-position="right"
          :step-strictly="true"
          size="small"
        ></cb-input-number>
      </cb-form-item>
    </cb-col>
    <cb-col :span="6">
      <cb-form-item :label="$tt('target.memory') + ' ：'"  label-width="100px">
        <cb-input-number
          v-model="ramForm"
          :min="1"
          controls-position="right"
          :step-strictly="true"
          size="small"
        ></cb-input-number>
        <template>M</template>
      </cb-form-item>
    </cb-col>
    <cb-col :span="6">
      <cb-form-item :label="$tt('target.hardDisk') + ' ：'" label-width="100px">
        <cb-input-number
          v-model="diskForm"
          :min="uneditableBySceneStatus ? _disk : 1"
          controls-position="right"
          :step-strictly="true"
          size="small"
        ></cb-input-number>
        <template>G</template>
        <span v-if="system_type_help && system_type_help == 'Linux'" class="disk-help-box" @click="handleShowHelp">
          <cb-tooltip
            effect="dark"
            :content="$tt('toolbar.help')"
            placement="right"
            :enterable="true"
          >
            <cb-popover
              popper-class="disk-help-content"
              placement="right"
              width="400"
              :content="$tt('target.diskHelp')"
              trigger="click">
              <cb-iconfont type="icon-bangzhu" color="var(--neutral6)" slot="reference"></cb-iconfont>
            </cb-popover>
          </cb-tooltip>
        </span>
      </cb-form-item>
    </cb-col>
  </cb-row>
</template>

<script>
import t from '../../../../../utils/i18n';
import {computed, ref} from '@vue/composition-api';
import {SYSTEM_TYPE} from "../constant/probe";
import PageStatus from "../../../../store/page-status";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "card-cpu-ram-disk",
  components: {},
  props: {
    /**
     * 网卡数量
     */
    netCardNum: {
      type: Number | String,
      default: null,
    },
    cpu: {
      type: Number,
      default: 0,
    },
    ram: {
      type: Number,
      default: 0,
    },
    disk: {
      type: Number,
      default: 0,
    },
    /**
     * 角色信息，如果为终端 4 ，显示网卡数量，其他不显示
     */
    role: {
      type: Number,
      default: 0,
    },
    /**
     * 镜像信息，如果为容器，不显示cpu、内存、硬盘
     */
    image_type: {
      type: String,
      default: '',
    },
    system_type: {
      type: String | Number,
      default: '',
    },
    /**
     * 初始端口数量
     * 用于终端节点的动态更新
     */
    originalCount: {
      type: Object,
      default: () => {
      },
    },
    // 节点的实例id
    eid: {
      type: String,
      default: ''
    },
  },
  setup(props, {emit}) {
    let shareState = ref(PageStatus.state);
    let showHelp = ref(false);
    let _disk = ref(0);
    let _netCardNum = ref(0);
    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        if (props.role === 4) {
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
    if (uneditableBySceneStatus.value) {
      _disk.value = props.originalCount?.disk;
      _netCardNum.value = props.originalCount?.netCardNum;
    }
    const system_type_help = computed(() => {
      return SYSTEM_TYPE[shareState.value.systemType[props.system_type]]
    })
    // 回显网卡数量
    const max_port_number_form = computed({
      get: () => {
        return props.netCardNum;
      },
      set: (val) => {
        emit('update:netCardNum', val);
        return val;
      }
    });
    // 回显cpu
    const cpuForm = computed({
      get: () => {
        return props.cpu;
      },
      set: (val) => {
        emit('update:cpu', val);
        return val;
      }
    });
    // 回显内存
    const ramForm = computed({
      get: () => {
        return props.ram;
      },
      set: (val) => {
        emit('update:ram', val);
        return val;
      }
    });
    // 回显硬盘
    const diskForm = computed({
      get: () => {
        return props.disk;
      },
      set: (val) => {
        emit('update:disk', val);
        return val;
      }
    });
    // 处理网卡数量改变
    const changeCard = (cur, old) => {
      emit('change-card', cur, old);
    }
    const handleShowHelp = () => {
      showHelp.value = !showHelp.value
    }
    return {
      showHelp,
      system_type_help,
      max_port_number_form,
      cpuForm,
      ramForm,
      diskForm,
      changeCard,
      handleShowHelp,
      uneditableBySceneStatus,
      _disk,
      _netCardNum,
      $tt: t,
    }
  },
}
</script>
