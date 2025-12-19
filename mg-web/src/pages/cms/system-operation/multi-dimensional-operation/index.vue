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

          </div>
        </div>
      </div>
      <div class="bottom-wrap">
        <Block
          class="block-title"
          :title="'物理节点资源占用统计'"
        > </Block>
        <div class="chart-wrap">

        </div>
      </div>
    </div>
  </cb-inner-page>
</template>

<script>
import { getPhyStatics } from "@/api/multi-dimensional-operation.js";
import Block from '@/components/block';
import PhysicalOverview from './components/physical-overview.vue'
export default {
  name: "index",
  components: {
    Block,
    PhysicalOverview,
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
    }
  },
  mounted() {
    this.getPhyStatics();
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
    height: 50%;
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
    height: calc(50% - 16px);
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
