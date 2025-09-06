<template>
  <div class="detail-dialog-boxs">
    <div class="left-box mr20">
      <div class="img-wrapper">
        <img :src="infoData.logo" />
        <div class="img-desc">{{ infoData.name }}</div>
      </div>
      <div class="btn-wrapper">
        <cb-scrollbar>
          <login-model :connections="connections" />
        </cb-scrollbar>
      </div>
    </div>
    <div class="center-right-box mr20">
      <div class="top-wrapper mb20">
        <wing-title
          :title="
            $t('systemOperation.realEquipmentManagement.basicInformation')
          "
        />
        <div class="residue-boxs desc-boxs">
          <div class="com-desc one-overflow">
            {{ $t('systemOperation.realEquipmentManagement.entityName') }}：{{
              infoData.name
            }}
          </div>
          <div class="com-desc one-overflow">
            {{
              $t('systemOperation.realEquipmentManagement.managementAddress')
            }}：{{ infoData.address }}
          </div>
          <div class="com-desc one-overflow">
            {{ $t('systemOperation.realEquipmentManagement.model') }}：{{
              infoData.model
            }}
          </div>
          <div class="com-desc one-overflow">
            {{ $t('systemOperation.realEquipmentManagement.parameter') }}：{{
              infoData.params
            }}
          </div>
          <div class="com-desc one-overflow">
            {{
              $t('systemOperation.realEquipmentManagement.systemInformation')
            }}：<span :title="extSystemInfo">{{ extSystemInfo }}</span>
          </div>
        </div>
      </div>
      <div class="bottom-wrapper">
        <wing-title
          :title="
            $t('systemOperation.realEquipmentManagement.interfaceResources')
          "
        />
        <div class="residue-boxs">
          <cb-scrollbar>
            <cb-search-table
              ref="interfaceResourcesRef"
              :cols="colsInterface"
              :data="query"
              url="/devops/cluster/real-equipment/network-card"
              baseURL="/api/mp"
              :showLessItems="true"
              :showQuickJumper="false"
              :searchBarBg="false"
            >
            </cb-search-table>
          </cb-scrollbar>
        </div>
      </div>
    </div>
    <div class="center-right-box">
      <div class="top-wrapper mb20">
        <wing-title
          :title="
            $t('systemOperation.realEquipmentManagement.operationMonitoring')
          "
        />
        <div class="residue-boxs running-monitor">
          <template v-for="item in dashLists">
            <Dash :item="item" :key="item.text" />
          </template>
        </div>
      </div>
      <div class="bottom-wrapper">
        <wing-title
          :title="$t('systemOperation.realEquipmentManagement.sceneQuote')"
        />
        <div class="residue-boxs">
          <cb-scrollbar>
            <cb-search-table
              ref="sceneQuoteRef"
              :cols="colsScene"
              :url="refScenesUrl"
              :data="sceneQuery"
              baseURL="/api/mp"
              :showLessItems="true"
              :showQuickJumper="false"
              :searchBarBg="false"
            >
              <template v-slot:status="scope">
                <span>{{ getStatus(scope.data) }}</span>
              </template>
            </cb-search-table>
          </cb-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SceneMap } from '../../constant.js';
import _ from 'lodash';
import WingTitle from '@/components/wing-title';
import LoginModel from './login-model.vue';
import Dash from './dash.vue';
import DEFAULTIMAGELOGO from '@cyber/scene-icons';
export default {
  props: {
    id: {
      type: [String, Number],
      default: () => '',
    },
    name: {
      type: String,
      default: () => '',
    },
  },
  components: {
    WingTitle,
    LoginModel,
    Dash,
  },
  data() {
    return {
      DEFAULTIMAGELOGO,
      infoData: {},
      query: {
        uuid: this.id,
      },
      sceneQuery: {
        name: this.name,
      },
      connections: [],
      dashLists: [
        {
          count: 0,
          icon: 'icon-yibiaopanzhizhen',
          text: 'CPU',
        },
        {
          count: 0,
          icon: 'icon-yibiaopanzhizhen',
          text: this.$t('systemOperation.realEquipmentManagement.memory'),
        },
        {
          count: 0,
          icon: 'icon-yibiaopanzhizhen',
          text: this.$t('systemOperation.realEquipmentManagement.disk'),
        },
      ],
    };
  },
  computed: {
    colsInterface() {
      const that = this;
      return [
        {
          label: that.$t(
            'systemOperation.realEquipmentManagement.interfaceName',
          ),
          prop: 'name',
        },
        {
          label: that.$t('systemOperation.realEquipmentManagement.theTraffic'),
          getData(row) {
            return `${row.inflow}B`;
          },
        },
        {
          label: that.$t(
            'systemOperation.realEquipmentManagement.outOfTheTraffic',
          ),
          getData(row) {
            return `${row.outflow}B`;
          },
        },
      ];
    },
    refScenesUrl() {
      return `/agg/target_scene_refer/page`;
    },
    colsScene() {
      const that = this;
      return [
        {
          label: that.$t(
            'systemOperation.realEquipmentManagement.applicationScene',
          ),
          prop: 'name',
        },
        {
          label: that.$t('systemOperation.realEquipmentManagement.sceneStatus'),
          slot: 'status',
        },
        {
          label: that.$t('systemOperation.realEquipmentManagement.user'),
          prop: 'create_username',
        },
      ];
    },
    extSystemInfo() {
      if (this.infoData && this.infoData.ext_system_info) {
        let { language_name, system_architecture_name, system_type_name } =
          this.infoData.ext_system_info;
        system_type_name =
          system_type_name === null ? '' : `${system_type_name};`;
        system_architecture_name =
          system_architecture_name === null
            ? ''
            : `${system_architecture_name};`;
        language_name = language_name === null ? '' : `${language_name}`;
        return `${system_type_name}${system_architecture_name}${language_name}`;
      } else {
        return '-';
      }
    },
  },
  created() {},
  mounted() {
    this.getInfoData();
  },
  methods: {
    getInfoData() {
      const that = this;
      this.$request
        .get(
          `/devops/cluster/real-equipment/get-devops-details`,
          {
            uuid: that.id,
          },
          { baseURL: '/api/mp' },
        )
        .then((res) => {
          that.infoData = _.get(res, 'data.data', {});
          that.connections = that.infoData.connections || [];
          that.dashLists[0].count = that.infoData.cpu_percent || 0;
          that.dashLists[1].count = that.infoData.ram_percent || 0;
          that.dashLists[2].count = that.infoData.disk_percent || 0;
        });
    },
    getStatus(row) {
      const event = row.event;
      const event_status = row.event_status;
      const eventMap = `${event}-${event_status}`;
      return SceneMap[eventMap];
    },
  },
};
</script>
<style lang="scss"></style>
<style lang="scss" scoped>
.detail-dialog-boxs {
  height: 605px;
  width: 100%;
  display: flex;
  .left-box {
    width: 23%;
    height: 100%;
    padding: 43px 22px 0;
    box-sizing: border-box;
    .img-wrapper {
      img {
        width: 100%;
        height: 144px;
      }
      .img-desc {
        text-align: center;
        margin-top: 12px;
        font-size: 16px;
      }
    }
    .btn-wrapper {
      width: 100%;
      height: calc(100% - 180px);
      padding-top: 30px;
      box-sizing: border-box;
    }
  }
  .center-right-box {
    width: calc(38.5% - 20px);
    height: 100%;
    .top-wrapper {
      height: 42%;
      padding: 20px 0 10px;
      box-sizing: border-box;
      .com-desc {
        height: 36px;
        line-height: 36px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
      }
      .desc-boxs {
        padding: 15px 45px;
      }
    }
    .bottom-wrapper {
      height: calc(58% - 20px);
      padding: 20px 20px 10px;
      box-sizing: border-box;
    }
    .residue-boxs {
      height: calc(100% - 21px);
      padding-top: 20px;
      box-sizing: border-box;
    }
    .running-monitor {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .dash-wrapper {
        .dash-boxs {
          background: url('../assets/img/dash-bg.png');
          background-size: 100% 100%;
          width: 94px;
          height: 84px;
          position: relative;
          .arrows-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .arrows {
            transform-origin: 50% 100%;
          }
          .count-span {
            display: block;
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 18px;
            font-weight: bold;
          }
        }
        .info-desc {
          width: 92px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          box-shadow: #001e4f 0px 0px 10px inset;
          color: var(--white-color);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.detail-dialog-boxs {
  .img-desc {
    color: var(--neutral8);
  }
  .com-desc {
    color: var(--neutral8);
  }
  .left-box,
  .top-wrapper,
  .bottom-wrapper {
    background: var(--neutral0);
  }
}
</style>
