<template>
  <div class="image-lang-architecture-snapshot-wrapper">
    <cb-form-item :label="$tt('target.imageName') + ' ：'">{{ imageName | formatText }}</cb-form-item>
    <cb-form-item :label="$tt('target.languageVersion') + ' ：'">{{
        LANGUAGE[system_language] | formatText
      }}
    </cb-form-item>
    <cb-form-item :label="$tt('target.systemArchitecture') + ' ：'">
      {{ SYSTEM_ARCHITECTURE[system_architecture] | formatText }}
    </cb-form-item>
    <cb-form-item :label="$tt('target.inputSnapshot') + ' ：'">
      <cb-select
        :disabled="uneditableBySceneStatus"
        :placeholder="$tt('global.placeSelect')"
        v-model="imageForm"
        :options="options"
        @change="changeSnapshot"
        :popper-append-to-body="false"
        size="small"
      >
      </cb-select>
    </cb-form-item>
    <cb-row  v-if="image_type === 'dynamips'">
      <cb-form-item :label="$tt('target.platformName') + ' ：'">{{ platform | formatText }}</cb-form-item>
    </cb-row>
  </div>
</template>

<script>
import _ from 'lodash';
import t from '../../../../../utils/i18n';
import {computed, ref} from '@vue/composition-api';
import {LANGUAGE, SYSTEM_ARCHITECTURE} from "../constant/device-info"
import {getProtocolsDefault, getSnapShotsByName} from "../../../../../api";
import {getQuickCreateParams} from "../../../../../utils/data-conversion/target-to-element";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "image-lang-architecture-snapshot",
  components: {},
  props: {
    /**
     * 快照名称
     */
    image: {
      type: String,
      default: '',
    },
    /**
     * 靶标uuid
     */
    image_uuid: {
      type: String,
      default: '',
    },
    /**
     * 语言版本
     */
    system_language: {
      type: String,
      default: '',
    },
    /**
     * 系统架构
     */
    system_architecture: {
      type: String,
      default: '',
    },
    /**
     * 镜像类型，如果为container，则不展示快照下拉框
     */
    image_type: {
      type: String,
      default: '',
    },
    // 快速构建参数
    quick_create_params: {
      type: Array | Object,
      default: () => [],
    },
    platform: {
      type: String,
      default: '',
    },
    /**
     * 角色信息
     */
    role: {
      type: Number,
      default: 0,
    },
    // 节点的实例id
    eid: {
      type: String,
      default: ''
    },
  },
  setup(props, {emit}) {
    let options = ref([]);
    let imageName = ref('');
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
    // 用于同步image字段值
    const imageForm = computed({
      get: () => {
        if (props.image) {
          return props.image;
        }
      },
      set: (val) => {
        emit('update:image', val);
        return val;
      }
    });
    // 用于同步quick_create_params字段值
    const quick_create_paramsForm = computed({
      get: () => {
        if (props.quick_create_params) {
          return props.quick_create_params;
        }
      },
      set: (val) => {
        emit('update:quick_create_params', val);
        return val;
      }
    });
    const getImageByShotsFunc = () => {
      getSnapShotsByName(props.image_uuid)
        .then((res) => {
          let _data = _.get(res.data, 'data', {
            data: {device_name: '', items: []},
          });
          if (!_data) return;
          _data.items.forEach((item) => {
            if (item.user_snapshot_name || item.name) {
              options.value.push({
                label: item.user_snapshot_name,
                value: item.name,
                quick_create_params: item.quick_create_params,
              });
            }
          })
          imageName.value = _data.device_name || props.image_uuid || props.image;
          // 角色为 镜像类型的节点(排除简易型的)，则获取默认接入协议和默认console接入协议
          if (props.image_type != 'simple') {
            getProtocolsDefault(_data.device_name).then((res) => {
              let protocols = _.get(res.data, 'data.list', []);
              emit('default-protocols', protocols);
            });
          }
        })
    }
    getImageByShotsFunc();
    // 选择快照，需要同步更新 quick_create_params 字段
    const changeSnapshot = (value) => {
      quick_create_paramsForm.value = getQuickCreateParams((options.value?.filter(option => option.value == value)[0]?.quick_create_params) || []);
    }
    return {
      $tt: t,
      LANGUAGE,
      SYSTEM_ARCHITECTURE,
      sceneStore,
      imageName,
      options,
      imageForm,
      quick_create_paramsForm,
      changeSnapshot,
      uneditableBySceneStatus,
    }
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
}
</script>
<style lang="scss" scoped>
.image-lang-architecture-snapshot-wrapper {
  .cb-select {
    width: 100% !important;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin: 0 !important;
    }
  }
}
</style>
