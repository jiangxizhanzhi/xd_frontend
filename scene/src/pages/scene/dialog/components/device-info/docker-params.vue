<template>
  <div class="docker-params-wrapper" v-if="docker_params_form.image_source === 3">
    <cb-form-item :label="$tt('target.advancedOptions') + ' ：'">
        <cb-switch
          v-model="docker_params_form.options"
          :disabled="uneditableBySceneStatus"
          @change="handleChangeOptions"
        ></cb-switch>
      </cb-form-item>
    <div class="params-box" v-if="docker_params_form.options">
      <cb-form-item label="interactive：" label-width="120px">
        <cb-select
          v-model="docker_params_form.interactive"
          :options="advancedSelectOptions"
          :disabled="uneditableBySceneStatus"
        >
        </cb-select>
      </cb-form-item>
      <cb-form-item label="tty：" label-width="120px">
        <cb-select
          v-model="docker_params_form.tty"
          :options="advancedSelectOptions"
          :disabled="uneditableBySceneStatus"
        >
        </cb-select>
      </cb-form-item>
      <cb-form-item label="env：" label-width="120px">
        <cb-input
          v-model="docker_params_form.environment_str"
          :disabled="uneditableBySceneStatus"
        ></cb-input>
        <div class="env-tip">{{$tt('target.envTip')}}</div>
      </cb-form-item>
      <cb-form-item :label="$tt('target.exStrLabel') + ' ：'" label-width="120px">
        <div class="ex-params-box">
          <cb-input
            v-model="docker_params_form.host_config_ex_str"
            :disabled="uneditableBySceneStatus"
          ></cb-input>
          <cb-tooltip
            effect="dark"
            :content="$tt('target.exStrTip')"
            placement="top"
          >
            <cb-iconfont
              class="help-icon"
              type="icon-jingshi1"
              color="var(--orange-color)"
              size="18"
            ></cb-iconfont>
          </cb-tooltip>
        </div>
      </cb-form-item>
    </div>
  </div>
</template>

<script>
import {computed, ref} from '@vue/composition-api';
import PageStatus from "../../../../store/page-status";
import t from "../../../../../utils/i18n";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "docker-params",
  components: {},
  props: {
    docker_params: {
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
    const advancedSelectOptions = [
      {
        label: t('target.advancedSelectOptions')[0],
        value: true,
      },
      {
        label: t('target.advancedSelectOptions')[1],
        value: false,
      },
    ];
    // 回显网卡数量
    const docker_params_form = computed({
      get: () => {
        return props.docker_params;
      },
      set: (val) => {
        emit('update:docker_params', val);
        return val;
      }
    });
    // 场景状态
    const uneditableBySceneStatus = computed({
      get: () => {
        if (props.eid) {
          return (sceneStore.state.sceneStatus === 'display' || sceneStore.state.sceneStatus === 'update');
        } else {
          return false;
        }
      },
    });
    const handleChangeOptions = (val) => {
      if (!val) {
        docker_params_form.value.interactive = false;
        docker_params_form.value.tty = false;
        docker_params_form.value.environment_str = '';
        docker_params_form.value.host_config_ex_str = '';
      }
    };
    return {
      $tt: t,
      uneditableBySceneStatus,
      docker_params_form,
      advancedSelectOptions,
      handleChangeOptions,
    }
  },
}
</script>

<style lang="scss" scoped>
.docker-params-wrapper {
  .params-box {
    background-color: var(--bg-color-3);
    margin-left: 140px;
    padding: 16px 16px 16px 0;
  }
  .env-tip {
    color: var(--red-color);
  }
  .ex-params-box {
    display: flex;
    align-items: center;
    .help-icon {
      margin-left: 12px;
      cursor: pointer;
    }
  }
}
</style>
