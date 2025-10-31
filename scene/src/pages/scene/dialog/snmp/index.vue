<template>
  <cb-dialog
    v-if="visible"
    width="1200px"
    class="snmp-dialog"
    :visible.sync="visible"
    @close="handleClose"
    :modal-append-to-body="false"
  >
    <template slot="title">
      <div>{{ title }} {{ $tt('stage.snmpCollection') }}</div>
    </template>
    <div class="snmp-content">
      <div class="snmp-content-left cyber-scroll-bar-small">
        <cb-tree
          :data="mibData"
          :props="defaultProps"
          :default-expand-all="true"
          :expand-on-click-node="false"
          node-key="oid"
          @node-click="handleNodeClick"
        >
          <span class="node-customized" slot-scope="{ node }">
            <span :title="node.label">{{ node.label }}</span>
          </span>
        </cb-tree>
      </div>
      <div class="snmp-content-right cyber-scroll-bar-small">
        <div class="snmp-content-right-base">
          <block :title="name + $tt('stage.info')" />
          <div class="snmp-content-right-base-content">
            <div class="item">
              <label for="">name:</label>
              <span v-if="mibTree">{{ name }}</span>
            </div>
            <div class="item">
              <label for="">OID:</label>
              <span>{{ oid }}</span>
            </div>
            <div class="item">
              <label for="">Syntax:</label>
              <span>{{ syntax }}</span>
            </div>
            <div class="item">
              <label for="" v-if="defalutValue">MIB:</label>
              <span v-if="mibTree">{{
                snmpConfig && snmpConfig.file_info && snmpConfig.file_info.file_name
              }}</span>
            </div>
          </div>

          <cb-button
            hollow
            v-if="mibTree"
            @click="queryMibNodeInfo"
            :loading="loading"
            >{{ $tt('stage.query') }}</cb-button
          >
        </div>
        <div class="snmp-content-right-data">
          <cb-search-table
            :cols="cols"
            row-key="key"
            v-loading="loading"
            :scroll="{ y: 310 }"
            :dataSource="mibNodeInfo"
            :hidePaginOnDemand="true"
            :searchBarBg="false"
          ></cb-search-table>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div class="form-button-group">
        <cb-button-group space="middle">
          <cb-button button-type="confirm" @click="handleClose"></cb-button>
          <cb-button button-type="cancel" @click="handleClose"></cb-button>
        </cb-button-group>
      </div>
    </template>
  </cb-dialog>
</template>

<script>
import t from '../../../../utils/i18n';
import { mibNodeInfo } from '../../../../api';
import _ from 'lodash';
import Block from '../../../../components/block';

export default {
  components: { Block },
  props: {
    title: {
      type: String,
      default: '',
    },
    mibData: {
      type: Array,
      default() {
        return null;
      },
    },
    snmpConfig: {
      type: Object,
      default() {
        return null;
      },
    },
    sceneId: {
      type: String,
      default: '',
    },
    nodeId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      defalutValue: true,
      mibTree: false,
      name: '',
      oid: '',
      syntax: '',
      mib: '',
      mibNodeInfo: [],
      cols: [
        {
          label: 'OID',
          prop: 'oid_or_name',
        },
        {
          label: this.$tt('stage.oidValue'),
          prop: 'value',
        },
        {
          label: this.$tt('stage.oidType'),
          prop: 'type',
        },
        {
          label: this.$tt('stage.ipPort'),
          prop: 'ip_port',
        },
      ],
    };
  },
  methods: {
    $tt: t,
    handleClose() {
      this.visible = false;
    },
    handleNodeClick(data) {
      if (data.name === 'mib-tree') {
        this.name = data.name;
        this.syntax = '';
        this.mib = '';
        this.oid = '';
        this.mibTree = false;
        this.defalutValue = false;
      } else {
        this.name = data.name;
        this.oid = data.oid;
        this.syntax = data.syntax;
        this.mib = data.name;
        this.mibTree = true;
        this.defalutValue = true;
      }
    },
    queryMibNodeInfo() {
      this.loading = true;
      this.mibNodeInfo = [];
      const { version, community_name, auth_key, priv_key, username } =
        this.snmpConfig;
      const data = {
        oid: this.oid,
        element_id: this.nodeId,
        scene_id: this.sceneId,
        version:
          version === 'V2'
            ? 2
            : version === 'V1'
            ? 1
            : version === 'V3'
            ? 3
            : '',
        community_name,
      };
      if (version === 'V3') {
        data.auth_key = auth_key;
        data.priv_key = priv_key;
        data.username = username;
      }
      mibNodeInfo(data)
        .then((res) => {
          this.loading = false;
          this.mibNodeInfo = _.get(res, 'data.data', []);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.snmp-content {
  display: flex;
  background: var(--bg-color-2);
  height: 100%;
  min-height: 500px;
  &-left {
    width: 480px;
    margin-right: 10px;
    height: 550px;
    overflow: auto;
    .node-customized {
      font-size: 14px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &-right {
    background: var(--bg-color-3);
    width: 100%;
    padding: 16px;
    overflow: auto;
    &-base {
      margin-bottom: 16px;
      &-content {
        display: flex;
        justify-content: flex-start;
        flex-flow: wrap;
        margin-bottom: 16px;
        .item {
          width: 50%;
          label {
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
