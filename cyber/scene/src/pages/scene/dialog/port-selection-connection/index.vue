<template>
  <cb-dialog
    class="drawer-dialog"
    :visible="visible"
    @close="handleClose"
    :append-to-body="false"
    :modal-append-to-body="false"
    width="670px"
  >
    <template slot="title">
      <div>{{ $tt('target.selectNodeInterface') }}</div>
    </template>
    <div class="form-wrapper">
      <cb-form
        ref="fromRef"
        :model.sync="portForm"
        :rules="rules"
        :json="true"
        label-position="right"
        :label-width="labelWidth"
        :inline="false"
      >
        <cb-form-item prop="source">
          <label slot="label" :title="portInfo[0].label">{{
              portInfo[0].label | ellipsis
            }}</label>
          <cb-select
            :placeholder="$tt('global.placeSelect')"
            v-model="portForm.source"
            @change="currentSel($event, 0)"
            :options="options[0]"
            style="width: 60%"
            :popper-append-to-body="false"
          >
          </cb-select>
        </cb-form-item>
        <cb-form-item prop="target">
          <label slot="label" :title="portInfo[1].label">{{
              portInfo[1].label | ellipsis
            }}</label>
          <cb-select
            :placeholder="$tt('global.placeSelect')"
            v-model="portForm.target"
            @change="currentSel($event, 1)"
            :options="options[1]"
            style="width: 60%"
            :popper-append-to-body="false"
          >
          </cb-select>
        </cb-form-item>
      </cb-form>
    </div>
    <template slot="footer">
      <div class="form-button-group">
        <cb-button-group space="middle">
          <cb-button
            button-type="confirm"
            @click="submitForm($event)"
          ></cb-button>
          <cb-button button-type="cancel" @click="handleClose"></cb-button>
        </cb-button-group>
      </div>
    </template>
  </cb-dialog>
</template>

<script>
import {computed, inject} from '@vue/composition-api';
import { getOptions } from '../../../../utils/port-processing/dropdown-port-options';
import t from '../../../../utils/i18n';
import sceneStore from "../../../../store/scene-store";
import { getNodeIdByPortId, updateNetworkPorts } from "../../../../utils/port-processing/port-generation";

export default {
  name: 'Port',
  props: {
    /**
     * 弹窗是否显示
     */
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * 节点信息
     * role、image_type、nodeId
     */
    nodeInfo: {
      type: Object,
      default: () => {},
    },
    currentNode: {},
    nodesToEdge: {
      type: Array,
      default: () => [],
    },
    currentEdge: {},
  },
  model: {
    prop: 'visible',
    event: 'update',
  },
  setup() {
    const lang = inject('lang');
    const labelWidth = computed(() => {
      return lang === 'zh-CN' ? '200px' : '200px';
    });
    const graph = sceneStore.state.graph;
    return { labelWidth, graph };
  },
  data() {
    return {
      portForm: {
        source: '',
        target: '',
      },
      portInfo: {
        0: {
          info: {},
          label: '',
        },
        1: {
          info: {},
          label: '',
        },
      },
      options: {
        0: [], // source
        1: [], // target
      },
      rules: {
        source: [
          {
            required: true,
            message: this.$tt('target.pleaseSelectInterface'),
            trigger: ['blur', 'change'],
          },
        ],
        target: [
          {
            required: true,
            message: this.$tt('target.pleaseSelectInterface'),
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  watch: {
    nodesToEdge: {
      handler(val) {
        if (val.length !== 2 || !this.visible) return;
        val.length && val?.forEach((item, index) => {
          let data = item.data;
          let connectedEdges = [];
          this.graph.getConnectedEdges(item.id)?.forEach(edge => {
            if (getNodeIdByPortId(edge.source.port) === item.id) {
              connectedEdges.push({ id: edge.source.port });
            }
            if (getNodeIdByPortId(edge.target.port) === item.id) {
              connectedEdges.push({ id: edge.target.port });
            }
          });
          this.options[index] = [];
          this.options[index] = getOptions(
            {
              id: item.id,
              role: item.data.basicConfig.role,
              image_type: item.data.basicConfig.image_type,
            },
            data,
            connectedEdges,
          );
          this.portInfo[index].label = `${data?.basicConfig?.name} ${this.$tt('target.selectInterface')}`;
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    $tt: t,
    currentSel(val, index) {
      this.portInfo[index].info = this.options[index].filter((item) => {
        return item.value == val;
      })[0];
    },
    handleClose() {
      this.$refs.fromRef.resetFields();
      this.$emit('update', false);
      this.$emit('clear-nodes-to-edge', false);
      this.graph.removeEdge(this.currentEdge);
    },
    submitForm(done) {
      this.$refs['fromRef'].validate((valid) => {
        if (valid) {
          let edge = {
            source: {
              cell: this.nodesToEdge[0].id,
              port: this.portInfo[0].info.value,
            },
            target: {
              cell: this.nodesToEdge[1].id,
              port: this.portInfo[1].info.value,
            },
            labels: { source: this.portInfo[0].info.label, target: this.portInfo[1].info.label },
          }
          updateNetworkPorts(this.graph.getCellById(this.nodesToEdge[0].id), this.graph.getCellById(this.nodesToEdge[1].id), 'add');
          this.$emit('add-edge', edge);
          this.$emit('update', false);
        } else {
          return false;
        }
      });
    },
  },
  filters: {
    ellipsis(value) {
      if (!value) return '';
      if (value.length > 18) {
        return value.slice(0, 18) + '...';
      }
      return value;
    },
  },
  components: {},
};
</script>
<style lang="scss" scoped>
.drawer-dialog {
  .cb-select {
    width: 100% !important;
    ::v-deep .el-select-dropdown .el-select-dropdown__wrap {
      margin: 0 -6px !important;
    }
  }
}
</style>
