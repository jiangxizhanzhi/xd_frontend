<template>
  <cb-inner-page
    :background="true"
    title="多维度运营"
  >
    <div class="main-outer-box">
      <div class="top-wrap">
        <div class="left">
          <Block
            class="block-title"
            :title="'物理资源概览'"
          > </Block>
          <div class="chart-wrap">
            <physical-overview :physicalOverviewData="physicalOverviewData"></physical-overview>
          </div>
        </div>
        <div class="right">
          <Block
            class="block-title"
            :title="'虚拟资源统计'"
          > </Block>
          <div class="chart-wrap">
            <virtual-resource :virStaticsData="virStaticsData"></virtual-resource>
          </div>
        </div>
      </div>
      <div class="bottom-wrap">
        <Block
          class="block-title"
          :title="'物理节点资源占用统计'"
        > </Block>
        <div class="chart-wrap">
          <physical-node-resource :physicalNodeData="physicalNodeData"></physical-node-resource>
        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import { getPhyStatics, geVirStatics, gePhyNodeStatics } from "@/api/multi-dimensional-operation.js";
import Block from '@/components/block';
import PhysicalOverview from './components/physical-overview.vue';
import VirtualResource from './components/virtual-resource.vue';
import physicalNodeResource from './components/physical-node-resource.vue'
export default {
  name: "index",
  components: {
    Block,
    PhysicalOverview,
    VirtualResource,
    physicalNodeResource,
  },
  props: {},
  data() {
    return {
      physicalOverviewData: {
        xData: [],
        company_data1: [],
        company_data2: [],
        company_data3: [],
      },
      virStaticsData: {
        xData: [],
        company_data1: [],
        company_data2: [],
        company_data3: [],
      },
      physicalNodeData: {
        xData: [],
        company_data1: [],
        company_data2: [],
        company_data3: [],
      },
    }
  },
  mounted() {
    // 物理资源概览
    this.getPhyStatics();
    // 虚拟资源统计
    this.geVirStatics();
    // 物理节点资源占用统计
    this.gePhyNodeStatics();
  },
  methods: {
    getPhyStatics() {
      getPhyStatics().then(res => {
        const data = _.get(res, 'data.data', {})
        this.physicalOverviewData.xData = [data.company_name1, data.company_name2, data.company_name3]
        this.physicalOverviewData.company_data1 = [data.cpu_percent1 || 0, data.memory_percent1 || 0, data.file_system_percent1 || 0];
        this.physicalOverviewData.company_data2 = [data.cpu_percent2 || 0, data.memory_percent2 || 0, data.file_system_percent2 || 0];
        this.physicalOverviewData.company_data3 = [data.cpu_percent3 || 0, data.memory_percent3 || 0, data.file_system_percent3 || 0];
      })
    },
    geVirStatics() {
      geVirStatics().then(res => {
        const data = _.get(res, 'data.data', {})
        data.forEach(item => {
          this.virStaticsData.xData.push(item.company_name)
        })
        this.virStaticsData.company_data1 = [data[0].total_num || 0, data[0].up_num || 0, data[0].down_num || 0];
        this.virStaticsData.company_data2 = [data[1].total_num || 0, data[1].up_num || 0, data[1].down_num || 0];
        this.virStaticsData.company_data3 = [data[2].total_num || 0, data[2].up_num || 0, data[0].down_num || 0];
      })
    },
    gePhyNodeStatics() {
      gePhyNodeStatics().then(res => {
        const data = _.get(res, 'data.data', {})
        data.forEach(item => {
          this.physicalNodeData.xData.push(item.node_name);
          this.physicalNodeData.company_data1.push(item.cpu_percent || 0);
          this.physicalNodeData.company_data2.push(item.memory_percent || 0);
          this.physicalNodeData.company_data3.push(item.file_system_percent || 0);
        })

      })
    }
  }
}
</script>

<style scoped lang="scss">
.main-outer-box {
  padding-right: 16px;
  width: 100%;
  height: 100%;

  .top-wrap {
    width: 100%;
    height: 44%;
    display: flex;

    .left {
      flex: 1;
      background: var(--bg-color-3);
      padding: 16px;

      .chart-wrap {
        width: 100%;
        height: calc(100% - 40px);
      }
    }

    .right {
      flex: 1;
      margin-left: 16px;
      padding: 16px;
      background: var(--bg-color-3);

      .chart-wrap {
        width: 100%;
        height: calc(100% - 40px);
      }
    }
  }

  .bottom-wrap {
    width: 100%;
    height: calc(56% - 16px);
    padding: 16px;
    margin-top: 16px;
    background: var(--bg-color-3);

    .chart-wrap {
      width: 100%;
      height: calc(100% - 40px);
    }
  }
}
</style>
