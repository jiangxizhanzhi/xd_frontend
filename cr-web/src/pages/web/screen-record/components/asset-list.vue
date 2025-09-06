<template>
  <cb-dialog
    :title="$t('m.assetList')"
    :visible="visible"
    class="asset-dialog"
    :before-close="beforeClose"
    :close-on-press-escape="false"
    width="960px"
  >
    <div class="asset-dialog-content">
      <cb-search-table
        :cols.sync="columns"
        row-key="id"
        :url="url"
        baseURL="/api/ojj"
        :data.sync="model"
        :searchBarBg="true"
      >
        <template v-slot:filter>
          <cb-select
            v-if="
              $route.query.page === 'team' ||
              $route.query.page === 'team-student' ||
              $route.query.page === 'red' ||
              $route.query.page === 'red-blue-student'
            "
            v-model="model.systemTypeName"
            :options="categoryList"
            clearable
          />
          <cb-select
            v-else
            v-model="model.systemTypeName"
            :options="categoryList"
            clearable
          />
          <cb-search-input
            v-model="model.pattern"
            :placeholder="$t('m.searchName')"
          ></cb-search-input>
        </template>
        <template v-slot:virtualType="scope">
          <span :title="handleVirtualType(scope.data.virtual_type)">{{
            handleVirtualType(scope.data.virtual_type)
          }}</span>
        </template>
        <!-- <template v-slot:ip="scope">
          <span :title="handleIp(scope.data.ports)">{{
            handleIp(scope.data.ports)
          }}</span>
        </template> -->
        <template v-slot:operate="scope">
          <div class="cyber-scroll-bar-small operation-content">
            <div
              v-for="item in scope.data.ports"
              :key="item.ip"
              class="connect-list"
            >
              <div class="connect-ip">{{ item.ip }}</div>
              <div class="connect-content">
                <div
                  v-for="child in item.cloud_access_modes"
                  :key="child.id"
                  class="conenct-item"
                >
                  <cb-button
                    type="text"
                    class="login-btn"
                    @click="connect(child, scope.data)"
                    :disabled="child.protocol === 'nc'"
                    mr
                    >{{ child.protocol }} {{ $t('scene.login') }}</cb-button
                  >
                  <div style="margin-left: 40px">
                    <span v-if="child.port">
                      {{ child.access_ip || '--' }}:{{ child.port }}
                    </span>
                    <span v-else> {{ child.access_ip || '--' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </cb-search-table>
    </div>
  </cb-dialog>
</template>

<script>
import _ from 'lodash';
import { osList } from '@/api/web/single-train';
import { osListApi } from '@/api/web/team-training';
export default {
  props: {
    resourceId: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      visible: false,
      url: '/cr/single_train/room/asset/list',
      categoryList: [],
      model: {
        systemTypeName: '',
        pattern: '',
        resource_id: this.resourceId,
      },
      columns: [
        {
          label: this.$t('m.assetName'),
          prop: 'name',
          width: 250,
          resizable: true,
        },
        {
          label: this.$t('m.assetOs'),
          prop: 'system_type_name',
          width: 105,
          resizable: true,
        },
        {
          label: this.$t('m.assetType'),
          slot: 'virtualType',
          prop: 'virtualType',
          width: 105,
          resizable: true,
        },
        // {
        //   label: this.$t('m.assetIp'),
        //   slot: 'ip',
        // },
        {
          label: this.$t('m.assetConnect'),
          slot: 'operate',
          width: 420,
        },
      ],
      tableData: [
        {
          name: 'r_vpnclient_v61',
        },
      ],
    };
  },
  watch: {
    resourceId: {
      handler(val) {
        this.getOsList();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    if (
      this.$route.query.page === 'team' ||
      this.$route.query.page === 'team-student' ||
      this.$route.query.page === 'red' ||
      this.$route.query.page === 'red-blue-student'
    ) {
      //团队 红蓝资产清单
      this.url = '/cr/scene/asset/list';
    }
  },
  mounted() {},
  methods: {
    beforeClose() {
      this.$emit('before-close', 'asset');
      this.visible = false;
    },
    handleVirtualType(value) {
      // 1 交换机
      // 2 路由器
      // 3 防火墙
      // 4 虚拟机
      // 5 容器
      // 6 实体节点
      // 7 npc节点
      // 8 dynamips
      const data = {
        1: '交换机',
        2: '路由器',
        3: '防火墙',
        4: '虚拟机',
        5: '容器',
        6: '实体节点',
        7: 'npc节点',
        8: 'dynamips',
      };
      return data[value];
    },
    handleIp(data) {
      const list = [];
      data.map((item) => {
        list.push(item.ip);
      });
      return [...list];
    },
    connect(data, nodeData) {
      this.visible = false;
      this.$emit('before-close', 'asset');
      this.$emit('connect', data, nodeData);
    },
    getOsList() {
      const data = {
        resource_id: this.resourceId,
      };
      if (
        this.$route.query.page === 'team' ||
        this.$route.query.page === 'team-student' ||
        this.$route.query.page === 'red' ||
        this.$route.query.page === 'red-blue-student'
      ) {
        // 团队红蓝查询资产清单操作系统下拉框
        osListApi(data).then((res) => {
          const data = _.get(res, 'data.data');
          this.categoryList = data.map((item) => {
            return {
              label: item.name,
              value: item.name,
            };
          });
          this.categoryList.unshift({
            label: this.$t('m.allAsset'),
            value: '',
          });
        });
      } else {
        // 单兵
        osList(data).then((res) => {
          const data = _.get(res, 'data.data');
          this.categoryList = data.map((item) => {
            return {
              label: item.name,
              value: item.name,
            };
          });
          this.categoryList.unshift({
            label: this.$t('m.allAsset'),
            value: '',
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.asset-dialog {
  ::v-deep .el-dialog {
    margin-right: 0;
  }
  ::v-deep.el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        padding: 0px 24px 24px 24px !important;
        .asset-dialog-content {
          .cb-search-table {
            .search-bar {
              .cb-search-bar {
                margin-bottom: 0 !important;
              }
            }
            .cb-a-table-container {
              padding: 0 16px 16px 16px !important;
            }
          }
        }
      }
    }
  }
  &-content {
    min-height: 300px;
    .operation-content {
      max-height: 200px;
      overflow: auto;
      .connect-list {
        display: flex;
        align-items: baseline;
        .connect-ip {
          width: 90px;
          margin-right: 40px;
        }
        .conenct-item {
          display: flex;
          align-items: center;
          .login-btn {
            width: 80px;
          }
        }
      }
    }
  }
}
</style>
