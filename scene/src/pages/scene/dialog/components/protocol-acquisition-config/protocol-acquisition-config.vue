<template>
  <div>
    <cb-checkbox size="small" :disabled="uneditableBySceneStatus" v-model="snmp_configForm.config_switch" class="checkbox-box">
      {{$tt('target.snmpConfig')}}
    </cb-checkbox>
    <cb-row class="protocol-acquisition-config-wrapper">
      <cb-col :span="4">
        <cb-form-item
          :label-width="'90px'"
          :label="$tt('target.version') + ' ：'"
          prop="snmp_config.version"
          :rules="FORM_RULES.otherConfig.init_commands">
          <cb-select
            :disabled="uneditableBySceneStatus"
            size="small"
            v-model="snmp_configForm.version"
            :options="SNMP_LIST"
            width="100%"
            :popper-append-to-body="false"
          ></cb-select>
        </cb-form-item>
      </cb-col>
      <cb-col :span="5" v-if="snmp_configForm.version == 'V3'">
        <cb-form-item
          :label-width="'100px'"
          :label="$tt('target.userGroupName') + ' ：'"
          prop="snmp_config.priv_key"
        >
          <cb-input
            :disabled="uneditableBySceneStatus"
            v-model="snmp_configForm.priv_key"
            type="text"
            :placeholder="$tt('global.placeInput')+$tt('target.userGroupName')"
          ></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="5" v-if="snmp_configForm.version == 'V3'">
        <cb-form-item
          :label-width="'90px'"
          :label="$tt('global.userName') + ' ：'"
          prop="snmp_config.username"
        >
          <cb-input
            :disabled="uneditableBySceneStatus"
            v-model="snmp_configForm.username"
            type="text"
            :placeholder="$tt('global.placeInput')+$tt('global.userName')"
          ></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="5" v-if="snmp_configForm.version == 'V3'">
        <cb-form-item
          :label-width="'100px'"
          :label="$tt('target.authenticationCode') + ' ：'"
          prop="snmp_config.auth_key"
        >
          <cb-input
            :disabled="uneditableBySceneStatus"
            v-model="snmp_configForm.auth_key"
            type="text"
            :placeholder="$tt('global.placeInput')+$tt('target.authenticationCode')"
          ></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="5" v-if="snmp_configForm.version != 'V3'">
        <cb-form-item
          :label-width="'90px'"
          :label="$tt('target.communityName') + ' ：'"
          prop="snmp_config.community_name"
        >
          <cb-input
            :disabled="uneditableBySceneStatus"
            v-model="snmp_configForm.community_name"
            type="text"
            :placeholder="$tt('target.readCommunityName')"
          ></cb-input>
        </cb-form-item>
      </cb-col>
      <cb-col :span="5">
        <cb-form-item
          :label-width="'90px'"
          :label="$tt('target.ipAddress') + ' ：'"
          prop="snmp_config.ip"
          :rules="FORM_RULES.networkConfig.ip">
          <cb-input
            :disabled="uneditableBySceneStatus"
            v-model="snmp_configForm.ip"
            type="text"
            :placeholder="$tt('target.inputIpAddress')"
          ></cb-input>
        </cb-form-item>
      </cb-col>
    </cb-row>
    <cb-row class="downloadBtn">
      <cb-col>
        <cb-upload-file
          :disabled="uneditableBySceneStatus"
          :limit="1"
          :type="'file'"
          accept=".mib"
          :fetch-promise="fetchPromise"
          :isDownload="true"
          :showFileList="false"
        >
          <template v-slot:tip>{{$tt('global.placeUploadMib')}}</template>
        </cb-upload-file>
      </cb-col>
      <cb-col>
        <div class="delete-file-btn">
          <cb-button
            @click="deleteMib($event)"
            buttonType="delete"
            type="text"
            icon="icon-shanchu"
            :warnMsg="$tt('global.confirmDeleteFile')"
            :isConfirm="false"
            :disabled="!mibDataForm || !mibDataForm.length"
          >
          </cb-button>
        </div>
        <div class="result-txt">{{$tt('target.result')}}：</div>
      </cb-col>
    </cb-row>
    <cb-row>
      <div class="tree-wrapper" v-loading="loading">
        <cb-col class="left-tree">
          <cb-tree
            class="tree"
            :data="mibDataForm"
            ref="treeList"
            :props="defaultProps"
            default-expand-all
            :show-checkbox="false"
            node-key="id"
            :expand-on-click-node="false"
            :empty-text="$tt('stage.noDataAvailable')"
            @node-click="showTreeInfo"
          >
            <span class="host-name" slot-scope="{ node, data }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </cb-tree>
        </cb-col>
        <cb-col :span="2" class="tree-spacing"></cb-col>
        <cb-col :span="11">
          <div v-if="!treeContent.length" class="result-wrapper">{{resultForm}}</div>
          <div class="result-wrapper" v-for="item in treeContent" :key="item.label">
            <span class="label-box">{{item.label}}：</span> <span>{{item.value}}</span>
          </div>
        </cb-col>
      </div>
    </cb-row>
  </div>
</template>

<script>
import {FORM_RULES} from "../constant/form-rules";
import t from "../../../../../utils/i18n";
import {SNMP_LIST} from "../constant/options";
import {computed, ref} from "@vue/composition-api";
import {mibImport} from "../../../../../api";
import sceneStore from "../../../../../store/scene-store";

export default {
  name: "protocol-acquisition-config",
  components: {},
  props: {
    snmp_config: {
      type: Object,
      default: () => {},
    },
    mib_data: {
      type: Array,
      default: () => [],
    },
    result: {
      type: Boolean | String,
      default: '',
    },
    // 节点的实例id
    eid: {
      type: String,
      default: ''
    },
    /**
     * 角色信息
     */
    role: {
      type: Number,
      default: 0,
    },
  },
  setup(props, {emit}) {
    const $tt = t;
    let requestId = ref(0);
    let treeContent = ref([]);
    const defaultProps = {
      children: 'children',
      label: 'name'
    }
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
    let loading = ref(false);
    let snmp_configForm = computed({
      get: () => {
        return props.snmp_config;
      },
      set: (val) => {
        emit('update:snmp_config', val);
        return val;
      },
    })
    let mibDataForm = computed({
      get: () => {
        return props.mib_data;
      },
      set: (val) => {
        emit('update:mib_data', val);
        return val;
      },
    })
    let resultForm = computed({
      get: () => {
        if (props.mib_data && props.mib_data.length) {
          return 'success'
        } else {
          return props.result;
        }
      },
      set: (val) => {
        emit('update:result', val);
        return val;
      },
    })
    // 上传附件
    const fetchPromise = (file) => {
      let currentId = ++requestId.value;
      loading.value = true;
      mibDataForm.value = [];
      resultForm.value = '';
      treeContent.value = [];
      const formData = new FormData();
      formData.append('file', file);
      mibImport(formData)
        .then((res) => {
          if (currentId !== requestId.value) {
            return;
          }
          loading.value = false;
          mibDataForm.value = res?.data?.data?.mib;
          resultForm.value = res?.data?.success ? 'success' : res?.data?.detail;
          snmp_configForm.value['file_info'] = res?.data?.data?.file_info;
        })
    }
    const showTreeInfo = (data, node, cls) => {
      treeContent.value = [
        {
          label: 'oid',
          value: data.oid || '--'
        },
        {
          label: $tt('target.status'),
          value: data.status || '--'
        },
        {
          label: $tt('target.type'),
          value: data.syntax || '--'
        },
      ]
    }

    const deleteMib = (done) => {
      mibDataForm.value = [];
      resultForm.value = '';
      treeContent.value = [];
      done()
    }

    return {
      FORM_RULES,
      SNMP_LIST,
      $tt: t,
      loading,
      resultForm,
      mibDataForm,
      defaultProps,
      snmp_configForm,
      uneditableBySceneStatus,
      treeContent,
      fetchPromise,
      showTreeInfo,
      deleteMib,
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-box {
  margin-bottom: 10px;
  margin-left: 0;
}
.protocol-acquisition-config-wrapper {
  margin-left: 7px;
  .cb-select {
    width: 100% !important;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin: 0 !important;
    }
  }
}
.downloadBtn {
  display: flex;
  align-items: end;
  padding: 0 23px;
  .cb-upload-file {
    margin-top: -8px;
  }
  .el-col:nth-child(2) {
    margin-left: 16px;
    margin-bottom: 8px;
  }
  .delete-file-btn {
    display: inline-block;
    position: relative;
    right: 75px;
    top: 27px;
  }
}
.tree-wrapper {
  margin: 8px 21px 0 21px;
  background-color: var(--bg-color-3);
  height: 462px;
  //overflow-y: scroll;
  .el-col:nth-child(1), .el-col:nth-child(3) {
    width: calc(50% - 8px)
  }
  .tree-spacing {
    width: 16px;
    background-color: var(--bg-color-2);
    height: 462px;
  }
  .result-wrapper {
    padding: 10px;
  }
  .left-tree {
    overflow-y: scroll;
    height: 100%;
  }
  .label-box {
    display: inline-block;
    width: 50px;
    text-align: left;
  }
}
</style>
